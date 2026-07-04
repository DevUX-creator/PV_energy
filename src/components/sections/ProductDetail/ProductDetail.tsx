import Link from "next/link";
import type { ReactNode } from "react";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import Markdown from "@/components/ui/Markdown";
import { inline } from "@/components/ui/Markdown/inline";
import { parseProductDoc, type PSection } from "@/lib/productContent";
import { PRODUCT_HIGHLIGHTS } from "@/lib/productHighlights";
import { type ProductWithDept } from "@/lib/products";
import "./productDetail.css";

type Kind = "intro" | "applications" | "grades" | "logistics" | "buyers" | "other";

function kindOf(title: string): Kind {
  const t = title.toLowerCase();
  if (t.includes("what it") || t.includes("what they")) return "intro";
  if (t.includes("application")) return "applications";
  if (t.includes("grade") || t.includes("spec")) return "grades";
  if (t.includes("handling") || t.includes("logistics") || t.includes("storage"))
    return "logistics";
  if (t.includes("buyer") || t.includes("what to know")) return "buyers";
  return "other";
}

// Split "**Label** — text" into a label + remaining text.
function splitItem(item: string): { label?: string; text: string } {
  const dash = item.match(/^\*\*(.+?)\*\*\s*[—–-]\s*(.+)$/);
  if (dash) return { label: dash[1], text: dash[2] };
  const lead = item.match(/^\*\*(.+?)\*\*\s*(.*)$/);
  if (lead) return { label: lead[1], text: lead[2] };
  return { text: item };
}

function paragraphs(sec: PSection, base: string): ReactNode {
  return sec.blocks
    .filter((b) => b.type === "p")
    .map((b, i) => <p key={`${base}-p${i}`}>{inline(b.text, `${base}-p${i}`)}</p>);
}

function firstList(sec: PSection): string[] {
  const b = sec.blocks.find((x) => x.type === "ul");
  return b && b.type === "ul" ? b.items : [];
}

/**
 * ProductDetail — a single product page laid out as alternating sections
 * (hero → intro + image → application feature blocks → specification panel →
 * logistics band → closing CTA), driven by the product's markdown content.
 */
