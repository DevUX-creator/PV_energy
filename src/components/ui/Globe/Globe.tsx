"use client";

import { useEffect, useRef } from "react";
import "./globe.css";

// 256×128 equirectangular land mask (white = land).
const MAP_SRC = "/GlobalReach/world-dots.png";

// ---- Tunables -------------------------------------------------------------
const R = 1;
const AUTO_SPIN = 0.0007; // slow idle rotation
// Frosted-glass palette (sampled from the Figma reference).
const OCEAN = 0xededf0; // near-white body
const LAND = 0xd7d5ea; // faint blue-lavender continents, seen through the glass
const RIM = 0xfcfcfe; // bright soft rim / halo

/**
 * Globe — a matte frosted-glass sphere: near-white body with very faint,
 * heavily-blurred blue continents diffused through it (like coloured matte
 * glass), plus a bright soft rim and a soft outer glow. Drag to rotate.
 * (Reference: Figma frosted orb — no particles.)
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
      camera.position.set(0, 0, 3.8);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(dpr);
      mount.appendChild(renderer.domElement);

      const group = new THREE.Group();
      scene.add(group);

      // Heavily-blurred land mask → continents read as soft diffuse shades.
      const img = await new Promise<HTMLImageElement | null>((res) => {
        const im = new Image();
        im.onload = () => res(im);
        im.onerror = () => res(null);
        im.src = MAP_SRC;
      });
      if (disposed || !img) return;

      const bcvs = document.createElement("canvas");
      bcvs.width = 256;
      bcvs.height = 128;
      const bctx = bcvs.getContext("2d")!;
      const small = document.createElement("canvas");
      small.width = 22;
      small.height = 11;
      const sctx = small.getContext("2d")!;
      sctx.imageSmoothingEnabled = true;
      sctx.drawImage(img, 0, 0, 22, 11);
      bctx.imageSmoothingEnabled = true;
      bctx.drawImage(small, 0, 0, 256, 128);

      const mapTex = new THREE.CanvasTexture(bcvs);
      mapTex.minFilter = THREE.LinearFilter;
      mapTex.magFilter = THREE.LinearFilter;
      mapTex.wrapS = THREE.RepeatWrapping;
      mapTex.wrapT = THREE.ClampToEdgeWrapping;

      // ---- Frosted-glass body --------------------------------------------
      const bodyMat = new THREE.ShaderMaterial({
        uniforms: {
          uMap: { value: mapTex },
          uOcean: { value: new THREE.Color(OCEAN) },
          uLand: { value: new THREE.Color(LAND) },
          uRim: { value: new THREE.Color(RIM) },
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
          varying vec3 vN;
          varying vec3 vV;
          varying vec2 vUv;
          void main() {
            vec3 N = normalize(vN);
            float land = texture2D(uMap, vUv).r;
            // Faint blue continents diffused through the frosted glass.
            vec3 col = mix(uOcean, uLand, land * 0.55);
            float facing = clamp(dot(N, normalize(vV)), 0.0, 1.0);
            // Bright soft rim (the frosted edge glow).
            col = mix(col, uRim, pow(1.0 - facing, 2.4));
            // A whisper of centre light so it reads as a rounded matte body.
            col += facing * 0.015;
            gl_FragColor = vec4(col, 1.0);
          }
        `,
      });
      const body = new THREE.Mesh(new THREE.SphereGeometry(R, 96, 96), bodyMat);
      group.add(body);

      // ---- Soft outer glow halo (feathers the edge into the background) ---
      const glowMat = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        side: THREE.BackSide,
        uniforms: {
          uColor: { value: new THREE.Color(RIM) },
          uIntensity: { value: 0.55 },
        },
        vertexShader: `
          varying vec3 vN;
          varying vec3 vV;
          void main() {
            vec4 wp = modelMatrix * vec4(position, 1.0);
            vN = normalize(mat3(modelMatrix) * normal);
            vV = normalize(cameraPosition - wp.xyz);
            gl_Position = projectionMatrix * viewMatrix * wp;
          }
        `,
        fragmentShader: `
          uniform vec3 uColor;
          uniform float uIntensity;
          varying vec3 vN;
          varying vec3 vV;
          void main() {
            float fres = pow(1.0 - max(dot(normalize(vN), normalize(vV)), 0.0), 3.5);
            gl_FragColor = vec4(uColor, fres * uIntensity);
          }
        `,
      });
      const glow = new THREE.Mesh(new THREE.SphereGeometry(R * 1.08, 64, 64), glowMat);
      group.add(glow);

      // ---- Interaction: slow spin + drag ---------------------------------
      let dragging = false;
      let lastX = 0;
      let lastY = 0;
      let rotY = 0;
      let rotX = 0.1;
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
      const onPointerMove = (e: PointerEvent) => {
        if (!dragging) return;
        rotY += (e.clientX - lastX) * 0.005;
        rotX = Math.max(-0.6, Math.min(0.6, rotX + (e.clientY - lastY) * 0.005));
        lastX = e.clientX;
        lastY = e.clientY;
      };
      renderer.domElement.addEventListener("pointerdown", onPointerDown);
      window.addEventListener("pointerup", onPointerUp);
      window.addEventListener("pointermove", onPointerMove);

      const onResize = () => {
        width = mount.clientWidth || 1;
        height = mount.clientHeight || 1;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
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
        if (!dragging) rotY += AUTO_SPIN;
        group.rotation.y = rotY;
        group.rotation.x += (rotX - group.rotation.x) * 0.1;
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
        window.removeEventListener("pointerup", onPointerUp);
        window.removeEventListener("pointermove", onPointerMove);
        mapTex.dispose();
        body.geometry.dispose();
        bodyMat.dispose();
        glow.geometry.dispose();
        glowMat.dispose();
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
