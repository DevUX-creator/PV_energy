"use client";

import { useEffect, useRef, useState } from "react";
import "./scrollLine.css";

/**
 * ScrollLine — a 1px horizontal rule that draws from left to right
 * (scaleX 0 → 1) the first time it scrolls into view. Reduced-motion
 * shows it fully drawn.
 */
export default function ScrollLine({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`scroll-line ${inView ? "is-inview" : ""} ${className}`.trim()}
      aria-hidden="true"
    />
  );
}
