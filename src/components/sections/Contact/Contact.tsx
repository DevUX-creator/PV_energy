import Section from "@/components/ui/Section";
import RevealSection from "@/animations/RevealSection";
import Button from "@/components/ui/Button";
import "./contact.css";

/**
 * Contact — STUB. Closing CTA. The real contact form (fields + backend)
 * is deferred per the plan; this is the structural call-to-action shell.
 */
export default function Contact() {
  return (
    <Section id="contact" inverse ariaLabel="Contact">
      <RevealSection>
        <p className="eyebrow">Get In Touch</p>
        <h2 className="contact__title">Get in touch with the energy experts</h2>
        <p className="contact__lead">
          Stay connected with PV Link Energy. Tell us what you need moved, and our
          team will respond with a tailored proposal.
        </p>
        <div className="contact__actions">
          <Button href="mailto:info@pvlinkenergy.com">Email info@pvlinkenergy.com</Button>
          <Button href="tel:+97145775989" variant="outline" showArrow={false}>
            +971 4 577 5989
          </Button>
        </div>
      </RevealSection>
    </Section>
  );
}
