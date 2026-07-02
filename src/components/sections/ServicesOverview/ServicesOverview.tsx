import Section from "@/components/ui/Section";
import RevealSection from "@/animations/RevealSection";
import "./servicesOverview.css";

// The six core services with concise descriptions (from docs/content/services).
const SERVICES = [
  {
    id: "trading",
    name: "Trading",
    copy: "Physical trading of crude, LPG, refined fuels and agricultural products across global markets — reliable execution and total transparency from negotiation to settlement.",
  },
  {
    id: "supply-distribution",
    name: "Supply & Distribution",
    copy: "From source to site — sourcing from trusted suppliers and delivering by road, rail, sea and pipeline, with optimized routes and full chain-of-custody transparency.",
  },
  {
    id: "storage-blending",
    name: "Storage & Blending",
    copy: "Bulk storage with top-tier terminal partners, plus custom blending and additive management to tailor specifications, secure availability and meet every regulatory standard.",
  },
  {
    id: "shipping-chartering",
    name: "Shipping & Chartering",
    copy: "Chartering tankers and dry-bulk vessels in sync with our trading desk — competitive freight, route flexibility and IMO-compliant, end-to-end marine execution.",
  },
  {
    id: "hedging-risk",
    name: "Hedging & Risk Management",
    copy: "Structured hedging — futures, options, swaps and structured products — with a comprehensive approach to price, credit, operational and regulatory risk.",
  },
  {
    id: "financial-solutions",
    name: "Financial Solutions",
    copy: "Tailored trade finance and structured, commodity-backed funding — from working capital to project finance — that keeps deals liquid, bankable and ready to scale.",
  },
];

/**
 * ServicesOverview — the six core services. Sits above the sticky hero and
 * scrolls up to overlap it (same stacking move as the home sections).
 */
export default function ServicesOverview() {
  return (
    <Section
      id="services-overview"
      surface
      width="wide"
      className="svc-overview"
      ariaLabel="What we do"
    >
      <RevealSection>
        <span className="section-tag">Our services</span>
        <h2 className="svc-overview__title">
          Everything the value chain needs
        </h2>
        <p className="svc-overview__lead">
          Six integrated services that carry energy and agricultural commodities
          from origin to destination — under one accountable team.
        </p>
      </RevealSection>

      <ul className="svc-overview__list">
        {SERVICES.map((s, i) => (
          <li key={s.id} className="svc-overview__item">
            <span className="svc-overview__num">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="svc-overview__name">{s.name}</h3>
            <p className="svc-overview__copy">{s.copy}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
