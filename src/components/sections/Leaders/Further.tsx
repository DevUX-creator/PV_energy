"use client";

import { useEffect, useRef } from "react";
import Container from "@/components/ui/Container";
import TextButton from "@/components/ui/TextButton";
import Button from "@/components/ui/Button";
import { gsap, ScrollTrigger, registerGsapPlugins } from "@/lib/gsap";
import "./further.css";

// Our texts dropped into the exact slots of the CodeGrid sticky-cards demo.
const CARDS = [
  {
    title: "End-to-end integration",
    copy: "From sourcing and trading to storage, shipping, and final delivery, we manage every step of the commodity supply chain — integrating trading, logistics, financing, and risk management into solutions that remove complexity from origin to destination.",
    image: "/Trusted/choose-1.webp",
  },
  {
    title: "Data-backed decisions",
    copy: "We pair deep market expertise with real-time analytics, price forecasting, and risk assessment to optimize every trade — and keep you informed with proactive updates, shipment tracking, and dedicated account management.",
    image: "/Trusted/choose-2.webp",
  },
  {
    title: "Global reach, local execution",
    copy: "Active across five strategic hubs — the Middle East, Asia-Pacific, Europe (ARA), West Africa, and the Americas — we combine worldwide market access with local expertise, compliance, and on-the-ground relationships.",
    image: "/Trusted/choose-3.webp",
  },
];

/**
 * Further — CodeGrid sticky-cards, copied 1:1 (per-card pin with a shared
 * .outro end trigger + inner y-drift). Only the texts, skin, container and
 * Contact Us button are ours. The demo's pinned intro heading is dropped.
 */
export default function Further() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    registerGsapPlugins();

    const mm = gsap.matchMedia();
    mm.add("(min-width: 769px) and (prefers-reduced-motion: no-preference)", () => {
      const cards = gsap.utils.toArray<HTMLElement>(".further__card", root);

      // Every card (incl. the last) pins at the same line and its inner
      // drifts up, stepping down a constant 14vh per card — so every card
      // "flies" the same way and they stack into an even, fully-covering
      // pile. The shared end trigger (outro "top 65%") releases them while
      // the outro is still low, so the line below never crowds the cards.
      // (invalidateOnRefresh keeps the windows correct under the big pinned
      // Leaders block above.)
      cards.forEach((card, index) => {
        const cardInner = card.querySelector<HTMLElement>(".further__card-inner");

        ScrollTrigger.create({
          trigger: card,
          start: "top 35%",
          endTrigger: ".further__outro",
          end: "top 65%",
          pin: true,
          pinSpacing: false,
          invalidateOnRefresh: true,
        });

        gsap.to(cardInner, {
          y: `-${(cards.length - index) * 14}vh`,
          ease: "none",
          scrollTrigger: {
            trigger: card,
            start: "top 35%",
            endTrigger: ".further__outro",
            end: "top 65%",
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
      });

      // The pinned Leaders block above mounts its own (large) pin AFTER this
      // section's triggers are created, which shifts every position below it.
      // Re-measure once layout settles so our start/end windows aren't stale
      // (a degenerate window leaves the cards frozen, never pinning).
      ScrollTrigger.refresh();
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={rootRef} className="further">
      <section className="further__cards">
        <Container width="wide">
          {CARDS.map((card, index) => (
            <div className="further__card" id={`further-card-${index + 1}`} key={card.title}>
              <div className="further__card-inner">
                <div className="further__card-content">
                  <h3 className="further__card-title">{card.title}</h3>
                  <p className="further__card-copy">{card.copy}</p>
                  <TextButton href="/contact" label="Contact Us" />
                </div>
                <figure className="further__card-img">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={card.image} alt={card.title} loading="lazy" />
                </figure>
              </div>
            </div>
          ))}
        </Container>
      </section>

      <section className="further__outro">
        <Container width="wide">
          <h2 className="further__outro-title">Let&apos;s move energy together.</h2>
          <div className="further__outro-cta">
            <Button href="/contact" variant="primary" className="further__contact-btn">
              Contact Us
            </Button>
          </div>
        </Container>
      </section>
    </section>
  );
}
