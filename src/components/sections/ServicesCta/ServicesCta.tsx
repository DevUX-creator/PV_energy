import Section from "@/components/ui/Section";
import RevealText from "@/animations/RevealText";
import Button from "@/components/ui/Button";
import "./servicesCta.css";

/**
 * ServicesCta — closing call-to-action on the dark inverse surface.
 */
export default function ServicesCta() {
  return (
    <Section
      id="services-cta"
      inverse
      width="wide"
      className="svc-cta"
      ariaLabel="Work with us"
    >
      <RevealText split="none">
        <span className="section-tag svc-cta__tag">Let&apos;s work together</span>
      </RevealText>
      <RevealText delay={0.06}>
        <h2 className="svc-cta__title">Ready to move your commodities?</h2>
      </RevealText>
      <RevealText split="none" delay={0.12}>
        <p className="svc-cta__text">
          Whether you&apos;re sourcing product or building a long-term supply
          partnership, our team is ready to help — with the reliability,
          transparency and global reach your operations depend on.
        </p>
      </RevealText>
      <RevealText split="none" delay={0.18}>
        <div className="svc-cta__actions">
          <Button href="/contact" variant="primary">
            Contact Us
          </Button>
        </div>
      </RevealText>
    </Section>
  );
}
