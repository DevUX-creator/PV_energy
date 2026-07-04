import CtaSection from "@/components/sections/CtaSection";

const SERVICES = [
  "Trading",
  "Supply & Distribution",
  "Storage & Blending",
  "Shipping & Chartering",
  "Hedging & Risk Management",
  "Financial Solutions",
];

/**
 * ServicesCta — closing call-to-action for the services page. Thin wrapper
 * around the shared CtaSection.
 */
export default function ServicesCta() {
  return (
    <CtaSection
      id="services-cta"
      ariaLabel="Work with us"
      tag="Let's work together"
      title="Ready to move your commodities?"
      text="Whether you're sourcing product or building a long-term supply partnership, our team is ready to help — with the reliability, transparency and global reach your operations depend on."
      action={{ label: "Contact Us", href: "/contact" }}
      chips={SERVICES}
    />
  );
}
