"use client";

import { useEffect, useRef } from "react";
import Button from "@/components/ui/Button";
import Logo3D from "@/components/ui/Logo3D";
import "./productsHero.css";

/**
 * ProductsHero — dark hero with a soft blue gradient wash (sui.io style). The
 * word "Products" sits under one fully-blurred layer whose feathered radial
 * mask punches a sharp "hole": centered by default, and following the cursor
 * so moving the mouse reveals different parts of the word (a progressive-blur
 * spotlight). The 3D logo (above) and buttons (below) stay crisp.
 */
export default function ProductsHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const blurRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const blur = blurRef.current;
    if (!section || !blur) return;

    // Normalised target / current reveal position (0..1 within the section).
    let tx = 0.5;
    let ty = 0.5;
    let cx = 0.5;
    let cy = 0.5;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      const r = section.getBoundingClientRect();
      tx = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
      ty = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
    };
    const onLeave = () => {
      tx = 0.5;
      ty = 0.5;
    };

    const tick = () => {
      // Ease the sharp window toward the cursor for a trailing feel.
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      const b = blur.getBoundingClientRect();
      blur.style.setProperty("--mx", `${(cx * b.width).toFixed(1)}px`);
      blur.style.setProperty("--my", `${(cy * b.height).toFixed(1)}px`);
      raf = requestAnimationFrame(tick);
    };

    // Only track a real pointer; touch keeps the centered reveal.
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (fine) {
      window.addEventListener("pointermove", onMove, { passive: true });
      section.addEventListener("pointerleave", onLeave);
    }
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <section className="prod-hero" aria-label="Products" ref={sectionRef}>
      <div className="prod-hero__bg" aria-hidden="true" />

      <div className="prod-hero__center">
        <div className="prod-hero__logo">
          <Logo3D />
        </div>

        <div className="prod-hero__wordstage">
          <h1 className="prod-hero__word">Products</h1>
          {/* Full blur over the word; the feathered radial hole (at --mx/--my)
              reveals the sharp centre and follows the cursor. */}
          <div className="prod-hero__blur" aria-hidden="true" ref={blurRef} />
        </div>

        <div className="prod-hero__actions">
          <Button href="/products#petroleum" variant="outline" showArrow={false}>
            Petroleum
          </Button>
          <Button href="/products#fertilizers" variant="outline" showArrow={false}>
            Fertilizers
          </Button>
        </div>
      </div>
    </section>
  );
}
