import Container from "@/components/ui/Container";
import RevealText from "@/animations/RevealText";
import "./servicesHero.css";

/**
 * ServicesHero — intro band for the /services page (matches the About hero
 * treatment: dark-grey band, eyebrow pill, big uppercase headline, lead).
 * The individual services are explained in the sections below it.
 */
export default function ServicesHero() {
  return (
    <section className="services-hero" aria-label="Services">
      <Container width="wide" className="services-hero__inner">
        <RevealText eager split="none" delay={0.05}>
          <span className="section-tag services-hero__tag">Services</span>
        </RevealText>

        <RevealText eager delay={0.12}>
          <h1 className="services-hero__title">
            Across the energy &amp; commodities supply chain
          </h1>
        </RevealText>

        <RevealText eager split="none" delay={0.3}>
          <p className="services-hero__lead">
            From sourcing to final delivery, our six integrated services move
            energy and agricultural commodities with precision, accountability,
            and a single point of contact — not a chain of hand-offs.
          </p>
        </RevealText>
      </Container>
    </section>
  );
}
