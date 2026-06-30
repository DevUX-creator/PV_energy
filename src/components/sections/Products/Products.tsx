import Section from "@/components/ui/Section";
import RevealSection from "@/animations/RevealSection";
import Accordion, { type AccordionItemData } from "@/components/ui/Accordion";
import { PRODUCT_DEPARTMENTS } from "./config";
import "./products.css";

/**
 * Products — wires the foundational Accordion to the reconciled
 * two-department product data (Petroleum + Fertilizer). This is the
 * BB-Energy-style traded-products pattern the client asked for; the
 * visual styling is a baseline to be elevated during section polish.
 */
export default function Products() {
  return (
    <Section id="products" ariaLabel="Products">
      <RevealSection>
        <p className="eyebrow">Products</p>
        <h2 className="products__title">
          Explore the energy products that define our legacy
        </h2>
        <p className="products__lead">
          A diversified portfolio across two departments — refined petroleum
          products and crop-nutrition fertilizers — backed by logistics, finance,
          and risk-management expertise.
        </p>
      </RevealSection>

      <div className="products__departments">
        {PRODUCT_DEPARTMENTS.map((dept) => {
          const items: AccordionItemData[] = dept.products.map((p) => ({
            id: p.id,
            title: p.name,
            meta: p.origin,
            content: (
              <div className="products__detail">
                <p className="products__tagline">{p.tagline}</p>
                <p>{p.description}</p>
              </div>
            ),
          }));

          return (
            <div key={dept.id} className="products__department">
              <div className="products__department-head">
                <h3 className="products__department-name">{dept.name}</h3>
                <p className="products__department-intro">{dept.intro}</p>
              </div>
              <Accordion items={items} />
            </div>
          );
        })}
      </div>
    </Section>
  );
}
