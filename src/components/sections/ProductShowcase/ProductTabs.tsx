"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGsapPlugins } from "@/lib/gsap";
import type { ShowcaseProduct } from "./types";

type ProductTabsProps = {
  products: ShowcaseProduct[];
  active: number;
  onSelect: (index: number) => void;
};

/**
 * ProductTabs — the full-width, stretched tab nav with a sliding underline
 * indicator. Owns only the indicator motion and keeping the active tab in
 * view; selection state lives in the parent.
 */
export default function ProductTabs({ products, active, onSelect }: ProductTabsProps) {
  const navRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const indicatorRef = useRef<HTMLSpanElement>(null);

  // Slide the underline under the active tab, and keep it within the
  // horizontally-scrolling nav.
  useEffect(() => {
    const ind = indicatorRef.current;
    const btn = tabRefs.current[active];
    const nav = navRef.current;
    if (!ind || !btn || !nav) return;

    registerGsapPlugins();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.to(ind, {
      x: btn.offsetLeft,
      width: btn.offsetWidth,
      duration: reduce ? 0 : 0.4,
      ease: "power3.out",
      overwrite: true,
    });

    const left = btn.offsetLeft;
    const right = left + btn.offsetWidth;
    if (left < nav.scrollLeft) {
      nav.scrollTo({ left: left - 16, behavior: "smooth" });
    } else if (right > nav.scrollLeft + nav.clientWidth) {
      nav.scrollTo({ left: right - nav.clientWidth + 16, behavior: "smooth" });
    }
  }, [active]);

  return (
    <div ref={navRef} className="prod__tabs" role="tablist" aria-label="Products">
      <span ref={indicatorRef} className="prod__tab-indicator" aria-hidden="true" />
      {products.map((prod, i) => (
        <button
          key={prod.id}
          ref={(el) => {
            tabRefs.current[i] = el;
          }}
          type="button"
          role="tab"
          aria-selected={i === active}
          className={`prod__tab ${i === active ? "is-active" : ""}`.trim()}
          onClick={() => onSelect(i)}
        >
          {prod.tab ?? prod.name}
        </button>
      ))}
    </div>
  );
}
