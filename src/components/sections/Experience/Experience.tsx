"use client";

import { useEffect, useRef } from "react";
import Section from "@/components/ui/Section";
import RevealText from "@/animations/RevealText";
import ScrollLine from "@/components/ui/ScrollLine";
import { gsap, ScrollTrigger, registerGsapPlugins } from "@/lib/gsap";
import { EXPERIENCE } from "./config";
import "./experience.css";

const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Experience — opening of the "reach / sectors served" section: tag →
 * hairline → a large headline whose last line swaps through sectors using
 * the menu's letter-swap transition. Body content gets appended after.
 */
export default function Experience() {
  const markRef = useRef<HTMLSpanElement>(null);

  // Parallax: as you scroll past the image, the mark drifts up and fades —
  // the scrubbed lag gives it a delayed "fly away" feel.
  useEffect(() => {
    const el = markRef.current;
    if (!el || prefersReduced()) return;
    registerGsapPlugins();
    const ctx = gsap.context(() => {
      // Move only (no fade) — the lagging scrub makes it drift out of sync
      // with the scroll.
      gsap.to(el, {
        y: -220,
        ease: "none",
        scrollTrigger: {
          trigger: el.closest(".exp__media") || el,
          start: "top 90%",
          end: "bottom top",
          scrub: 1.6, // lag → the wording trails the scroll, asynchronous
        },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <Section id="experience" surface width="wide" className="exp" ariaLabel="Global reach">
      <div className="exp__head">
        <RevealText split="none">
          <span className="section-tag">{EXPERIENCE.tag}</span>
        </RevealText>
        <ScrollLine className="exp__rule" />
      </div>

      <div className="exp__highlight">
        <RevealText split="none">
          <h2 className="exp__lead">
            {EXPERIENCE.lead.slice(0, -1).map((line) => (
              <span key={line} className="exp__lead-line">
                {line}
              </span>
            ))}
            {/* Last lead word sits on the same line as the swapping sector. */}
            <span className="exp__lead-line exp__lead-line--swap">
              <span className="exp__to">
                {EXPERIENCE.lead[EXPERIENCE.lead.length - 1]}&nbsp;
              </span>
              <SwapRotator items={EXPERIENCE.sectors} />
            </span>
          </h2>
        </RevealText>

        <RevealText split="none" delay={0.1}>
          <div className="exp__media">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="exp__img"
              src="/GlobalReach/global-reach.webp"
              alt="PV Link Energy's global reach across world markets"
              width={2000}
              height={1117}
              loading="lazy"
            />

            {/* Mono label straddling the image's left edge, with a rotating
                shuriken mark beside it on the background side. */}
            <span className="exp__mark">
              <span ref={markRef} className="exp__mark-inner">
                <span className="exp__shuriken-wrap" aria-hidden="true">
                  <svg
                    className="exp__shuriken"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 1 L14.2 9.8 L23 12 L14.2 14.2 L12 23 L9.8 14.2 L1 12 L9.8 9.8 Z" />
                  </svg>
                </span>
                <span className="exp__mark-label">{EXPERIENCE.mark}</span>
              </span>
            </span>
          </div>
        </RevealText>
      </div>
    </Section>
  );
}

/**
 * Letter-swap rotator (same transition as the menu links): each sector
 * holds, then its letters roll up out of the mask — staggered per
 * character — while the next sector's letters roll in from below. Only
 * runs while on screen, so it adds no off-screen scroll cost.
 */
function SwapRotator({ items }: { items: string[] }) {
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const front = frontRef.current;
    const back = backRef.current;
    if (!front || !back) return;

    const n = items.length;
    const setWord = (el: HTMLElement, word: string) => {
      el.replaceChildren();
      for (const ch of word) {
        const s = document.createElement("span");
        s.className = "exp__swap-char";
        s.textContent = ch === " " ? " " : ch;
        el.appendChild(s);
      }
    };

    let i = 0;
    setWord(front, items[0]);
    if (prefersReduced()) return; // static first word, no rotation
    setWord(back, items[1 % n]);

    registerGsapPlugins();
    const HOLD = 2.4; // larger pause before each swap
    let inView = false;
    let running = false;
    let killed = false;
    let pending: gsap.core.Tween | null = null;
    let active: gsap.core.Tween | null = null;

    const chars = () => [...front.children, ...back.children] as HTMLElement[];

    const swap = () => {
      if (killed || !inView) {
        running = false;
        return;
      }
      const lineH = front.offsetHeight; // exact one-line travel
      active = gsap.to(chars(), {
        y: -lineH,
        duration: 0.36,
        ease: "power3.out",
        stagger: 0.026, // per-letter cascade, like the menu hover
        onComplete: () => {
          if (killed) return;
          i = (i + 1) % n;
          setWord(front, items[i]);
          setWord(back, items[(i + 1) % n]);
          gsap.set(chars(), { y: 0 });
          tick();
        },
      });
    };

    const tick = () => {
      if (killed || !inView) {
        running = false;
        return;
      }
      running = true;
      pending = gsap.delayedCall(HOLD, swap);
    };

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: front,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => {
          inView = self.isActive;
          if (inView && !running) tick();
        },
      });
    });

    return () => {
      killed = true;
      pending?.kill();
      active?.kill();
      ctx.revert();
    };
  }, [items]);

  return (
    <div className="exp__swap">
      <div ref={frontRef} className="exp__swap-line exp__swap-front" aria-hidden="true" />
      <div ref={backRef} className="exp__swap-line exp__swap-back" aria-hidden="true" />
      <span className="sr-only">Serving sectors including {items.join(", ")}.</span>
    </div>
  );
}
