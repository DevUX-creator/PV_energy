import Section from "@/components/ui/Section";
import RevealSection from "@/animations/RevealSection";
import "./servicesOverview.css";

// The six core services with concise descriptions (from docs/content/services).
const SERVICES = [
  {
    id: "trading",
    name: "Trading",
    copy: "We buy, sell and move energy and agricultural commodities across global markets — turning supply and demand into reliable, well-priced flows.",
  },
  {
    id: "supply-distribution",
    name: "Supply & Distribution",
    copy: "From source to destination, we keep product moving — coordinating volumes, terminals and transport so deliveries arrive on-spec and on time.",
  },
  {
    id: "storage-blending",
    name: "Storage & Blending",
    copy: "Strategic storage and precision blending let us hold, condition and tailor products to the exact grades our partners need.",
  },
  {
    id: "shipping-chartering",
    name: "Shipping & Chartering",
    copy: "We charter and manage vessels across key routes, handling logistics end-to-end so cargo moves safely and efficiently by sea.",
  },
  {
    id: "hedging-risk",
    name: "Hedging & Risk Management",
    copy: "We manage price and market exposure with disciplined hedging, protecting every trade against volatility.",
  },
  {
    id: "financial-solutions",
    name: "Financial Solutions",
    copy: "Trade finance and structured solutions that keep deals liquid, bankable and moving — backed by strong financial expertise.",
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
