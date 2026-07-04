"use client";

import { useEffect, useRef } from "react";
import Button from "@/components/ui/Button";
import Logo3D from "@/components/ui/Logo3D";
import "./productsHero.css";

/**
 * ProductsHero — dark-to-blue-to-white vertical gradient (from Figma) with a
 * blueprint guide overlay. The hero is a little taller than the viewport so
 * the white tail only reveals as you scroll, blending into the section below.
 *
 * The word "Products" sits under a soft blurred layer whose feathered radial
 * hole reveals the sharp content and follows the cursor. The 3D logo (above)
 * and the CTA (below) stay crisp.
 */
export default function ProductsHero() {
  const blurRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const blur = blurRef.current;
    if (!blur) return;

    const clamp = (v: number) => Math.min(1, Math.max(0, v));

    let tx = 0.5;
    let ty = 0.5;
    let cx = 0.5;
    let cy = 0.5;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      const r = blur.getBoundingClientRect();
      tx = clamp((e.clientX - r.left) / r.width);
      ty = clamp((e.clientY - r.top) / r.height);
    };
    const onLeave = () => {
      tx = 0.5;
      ty = 0.5;
    };

    const tick = () => {
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      const b = blur.getBoundingClientRect();
      blur.style.setProperty("--mx", `${(cx * b.width).toFixed(1)}px`);
      blur.style.setProperty("--my", `${(cy * b.height).toFixed(1)}px`);
      raf = requestAnimationFrame(tick);
    };

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (fine) {
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerleave", onLeave);
    }
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <section className="prod-hero" aria-label="Products">
      <div className="prod-hero__bg" aria-hidden="true" />

      <div className="prod-hero__viewport">
        {/* Blueprint guides (from Figma): crosshair, dashed grid, circles. */}
        <div className="prod-hero__guides" aria-hidden="true">
          <span className="prod-hero__cross" />
          <span className="prod-hero__dash prod-hero__dash--v" />
          <span className="prod-hero__dash prod-hero__dash--h" />
          <svg
            className="prod-hero__rings"
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid meet"
          >
            <circle cx="50" cy="50" r="46" />
            <circle cx="50" cy="50" r="34" />
          </svg>
        </div>

        <div className="prod-hero__center">
          <div className="prod-hero__logo">
            <Logo3D />
          </div>

          <div className="prod-hero__wordstage">
            <h1 className="prod-hero__word">Products</h1>
          </div>

          <div className="prod-hero__actions">
            <Button href="/products#petroleum" variant="primary">
              Explore products
            </Button>
          </div>
        </div>

        {/* Soft blur over the first screen; the radial hole (at --mx/--my)
            reveals the sharp content and follows the cursor. */}
        <div className="prod-hero__blur" aria-hidden="true" ref={blurRef} />
      </div>
    </section>
  );
}
