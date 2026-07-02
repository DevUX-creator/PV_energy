"use client";

import { useEffect, useRef } from "react";
import "./globe.css";

// 256×128 equirectangular land mask (white = land).
const MAP_SRC = "/GlobalReach/world-dots.png";

// ---- Tunables (dial these with the design) --------------------------------
const R = 1; // base sphere radius
const GAP = 0.03; // "air" between the sphere and the dot blanket
const RADIUS_JITTER = 0.012; // per-dot radial variation
const DENSITY = 3; // particles per land pixel
const AUTO_SPIN = 0.0006; // idle rotation speed (rad/frame) — super slow
const DOT_SIZE = 0.022; // base world size of a dot — small "lights"

// Hover: lift + highlight + grow, with a fading trail behind the cursor.
const HOVER_RADIUS = 0.34; // influence radius per trail sample
const HOVER_LIFT = 0.12; // how far dots rise in the gap
const HOVER_SIZE_BOOST = 1.4; // extra size under the cursor
const HOVER_HIGHLIGHT: [number, number, number] = [0.25, 0.85, 1.0]; // bright cyan
const TRAIL_N = 32; // trail length (recent cursor samples)
const TRAIL_DECAY = 0.94; // per-frame strength falloff → longer, flowing trail

// Dot base colours — small bright "lights", blended per region.
const DOT_MAIN: [number, number, number] = [0.5, 0.7, 1.0]; // bright blue
const DOT_ACCENT: [number, number, number] = [0.28, 0.52, 0.95]; // deeper blue

// Sphere body colours (soft matte): near-white oceans, mild blue land shades.
const OCEAN = 0xeef2f7;
const LAND = 0xbcc9e6;

