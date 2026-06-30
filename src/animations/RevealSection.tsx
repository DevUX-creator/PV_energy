"use client";

/**
 * RevealSection — fade + rise wrapper for any block of content.
 *
 * Lazy-loads GSAP when the block nears the viewport (or immediately with
 * `eager` for above-the-fold content) and animates once. Honours
 * prefers-reduced-motion by rendering the content statically.
 */

import { useRef, useEffect, useState, ReactNode } from "react";

interface RevealSectionProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  rotation?: number;
  duration?: number;
  ease?: string;
  eager?: boolean;
  className?: string;
}

export default function RevealSection({
  children,
  delay = 0,
  y = 32,
  rotation = 0,
  duration = 1.2,
  ease = "power2.out",
  eager = false,
  className = "",
}: RevealSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [gsapReady, setGsapReady] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) {
      // Intentional: reveal the static content at once, no GSAP load.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setGsapReady(true);
      return;
    }

    const node = ref.current;

    const initAnimation = async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      setGsapReady(true);

      gsap.fromTo(
        node,
        { autoAlpha: 0, y, rotation },
        {
          autoAlpha: 1,
          y: 0,
          rotation: 0,
          duration,
          delay,
          ease,
          scrollTrigger: {
            trigger: node,
            start: "top 85%",
            once: true,
          },
        }
      );
    };

    if (eager) {
      initAnimation();
    } else {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            initAnimation();
            observer.disconnect();
          }
        },
        { rootMargin: "100px" }
      );
      observer.observe(node);
      return () => observer.disconnect();
    }
  }, [delay, y, rotation, duration, ease, eager]);

  return (
    <div
      ref={ref}
      className={`reveal-block ${className}`.trim()}
      style={{ visibility: gsapReady ? undefined : "hidden" }}
    >
      {children}
    </div>
  );
}
