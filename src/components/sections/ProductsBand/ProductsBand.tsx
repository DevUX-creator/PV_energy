"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGsapPlugins } from "@/lib/gsap";
import "./productsBand.css";

/**
 * ProductsBand — full-bleed cinematic photo with a gentle scroll parallax and
 * a shuriken caption (same pattern as ServicesBand), sitting between the
 * products intro and the department listings.
 */
export default function ProductsBand() {
  const bandRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const band = bandRef.current;
    const img = imgRef.current;
    if (!band || !img) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    registerGsapPlugins();
    const tween = gsap.fromTo(
      img,
      { yPercent: -7 },
      {
        yPercent: 7,
        ease: "none",
        scrollTrigger: {
          trigger: band,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      }
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <section
      ref={bandRef}
      className="prod-band"
      aria-label="Storing, blending and delivering commodities on-spec"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        className="prod-band__img"
        src="/Products/products-band.webp"
        alt="Petroleum storage tanks at a terminal in the evening light"
        loading="lazy"
      />
      <div className="prod-band__overlay" aria-hidden="true" />

      <div className="prod-band__caption">
        <span className="prod-band__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 1 L14.2 9.8 L23 12 L14.2 14.2 L12 23 L9.8 14.2 L1 12 L9.8 9.8 Z" />
          </svg>
        </span>
        <p className="prod-band__text">
          From refinery and plant to port and field — stored, blended and
          delivered on-spec, wherever industry needs it.
        </p>
      </div>
    </section>
  );
}
