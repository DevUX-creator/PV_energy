"use client";

import { useState } from "react";
import Section from "@/components/ui/Section";
import RevealText from "@/animations/RevealText";
import { PRODUCT_DEPARTMENTS } from "../Products/config";
import ProductTabs from "./ProductTabs";
import ProductPanel from "./ProductPanel";
import type { ShowcaseProduct } from "./types";
import "./productShowcase.css";

// Flatten both departments into a single tab list, keeping the department
// name for the panel eyebrow.
const PRODUCTS: ShowcaseProduct[] = PRODUCT_DEPARTMENTS.flatMap((dept) =>
  dept.products.map((p) => ({ ...p, department: dept.name }))
);

/**
 * ProductShowcase — tabs + per-product panel (ZettaJoule-style), built from
 * our own components. Thin orchestrator: holds the active tab and composes
 * <ProductTabs> + <ProductPanel>.
 */
export default function ProductShowcase() {
  const [active, setActive] = useState(0);
  const product = PRODUCTS[active];

  return (
    <Section id="products" width="wide" className="prod" ariaLabel="Products">
      <div className="prod__head">
        <RevealText>
          <h2 className="prod__title">The products that keep industry moving</h2>
        </RevealText>
      </div>

      <ProductTabs products={PRODUCTS} active={active} onSelect={setActive} />
      {/* key re-mounts the panel on tab change so the content transition replays. */}
      <ProductPanel key={product.id} product={product} />
    </Section>
  );
}
