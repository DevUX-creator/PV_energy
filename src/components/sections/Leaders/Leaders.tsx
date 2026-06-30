"use client";

import { useEffect, useRef } from "react";
import Section from "@/components/ui/Section";
import RevealText from "@/animations/RevealText";
import Button from "@/components/ui/Button";
import Further from "./Further";
import { gsap, ScrollTrigger, registerGsapPlugins } from "@/lib/gsap";
import "./leaders.css";

// The four credibility points. Each becomes a card (aircenter location-card
// layout: big number top, small kicker, heading bottom-right) that flies
// horizontally across the pinned photo.
const KEY_POINTS = [
  { no: "01", kicker: "On time", title: "Proven track record of timely delivery" },
  { no: "02", kicker: "Net zero", title: "Committed to responsible energy practices" },
  { no: "03", kicker: "Fair play", title: "Transparent and ethical partnerships" },
  { no: "04", kicker: "Global reach", title: "Strong presence across key energy markets" },
];

/**
 * Leaders — "Trusted by Industry Leaders" credibility block. A dark
 * (inverse) surface that scrolls up and overlaps the pinned ProductShowcase
 * above it (same stacking move as Hero→About).
 *
 * After the title a contained photo is pinned with EQUAL padding on all four
 * sides (the dark section shows around it) while the key-point cards fly
 * vertically up across it, one after another. Each card is animated on its
 * OWN transform — never via a transformed wrapper — so the glass
 * backdrop-filter keeps working.
 */
export default function Leaders() {
  const stageRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const bg = bgRef.current;
    if (!stage || !bg) return;

    registerGsapPlugins();
    const cards = gsap.utils.toArray<HTMLElement>(".leaders__card", stage);
    const mm = gsap.matchMedia();

    // Desktop: pin the photo with equal padding all around, then float each
    // card UP from below the frame to its resting spot, one after another
    // (stagger). Animating each card's own y leaves no transformed ancestor
    // between card and photo, so the blur survives.
    mm.add("(min-width: 769px) and (prefers-reduced-motion: no-preference)", () => {
      // The side gap (distance from viewport edge to the stage) becomes the
      // pad used for top + bottom too, so all four sides match exactly.
      const pad = Math.round(stage.getBoundingClientRect().left);
      stage.style.setProperty("--pad", `${pad}px`);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: () => `top top+=${pad}`,
          end: "+=300%",
          pin: true,
          scrub: 1,
          anticipatePin: 1, // smooth the pin engage (no sharp jump)
          invalidateOnRefresh: true,
          // This pin adds a large (300%) spacer. It must be measured BEFORE the
          // Further sticky-cards below it, or their start/end land inside this
          // pinned range instead of after it. Higher refreshPriority = measured
          // first, so the spacer exists when Further computes its positions.
          refreshPriority: 1,
        },
      });

      // Fly drives --fly (composed in the card's CSS transform) so the
      // continuous levitation (--lev) can run on the same element without the
      // two fighting over `transform`. Cards rise from below to the centre.
      tl.fromTo(
        cards,
        { "--fly": () => `${stage.clientHeight}px` }, // start below the frame
        { "--fly": "0px", ease: "power2.out", stagger: 0.6 }, // settle centre
        0
      );

      // Once placed, each card levitates slightly forever (composes via the
      // CSS calc; the small offset is invisible while the card is off-screen
      // mid-fly). Randomised so they don't bob in sync.
      gsap.to(cards, {
        "--lev": "-12px",
        duration: 2.4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        stagger: { each: 0.4, from: "random" },
      });

      // Parallax: the photo zooms/drifts the WHOLE pin (duration = full
      // timeline) so it never stops partway. (bg is the backdrop, not an
      // ancestor of the cards, so this never affects the glass blur.)
      tl.fromTo(
        bg,
        { scale: 1.2, yPercent: -7 },
        { scale: 1, yPercent: 7, ease: "none", duration: tl.duration() },
        0
      );
    });

    // Mobile: no pin/sweep — banner photo, cards stacked below with a
    // simple staggered reveal.
    mm.add("(max-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      gsap.from(cards, {
        y: 40,
        autoAlpha: 0,
        ease: "power2.out",
        stagger: 0.12,
        scrollTrigger: { trigger: stage, start: "top 85%", once: true },
      });
    });

    return () => {
      mm.revert();
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === stage) t.kill();
      });
    };
  }, []);

  return (
    <>
    <Section
      id="leaders"
      inverse
      width="wide"
      className="leaders"
      ariaLabel="Trusted by industry leaders"
    >
      <div className="leaders__head">
        <RevealText split="none">
          <span className="section-tag leaders__tag">Trusted by Industry Leaders</span>
        </RevealText>

        <RevealText delay={0.06}>
          <h2 className="leaders__title">
            Why Industry Leaders Choose PV Link Energy
          </h2>
        </RevealText>

        <RevealText split="none" delay={0.12}>
          <p className="leaders__lead">
            We&apos;re trusted by global enterprises for our proven performance,
            commitment to safety, and cutting-edge solutions.
          </p>
        </RevealText>
      </div>

      <div ref={stageRef} className="leaders__stage">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={bgRef}
          className="leaders__bg"
          src="/Trusted/KeyPoints.jpg"
          alt="A PV Link Energy tanker at sea at sunset"
          width={4032}
          height={3024}
          loading="lazy"
        />

        <div className="leaders__cards">
          {KEY_POINTS.map((p) => (
            <article key={p.no} className="leaders__card">
              <span className="leaders__card-no">{p.no}</span>
              <span className="leaders__card-kicker">{p.kicker}</span>
              <span className="leaders__card-title">{p.title}</span>
            </article>
          ))}
        </div>
      </div>

      <div className="leaders__outro">
        <RevealText split="none">
          <span className="section-tag leaders__tag">Let&apos;s Work Together</span>
        </RevealText>
        <RevealText split="none" delay={0.06}>
          <p className="leaders__outro-text">
            Whether you&apos;re sourcing energy products or building a long-term
            supply partnership, our team is ready to help. We bring the
            reliability, transparency, and global reach your operations depend
            on. Let&apos;s talk about what we can deliver for you.
          </p>
        </RevealText>
        <RevealText split="none" delay={0.12}>
          <div className="leaders__outro-cta">
            <Button href="/contact" variant="primary">Contact Us</Button>
          </div>
        </RevealText>
      </div>

      {/* Infinite horizontal marquee, hairline top + bottom. Two identical
          groups; the track loops by -50% so the seam is invisible. */}
      <div className="leaders__marquee" aria-label="Ready to Fuel Your Next Project?">
        <div className="leaders__marquee-track" aria-hidden="true">
          {[0, 1].map((g) => (
            <div className="leaders__marquee-group" key={g}>
              {Array.from({ length: 4 }).map((_, i) => (
                <span className="leaders__marquee-item" key={i}>
                  Ready to Fuel Your Next Project?
                  <svg
                    className="leaders__marquee-sep"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 1 L14.2 9.8 L23 12 L14.2 14.2 L12 23 L9.8 14.2 L1 12 L9.8 9.8 Z" />
                  </svg>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </Section>

    <Further />
    </>
  );
}
