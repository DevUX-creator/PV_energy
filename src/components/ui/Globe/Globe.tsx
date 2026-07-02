"use client";

import { useEffect, useRef } from "react";
import "./globe.css";

// 256×128 equirectangular land mask (white = land).
const MAP_SRC = "/GlobalReach/world-dots.png";

// ---- Tunables -------------------------------------------------------------
const R = 1; // base sphere radius
const GAP = 0.03; // "air" between the glass and the dot blanket
const RADIUS_JITTER = 0.012; // per-dot radial variation
const DENSITY = 3; // particles per land pixel
const AUTO_SPIN = 0.0003; // idle rotation speed (rad/frame) — very slow
const DOT_SIZE = 0.022; // base world size of a dot — small "lights"

// Hover: lift + highlight + grow, with a fading trail behind the cursor.
const HOVER_RADIUS = 0.34;
const HOVER_LIFT = 0.12;
const HOVER_SIZE_BOOST = 1.4;
const HOVER_HIGHLIGHT: [number, number, number] = [1.0, 1.0, 1.0]; // brighter white glow on hover
const TRAIL_N = 32;
const TRAIL_DECAY = 0.965; // higher = the hover trail lingers longer (slower)

// Dot colours — white "lights" with a slight cool-white variation.
const DOT_MAIN: [number, number, number] = [1.0, 1.0, 1.0];
const DOT_ACCENT: [number, number, number] = [0.82, 0.9, 1.0];

// Frosted-glass body palette (sampled from the Figma reference).
const OCEAN = 0xededf0; // near-white body
const LAND = 0xb4c2e6; // blue continents seen through the glass
const RIM = 0xfcfcfe; // bright soft rim

