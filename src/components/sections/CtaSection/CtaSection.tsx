import Section from "@/components/ui/Section";
import RevealText from "@/animations/RevealText";
import Button from "@/components/ui/Button";
import FallingChips from "@/components/ui/FallingChips";
import "./ctaSection.css";

type CtaSectionProps = {
  id: string;
  ariaLabel: string;
  tag: string;
  title: string;
  text: string;
  action: { label: string; href: string };
  /** Labels for the falling physics chips behind the content. */
  chips: string[];
  /** Delay between each chip dropping, in ms. */
  chipStagger?: number;
};

/**
 * CtaSection — closing call-to-action on the dark inverse surface, with a
 * step-by-step reveal and the product/service chips falling behind. Shared by
 * the Services and Products pages.
 */
export default function CtaSection({
  id,
  ariaLabel,
  tag,
  title,
  text,
  action,
  chips,
  chipStagger,
}: CtaSectionProps) {
  return (
    <Section id={id} inverse width="wide" className="cta-section" ariaLabel={ariaLabel}>
      <div className="cta-section__inner">
        <RevealText split="none">
          <span className="section-tag cta-section__tag">{tag}</span>
        </RevealText>
        <RevealText delay={0.06}>
          <h2 className="cta-section__title">{title}</h2>
        </RevealText>
        <RevealText split="none" delay={0.12}>
          <p className="cta-section__text">{text}</p>
        </RevealText>
        <RevealText split="none" delay={0.18}>
          <div className="cta-section__actions">
            <Button href={action.href} variant="primary">
              {action.label}
            </Button>
          </div>
        </RevealText>
      </div>

      <FallingChips items={chips} stagger={chipStagger} />
    </Section>
  );
}
