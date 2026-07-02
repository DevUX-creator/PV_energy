"use client";

import { useEffect, useRef } from "react";
import "./globe.css";

// Office + key-hub markers ([lat, lng]). Dubai / Athens / Hong Kong are the
// real offices; the rest sketch the "5 hubs / 20+ countries" reach.
const MARKERS: { location: [number, number]; size: number }[] = [
  { location: [25.19, 55.28], size: 0.1 }, // Dubai
  { location: [37.98, 23.72], size: 0.1 }, // Athens
  { location: [22.32, 114.17], size: 0.1 }, // Hong Kong
  { location: [1.35, 103.82], size: 0.06 }, // Singapore
  { location: [51.95, 4.14], size: 0.06 }, // Rotterdam (ARA)
  { location: [29.76, -95.37], size: 0.06 }, // Houston
  { location: [6.45, 3.39], size: 0.06 }, // Lagos
];

/**
 * Globe — a dotted, phong-lit particle globe (via cobe) with location markers.
 * Slowly auto-rotates; drag to spin. Light theme to sit on a warm off-white
 * surface. cobe bundles the world-map data, so no map asset is needed.
 */
export default function Globe({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let width = canvas.offsetWidth;
    let phi = 0;
    let rotation = 0; // drag offset added on top of the auto-spin
    let pointerStart: number | null = null;
    let firstRender = true;
    let raf = 0;

    const onResize = () => {
      width = canvas.offsetWidth;
    };
    window.addEventListener("resize", onResize);

    let destroy = () => {};
    let disposed = false;

    (async () => {
      const createGlobe = (await import("cobe")).default;
      if (disposed || !canvasRef.current) return;

      const globe = createGlobe(canvas, {
        devicePixelRatio: Math.min(window.devicePixelRatio, 2),
        width: width * 2,
        height: width * 2,
        phi: 0,
        theta: 0.22,
        dark: 0, // light theme
        diffuse: 1.2,
        mapSamples: 16000,
        mapBrightness: 3,
        baseColor: [0.78, 0.84, 0.95], // soft blue land dots
        markerColor: [0.1, 0.32, 0.78], // brand-ish blue markers
        glowColor: [1, 1, 1], // soft white halo / blooms
        markers: MARKERS,
      });

      // cobe v2 has no onRender — drive it with our own loop.
      const frame = () => {
        if (pointerStart === null) phi += 0.0035; // idle auto-rotate
        globe.update({ phi: phi + rotation, width: width * 2, height: width * 2 });
        if (firstRender) {
          firstRender = false;
          canvas.style.opacity = "1";
        }
        raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);

      destroy = () => {
        cancelAnimationFrame(raf);
        globe.destroy();
      };
    })();

    const onPointerDown = (e: PointerEvent) => {
      pointerStart = e.clientX - rotation / 0.005;
      canvas.style.cursor = "grabbing";
    };
    const onPointerUp = () => {
      pointerStart = null;
      canvas.style.cursor = "grab";
    };
    const onPointerMove = (e: PointerEvent) => {
      if (pointerStart !== null) rotation = (e.clientX - pointerStart) * 0.005;
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointermove", onPointerMove);

    return () => {
      disposed = true;
      destroy();
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  return <canvas ref={canvasRef} className={`globe ${className}`.trim()} />;
}
