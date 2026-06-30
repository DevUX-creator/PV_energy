import Section from "@/components/ui/Section";
import RevealSection from "@/animations/RevealSection";
import { INDUSTRIES } from "./config";
import "./industries.css";

/**
 * Industries — STUB. The 21 sectors served, as a tag cloud / chip strip.
 * Could become a marquee during polish (see ARCHITECTURE.md patterns).
 */
export default function Industries() {
  return (
    <Section id="industries" inverse ariaLabel="Industries served">
      <RevealSection>
        <p className="eyebrow">Industries Served</p>
        <h2 className="industries__title">Powering the sectors that move the world</h2>
      </RevealSection>

      <ul className="industries__list">
        {INDUSTRIES.map((industry) => (
          <li key={industry} className="industries__chip">{industry}</li>
        ))}
      </ul>
    </Section>
  );
}