export default function ProductDetail({
  product,
  content,
}: {
  product: ProductWithDept;
  content?: string | null;
}) {
  const doc = content ? parseProductDoc(content) : null;
  const byKind = (k: Kind) => doc?.sections.find((s) => kindOf(s.title) === k);

  const intro = byKind("intro");
  const apps = byKind("applications");
  const grades = byKind("grades");
  const logistics = byKind("logistics");
  const buyers = byKind("buyers");
  const highlights = PRODUCT_HIGHLIGHTS[product.id] ?? [];

  // Text for the frosted-glass box on the right of the intro.
  const buyersP = buyers?.blocks.find((b) => b.type === "p");
  const asideText =
    (buyersP && buyersP.type === "p" ? buyersP.text : null) ??
    doc.lead ??
    product.tagline;

  // If there's no parsed content, fall back to a simple prose render.
  if (!doc) {
    return (
      <article className="prod-detail">
        <Section width="wide" className="prod-detail__hero" ariaLabel={product.name}>
          <nav className="prod-detail__crumbs" aria-label="Breadcrumb">
            <ol>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/products">Products</Link>
              </li>
              <li aria-current="page">{product.name}</li>
            </ol>
          </nav>
          <span className="section-tag">{product.department.name}</span>
          <h1 className="prod-detail__title">{product.name}</h1>
          <p className="prod-detail__tagline">{product.tagline}</p>
          <p className="prod-detail__desc">{product.description}</p>
          <div className="prod-detail__cta">
            <Button href="/contact">Enquire about {product.name}</Button>
          </div>
        </Section>
      </article>
    );
  }

  return (
    <article className="prod-detail">
      {/* Hero */}
      <Section width="wide" className="prod-detail__hero" ariaLabel={product.name}>
        <nav className="prod-detail__crumbs" aria-label="Breadcrumb">
          <ol>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/products">Products</Link>
            </li>
            <li aria-current="page">{product.name}</li>
          </ol>
        </nav>

        <div className="prod-detail__hero-main">
          <span className="section-tag">{product.department.name}</span>
          <h1 className="prod-detail__title">{product.name}</h1>
          <p className="prod-detail__tagline">{product.tagline}</p>
        </div>

        {doc.lead || product.origin ? (
          <div className="prod-detail__hero-aside">
            {doc.lead ? (
              <p className="prod-detail__lead">{inline(doc.lead, "lead")}</p>
            ) : null}
            {product.origin ? (
              <p className="prod-detail__origin">Sourcing · {product.origin}</p>
            ) : null}
          </div>
        ) : null}
      </Section>

      {/* At a glance — big stat boxes */}
      {highlights.length ? (
        <Section width="wide" className="prod-detail__stats" ariaLabel="At a glance">
          <ul className="prod-detail__stat-grid">
            {highlights.map((h, i) => (
              <li
                key={i}
                className={`prod-detail__stat${i === 0 ? " prod-detail__stat--wide" : ""}`}
              >
                <span className="prod-detail__stat-value">{h.value}</span>
                <span className="prod-detail__stat-label">{h.label}</span>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {/* Intro — dotted backdrop, centred product image, tag + subtext left,
          frosted-glass note right */}
      {intro || product.image ? (
        <Section
          width="wide"
          className="prod-detail__intro"
          ariaLabel={intro?.title ?? "Overview"}
        >
          <div className="prod-detail__intro-dots" aria-hidden="true" />

          <div className="prod-detail__intro-grid">
            <div className="prod-detail__intro-left">
              <span className="prod-detail__eyebrow">
                {intro?.title ?? "Overview"}
              </span>
              {intro ? paragraphs(intro, "intro") : null}
            </div>

            <div className="prod-detail__intro-center">
              <figure className="prod-detail__shape">
                {product.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={product.image} alt={product.name} />
                ) : (
                  <span className="prod-detail__shape-ph" aria-hidden="true" />
                )}
              </figure>
            </div>

            <div className="prod-detail__intro-right">
              {asideText ? (
                <div className="prod-detail__glass">
                  {buyers ? (
                    <span className="prod-detail__glass-tag">{buyers.title}</span>
                  ) : null}
                  <p className="prod-detail__glass-text">
                    {inline(asideText, "aside")}
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </Section>
      ) : null}

      {/* Applications — feature blocks */}
      {apps ? (
        <Section width="wide" className="prod-detail__apps">
          <h2 className="prod-detail__h">{apps.title}</h2>
          <ul className="prod-detail__features">
            {firstList(apps).map((it, i) => {
              const { label, text } = splitItem(it);
              return (
                <li key={i} className="prod-detail__feature">
                  {label ? (
                    <h3 className="prod-detail__feature-title">{label}</h3>
                  ) : null}
                  <p className="prod-detail__feature-body">{inline(text, `f${i}`)}</p>
                </li>
              );
            })}
          </ul>
        </Section>
      ) : null}

      {/* Specifications — panel */}
      {grades ? (
        <Section width="wide" className="prod-detail__specs">
          <div className="prod-detail__specs-inner">
            <h2 className="prod-detail__h">{grades.title}</h2>
            <ul className="prod-detail__spec-list">
              {firstList(grades).map((it, i) => {
                const { label, text } = splitItem(it);
                return (
                  <li key={i} className="prod-detail__spec">
                    {label ? (
                      <span className="prod-detail__spec-label">{label}</span>
                    ) : null}
                    <span className="prod-detail__spec-text">
                      {inline(text, `s${i}`)}
                    </span>
                  </li>
                );
              })}
            </ul>
            {paragraphs(grades, "grades")}
          </div>
        </Section>
      ) : null}

      {/* Logistics — band */}
      {logistics ? (
        <Section surface width="wide" className="prod-detail__band">
          <div className="prod-detail__band-inner">
            <h2 className="prod-detail__h">{logistics.title}</h2>
            {paragraphs(logistics, "log")}
            {firstList(logistics).length ? (
              <ul className="prod-detail__band-list">
                {firstList(logistics).map((it, i) => {
                  const { label, text } = splitItem(it);
                  return (
                    <li key={i}>
                      {label ? <strong>{label}</strong> : null}
                      {label ? " — " : null}
                      {inline(text, `l${i}`)}
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>
        </Section>
      ) : null}

      {/* Closing + CTA (the "buyers" note now lives in the intro glass box) */}
      <Section width="wide" className="prod-detail__close">
        <div className="prod-detail__cta">
          <Button href="/contact">Enquire about {product.name}</Button>
        </div>
      </Section>

      {/* Any extra sections we didn't place, rendered as prose (safety net). */}
      {doc.sections
        .filter((s) => kindOf(s.title) === "other")
        .map((s, i) => (
          <Section key={i} width="wide" className="prod-detail__extra">
            <h2 className="prod-detail__h">{s.title}</h2>
            <Markdown
              className="prod-detail__prose"
              source={s.blocks
                .map((b) =>
                  b.type === "p" ? b.text : b.items.map((it) => `- ${it}`).join("\n")
                )
                .join("\n\n")}
            />
          </Section>
        ))}
    </article>
  );
}
