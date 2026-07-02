"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGsapPlugins } from "@/lib/gsap";
import "./servicesBand.css";

/**
 * ServicesBand — full-bleed cinematic photo with a gentle scroll parallax and
 * a shuriken caption over it (About-page style, but a plain image — no WebGL
 * grid-deform effect).
 */
export default function ServicesBand() {
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
      className="svc-band"
      aria-label="Moving energy and commodities worldwide"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        className="svc-band__img"
        src="/Services/services-band.webp"
        alt="A PV Link Energy tanker at sea at sunset"
        loading="lazy"
      />
      <div className="svc-band__overlay" aria-hidden="true" />

      <div className="svc-band__caption">
        <span className="svc-band__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 1 L14.2 9.8 L23 12 L14.2 14.2 L12 23 L9.8 14.2 L1 12 L9.8 9.8 Z" />
          </svg>
        </span>
        <p className="svc-band__text">
          Moving critical energy &amp; agricultural commodities — safely and on
          schedule, across every major market.
        </p>
      </div>
    </section>
  );
}
