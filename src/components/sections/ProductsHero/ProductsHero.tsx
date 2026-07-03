"use client";

import { useEffect, useRef } from "react";
import Button from "@/components/ui/Button";
import Logo3D from "@/components/ui/Logo3D";
import "./productsHero.css";

/**
 * ProductsHero — dark-to-blue-to-white vertical gradient (from Figma) with a
 * blueprint guide overlay (concentric circles, crosshair, dashed grid). The
 * hero is taller than the viewport so the white tail reveals on scroll.
 *
 * The word "Products" sits under a soft blurred layer whose feathered radial
 * hole reveals the sharp content and follows the cursor. As you scroll down,
 * a blur-out layer ramps up (driven by --p) so the whole hero blurs away.
 */
export default function ProductsHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const blurRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const blur = blurRef.current;
    if (!section || !blur) return;

    const clamp = (v: number) => Math.min(1, Math.max(0, v));

    // Reveal position (0..1 within the blur box), eased toward the cursor.
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

      // Scroll-out progress: 0 at the top, 1 after ~0.65 viewport of scroll.
      const r = section.getBoundingClientRect();
      const p = clamp(-r.top / (window.innerHeight * 0.65));
      section.style.setProperty("--p", p.toFixed(3));

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
    <section className="prod-hero" aria-label="Products" ref={sectionRef}>
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

        {/* Scroll-out: blurs the whole hero away as --p rises. */}
        <div className="prod-hero__blurout" aria-hidden="true" />
      </div>
    </section>
  );
}
