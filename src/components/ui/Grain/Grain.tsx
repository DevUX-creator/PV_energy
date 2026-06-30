"use client";

import { useEffect, useRef } from "react";
import { useFirstViewport } from "@/lib/useFirstViewport";
import "./grain.css";

/**
 * Grain — animated film-grain/noise overlay (à la sui.io hero). Draws a
 * small random-noise tile, repeats it to fill, and re-randomises a few
 * times a second for a living-grain texture. Decorative, pointer-events
 * none; disabled under reduced-motion.
 *
 * The loop only runs while the hero is uncovered and the tab is visible —
 * a full-screen canvas repainting forever (the hero is sticky, so it sits
 * behind every section) is a page-wide scroll cost.
 */
export default function Grain({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const ctrl = useRef<{ start: () => void; stop: () => void } | null>(null);
  const active = useFirstViewport();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const tile = document.createElement("canvas");
    tile.width = 128;
    tile.height = 128;
    const tctx = tile.getContext("2d");
    if (!tctx) return;

    let pattern: CanvasPattern | null = null;

    const regen = () => {
      const img = tctx.createImageData(128, 128);
      const d = img.data;
      for (let i = 0; i < d.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        d[i] = d[i + 1] = d[i + 2] = v;
        d[i + 3] = 255;
      }
      tctx.putImageData(img, 0, 0);
      pattern = ctx.createPattern(tile, "repeat");
    };

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    let last = 0;
    let running = false;
    const loop = (t: number) => {
      if (t - last > 80) {
        regen();
        if (pattern) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = pattern;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        last = t;
      }
      raf = requestAnimationFrame(loop);
    };

    ctrl.current = {
      start: () => {
        if (running) return;
        running = true;
        last = 0;
        raf = requestAnimationFrame(loop);
      },
      stop: () => {
        if (!running) return;
        running = false;
        cancelAnimationFrame(raf);
      },
    };

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      ctrl.current = null;
    };
  }, []);

  // Run only while the hero is uncovered and the tab is visible.
  useEffect(() => {
    const c = ctrl.current;
    if (!c) return;
    const sync = () => (active && !document.hidden ? c.start() : c.stop());
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => {
      document.removeEventListener("visibilitychange", sync);
      c.stop();
    };
  }, [active]);

  return <canvas ref={ref} className={`grain ${className}`.trim()} aria-hidden="true" />;
}
