"use client";

import { useEffect, useRef, useState } from "react";
import Container from "@/components/ui/Container";
import RevealText from "@/animations/RevealText";
import GridDeformImage from "@/components/ui/GridDeformImage";
import { gsap, registerGsapPlugins } from "@/lib/gsap";
import "./aboutHero.css";

// Live clocks for our three offices (mirrors the reference's city times).
const OFFICE_CLOCKS = [
  { city: "Dubai", tz: "Asia/Dubai" },
  { city: "Athens", tz: "Europe/Athens" },
  { city: "Hong Kong", tz: "Asia/Hong_Kong" },
] as const;

function Clock({ city, tz }: { city: string; tz: string }) {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: tz,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 10_000); // minute precision
    return () => window.clearInterval(id);
  }, [tz]);

  return (
    <div className="about-hero__clock">
      <span className="about-hero__clock-city">{city}</span>
      <time className="about-hero__clock-time" suppressHydrationWarning>
        {time || "––:––"}
      </time>
    </div>
  );
}

/**
 * AboutHero — intro banner (Mallard & Claret style) on a dark-grey band: an
 * upper band for breathing room, then a bottom-anchored row with a big "About
 * Us" headline on the left and the tagline + live office clocks ~40px to its
 * right. All copy animates in with the site's RevealText (eager, on load).
 */
export default function AboutHero() {
  const mediaRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  // Scroll parallax — the image drifts up ~200px as the band passes through.
  useEffect(() => {
    const media = mediaRef.current;
    const px = parallaxRef.current;
    if (!media || !px) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    registerGsapPlugins();
    const tween = gsap.fromTo(
      px,
      { y: 100 },
      {
        y: -100,
        ease: "none",
        scrollTrigger: {
          trigger: media,
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

  // Reveal the image when it scrolls into view (or immediately on reduced motion).
  useEffect(() => {
    const el = mediaRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="about-hero" aria-label="About PV Link Energy">
      <Container width="wide" className="about-hero__inner">
        <div className="about-hero__upper">
          <RevealText eager split="none" delay={0.1}>
            <span className="section-tag about-hero__tag">About PV Link Energy</span>
          </RevealText>
        </div>

        <div className="about-hero__lower">
          <div className="about-hero__logo">
            <RevealText eager delay={0.2}>
              <h1 className="about-hero__title">About Us</h1>
            </RevealText>
          </div>

          <div className="about-hero__info">
            <RevealText eager split="none" delay={0.5}>
              <p className="about-hero__tagline">
                Energy &amp; agricultural commodities,{" "}
                <br className="about-hero__tagline-br" />
                moved with precision and purpose.
              </p>
            </RevealText>
            <RevealText eager split="none" delay={0.7}>
              <div className="about-hero__clocks">
                {OFFICE_CLOCKS.map((o) => (
                  <Clock key={o.city} city={o.city} tz={o.tz} />
                ))}
              </div>
            </RevealText>
          </div>
        </div>
      </Container>

      <div
        ref={mediaRef}
        className={`about-hero__media ${shown ? "is-shown" : ""}`.trim()}
      >
        <div ref={parallaxRef} className="about-hero__parallax">
          <GridDeformImage
            src="/About/about-hero.webp"
            alt="A bulk carrier anchored on the open sea at dusk"
            priority
          />
        </div>

        <div className="about-hero__caption">
          <span className="about-hero__caption-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 1 L14.2 9.8 L23 12 L14.2 14.2 L12 23 L9.8 14.2 L1 12 L9.8 9.8 Z" />
            </svg>
          </span>
          <RevealText split="none">
            <p className="about-hero__caption-text">
              From origin to destination, we keep the world&apos;s energy moving.
            </p>
          </RevealText>
        </div>
      </div>
    </section>
  );
}
