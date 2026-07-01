"use client";

import { useEffect, useState } from "react";
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

  // The section is sticky (the dark Leaders block scrolls up and overlaps it).
  // Pin from the TABS rather than the title: a negative sticky `top` equal to
  // the title-block height lets the title scroll away, then the tabs settle at
  // the viewport top. The height is dynamic (responsive + wrapping), so measure
  // the offset from the section top down to the tabs and feed it to the CSS.
  useEffect(() => {
    const section = document.getElementById("products");
    const tabs = section?.querySelector<HTMLElement>(".prod__tabs");
    if (!section || !tabs) return;

    const setOffset = () => {
      const offset =
        tabs.getBoundingClientRect().top - section.getBoundingClientRect().top;
      section.style.setProperty("--prod-pin-offset", `${Math.round(offset)}px`);
    };
    setOffset();

    window.addEventListener("resize", setOffset);
    // The title's height (hence the offset) can shift once webfonts load.
    document.fonts?.ready.then(setOffset).catch(() => {});
    return () => window.removeEventListener("resize", setOffset);
  }, []);

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
