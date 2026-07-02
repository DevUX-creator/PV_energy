import Section from "@/components/ui/Section";
import RevealSection from "@/animations/RevealSection";
import "./servicesApproach.css";

// Differentiators (from docs/content — the About page's "how we work" themes).
const POINTS = [
  {
    n: "01",
    title: "End-to-end integration",
    copy: "One partner from sourcing to delivery — we fold trading, logistics, storage, financing and risk into a single accountable solution, so you deal with one team, not a chain of hand-offs.",
  },
  {
    n: "02",
    title: "Data-backed decisions",
    copy: "We pair deep market expertise with real-time analytics, price forecasting and risk assessment to optimise every trade — and keep you informed with proactive updates and shipment tracking.",
  },
  {
    n: "03",
    title: "Global reach, local execution",
    copy: "Active across five strategic hubs — the Middle East, Asia-Pacific, Europe (ARA), West Africa and the Americas — we combine worldwide market access with local expertise, compliance and on-the-ground relationships.",
  },
];

/**
 * ServicesApproach — how we work: alternating image/text rows. Images are
 * temporary grey-box placeholders.
 */
export default function ServicesApproach() {
  return (
    <Section
      id="services-approach"
      width="wide"
      className="svc-approach"
      ariaLabel="How we work"
    >
      <RevealSection>
        <span className="section-tag">How we work</span>
        <h2 className="svc-approach__title">Built around your operations</h2>
        <p className="svc-approach__lead">
          A lean, relationship-led operator — fast, transparent, and genuinely
          accountable for every cargo we move.
        </p>
      </RevealSection>

      <div className="svc-approach__rows">
        {POINTS.map((p) => (
          <div className="svc-approach__row" key={p.n}>
            {/* TODO: replace with real imagery */}
            <div className="svc-approach__media" aria-hidden="true" />
            <div className="svc-approach__text">
              <span className="svc-approach__num">{p.n}</span>
              <h3 className="svc-approach__name">{p.title}</h3>
              <p className="svc-approach__copy">{p.copy}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
