import Container from "@/components/ui/Container";
import Globe from "@/components/ui/Globe";
import "./servicesHero.css";

/**
 * ServicesHero — WIP. Prototyping a dotted particle globe (à la the reference)
 * on a warm off-white band. The intro copy is temporarily hidden while the
 * globe is dialled in.
 */
export default function ServicesHero() {
  return (
    <section className="services-hero" aria-label="Services">
      <Container width="wide" className="services-hero__inner">
        {/* Intro copy temporarily hidden while prototyping the globe.
        <span className="section-tag services-hero__tag">Services</span>
        <h1 className="services-hero__title">
          Across the energy &amp; commodities supply chain
        </h1>
        <p className="services-hero__lead">…</p>
        */}
        <div className="services-hero__globe">
          <Globe />
        </div>
      </Container>
    </section>
  );
}
