"use client";

/**
 * Copy — line-by-line text reveal.
 *
 * Splits its single child's text into masked lines and staggers each
 * line up into view. Honours prefers-reduced-motion (renders instantly)
 * and waits for webfonts so SplitText measures the final glyphs.
 *
 *   - eager   → load GSAP immediately (above-the-fold, e.g. Hero)
 *   - default → lazy-load GSAP when the block nears the viewport
 */

import "./copy.css";
import React, { useRef, useEffect, useState, ReactElement } from "react";

interface CopyProps {
  children: ReactElement | ReactElement[];
  animateOnScroll?: boolean;
  delay?: number;
  eager?: boolean;
}

export default function Copy({
  children,
  animateOnScroll = true,
  delay = 0,
  eager = false,
}: CopyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const splitRefs = useRef<unknown[]>([]);
  const revealedRef = useRef(false);
  const failsafeRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [gsapReady, setGsapReady] = useState(false);

  const waitForFonts = async (): Promise<void> => {
    try {
      await document.fonts.ready;
    } catch {
      /* no-op: fall through to a small settle delay */
    }
    await new Promise((r) => setTimeout(r, 50));
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) {
      // Intentional: reveal the static text at once, no GSAP load.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setGsapReady(true);
      return;
    }

    const initAnimation = async () => {
      await waitForFonts();

      const gsap = (await import("gsap")).default;
      const { SplitText } = await import("gsap/SplitText");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(SplitText, ScrollTrigger);

      // If the failsafe already revealed the static text, don't re-hide it.
      if (failsafeRef.current) {
        clearTimeout(failsafeRef.current);
        failsafeRef.current = undefined;
      }
      if (revealedRef.current) {
        setGsapReady(true);
        return;
      }
      revealedRef.current = true;
      setGsapReady(true);

      const elements = containerRef.current?.hasAttribute("data-copy-wrapper")
        ? Array.from(containerRef.current.children)
        : containerRef.current
          ? [containerRef.current]
          : [];

      const lines: Element[] = [];
      elements.forEach((element) => {
        const split = SplitText.create(element, {
          type: "lines",
          mask: "lines",
          linesClass: "line++",
        });
        splitRefs.current.push(split);
        lines.push(...split.lines);
      });

      gsap.set(lines, { y: "100%", opacity: 0 });

      const animationProps = {
        y: "0%",
        opacity: 1,
        duration: 1.1,
        stagger: 0.12,
        ease: "power3.out",
        delay,
      };

      if (animateOnScroll) {
        gsap.to(lines, {
          ...animationProps,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 90%",
            once: true,
          },
        });
      } else {
        gsap.to(lines, animationProps);
      }
    };

    if (eager || !animateOnScroll) {
      initAnimation();
      // Failsafe for above-the-fold copy: reveal static text if the async
      // font + GSAP load is slow or fails on a real device.
      failsafeRef.current = setTimeout(() => {
        revealedRef.current = true;
        setGsapReady(true);
      }, 1200);
    } else {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            initAnimation();
            observer.disconnect();
          }
        },
        { rootMargin: "200px" }
      );
      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }

    const currentSplits = splitRefs.current;
    return () => {
      if (failsafeRef.current) clearTimeout(failsafeRef.current);
      currentSplits.forEach((s) => {
        if (s && typeof s === "object" && "revert" in s) {
          (s as { revert: () => void }).revert();
        }
      });
    };
  }, [delay, animateOnScroll, eager]);

  // Single child: clone it directly so the ref/visibility apply to the
  // real element (h1, p, …) and SplitText runs on its own text.
  if (React.Children.count(children) === 1) {
    const child = React.Children.only(children) as ReactElement<{
      style?: React.CSSProperties;
    }>;
    return React.cloneElement(child, {
      ref: containerRef,
      style: {
        ...(child.props.style || {}),
        visibility: gsapReady ? undefined : "hidden",
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
  }

  // Multiple children: wrap them; each child becomes its own split group.
  return (
    <div
      ref={containerRef}
      data-copy-wrapper="true"
      style={{ visibility: gsapReady ? undefined : "hidden" }}
    >
      {children}
    </div>
  );
}
