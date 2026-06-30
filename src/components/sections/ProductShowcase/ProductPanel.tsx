"use client";

import Accordion, { type AccordionItemData } from "@/components/ui/Accordion";
import Button from "@/components/ui/Button";
import type { ShowcaseProduct } from "./types";

type ProductPanelProps = {
  product: ShowcaseProduct;
};

/**
 * ProductPanel — the per-product layout: info (department · title · desc)
 * on the left, the product image centred, and an accordion of
 * applications/grades on the right. Re-mounted on tab change (keyed by the
 * parent) so the content transition replays.
 */
export default function ProductPanel({ product: p }: ProductPanelProps) {
  const points: AccordionItemData[] = (p.points ?? []).map((pt) => ({
    id: pt.id,
    title: pt.title,
    content: <p className="prod__point">{pt.body}</p>,
  }));

  return (
    <div className="prod__panel">
      <div className="prod__info">
        <div className="prod__info-top">
          <p className="prod__dept">{`[ ${p.department} ]`}</p>
          <h3 className="prod__name">{p.tagline}</h3>
        </div>
        <p className="prod__desc">{p.description}</p>
      </div>

      <div className="prod__media">
        {p.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="prod__img" src={p.image} alt={p.name} />
        ) : (
          <div className="prod__img prod__img--placeholder" aria-hidden="true" />
        )}
      </div>

      <div className="prod__aside">
        {points.length ? (
          <Accordion
            items={points}
            defaultOpen={[points[0].id]}
            className="prod__accordion"
          />
        ) : null}
        <div className="prod__cta">
          <Button href="/contact">Request a Quote</Button>
        </div>
      </div>
    </div>
  );
}