/**
 * Globe — a matte sphere (light-grey oceans, bluish continents, lit softly from
 * inside) with a floating particle "blanket" of the world map above it. Drag to
 * rotate; hovering lifts/highlights/grows the dots and leaves a fading trail.
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
      const dpr = Math.min(window.devicePixelRatio, 2);

      let width = mount.clientWidth || 1;
      let height = mount.clientHeight || 1;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100);
      camera.position.set(0, 0, 4.6);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(dpr);
      mount.appendChild(renderer.domElement);

      const group = new THREE.Group();
      scene.add(group);

      // Sample the land mask (also reused as the sphere's land texture).
      const img = await new Promise<HTMLImageElement | null>((res) => {
        const im = new Image();
        im.onload = () => res(im);
        im.onerror = () => res(null);
        im.src = MAP_SRC;
      });
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

      // Blurred copy of the mask for the sphere tint → continents read as soft
      // shades, not defined shapes (down-sample then up-sample smoothed).
      const bcvs = document.createElement("canvas");
      bcvs.width = MW;
      bcvs.height = MH;
      const bctx = bcvs.getContext("2d")!;
      const small = document.createElement("canvas");
      small.width = 48;
      small.height = 24;
      const sctx = small.getContext("2d")!;
      sctx.imageSmoothingEnabled = true;
      sctx.drawImage(cvs, 0, 0, 48, 24);
      bctx.imageSmoothingEnabled = true;
      bctx.drawImage(small, 0, 0, MW, MH);

      const mapTex = new THREE.CanvasTexture(bcvs);
      mapTex.minFilter = THREE.LinearFilter;
      mapTex.magFilter = THREE.LinearFilter;
      mapTex.wrapS = THREE.RepeatWrapping;
      mapTex.wrapT = THREE.ClampToEdgeWrapping;

      // ---- Base sphere: matte, land/ocean tint, soft inner light ----------
      const sphereGeo = new THREE.SphereGeometry(R, 96, 96);
      const sphereMat = new THREE.ShaderMaterial({
        uniforms: {
          uMap: { value: mapTex },
          uOcean: { value: new THREE.Color(OCEAN) },
          uLand: { value: new THREE.Color(LAND) },
          uTime: { value: 0 },
        },
        vertexShader: `
          varying vec3 vN;
          varying vec3 vV;
          varying vec2 vUv;
          void main() {
            vec4 wp = modelMatrix * vec4(position, 1.0);
            vN = normalize(mat3(modelMatrix) * normal);
            vV = normalize(cameraPosition - wp.xyz);
            vUv = uv;
            gl_Position = projectionMatrix * viewMatrix * wp;
          }
        `,
        fragmentShader: `
          uniform sampler2D uMap;
          uniform vec3 uOcean;
          uniform vec3 uLand;
          uniform float uTime;
          varying vec3 vN;
          varying vec3 vV;
          varying vec2 vUv;
          void main() {
            vec3 N = normalize(vN);
            float land = texture2D(uMap, vUv).r;
            vec3 base = mix(uOcean, uLand, land * 0.62); // mild bluish continents

            // Soft matte light that slowly moves across the planet.
            vec3 L = normalize(vec3(sin(uTime * 0.13) * 0.9, 0.4, cos(uTime * 0.13) * 0.9 + 0.35));
            float wrap = clamp(0.6 + 0.45 * dot(N, L), 0.0, 1.25); // soft wrap diffuse
            vec3 col = base * wrap;

            // Moving soft bloom — the light that falls on the planet.
            col += pow(max(dot(N, L), 0.0), 3.5) * 0.4;

            // Slight rim glow at the edges.
            float facing = clamp(dot(N, normalize(vV)), 0.0, 1.0);
            col += pow(1.0 - facing, 2.5) * vec3(0.82, 0.88, 1.0) * 0.5;

            gl_FragColor = vec4(col, 1.0);
          }
        `,
      });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      group.add(sphere);

      // ---- Dot blanket ----------------------------------------------------
      // Positions use three's own sphere formula so the dots line up with the
      // sphere's land texture underneath.
      const homes: number[] = [];
      const cols: number[] = [];
      for (let y = 0; y < MH; y++) {
        for (let x = 0; x < MW; x++) {
          if (data[(y * MW + x) * 4] < 128) continue; // land = white
          for (let d = 0; d < DENSITY; d++) {
            const u = (x + Math.random()) / MW;
            const v = (y + Math.random()) / MH;
            const phi = u * Math.PI * 2;
            const theta = v * Math.PI;
            const sinT = Math.sin(theta);
            const rr = R + GAP + (Math.random() - 0.5) * RADIUS_JITTER;
            const hx = -Math.cos(phi) * sinT * rr;
            const hy = Math.cos(theta) * rr;
            const hz = Math.sin(phi) * sinT * rr;
            homes.push(hx, hy, hz);

            const n = Math.sin(hx * 2.3 + hy * 1.7) * Math.cos(hz * 2.1 - hy * 1.3);
            let t = 0.5 + 0.5 * n;
            t = t * t;
            t = Math.min(1, Math.max(0, t + (Math.random() - 0.5) * 0.2));
            cols.push(
              DOT_MAIN[0] + (DOT_ACCENT[0] - DOT_MAIN[0]) * t,
              DOT_MAIN[1] + (DOT_ACCENT[1] - DOT_MAIN[1]) * t,
              DOT_MAIN[2] + (DOT_ACCENT[2] - DOT_MAIN[2]) * t
            );
          }
        }
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(homes), 3));
      geo.setAttribute("color", new THREE.BufferAttribute(new Float32Array(cols), 3));

      // Trail: a ring buffer of recent cursor samples (xyz + strength).
      const trail = Array.from({ length: TRAIL_N }, () => new THREE.Vector4(999, 999, 999, 0));
      let writeIdx = 0;

      const pointsMat = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: {
          uTrail: { value: trail },
          uTime: { value: 0 },
          uInfluence: { value: HOVER_RADIUS },
          uLift: { value: HOVER_LIFT },
          uSizeBoost: { value: HOVER_SIZE_BOOST },
          uHighlight: { value: new THREE.Color(...HOVER_HIGHLIGHT) },
          uSize: { value: DOT_SIZE },
          uSizeScale: { value: height * dpr * 0.5 },
        },
        vertexShader: `
          attribute vec3 color;
          uniform vec4 uTrail[${TRAIL_N}];
          uniform float uTime;
          uniform float uInfluence;
          uniform float uLift;
          uniform float uSizeBoost;
          uniform vec3 uHighlight;
          uniform float uSize;
          uniform float uSizeScale;
          varying vec3 vColor;
          varying float vFacing;
          void main() {
            vec3 p = position;
            vec3 nrm = normalize(p);
            // Hover trail: strongest at the newest sample, fading behind it.
            float f = 0.0;
            for (int i = 0; i < ${TRAIL_N}; i++) {
              vec4 tr = uTrail[i];
              float infl = 1.0 - smoothstep(0.0, uInfluence, distance(p, tr.xyz));
              f = max(f, infl * tr.w);
            }
            f = clamp(f, 0.0, 1.0);
            // Fluid wavy drift — gentle everywhere, wavier under the hover.
            float w = sin(uTime * 0.9 + p.x * 6.0 + p.y * 3.0) * 0.5
                    + sin(uTime * 1.4 + p.z * 7.0 - p.y * 4.0) * 0.5;
            p += nrm * (w * (0.008 + f * 0.022));
            p += nrm * (uLift * f);
            vColor = mix(color, uHighlight, f);
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            // Feather the silhouette: dots facing away fade out (soft rim, no
            // hard ring of dots floating off the edge).
            vec3 viewNrm = normalize((modelViewMatrix * vec4(nrm, 0.0)).xyz);
            vFacing = dot(viewNrm, normalize(-mv.xyz));
            float size = uSize * (1.0 + uSizeBoost * f);
            gl_PointSize = size * uSizeScale / -mv.z;
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          varying float vFacing;
          void main() {
            // Procedural round light: white-hot core → coloured glow → soft edge.
            float d = distance(gl_PointCoord, vec2(0.5));
            float core = smoothstep(0.5, 0.0, d);
            float alpha = core * smoothstep(-0.05, 0.45, vFacing);
            if (alpha < 0.02) discard;
            vec3 col = mix(vColor, vec3(1.0), pow(core, 3.0) * 0.65);
            gl_FragColor = vec4(col, alpha);
          }
        `,
      });
      const points = new THREE.Points(geo, pointsMat);
      group.add(points);

      const pick = new THREE.Mesh(
        new THREE.SphereGeometry(R + GAP, 24, 24),
        new THREE.MeshBasicMaterial({ visible: false })
      );
      group.add(pick);

      // ---- Interaction ----------------------------------------------------
      const raycaster = new THREE.Raycaster();
      const ndc = new THREE.Vector2(-10, -10);
      const cursorLocal = new THREE.Vector3(999, 999, 999);
      let hovering = false;
      let dragging = false;
      let lastX = 0;
      let lastY = 0;
      let rotY = 0;
      let rotX = 0;

      const onPointerMove = (e: PointerEvent) => {
        const rect = renderer.domElement.getBoundingClientRect();
        ndc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        ndc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        hovering = true;
        if (dragging) {
          rotY += (e.clientX - lastX) * 0.005;
          rotX = Math.max(-0.6, Math.min(0.6, rotX + (e.clientY - lastY) * 0.005));
          lastX = e.clientX;
          lastY = e.clientY;
        }
      };
      const onPointerDown = (e: PointerEvent) => {
        dragging = true;
        lastX = e.clientX;
        lastY = e.clientY;
        renderer.domElement.style.cursor = "grabbing";
      };
      const onPointerUp = () => {
        dragging = false;
        renderer.domElement.style.cursor = "grab";
      };
      const onPointerLeave = () => {
        hovering = false;
      };
      renderer.domElement.addEventListener("pointerdown", onPointerDown);
      renderer.domElement.addEventListener("pointerleave", onPointerLeave);
      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);

      const onResize = () => {
        width = mount.clientWidth || 1;
        height = mount.clientHeight || 1;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
        pointsMat.uniforms.uSizeScale.value = height * dpr * 0.5;
      };
      window.addEventListener("resize", onResize);

      let visible = true;
      const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), {
        threshold: 0,
      });
      io.observe(mount);

      let raf = 0;
      const loop = () => {
        raf = requestAnimationFrame(loop);
        if (!visible) return;

        pointsMat.uniforms.uTime.value += 0.016;
        sphereMat.uniforms.uTime.value += 0.016;
        if (!dragging) rotY += AUTO_SPIN;
        group.rotation.y = rotY;
        group.rotation.x += (rotX - group.rotation.x) * 0.1;

        // Cursor → local space.
        let hit = false;
        if (hovering) {
          raycaster.setFromCamera(ndc, camera);
          const h = raycaster.intersectObject(pick, false)[0];
          if (h) {
            cursorLocal.copy(group.worldToLocal(h.point.clone()));
            hit = true;
          }
        }

        // Age the trail, then stamp the current cursor into the ring buffer.
        for (let i = 0; i < TRAIL_N; i++) trail[i].w *= TRAIL_DECAY;
        if (hit) {
          trail[writeIdx].set(cursorLocal.x, cursorLocal.y, cursorLocal.z, 1);
          writeIdx = (writeIdx + 1) % TRAIL_N;
        }

        renderer.render(scene, camera);
      };
      loop();
      renderer.domElement.style.opacity = "1";
      renderer.domElement.style.cursor = "grab";

      cleanup = () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        window.removeEventListener("resize", onResize);
        renderer.domElement.removeEventListener("pointerdown", onPointerDown);
        renderer.domElement.removeEventListener("pointerleave", onPointerLeave);
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
        geo.dispose();
        pointsMat.dispose();
        mapTex.dispose();
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
