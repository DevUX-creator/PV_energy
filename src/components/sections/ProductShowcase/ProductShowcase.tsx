"use client";

import { useEffect, useState } from "react";
import Section from "@/components/ui/Section";
import RevealText from "@/animations/RevealText";
import { PRODUCT_DEPARTMENTS } from "../Products/config";
import ProductTabs from "./ProductTabs";
import ProductPanel from "./ProductPanel";
import type { ShowcaseProduct } from "./types";
import { gsap, registerGsapPlugins } from "@/lib/gsap";
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
  // Pin from the TABS rather than the title: measure the offset from the
  // section top down to the tabs and feed it to the CSS as --prod-pin-offset.
  // The stylesheet subtracts a header clearance from it, so the title scrolls
  // away, leaving a gap below the fixed nav, then the tabs settle there (not
  // jammed under the header). Height is dynamic (responsive + wrapping).
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

  // Blur + fade the title out as it scrolls up toward the pin, so it dissolves
  // instead of sliding behind the header. Only while the section actually pins
  // (>960) and motion is allowed.
  useEffect(() => {
    const section = document.getElementById("products");
    const head = section?.querySelector<HTMLElement>(".prod__head");
    if (!section || !head) return;

    registerGsapPlugins();
    const mm = gsap.matchMedia();
    mm.add("(min-width: 961px) and (prefers-reduced-motion: no-preference)", () => {
      gsap.to(head, {
        autoAlpha: 0,
        filter: "blur(12px)",
        y: -24,
        ease: "none",
        scrollTrigger: {
          trigger: head,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    });
    return () => mm.revert();
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
