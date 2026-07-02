"use client";

import { useEffect, useRef } from "react";
import "./heroCursor.css";

/**
 * HeroCursor — a crosshair custom cursor for the services hero: a full-width
 * horizontal line + full-height vertical line meeting at the pointer, with a
 * square outline (a touch bigger than the office chips) so it reads like it's
 * "catching" markers on the map. Pointer-events pass through to the globe.
 */
export default function HeroCursor() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const section = root?.parentElement;
    if (!root || !section) return;
    // No custom cursor on touch / no-hover devices.
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;

    section.classList.add("has-hero-cursor");
    const hLine = root.querySelector<HTMLElement>(".hero-cursor__h")!;
    const vLine = root.querySelector<HTMLElement>(".hero-cursor__v")!;
    const box = root.querySelector<HTMLElement>(".hero-cursor__box")!;

    const onMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const inside = x >= 0 && x <= rect.width && y >= 0 && y <= rect.height;
      root.style.opacity = inside ? "1" : "0";
      if (!inside) return;
      vLine.style.transform = `translateX(${x}px)`;
      hLine.style.transform = `translateY(${y}px)`;
      box.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    };
    window.addEventListener("mousemove", onMove);

    return () => {
      window.removeEventListener("mousemove", onMove);
      section.classList.remove("has-hero-cursor");
    };
  }, []);

  return (
    <div ref={rootRef} className="hero-cursor" aria-hidden="true">
      <span className="hero-cursor__h" />
      <span className="hero-cursor__v" />
      <span className="hero-cursor__box" />
    </div>
  );
}
