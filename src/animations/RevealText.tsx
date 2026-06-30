"use client";

/**
 * RevealText — BeBawa-style text reveal: split into words and lift each
 * in with a blur fade (or reveal the whole block when split="none").
 * Honours prefers-reduced-motion (renders static).
 *
 *   <RevealText><h2>Heading</h2></RevealText>          // word-by-word
 *   <RevealText split="none"><p>Body…</p></RevealText> // whole block
 */

import React, { useEffect, useRef, useState, type ReactElement } from "react";

interface RevealTextProps {
  children: ReactElement;
  eager?: boolean;
  delay?: number;
  split?: "words" | "none";
  y?: number;
  blur?: number;
  duration?: number;
  stagger?: number;
}

export default function RevealText({
  children,
  eager = false,
  delay = 0,
  split = "words",
  y = 40,
  blur = 16,
  duration = 1.2,
  stagger = 0.09,
}: RevealTextProps) {
  const ref = useRef<HTMLElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setReady(true);
      return;
    }

    let killed = false;
    let splitter: { revert: () => void } | null = null;
    let st: { kill: () => void } | null = null;

    (async () => {
      try {
        await document.fonts.ready;
      } catch {
        /* settle without fonts */
      }
      if (killed || !ref.current) return;

      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      const { SplitText } = await import("gsap/SplitText");
      gsap.registerPlugin(ScrollTrigger, SplitText);
      setReady(true);

      const el = ref.current;
      let targets: Element[] | Element = el;
      if (split === "words") {
        const s = new SplitText(el, { type: "words", wordsClass: "reveal-word" });
        splitter = s;
        targets = s.words;
      }

      gsap.set(targets, { autoAlpha: 0, y, filter: `blur(${blur}px)` });
      const animate = () =>
        gsap.to(targets, {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration,
          stagger: split === "words" ? stagger : 0,
          ease: "power3.out",
          delay,
        });

      if (eager) {
        animate();
      } else {
        st = ScrollTrigger.create({
          trigger: el,
          start: "top 85%",
          once: true,
          onEnter: animate,
        });
      }
    })();

    return () => {
      killed = true;
      st?.kill();
      splitter?.revert();
    };
  }, [eager, delay, split, y, blur, duration, stagger]);

  return React.cloneElement(
    children as ReactElement<{ style?: React.CSSProperties }>,
    {
      ref,
      style: {
        ...((children.props as { style?: React.CSSProperties }).style || {}),
        visibility: ready ? undefined : "hidden",
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any
  );
}
