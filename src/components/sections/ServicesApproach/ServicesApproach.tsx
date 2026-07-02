import Section from "@/components/ui/Section";
import RevealSection from "@/animations/RevealSection";
import "./servicesApproach.css";

// Service-delivery principles — distinct from the home / About "how we work"
// themes to avoid duplicate copy.
const POINTS = [
  {
    n: "01",
    title: "Compliance you can count on",
    copy: "Every cargo moves to international standards — sanctions screening, AML/KYC, IMO marine rules and ISO-certified facilities — with independent inspection and clean documentation at every step.",
  },
  {
    n: "02",
    title: "Flexible by design",
    copy: "Spot, term or just-in-time; DDP or DAP; prepayment through to structured finance — we shape contracts, delivery and funding around your commercial goals and capital cycles.",
  },
  {
    n: "03",
    title: "Transparent execution",
    copy: "From negotiation to settlement you get dependable execution and real-time visibility — chain-of-custody tracking, proactive updates, and one point of contact accountable for the outcome.",
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
        <h2 className="svc-approach__title">How we deliver</h2>
        <p className="svc-approach__lead">
          Six services, one operating standard — coordinated execution, strict
          compliance, and commercial structures shaped around how your business
          actually runs.
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
