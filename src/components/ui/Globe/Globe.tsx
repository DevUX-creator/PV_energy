"use client";

import { useEffect, useRef } from "react";
import "./globe.css";

// 256×128 equirectangular land mask (white = land).
const MAP_SRC = "/GlobalReach/world-dots.png";

// ---- Tunables (dial these with the design) --------------------------------
const R = 1; // base sphere radius
const GAP = 0.06; // "air" between the sphere and the dot blanket
const RADIUS_JITTER = 0.012; // per-dot radial variation (organic blanket)
const AUTO_SPIN = 0.0016; // idle rotation speed (rad/frame)
const INFLUENCE = 0.34; // cursor repulsion radius (local units)
const PUSH = 0.3; // how far dots shove away from the cursor
const EASE = 0.12; // spring-back speed toward home
const DOT_SIZE = 0.019;

/**
 * Globe — a soft base sphere with a floating "blanket" of particles that form
 * the world map at a slightly larger radius (air gap between). The dots react
 * to the cursor (repel, then spring back). Custom Three.js; the map is a static
 * land mask, so nothing is fetched at runtime beyond the small PNG.
 */
export default function Globe({ className = "" }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const THREE = await import("three");
      if (disposed || !mountRef.current) return;

      let width = mount.clientWidth || 1;
      let height = mount.clientHeight || 1;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
      camera.position.set(0, 0, 3.4);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      mount.appendChild(renderer.domElement);

      scene.add(new THREE.AmbientLight(0xffffff, 0.8));
      const key = new THREE.DirectionalLight(0xffffff, 1.15);
      key.position.set(-1.6, 1.1, 2.2);
      scene.add(key);

      const group = new THREE.Group();
      scene.add(group);

      // Soft base sphere (the glowing body under the dots).
      const sphereGeo = new THREE.SphereGeometry(R, 64, 64);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: 0xdbe6f4,
        roughness: 0.95,
        metalness: 0,
      });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      group.add(sphere);

      // Load + sample the land mask on a canvas.
      const img = await new Promise<HTMLImageElement>((res, rej) => {
        const im = new Image();
        im.onload = () => res(im);
        im.onerror = rej;
        im.src = MAP_SRC;
      }).catch(() => null);
      if (disposed || !img) return;

      const MW = 256;
      const MH = 128;
      const cvs = document.createElement("canvas");
      cvs.width = MW;
      cvs.height = MH;
      const cx = cvs.getContext("2d");
      if (!cx) return;
      cx.drawImage(img, 0, 0, MW, MH);
      const data = cx.getImageData(0, 0, MW, MH).data;

      // Build the dot blanket: one point per land pixel (jittered) on R+GAP.
      const homes: number[] = [];
      for (let y = 0; y < MH; y++) {
        for (let x = 0; x < MW; x++) {
          if (data[(y * MW + x) * 4] < 128) continue; // land = white
          const u = (x + Math.random()) / MW;
          const v = (y + Math.random()) / MH;
          const lon = u * Math.PI * 2 - Math.PI;
          const lat = Math.PI / 2 - v * Math.PI;
          const rr = R + GAP + (Math.random() - 0.5) * RADIUS_JITTER;
          const cosLat = Math.cos(lat);
          homes.push(
            rr * cosLat * Math.cos(lon),
            rr * Math.sin(lat),
            rr * cosLat * Math.sin(lon)
          );
        }
      }
      const N = homes.length / 3;
      const home = new Float32Array(homes);
      const pos = Float32Array.from(home); // live positions

      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));

      // Round soft sprite for each dot.
      const ts = 64;
      const tc = document.createElement("canvas");
      tc.width = tc.height = ts;
      const tcx = tc.getContext("2d")!;
      const grad = tcx.createRadialGradient(ts / 2, ts / 2, 0, ts / 2, ts / 2, ts / 2);
      grad.addColorStop(0, "rgba(255,255,255,1)");
      grad.addColorStop(0.45, "rgba(255,255,255,0.85)");
      grad.addColorStop(1, "rgba(255,255,255,0)");
      tcx.fillStyle = grad;
      tcx.fillRect(0, 0, ts, ts);
      const disc = new THREE.CanvasTexture(tc);

      const mat = new THREE.PointsMaterial({
        size: DOT_SIZE,
        map: disc,
        transparent: true,
        depthWrite: false,
        sizeAttenuation: true,
        color: 0x5b83c0,
        opacity: 0.95,
      });
      const points = new THREE.Points(geo, mat);
      group.add(points);

      // Invisible sphere at the dot radius to raycast the cursor onto.
      const pick = new THREE.Mesh(
        new THREE.SphereGeometry(R + GAP, 24, 24),
        new THREE.MeshBasicMaterial({ visible: false })
      );
      group.add(pick);

      const raycaster = new THREE.Raycaster();
      const ndc = new THREE.Vector2(-10, -10);
      const cursor = new THREE.Vector3(999, 999, 999);
      let hasCursor = false;

      const onMove = (e: PointerEvent) => {
        const rect = renderer.domElement.getBoundingClientRect();
        ndc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        ndc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        hasCursor = true;
      };
      const onLeave = () => {
        hasCursor = false;
      };
      renderer.domElement.addEventListener("pointermove", onMove);
      renderer.domElement.addEventListener("pointerleave", onLeave);

      const onResize = () => {
        width = mount.clientWidth || 1;
        height = mount.clientHeight || 1;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      };
      window.addEventListener("resize", onResize);

      let visible = true;
      const io = new IntersectionObserver(
        ([e]) => (visible = e.isIntersecting),
        { threshold: 0 }
      );
      io.observe(mount);

      const INFL2 = INFLUENCE * INFLUENCE;
      let raf = 0;
      const loop = () => {
        raf = requestAnimationFrame(loop);
        if (!visible) return;

        group.rotation.y += AUTO_SPIN;

        if (hasCursor) {
          raycaster.setFromCamera(ndc, camera);
          const hit = raycaster.intersectObject(pick, false)[0];
          if (hit) cursor.copy(group.worldToLocal(hit.point.clone()));
          else cursor.set(999, 999, 999);
        } else {
          cursor.set(999, 999, 999);
        }

        const arr = geo.attributes.position.array as Float32Array;
        for (let i = 0; i < N; i++) {
          const j = i * 3;
          const hx = home[j];
          const hy = home[j + 1];
          const hz = home[j + 2];
          let tx = hx;
          let ty = hy;
          let tz = hz;
          const dx = hx - cursor.x;
          const dy = hy - cursor.y;
          const dz = hz - cursor.z;
          const d2 = dx * dx + dy * dy + dz * dz;
          if (d2 < INFL2) {
            const d = Math.sqrt(d2) || 1e-4;
            const f = ((INFLUENCE - d) / INFLUENCE) * PUSH;
            tx = hx + (dx / d) * f;
            ty = hy + (dy / d) * f;
            tz = hz + (dz / d) * f;
          }
          arr[j] += (tx - arr[j]) * EASE;
          arr[j + 1] += (ty - arr[j + 1]) * EASE;
          arr[j + 2] += (tz - arr[j + 2]) * EASE;
        }
        geo.attributes.position.needsUpdate = true;

        renderer.render(scene, camera);
      };
      loop();

      // Fade in once the first frame is up.
      renderer.domElement.style.opacity = "1";

      cleanup = () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        window.removeEventListener("resize", onResize);
        renderer.domElement.removeEventListener("pointermove", onMove);
        renderer.domElement.removeEventListener("pointerleave", onLeave);
        geo.dispose();
        mat.dispose();
        disc.dispose();
        sphereGeo.dispose();
        sphereMat.dispose();
        pick.geometry.dispose();
        const pm = pick.material;
        (Array.isArray(pm) ? pm : [pm]).forEach((m) => m.dispose());
        renderer.dispose();
        renderer.domElement.remove();
      };
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return <div ref={mountRef} className={`globe3d ${className}`.trim()} />;
}
