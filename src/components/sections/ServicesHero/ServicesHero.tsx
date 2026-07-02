import Container from "@/components/ui/Container";
import Globe from "@/components/ui/Globe";
import HeroCursor from "./HeroCursor";
import "./servicesHero.css";

/**
 * ServicesHero — the interactive dotted frosted-glass globe as the centrepiece,
 * with the section title top-left and a supporting line bottom-right.
 */
export default function ServicesHero() {
  return (
    <section className="services-hero" aria-label="Services">
      <h1 className="services-hero__title">
        Services
        <br />
        <span className="services-hero__title-grey">borderless</span>
      </h1>

      <Container width="wide" className="services-hero__inner">
        <div className="services-hero__globe">
          <Globe />
        </div>
      </Container>

      <p className="services-hero__sub">
        From sourcing to final delivery, we provide best-in-class energy &amp;
        commodities services across every major market — worldwide.
      </p>

      <HeroCursor />
    </section>
  );
}
