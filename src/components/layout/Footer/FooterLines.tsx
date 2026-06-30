"use client";

import { useEffect, useRef } from "react";

/**
 * FooterLines — a field of horizontal lines drawn on canvas that bend
 * toward the cursor. Runs only while the footer is in view (rAF stops
 * off-screen) and renders a single static frame on reduced-motion. The
 * stroke colour is inherited from CSS (`color` on the canvas), so it
 * sits as a subtle texture on our light footer.
 */
export default function FooterLines() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const LINES = 30;
    const SEG = 72;

    let w = 0;
    let h = 0;
    let raf = 0;
    let running = false;
    let t = 0;
    let stroke = "rgb(10,10,10)";
    const m = { x: -9999, y: -9999, tx: -9999, ty: -9999 };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stroke = getComputedStyle(canvas).color || stroke;
    };

    const render = () => {
      ctx.clearRect(0, 0, w, h);
      m.x += (m.tx - m.x) * 0.08;
      m.y += (m.ty - m.y) * 0.08;
      t += 0.006;

      ctx.lineWidth = 1;
      ctx.strokeStyle = stroke;
      ctx.globalAlpha = 0.1; // subtle on the light surface

      const sigmaX = w * 0.13;
      const sigmaY = h * 0.42;

      for (let i = 0; i < LINES; i++) {
        const baseY = (h / (LINES + 1)) * (i + 1);
        ctx.beginPath();
        for (let s = 0; s <= SEG; s++) {
          const x = (w / SEG) * s;
          let y = baseY + Math.sin(x * 0.01 + t * 1.6 + i * 0.6) * 5;
          const dx = x - m.x;
          const dy = baseY - m.y;
          const infl =
            Math.exp(-(dx * dx) / (2 * sigmaX * sigmaX)) *
            Math.exp(-(dy * dy) / (2 * sigmaY * sigmaY));
          y += (m.y - baseY) * infl * 0.55;
          if (s === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      if (running) raf = requestAnimationFrame(render);
    };

    const start = () => {
      if (!running) {
        running = true;
        raf = requestAnimationFrame(render);
      }
    };
    const stop = () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      m.tx = e.clientX - r.left;
      m.ty = e.clientY - r.top;
    };

    resize();

    if (reduce) {
      render(); // single static frame
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0 }
    );
    io.observe(canvas);
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);

    return () => {
      stop();
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return <canvas ref={ref} className="footer__lines" aria-hidden="true" />;
}
