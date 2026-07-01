"use client";

import { useLayoutEffect, useEffect, useRef } from "react";
import gsap from "gsap";
import { registerGsapPlugins } from "@/lib/gsap";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import HeroVideo from "@/components/ui/HeroVideo";
import Grain from "@/components/ui/Grain";
import "./hero.css";

const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Hero — full-bleed background video (first clip plays once, then crossfades
 * to a second looping clip; see HeroVideo). The wordmark + supporting
 * elements reveal with a word-by-word blur lift (BeBawa style). Dark
 * section: white glass text over the video. The next section scrolls up and
 * overlaps this (sticky). Reduced-motion falls back to the poster + static text.
 */
export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);

  // --- Text reveal: words blur+rise, then the supporting elements --------
  useIso(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const words = gsap.utils.toArray<HTMLElement>(root.querySelectorAll(".hero__word"));
    const fades = gsap.utils.toArray<HTMLElement>(root.querySelectorAll("[data-hero-fade]"));

    if (reduce) {
      gsap.set([...words, ...fades], { autoAlpha: 1, y: 0, filter: "none" });
      return;
    }

    registerGsapPlugins();
    const ctx = gsap.context(() => {
      gsap.set(words, { autoAlpha: 0, y: 48, filter: "blur(16px)" });
      gsap.set(fades, { autoAlpha: 0, y: 26, filter: "blur(12px)" });
      const tl = gsap.timeline({ delay: 0.2 });
      tl.to(words, {
        autoAlpha: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1.2,
        stagger: 0.14,
        ease: "power3.out",
      });
      tl.to(
        fades,
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.1,
          stagger: 0.12,
          ease: "power3.out",
        },
        "-=0.75"
      );
    }, root);

    return () => ctx.revert();
  }, []);

  // --- Scroll exit: blur + fade the title/buttons away as the next section
  //     scrolls up over the (sticky) hero. The video stays put underneath.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    registerGsapPlugins();
    // Target the real content boxes (on mobile .hero__inner is display:contents
    // and generates no box, so animating it wouldn't affect the title/buttons).
    const targets = root.querySelectorAll(
      ".hero__title, .hero__actions, .hero__footer"
    );

    const ctx = gsap.context(() => {
      // Triggered off the hero with start "top top" → progress is 0 at the
      // top (content fully visible); only blurs/fades as you scroll down.
      gsap.to(targets, {
        filter: "blur(18px)",
        autoAlpha: 0,
        y: -30,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "+=55%",
          scrub: true,
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="hero" data-theme="dark" aria-label="PV Link Energy">
      <HeroVideo
        first="/Hero/hero-1.mp4"
        second="/Hero/hero-2.mp4"
        poster="/Hero/hero-poster.jpg"
        className="hero__video"
      />
      <div className="hero__overlay" aria-hidden="true" />
      <Grain className="hero__grain" />

      <Container width="wide" className="hero__inner">
        <h1 className="hero__title">
          <span className="hero__word hero__word--pv">PV</span>
          <span className="hero__word hero__word--link">LINK</span>
          <span className="hero__word hero__word--energy">ENERGY</span>
        </h1>

        <div className="hero__actions" data-hero-fade>
          <Button href="/contact">Contact Us</Button>
          <Button href="/services" variant="outline" showArrow={false}>
            Explore Services
          </Button>
        </div>
      </Container>

      <div className="hero__footer container-wide">
        <p className="hero__sub" data-hero-fade>
          Critical energy &amp; agricultural commodities, delivered across global
          markets with precision and purpose.
        </p>
        <span className="hero__indicator" data-hero-fade aria-hidden="true">
          <svg
            className="hero__indicator-arrow"
            width="17"
            height="14"
            viewBox="0 0 17 14"
            fill="none"
          >
            <path
              d="M15.9742 5.12216L15.6467 5.5L15.9742 5.12216ZM16.8435 8.24117C17.0441 8.05146 17.053 7.735 16.8633 7.53434C16.6736 7.33369 16.3571 7.32481 16.1565 7.51453L16.5 7.87785L16.8435 8.24117ZM10.6565 12.7145L10.2932 13.058L10.9802 13.7847L11.3435 13.4412L11 13.0779L10.6565 12.7145ZM0 6.87785V7.37785H15.3193V6.87785V6.37785H0V6.87785ZM15.9742 5.12216L16.3017 4.74431L10.8275 1.2219e-06L10.5 0.377846L10.1725 0.75569L15.6467 5.5L15.9742 5.12216ZM15.3193 6.87785V7.37785C16.7078 7.37785 17.351 5.65372 16.3017 4.74431L15.9742 5.12216L15.6467 5.5C15.9965 5.80314 15.7821 6.37785 15.3193 6.37785V6.87785ZM16.5 7.87785L16.1565 7.51453L10.6565 12.7145L11 13.0779L11.3435 13.4412L16.8435 8.24117L16.5 7.87785Z"
              fill="currentColor"
            />
          </svg>
        </span>
      </div>
    </section>
  );
}
