import Section from "@/components/ui/Section";
import RevealText from "@/animations/RevealText";
import Button from "@/components/ui/Button";
import ScrollLine from "@/components/ui/ScrollLine";
import WhatWeDo from "@/components/sections/WhatWeDo";
import "./about.css";

/**
 * What We Do — aircenter-style intro: tag on the left + a large uppercase
 * heading on the same line, then a centred uppercase line below. Content
 * from the live site. Also the scroll trigger that overlaps the hero.
 */
export default function About() {
  return (
    <Section
      id="after-hero"
      surface
      width="wide"
      className="about-overlap"
      ariaLabel="What we do"
    >
      <div className="about__head">
        <RevealText split="none">
          <span className="section-tag">What We Do</span>
        </RevealText>
        <div className="about__head-main">
          <RevealText delay={0.06}>
            <h2 className="about__title">
              Across the Energy &amp; Commodities Supply Chain
            </h2>
          </RevealText>
          <RevealText split="none" delay={0.12}>
            <p className="about__lead">
              We handle every step — sourcing, moving, storing and delivering
              energy and commodities — keeping your operations efficient, safe,
              and on schedule.
            </p>
          </RevealText>
          <RevealText split="none" delay={0.18}>
            <div className="about__cta">
              <Button href="/contact">Contact Us</Button>
            </div>
          </RevealText>
          <ScrollLine className="about__sep" />
        </div>
      </div>

      <RevealText split="none">
        <div className="about__showcase">
          <WhatWeDo />
        </div>
      </RevealText>
    </Section>
  );
}
