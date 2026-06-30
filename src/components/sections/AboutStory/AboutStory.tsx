"use client";

import { useEffect, useRef } from "react";
import Container from "@/components/ui/Container";
import RevealText from "@/animations/RevealText";
import Button from "@/components/ui/Button";
import { gsap, registerGsapPlugins } from "@/lib/gsap";
import "./aboutStory.css";

/**
 * AboutStory — the two editorial blocks below the hero (Mallard & Claret
 * "half-text" + "about-agency" layouts), rebuilt with our Container, fonts and
 * tokens. A "mission" row (label left, big statement right) then a "company"
 * row (kicker + line + image left, two paragraphs + CTA right). The company
 * image has a gentle scroll parallax. Copy from docs/content/about.md.
 */
export default function AboutStory() {
  const figureRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const figure = figureRef.current;
    if (!figure) return;
    const img = figure.querySelector("img");
    if (!img) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    registerGsapPlugins();
    const tween = gsap.fromTo(
      img,
      { yPercent: -7 },
      {
        yPercent: 7,
        ease: "none",
        scrollTrigger: {
          trigger: figure,
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
    <>
      <section className="about-mission" aria-label="Our mission">
        <Container width="wide">
          <div className="about-mission__grid">
            <RevealText split="none">
              <h2 className="section-tag about-mission__label">Our mission</h2>
            </RevealText>
            <RevealText split="none" delay={0.05}>
              <p className="about-mission__statement">
                We connect supply and demand across continents — turning complex,
                fragmented commodity markets into reliable, well-priced flows for
                the producers, refiners and industrial buyers who depend on them.
              </p>
            </RevealText>
          </div>
        </Container>
      </section>

      <section className="about-company" aria-label="Our company">
        <Container width="wide">
          <div className="about-company__grid">
            <div className="about-company__asset">
              <RevealText split="none">
                <p className="about-company__kicker">Our company</p>
              </RevealText>
              <RevealText split="none" delay={0.05}>
                <p className="about-company__line">
                  Where deep market expertise meets on-the-ground execution.
                </p>
              </RevealText>
              <figure ref={figureRef} className="about-company__img">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/About/about-company.webp"
                  alt="PV Link Energy operations"
                  loading="lazy"
                />
              </figure>
            </div>

            <div className="about-company__info">
              <RevealText split="none">
                <p>
                  We manage every step of the commodity value chain — sourcing,
                  trading, storage, blending, shipping, financing and final
                  delivery — and integrate them into single, accountable
                  solutions that remove complexity from origin to destination.
                </p>
              </RevealText>
              <RevealText split="none" delay={0.06}>
                <p>
                  Across 20+ countries and five strategic hubs, we pair deep
                  market knowledge with real-time analytics and disciplined risk
                  management. We&apos;re a lean, relationship-led operator —
                  fast, transparent, and genuinely accountable for every cargo we
                  move.
                </p>
              </RevealText>
              <RevealText split="none" delay={0.12}>
                <div className="about-company__cta">
                  <Button href="/contact">Contact Us</Button>
                </div>
              </RevealText>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