/**
 * Globe — a matte frosted-glass sphere (near-white body with faint, heavily
 * blurred blue continents diffused through it + a bright soft rim) with a
 * floating particle "blanket" of the world map above it. Drag to rotate;
 * hovering lifts/highlights/grows the dots and leaves a fading, rippling trail.
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
      camera.position.set(0, 0, 4.2);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(dpr);
      mount.appendChild(renderer.domElement);

      const group = new THREE.Group();
      scene.add(group);

      // Sample the land mask (crisp for dots, blurred for the glass tint).
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

      // Heavily-blurred copy for the glass tint → soft diffuse continents.
      const bcvs = document.createElement("canvas");
      bcvs.width = MW;
      bcvs.height = MH;
      const bctx = bcvs.getContext("2d")!;
      const small = document.createElement("canvas");
      small.width = 24;
      small.height = 12;
      const sctx = small.getContext("2d")!;
      sctx.imageSmoothingEnabled = true;
      sctx.drawImage(cvs, 0, 0, 24, 12);
      bctx.imageSmoothingEnabled = true;
      bctx.drawImage(small, 0, 0, MW, MH);

      const mapTex = new THREE.CanvasTexture(bcvs);
      mapTex.minFilter = THREE.LinearFilter;
      mapTex.magFilter = THREE.LinearFilter;
      mapTex.wrapS = THREE.RepeatWrapping;
      mapTex.wrapT = THREE.ClampToEdgeWrapping;

      // ---- Frosted-glass body --------------------------------------------
      const sphereGeo = new THREE.SphereGeometry(R, 96, 96);
      const sphereMat = new THREE.ShaderMaterial({
        uniforms: {
          uMap: { value: mapTex },
          uOcean: { value: new THREE.Color(OCEAN) },
          uLand: { value: new THREE.Color(LAND) },
          uRim: { value: new THREE.Color(RIM) },
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
          uniform vec3 uRim;
          uniform float uTime;
          varying vec3 vN;
          varying vec3 vV;
          varying vec2 vUv;

          // A small soft ELLIPTICAL light spot around direction L; ax/ay are the
          // two radii — drift them over time and the ellipse morphs slightly.
          float ellipseSpot(vec3 N, vec3 L, float ax, float ay) {
            float ndl = dot(N, L);
            if (ndl <= 0.0) return 0.0;
            vec3 up = abs(L.y) < 0.99 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0);
            vec3 T = normalize(cross(up, L));
            vec3 B = cross(L, T);
            float x = dot(N, T);
            float y = dot(N, B);
            float r2 = (x * x) / (ax * ax) + (y * y) / (ay * ay);
            return smoothstep(1.0, 0.0, r2) * ndl;
          }

          void main() {
            vec3 N = normalize(vN);
            float land = texture2D(uMap, vUv).r;
            vec3 col = mix(uOcean, uLand, land * 0.72); // blue diffuse continents

            // Three light sources on the FRONT hemisphere; distinct sizes/
            // densities; the main one is static, the other two drift.
            vec3 L1 = normalize(vec3(-0.20, 0.22, 1.0)); // main — broad, low density, static
            vec3 L2 = normalize(vec3(0.34 + 0.30 * sin(uTime * 0.13 + 2.0), -0.22 + 0.24 * sin(uTime * 0.17), 0.95)); // medium, denser
            vec3 L3 = normalize(vec3(-0.14 + 0.28 * sin(uTime * 0.10 + 3.0), 0.34 + 0.20 * sin(uTime * 0.14 + 1.5), 0.9)); // small, low
            col += ellipseSpot(N, L1, 0.95, 0.78) * 0.1;
            col += ellipseSpot(N, L2, 0.42 + 0.06 * sin(uTime * 0.15), 0.34) * 0.15;
            col += ellipseSpot(N, L3, 0.26, 0.20 + 0.05 * sin(uTime * 0.19)) * 0.09;

            float facing = clamp(dot(N, normalize(vV)), 0.0, 1.0);
            // Wider soft glowing ring near the visible edge (lower exponent).
            col = mix(col, uRim, pow(1.0 - facing, 1.7));
            gl_FragColor = vec4(col, 1.0);
          }
        `,
      });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      group.add(sphere);

      // ---- Dot blanket ----------------------------------------------------
      // Edge-aware: dots on the coastline (edge pixels) stay tight so the
      // continent CONTOUR reads; interior dots scatter more and vary in size
      // for an organic, less grid-like fill.
      const isLand = (xx: number, yy: number) => {
        if (yy < 0 || yy >= MH) return false;
        const wx = ((xx % MW) + MW) % MW; // wrap longitude
        return data[(yy * MW + wx) * 4] >= 128;
      };
      const homes: number[] = [];
      const cols: number[] = [];
      const sizes: number[] = [];
      for (let y = 0; y < MH; y++) {
        for (let x = 0; x < MW; x++) {
          if (data[(y * MW + x) * 4] < 128) continue; // land = white
          const edge =
            !isLand(x - 1, y) || !isLand(x + 1, y) || !isLand(x, y - 1) || !isLand(x, y + 1);
          const jit = edge ? 0.55 : 1.7; // scatter interior more, keep edges tight
          for (let d = 0; d < DENSITY; d++) {
            const u = (x + 0.5 + (Math.random() - 0.5) * jit) / MW;
            const v = (y + 0.5 + (Math.random() - 0.5) * jit) / MH;
            const phi = u * Math.PI * 2;
            const theta = v * Math.PI;
            const sinT = Math.sin(theta);
            const rr = R + GAP + (Math.random() - 0.5) * RADIUS_JITTER;
            homes.push(
              -Math.cos(phi) * sinT * rr,
              Math.cos(theta) * rr,
              Math.sin(phi) * sinT * rr
            );

            const t = Math.random() * 0.65; // white → slight cool-white
            cols.push(
              DOT_MAIN[0] + (DOT_ACCENT[0] - DOT_MAIN[0]) * t,
              DOT_MAIN[1] + (DOT_ACCENT[1] - DOT_MAIN[1]) * t,
              DOT_MAIN[2] + (DOT_ACCENT[2] - DOT_MAIN[2]) * t
            );
            // Random size — edges stay fairly uniform, interior varies more.
            sizes.push(edge ? 0.85 + Math.random() * 0.4 : 0.55 + Math.random() * 1.15);
          }
        }
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(homes), 3));
      geo.setAttribute("color", new THREE.BufferAttribute(new Float32Array(cols), 3));
      geo.setAttribute("aSize", new THREE.BufferAttribute(new Float32Array(sizes), 1));

      // Trail: a ring buffer of recent cursor samples (xyz + strength).
      const trail = Array.from({ length: TRAIL_N }, () => new THREE.Vector4(999, 999, 999, 0));
      let writeIdx = 0;

      const pointsMat = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending, // white dots glow over the glass
        uniforms: {
          uTrail: { value: trail },
          uCursorNow: { value: new THREE.Vector4(999, 999, 999, 0) },
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
          attribute float aSize;
          uniform vec4 uTrail[${TRAIL_N}];
          uniform vec4 uCursorNow;
          uniform float uTime;
          uniform float uInfluence;
          uniform float uLift;
          uniform float uSizeBoost;
          uniform vec3 uHighlight;
          uniform float uSize;
          uniform float uSizeScale;
          varying vec3 vColor;
          varying float vFacing;
          varying float vGlow;
          void main() {
            vec3 p = position;
            vec3 nrm = normalize(p);
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
            // Ripple flowing out from the cursor — air moving through the blanket.
            float dcn = distance(p, uCursorNow.xyz);
            float ripple = sin(dcn * 12.0 - uTime * 2.8) * exp(-dcn * 3.2) * uCursorNow.w;
            p += nrm * (uLift * f + ripple * 0.07);
            vColor = mix(color, uHighlight, f);
            vGlow = f;
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            // Feather the silhouette so dots fade at the rim (no hard ring).
            vec3 viewNrm = normalize((modelViewMatrix * vec4(nrm, 0.0)).xyz);
            vFacing = dot(viewNrm, normalize(-mv.xyz));
            float size = uSize * aSize * (1.0 + uSizeBoost * f);
            gl_PointSize = size * uSizeScale / -mv.z;
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          varying float vFacing;
          varying float vGlow;
          void main() {
            // Small glowing light: tight bright core + soft halo (additive).
            float d = distance(gl_PointCoord, vec2(0.5));
            float halo = smoothstep(0.5, 0.0, d);
            float core = smoothstep(0.24, 0.0, d);
            // Hovered dots add more so the brand blue reads near the cursor.
            float a = (halo * 0.5 + core * 0.55) * (1.0 + vGlow * 1.8) * smoothstep(-0.05, 0.45, vFacing);
            if (a < 0.01) discard;
            gl_FragColor = vec4(vColor, a);
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
      let rotX = 0.08;

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

        let hit = false;
        if (hovering) {
          raycaster.setFromCamera(ndc, camera);
          const h = raycaster.intersectObject(pick, false)[0];
          if (h) {
            cursorLocal.copy(group.worldToLocal(h.point.clone()));
            hit = true;
          }
        }

        for (let i = 0; i < TRAIL_N; i++) trail[i].w *= TRAIL_DECAY;
        const now = pointsMat.uniforms.uCursorNow.value as InstanceType<
          typeof THREE.Vector4
        >;
        if (hit) {
          trail[writeIdx].set(cursorLocal.x, cursorLocal.y, cursorLocal.z, 1);
          writeIdx = (writeIdx + 1) % TRAIL_N;
          now.set(cursorLocal.x, cursorLocal.y, cursorLocal.z, 1);
        } else {
          now.w *= 0.94; // ripple settles out a bit slower
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
