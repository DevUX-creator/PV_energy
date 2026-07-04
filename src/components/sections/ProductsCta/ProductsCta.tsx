import Section from "@/components/ui/Section";
import RevealText from "@/animations/RevealText";
import Button from "@/components/ui/Button";
import ProductsTags from "./ProductsTags";
import "./productsCta.css";

/**
 * ProductsCta — closing call-to-action for the products page, on the dark
 * inverse surface, with the product chips falling behind (same pattern as
 * ServicesCta).
 */
export default function ProductsCta() {
  return (
    <Section
      id="products-cta"
      inverse
      width="wide"
      className="prod-cta"
      ariaLabel="Enquire about our products"
    >
      <div className="prod-cta__inner">
        <RevealText split="none">
          <span className="section-tag prod-cta__tag">Let&apos;s work together</span>
        </RevealText>
        <RevealText delay={0.06}>
          <h2 className="prod-cta__title">Need these products on-spec?</h2>
        </RevealText>
        <RevealText split="none" delay={0.12}>
          <p className="prod-cta__text">
            From a single cargo to a long-term supply program, our desk sources
            and delivers refined petroleum products and fertilizers on-spec —
            with the reliability, transparency and global reach your operations
            depend on.
          </p>
        </RevealText>
        <RevealText split="none" delay={0.18}>
          <div className="prod-cta__actions">
            <Button href="/contact" variant="primary">
              Enquire now
            </Button>
          </div>
        </RevealText>
      </div>

      <ProductsTags />
    </Section>
  );
}
