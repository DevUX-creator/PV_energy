"use client";

import { useEffect, useRef } from "react";
import "./gridDeform.css";

type GridDeformImageProps = {
  src: string;
  alt: string;
  className?: string;
};

// Grid-deformation hover effect (CodeGrid) adapted from video → image: a WebGL
// plane samples the image through a data texture that ripples along the
// cursor's velocity, with a chromatic-aberration trail. Pauses off-screen and
// falls back to a plain <img> on reduced motion / no WebGL.
const GRID_SIZE = 25;
const MOUSE_RADIUS = 0.25;
const STRENGTH = 0.06; // gentler ripple accumulation
const RELAXATION = 0.925;
const DISPLACEMENT = 0.008; // smaller max distortion shift
const ABERRATION = 0.15;

export default function GridDeformImage({ src, alt, className = "" }: GridDeformImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const img = imgRef.current;
    if (!container || !img) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // The deform is a cursor-driven hover effect — pointless on touch and a
    // heavy WebGL/three.js cost on phones. Only load it on a hover-capable
    // desktop viewport; everywhere else the plain <img> stays. (Width changes
    // reload the page via SmoothScroll, so this stays correct.)
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
      if (disposed || !containerRef.current) return;

      let width = container.offsetWidth;
      let height = container.offsetHeight;
      let gridX = GRID_SIZE;
      let gridY = GRID_SIZE;
      const mouse = { x: 0, y: 0, prevX: 0, prevY: 0, vX: 0, vY: 0 };

      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
      camera.position.z = 1;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.domElement.className = "grid-deform__canvas";
      container.appendChild(renderer.domElement);

      let texture: import("three").Texture;
      try {
        texture = await new THREE.TextureLoader().loadAsync(src);
      } catch {
        renderer.dispose();
        renderer.domElement.remove();
        return;
      }
      if (disposed) {
        texture.dispose();
        renderer.dispose();
        renderer.domElement.remove();
        return;
      }
      texture.minFilter = texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = false;
      // No colorSpace decode — the shader passes the raw image pixels straight
      // through (no output conversion), so the canvas matches the source photo.
      const imgAspect =
        (texture.image as HTMLImageElement).width /
        (texture.image as HTMLImageElement).height;

      img.style.opacity = "0"; // the canvas takes over once it's ready

      const createDataTexture = () => {
        const aspect = width / height;
        gridX = aspect >= 1 ? Math.round(GRID_SIZE * aspect) : GRID_SIZE;
        gridY = aspect >= 1 ? GRID_SIZE : Math.round(GRID_SIZE / aspect);
        const data = new Float32Array(gridX * gridY * 4);
        const t = new THREE.DataTexture(data, gridX, gridY, THREE.RGBAFormat, THREE.FloatType);
        t.magFilter = t.minFilter = THREE.NearestFilter;
        t.needsUpdate = true;
        return t;
      };
      let dataTexture = createDataTexture();

      const getCoverScale = (): [number, number] => {
        const containerAspect = width / height;
        const scaleX = containerAspect < imgAspect ? imgAspect / containerAspect : 1;
        const scaleY = containerAspect > imgAspect ? containerAspect / imgAspect : 1;
        return [2 * scaleX, 2 * scaleY];
      };

      const material = new THREE.ShaderMaterial({
        uniforms: {
          uTexture: { value: texture },
          uDataTexture: { value: dataTexture },
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform sampler2D uTexture;
          uniform sampler2D uDataTexture;
          varying vec2 vUv;
          void main() {
            vec4 offset = texture2D(uDataTexture, vUv);
            vec2 shift = ${DISPLACEMENT} * offset.rg;
            vec2 split = shift * ${ABERRATION};
            float r = texture2D(uTexture, vUv - shift + split).r;
            float g = texture2D(uTexture, vUv - shift).g;
            float b = texture2D(uTexture, vUv - shift - split).b;
            gl_FragColor = vec4(r, g, b, 1.0);
          }
        `,
      });

      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(...getCoverScale()), material);
      scene.add(mesh);

      const onMove = (event: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        mouse.vX = x - mouse.prevX;
        mouse.vY = y - mouse.prevY;
        mouse.prevX = mouse.x;
        mouse.prevY = mouse.y;
        mouse.x = x;
        mouse.y = y;
      };
      container.addEventListener("mousemove", onMove);

      const updateDataTexture = () => {
        const data = dataTexture.image.data as Float32Array;
        for (let i = 0; i < data.length; i += 4) {
          data[i] *= RELAXATION;
          data[i + 1] *= RELAXATION;
        }
        const gridMouseX = gridX * mouse.x;
        const gridMouseY = gridY * (1 - mouse.y);
        const maxDist = GRID_SIZE * MOUSE_RADIUS;
        for (let i = 0; i < gridX; i++) {
          for (let j = 0; j < gridY; j++) {
            const distanceSq = (gridMouseX - i) ** 2 + (gridMouseY - j) ** 2;
            if (distanceSq >= maxDist * maxDist) continue;
            const index = 4 * (i + gridX * j);
            const power = Math.min(10, maxDist / Math.sqrt(distanceSq));
            data[index] += STRENGTH * 100 * mouse.vX * power;
            data[index + 1] -= STRENGTH * 100 * mouse.vY * power;
          }
        }
        mouse.vX *= 0.9;
        mouse.vY *= 0.9;
        dataTexture.needsUpdate = true;
      };

      const loop = () => {
        updateDataTexture();
        renderer.render(scene, camera);
      };

      // Only run the render loop while on screen.
      const io = new IntersectionObserver(
        ([entry]) => renderer.setAnimationLoop(entry.isIntersecting ? loop : null),
        { threshold: 0 }
      );
      io.observe(container);

      const onResize = () => {
        width = container.offsetWidth;
        height = container.offsetHeight;
        mesh.geometry.dispose();
        mesh.geometry = new THREE.PlaneGeometry(...getCoverScale());
        dataTexture.dispose();
        dataTexture = createDataTexture();
        material.uniforms.uDataTexture.value = dataTexture;
        renderer.setSize(width, height);
      };
      window.addEventListener("resize", onResize);

      cleanup = () => {
        renderer.setAnimationLoop(null);
        io.disconnect();
        container.removeEventListener("mousemove", onMove);
        window.removeEventListener("resize", onResize);
        mesh.geometry.dispose();
        material.dispose();
        texture.dispose();
        dataTexture.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, [src]);

  return (
    <div ref={containerRef} className={`grid-deform ${className}`.trim()}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img ref={imgRef} src={src} alt={alt} className="grid-deform__img" loading="lazy" />
    </div>
  );
}
