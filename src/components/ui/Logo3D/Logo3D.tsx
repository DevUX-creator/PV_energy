"use client";

import { useEffect, useRef } from "react";
import "./logo3d.css";

// The menu/header mark (public/LogoIcon.svg) inlined so we can extrude its
// faces into real 3D without a fetch.
const LOGO_SVG = `<svg width="41" height="60" viewBox="0 0 41 60" xmlns="http://www.w3.org/2000/svg">
<path d="M9.50756 30.6875V43.5941L2.08606 47.8338L2.12904 26.3036L9.50756 30.6875Z" fill="#96002E"/>
<path d="M31.7434 30.7884V43.6518L39.2079 47.9348L39.1219 26.4045L31.7434 30.7884Z" fill="#96002E"/>
<path d="M9.50754 43.5652L20.8977 50.2277L20.6684 58.6638L2.0144 47.8771L9.50754 43.5652Z" fill="#E21735"/>
<path d="M31.7864 43.6229L20.6685 50.1123V58.7071L39.2222 47.8771L31.7864 43.6229Z" fill="#E21735"/>
<path d="M31.8436 18.848L20.4535 12.2L20.4678 3.64847L39.2651 14.5362L31.8436 18.848Z" fill="#0066A8"/>
<path d="M9.40719 18.848L20.4821 12.2V3.64847L2.07166 14.5794L9.40719 18.848Z" fill="#0066A8"/>
<path d="M39.1935 23.1598L28.0899 29.6203L20.6398 25.3662L39.2652 14.5073L39.1935 23.1598Z" fill="#019DDA"/>
<path d="M2.11473 23.1598L13.2183 29.6203L20.6685 25.3662L2.04309 14.5073L2.11473 23.1598Z" fill="#019DDA"/>
<path d="M28.0757 42.5846L28.09 29.505L20.6971 25.2797V46.9686L28.0757 42.5846Z" fill="#019DDA"/>
</svg>`;

/**
 * Logo3D — a real-3D version of the brand mark: each face of the SVG is
 * extruded and lit, then the whole thing slowly auto-rotates and tilts toward
 * the cursor. Pauses off-screen; reduced-motion / no-WebGL shows the flat SVG.
 */
export default function Logo3D({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // The mark tilts toward the cursor — a hover effect. Skip the heavy
    // three.js load on touch / phones and just show the flat SVG fallback.
    if (
      !window.matchMedia(
        "(min-width: 769px) and (hover: hover) and (pointer: fine)"
      ).matches
    )
      return;

    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const THREE = await import("three");
      const { SVGLoader } = await import("three/examples/jsm/loaders/SVGLoader.js");
      const { RoomEnvironment } = await import(
        "three/examples/jsm/environments/RoomEnvironment.js"
      );
      if (disposed || !ref.current) return;

      let w = container.clientWidth || 1;
      let h = container.clientHeight || 1;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(34, w / h, 0.1, 100);
      camera.position.set(0, 0, 7.2);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.domElement.className = "logo3d__canvas";
      container.appendChild(renderer.domElement);

      // Environment map → matte-metal reflections.
      const pmrem = new THREE.PMREMGenerator(renderer);
      const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      scene.environment = envTexture;

      scene.add(new THREE.AmbientLight(0xffffff, 0.6));
      const key = new THREE.DirectionalLight(0xffffff, 0.85);
      key.position.set(4, 5, 6);
      scene.add(key);
      const rim = new THREE.DirectionalLight(0xffffff, 0.32);
      rim.position.set(-5, -3, -4);
      scene.add(rim);

      // Build the mark from the SVG faces. No bevel (so adjacent faces meet
      // flush, not rounded), and a per-face polygon-offset + tiny z step so the
      // coplanar / slightly-overlapping faces of the source SVG don't z-fight at
      // the seams.
      const data = new SVGLoader().parse(LOGO_SVG);
      const group = new THREE.Group();
      const materials: import("three").Material[] = [];
      let i = 0;
      for (const path of data.paths) {
        const fill =
          (path.userData as { style?: { fill?: string } })?.style?.fill || "#888888";
        const mat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(fill),
          metalness: 0.85, // matte metal
          roughness: 0.82,
          envMapIntensity: 0.4,
          side: THREE.DoubleSide,
          flatShading: true,
          polygonOffset: true,
          polygonOffsetFactor: -i,
          polygonOffsetUnits: -i,
        });
        materials.push(mat);
        for (const shape of SVGLoader.createShapes(path)) {
          const geo = new THREE.ExtrudeGeometry(shape, { depth: 7, bevelEnabled: false });
          const mesh = new THREE.Mesh(geo, mat);
          mesh.position.z = i * 0.04; // break coplanar ties
          group.add(mesh);
        }
        i++;
      }
      group.scale.y = -1; // SVG y-down → three y-up

      // Centre + scale to fit.
      const box = new THREE.Box3().setFromObject(group);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      group.position.sub(center);
      const pivot = new THREE.Group();
      pivot.add(group);
      scene.add(pivot);
      pivot.scale.setScalar(3.4 / Math.max(size.x, size.y, size.z));

      const m = { x: 0, y: 0, tx: 0, ty: 0 };
      const onMove = (e: MouseEvent) => {
        const r = container.getBoundingClientRect();
        m.tx = ((e.clientX - r.left) / r.width) * 2 - 1;
        m.ty = ((e.clientY - r.top) / r.height) * 2 - 1;
      };
      window.addEventListener("mousemove", onMove);

      const loop = () => {
        m.x += (m.tx - m.x) * 0.06;
        m.y += (m.ty - m.y) * 0.06;
        // Slight horizontal rotation toward the cursor (+ a touch of tilt).
        pivot.rotation.y = m.x * 0.4;
        pivot.rotation.x = m.y * 0.18;
        renderer.render(scene, camera);
      };

      const io = new IntersectionObserver(
        ([entry]) => renderer.setAnimationLoop(entry.isIntersecting ? loop : null),
        { threshold: 0 }
      );
      io.observe(container);

      const onResize = () => {
        w = container.clientWidth || 1;
        h = container.clientHeight || 1;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener("resize", onResize);

      const fallback = container.querySelector<HTMLElement>(".logo3d__fallback");
      if (fallback) fallback.style.opacity = "0";

      cleanup = () => {
        renderer.setAnimationLoop(null);
        io.disconnect();
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("resize", onResize);
        group.traverse((o) => {
          const mesh = o as import("three").Mesh;
          if (mesh.geometry) mesh.geometry.dispose();
        });
        materials.forEach((mat) => mat.dispose());
        envTexture.dispose();
        pmrem.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return (
    <div ref={ref} className={`logo3d ${className}`.trim()}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="logo3d__fallback" src="/LogoIcon.svg" alt="PV Link Energy" />
    </div>
  );
}
