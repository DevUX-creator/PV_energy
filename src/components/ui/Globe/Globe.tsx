"use client";

import { useEffect, useRef } from "react";
import "./globe.css";

// 256×128 equirectangular land mask (white = land).
const MAP_SRC = "/GlobalReach/world-dots.png";

// ---- Tunables (dial these with the design) --------------------------------
const R = 1; // base sphere radius
const GAP = 0.06; // "air" between the sphere and the dot blanket
const RADIUS_JITTER = 0.012; // per-dot radial variation (organic blanket)
const DENSITY = 3; // particles per land pixel — denser continents, fewer gaps
const AUTO_SPIN = 0.0006; // idle rotation speed (rad/frame) — super slow
const INFLUENCE = 0.34; // cursor repulsion radius (local units)
const PUSH = 0.3; // how far dots shove away from the cursor
const EASE = 0.12; // spring-back speed toward home
const DOT_SIZE = 0.015;
// Dot colours — blended per region so patches read more/less blue.
const DOT_MAIN: [number, number, number] = [0.72, 0.8, 0.95]; // light blue-white
const DOT_ACCENT: [number, number, number] = [0.28, 0.48, 0.9]; // deeper blue

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

      const group = new THREE.Group();
      scene.add(group);

      // Base sphere — matte translucent "glass": a vertical linear-gradient
      // body with a fresnel rim, semi-transparent (no shiny specular), so it
      // reads light and airy on the dark-grey surface rather than a solid ball.
      const sphereGeo = new THREE.SphereGeometry(R, 64, 64);
      const sphereMat = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: {
          colorTop: { value: new THREE.Color(0xcdd8ec) },
          colorBottom: { value: new THREE.Color(0x7f9bcf) },
          rimStrength: { value: 0.45 },
          baseAlpha: { value: 0.42 },
        },
        vertexShader: `
          varying vec3 vNormalW;
          varying vec3 vViewDir;
          varying float vY;
          void main() {
            vec4 wp = modelMatrix * vec4(position, 1.0);
            vNormalW = normalize(mat3(modelMatrix) * normal);
            vViewDir = normalize(cameraPosition - wp.xyz);
            vY = position.y; // -R (bottom) .. R (top)
            gl_Position = projectionMatrix * viewMatrix * wp;
          }
        `,
        fragmentShader: `
          uniform vec3 colorTop;
          uniform vec3 colorBottom;
          uniform float rimStrength;
          uniform float baseAlpha;
          varying vec3 vNormalW;
          varying vec3 vViewDir;
          varying float vY;
          void main() {
            float g = clamp(vY * 0.5 + 0.5, 0.0, 1.0);
            vec3 col = mix(colorBottom, colorTop, g);
            float fres = pow(1.0 - max(dot(normalize(vNormalW), normalize(vViewDir)), 0.0), 2.0);
            col += fres * rimStrength;
            float alpha = clamp(baseAlpha + fres * 0.4, 0.0, 1.0);
            gl_FragColor = vec4(col, alpha);
          }
        `,
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

      // Build the dot blanket: DENSITY jittered points per land pixel on R+GAP.
      // Each dot's colour blends between DOT_MAIN and DOT_ACCENT via a smooth,
      // low-frequency function of position, so the globe has bluer patches.
      const homes: number[] = [];
      const cols: number[] = [];
      for (let y = 0; y < MH; y++) {
        for (let x = 0; x < MW; x++) {
          if (data[(y * MW + x) * 4] < 128) continue; // land = white
          for (let d = 0; d < DENSITY; d++) {
            const u = (x + Math.random()) / MW;
            const v = (y + Math.random()) / MH;
            const lon = u * Math.PI * 2 - Math.PI;
            const lat = Math.PI / 2 - v * Math.PI;
            const rr = R + GAP + (Math.random() - 0.5) * RADIUS_JITTER;
            const cosLat = Math.cos(lat);
            const hx = rr * cosLat * Math.cos(lon);
            const hy = rr * Math.sin(lat);
            const hz = rr * cosLat * Math.sin(lon);
            homes.push(hx, hy, hz);

            // Smooth regional blend (patches), biased toward MAIN, + a little
            // per-dot jitter so patches aren't flat.
            const n = Math.sin(hx * 2.3 + hy * 1.7) * Math.cos(hz * 2.1 - hy * 1.3);
            let t = 0.5 + 0.5 * n; // 0..1
            t = t * t; // bias toward MAIN
            t = Math.min(1, Math.max(0, t + (Math.random() - 0.5) * 0.2));
            cols.push(
              DOT_MAIN[0] + (DOT_ACCENT[0] - DOT_MAIN[0]) * t,
              DOT_MAIN[1] + (DOT_ACCENT[1] - DOT_MAIN[1]) * t,
              DOT_MAIN[2] + (DOT_ACCENT[2] - DOT_MAIN[2]) * t
            );
          }
        }
      }
      const N = homes.length / 3;
      const home = new Float32Array(homes);
      const pos = Float32Array.from(home); // live positions

      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      geo.setAttribute("color", new THREE.BufferAttribute(new Float32Array(cols), 3));

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
        vertexColors: true, // per-region blue variation
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
