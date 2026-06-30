"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Container from "@/components/ui/Container";
import RevealText from "@/animations/RevealText";
import Button from "@/components/ui/Button";
import Logo3D from "@/components/ui/Logo3D";
import { gsap, ScrollTrigger, registerGsapPlugins } from "@/lib/gsap";
import "./aboutFinale.css";

const NAV = [
  { label: "Our Services", href: "/services", pos: "left" },
  { label: "Our Products", href: "/products", pos: "right" },
];

const BG_LINES = ["Empowering", "global energy", "flows."];

/**
 * AboutFinale — closing composition (GraphicHunters "home-shirt" layout) on the
 * dark surface: a grey wordline centred on a full-bleed aim/crosshair, the 3D
 * brand mark in the bullseye, two glass nav buttons, and an info block + CTA.
 * Every layer parallax-moves at its own (small) rate on scroll.
 */
export default function AboutFinale() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    registerGsapPlugins();

    const mk = (sel: string, from: number, to: number) => {
      const el = root.querySelector(sel);
      if (!el) return null;
      return gsap.fromTo(
        el,
        { y: from },
        {
          y: to,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      );
    };

    // The aim composition (aim, wordline, crosshair, logo) moves together so it
    // stays centred; the logo is offset 20px up. Surrounding elements parallax
    // at their own rates.
    const tweens = [
      mk(".about-finale__aim", 20, -20),
      mk(".about-finale__bg-text", 20, -20),
      mk(".about-finale__cross--h", 20, -20),
      mk(".about-finale__logo", 0, -40), // = core − 20 (a bit to the top, synced)
      mk(".about-finale__eyebrow", -30, 30),
      mk(".about-finale__info", 44, -44),
      mk(".about-finale__nav--left", -34, 34),
      mk(".about-finale__nav--right", 46, -46),
    ];
    // The sticky section above shifts positions; re-measure once it settles.
    ScrollTrigger.refresh();

    return () => {
      tweens.forEach((t) => {
        t?.scrollTrigger?.kill();
        t?.kill();
      });
    };
  }, []);

  return (
    <section ref={rootRef} className="about-finale" aria-label="PV Link Energy">
      {/* Vertical line runs the full height; horizontal line is bounded by the
          container (inside the stage). */}
      <span className="about-finale__cross about-finale__cross--v" aria-hidden="true" />

      <Container width="wide">
        <div className="about-finale__stage">
          <span className="about-finale__cross about-finale__cross--h" aria-hidden="true" />
          <p className="about-finale__eyebrow">[ Global Energy &amp; Commodities ]</p>

          {/* Aim circles (centred on the bullseye) */}
          <svg
            className="about-finale__aim"
            viewBox="0 0 100 100"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="50" cy="50" r="48" stroke="currentColor" vectorEffect="non-scaling-stroke" />
            <circle cx="50" cy="50" r="31" stroke="currentColor" vectorEffect="non-scaling-stroke" />
            <circle cx="50" cy="50" r="15" stroke="currentColor" vectorEffect="non-scaling-stroke" />
          </svg>

          {/* Background wordline (centred on the aim) */}
          <h2
            className="about-finale__bg-text"
            aria-label="Empowering global energy flows"
          >
            {BG_LINES.map((line, i) => (
              <RevealText key={line} split="none" delay={i * 0.06}>
                <span className="about-finale__bg-line">{line}</span>
              </RevealText>
            ))}
          </h2>

          {/* 3D brand mark on top, in the bullseye */}
          <Logo3D className="about-finale__logo" />

          {/* Glass floating nav buttons, flanking the aim */}
          {NAV.map((n) => (
            <Link
              key={n.pos}
              href={n.href}
              className={`about-finale__nav about-finale__nav--${n.pos}`}
            >
              <span>{n.label}</span>
              <svg
                className="about-finale__nav-arrow"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="square"
                aria-hidden="true"
              >
                <line x1="3" y1="12" x2="18" y2="12" />
                <polyline points="12,6 18,12 12,18" />
              </svg>
            </Link>
          ))}

          {/* Info + CTA (below the outer circle) */}
          <div className="about-finale__info">
            <h3 className="about-finale__info-h3">One link in the global energy chain</h3>
            <p className="about-finale__info-p">
              We connect supply and demand across 20+ countries — one accountable
              partner from origin to destination.
            </p>
            <Button href="/contact" variant="primary" className="about-finale__cta">
              Contact Us
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
