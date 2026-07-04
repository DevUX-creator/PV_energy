import CtaSection from "@/components/sections/CtaSection";
import { ALL_PRODUCTS } from "@/lib/products";

// Short product labels (fall back to the full name) — kept in sync with config.
const PRODUCTS = ALL_PRODUCTS.map((p) => p.tab ?? p.name);

/**
 * ProductsCta — closing call-to-action for the products page. Thin wrapper
 * around the shared CtaSection, with every product as a falling chip.
 */
export default function ProductsCta() {
  return (
    <CtaSection
      id="products-cta"
      ariaLabel="Enquire about our products"
      tag="Let's work together"
      title="Need these products on-spec?"
      text="From a single cargo to a long-term supply program, our desk sources and delivers refined petroleum products and fertilizers on-spec — with the reliability, transparency and global reach your operations depend on."
      action={{ label: "Enquire now", href: "/contact" }}
      chips={PRODUCTS}
      chipStagger={450}
    />
  );
}
