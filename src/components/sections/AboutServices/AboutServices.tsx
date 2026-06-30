"use client";

import { useEffect, useRef } from "react";
import Container from "@/components/ui/Container";
import RevealText from "@/animations/RevealText";
import { gsap, ScrollTrigger, registerGsapPlugins } from "@/lib/gsap";
import "./aboutServices.css";

// Differentiators (HOW we work) — deliberately NOT the 6 services shown on the
// home, so the About page reads fresh. Copy from docs/content/about.md.
// Images are real-photo placeholders until the real art lands.
const ITEMS = [
  {
    name: "End-to-end integration",
    copy: "One partner from sourcing to delivery — we fold trading, logistics, storage, financing and risk into a single accountable solution, so you deal with one team, not a chain of hand-offs.",
    img: "/Trusted/choose-2.webp",
  },
  {
    name: "Data-backed decisions",
    copy: "We pair deep market expertise with real-time analytics, price forecasting and risk assessment to optimise every trade — and keep you informed with proactive updates and shipment tracking.",
    img: "/About/about-data.webp",
  },
  {
    name: "Local execution, global reach",
    copy: "Active across five strategic hubs — the Middle East, Asia-Pacific, Europe (ARA), West Africa and the Americas — we combine worldwide market access with local expertise, compliance and on-the-ground relationships.",
    img: "/About/about-reach.webp",
  },
  {
    name: "Built on trust",
    copy: "We build long-term partnerships, not one-off trades — with ISO-compliant operations, rigorous quality assurance and a track record for timely, transparent delivery.",
    img: "/About/about-trust.webp",
  },
];

const COLLAPSED_H = 160;
const EXPANDED_H = 460;
const COLLAPSED_W = 26;
const EXPANDED_W = 100;

/**
 * AboutServices — CodeGrid "industrial scroll" pattern, rebuilt with our
 * Container, fonts and tokens: a dark list where each service row starts as a
 * thin strip with a small image, then expands (taller + image widens to full)
 * as it scrolls up. Reduced motion shows the expanded state statically.
 */
export default function AboutServices() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    registerGsapPlugins();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.classList.add("is-static");
      return;
    }

    const rows = gsap.utils.toArray<HTMLElement>(".about-svc", root);
    const triggers = rows.map((row) => {
      const img = row.querySelector<HTMLElement>(".about-svc__img-inner");
      return ScrollTrigger.create({
        trigger: row,
        start: "top bottom",
        end: "top 30%",
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;
          row.style.height = `${COLLAPSED_H + (EXPANDED_H - COLLAPSED_H) * p}px`;
          if (img) img.style.width = `${COLLAPSED_W + (EXPANDED_W - COLLAPSED_W) * p}%`;
        },
      });
    });

    return () => triggers.forEach((t) => t.kill());
  }, []);

  return (
    <section ref={rootRef} className="about-services" aria-label="How we work">
      <Container width="wide">
        <div className="about-services__header">
          <div className="about-services__header-left">
            <RevealText split="none">
              <span className="section-tag">How we work</span>
            </RevealText>
          </div>
          <div className="about-services__header-right">
            <RevealText split="none" delay={0.05}>
              <h2 className="about-services__title">
                What sets us
                <br />
                apart.
              </h2>
            </RevealText>
          </div>
        </div>

        <div className="about-services__list">
          {ITEMS.map((s) => (
            <article className="about-svc" key={s.name}>
              <div className="about-svc__info">
                <h3 className="about-svc__name">{s.name}</h3>
                <p className="about-svc__copy">{s.copy}</p>
              </div>
              <div className="about-svc__img">
                <div className="about-svc__img-inner">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.img} alt={s.name} loading="lazy" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
