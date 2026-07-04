"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGsapPlugins } from "@/lib/gsap";
import "./photoBand.css";

type PhotoBandProps = {
  image: string;
  alt: string;
  caption: string;
  ariaLabel: string;
  /** object-position for the photo (default "center 50%"). */
  focus?: string;
};

/**
 * PhotoBand — full-bleed cinematic photo with a gentle scroll parallax and a
 * spinning-shuriken caption. Shared by the Services and Products pages.
 */
export default function PhotoBand({
  image,
  alt,
  caption,
  ariaLabel,
  focus = "center 50%",
}: PhotoBandProps) {
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
    <section ref={bandRef} className="photo-band" aria-label={ariaLabel}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        className="photo-band__img"
        src={image}
        alt={alt}
        loading="lazy"
        style={{ objectPosition: focus }}
      />
      <div className="photo-band__overlay" aria-hidden="true" />

      <div className="photo-band__caption">
        <span className="photo-band__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 1 L14.2 9.8 L23 12 L14.2 14.2 L12 23 L9.8 14.2 L1 12 L9.8 9.8 Z" />
          </svg>
        </span>
        <p className="photo-band__text">{caption}</p>
      </div>
    </section>
  );
}
