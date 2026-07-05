import Link from "next/link";
import type { ReactNode } from "react";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import Markdown from "@/components/ui/Markdown";
import { inline } from "@/components/ui/Markdown/inline";
import { parseProductDoc, type PSection } from "@/lib/productContent";
import { PRODUCT_HIGHLIGHTS } from "@/lib/productHighlights";
import { PRODUCT_DEPARTMENTS, type ProductWithDept } from "@/lib/products";
import ProductIntroScrub, { type IntroStage } from "./ProductIntroScrub";
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

// Four-point shuriken (throwing star) with a punched centre.
function ShurikenIcon() {
  return (
    <svg
      className="prod-detail__card-icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="currentColor"
      fillRule="evenodd"
    >
      <path d="M12 1L14.8 9.2 23 12 14.8 14.8 12 23 9.2 14.8 1 12 9.2 9.2ZM9.9 12A2.1 2.1 0 1 0 14.1 12 2.1 2.1 0 1 0 9.9 12Z" />
    </svg>
  );
}

// Per-product curated content for the scrubbed intro + Key Applications block.
// Keyed by product id; only products with an entry get the rich scrub layout.
type IntroStageCopy = {
  tag: string;
  lead: string; // full-colour part of the statement
  muted: string; // grey tail of the statement
  noteTag: string;
  note: string; // right-side glass note
};
type ProductExtras = {
  stages: IntroStageCopy[];
  cards: { label: string; info: string }[];
  blocks: { title: string; lead: string; muted: string; sub: string }[];
};

const PRODUCT_EXTRAS: Record<string, ProductExtras> = {
  "ammonium-sulfate": {
    stages: [
      {
        tag: "What it is",
        lead: "Nitrogen and sulphur, delivered together",
        muted: "— for the soils and crops that need both.",
        noteTag: "Why it matters",
        note: "Readily available nitrogen alongside a nutrient many soils increasingly lack as cleaner air cuts atmospheric sulphur — with a mild acidifying effect that suits alkaline soils.",
      },
      {
        tag: "Grades & forms",
        lead: "A clean, uniform source of N and S",
        muted: "— on its own or in the blend.",
        noteTag: "Core specs",
        note: "Around **21% N** and **24% S**. Crystalline, granular and compacted forms — granular and compacted for bulk blending and spreading, crystalline for solution and industrial use.",
      },
    ],
    cards: [
      {
        label: "Blend-ready",
        info: "Granular and compacted grades pair with urea, DAP and potash without segregating in the bag.",
      },
      {
        label: "Solution grade",
        info: "Crystalline form dissolves cleanly for fertigation and industrial use.",
      },
    ],
    blocks: [
      {
        title: "Grades & forms",
        lead: "Crystalline, granular and compacted forms",
        muted:
          "— granular and compacted suit bulk blending and mechanical spreading; crystalline suits solution and industrial use.",
        sub: "Source grade — caprolactam vs synthetic · ≈21% N · ≈24% S",
      },
      {
        title: "Handling, storage & logistics",
        lead: "Supplied bagged or in bulk, stored dry to stay free-flowing.",
        muted: "",
        sub: "Granular grades pair with urea, DAP and potash without segregating in the bag.",
      },
    ],
  },
  ammonia: {
    stages: [
      {
        tag: "What it is",
        lead: "The most concentrated nitrogen of all",
        muted: "— around 82% N, the feedstock behind nearly every nitrogen fertilizer.",
        noteTag: "Why it matters",
        note: "Made by combining nitrogen from the air with hydrogen — the base for urea, ammonium nitrate and DAP, a workhorse industrial chemical, and increasingly a carrier for clean hydrogen energy.",
      },
      {
        tag: "Grades & specs",
        lead: "Anhydrous, from commercial to metallurgical grade",
        muted: "— matched on purity, water and oil content to the end use.",
        noteTag: "Handled with discipline",
        note: "A liquefied gas — refrigerated near **−33 °C** or stored under pressure in specialised insulated carriers. Toxic, so safety, containment and trained handling matter as much as the product.",
      },
    ],
    cards: [
      {
        label: "Field-direct",
        info: "Anhydrous ammonia injected straight into soil as a high-efficiency nitrogen source.",
      },
      {
        label: "Clean-energy carrier",
        info: "An emerging zero-carbon fuel and a practical way to move hydrogen around the world.",
      },
    ],
    blocks: [
      {
        title: "Grades & specifications",
        lead: "Anhydrous — commercial, refrigeration, metallurgical",
        muted:
          "— distinguished by purity and water content, matched to the end use.",
        sub: "NH₃ purity · moisture / water · oil content",
      },
      {
        title: "Handling, storage & logistics",
        lead: "A liquefied gas — refrigerated near −33 °C or under pressure",
        muted:
          "— in specialised insulated carriers, with strict safety and trained handling at every step.",
        sub: "Toxic · certified equipment · disciplined logistics",
      },
    ],
  },
  urea: {
    stages: [
      {
        tag: "What it is",
        lead: "The highest nitrogen of any dry fertilizer",
        muted: "— around 46% N, dissolving readily to feed crops efficiently.",
        noteTag: "Why it matters",
        note: "More nutrient per tonne shipped and spread — lowering freight and handling cost per unit of nitrogen, which is why it dominates global nitrogen trade.",
      },
      {
        tag: "Grades & forms",
        lead: "Granular or prilled, plus a pure technical grade",
        muted: "— from broad-acre spreading to resins, feed and emissions control.",
        noteTag: "Core specs",
        note: "Around **46% N** with **low biuret** for foliar use. Granular for bulk blending and spreading, prilled for direct application and technical use.",
      },
    ],
    cards: [
      {
        label: "Blend-ready",
        info: "Hard granular grade suits bulk blending and mechanical spreading across broad-acre crops.",
      },
      {
        label: "Technical grade",
        info: "High-purity urea feeds resins, adhesives and melamine, and DEF/AdBlue emissions control.",
      },
    ],
    blocks: [
      {
        title: "Grades & specifications",
        lead: "Granular or prilled — sized to the job",
        muted:
          "— granular for bulk blending and spreading, prilled for direct application and technical use.",
        sub: "≈46% N · low biuret for foliar · consistent granulometry",
      },
      {
        title: "Handling, storage & logistics",
        lead: "Bagged (50 kg / jumbo) or in bulk",
        muted:
          "— urea is hygroscopic, so dry storage and anti-caking treatment protect quality plant to field.",
        sub: "50 kg bags · one-tonne jumbos · bulk",
      },
    ],
  },
};

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
    doc?.lead ??
    product.tagline;

  // Scroll-scrubbed intro stages (only when the product has an intro video).
  // Left = a short, larger "serious" statement; right = the supporting detail.
  // Two stages keeps the scrub smooth; deeper copy lives further down the page.
  const glassNote = (tag: string | null, text: string, key: string): ReactNode => (
    <div className="prod-detail__glass">
      {tag ? <span className="prod-detail__glass-tag">{tag}</span> : null}
      <p className="prod-detail__glass-text">{inline(text, key)}</p>
    </div>
  );
  // A two-tone statement: the emphatic lead in full colour, the tail in grey.
  const statement = (
    tag: string | null,
    lead: string,
    muted: string,
    key: string
  ): ReactNode => (
    <>
      {tag ? (
        <span className="section-tag prod-detail__intro-tag">{tag}</span>
      ) : null}
      <p className="pds-stage__statement">
        {inline(lead, `${key}-a`)}{" "}
        <span className="pds-stage__muted">{inline(muted, `${key}-b`)}</span>
      </p>
    </>
  );

  const extras = PRODUCT_EXTRAS[product.id];
  const appCards = extras?.cards ?? [];
  const detailBlocks = extras?.blocks ?? [];

  const introStages: IntroStage[] = [];
  if (product.video && doc && extras) {
    extras.stages.forEach((st, i) => {
      introStages.push({
        left: statement(st.tag, st.lead, st.muted, `st${i}-l`),
        right: glassNote(st.noteTag, st.note, `st${i}-note`),
      });
    });
  }
  const useScrub = product.video && doc && introStages.length > 0;

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
            <Button href="/contact">Contact Us</Button>
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
          <div className="prod-detail__hero-cta">
            <Button href="/contact">Contact Us</Button>
          </div>
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
          {useScrub ? (
            <ProductIntroScrub
              video={product.video!}
              poster={product.video!.replace(/\.mp4$/, "-poster.jpg")}
              stages={introStages}
            />
          ) : (
            <>
              <div className="prod-detail__intro-dots" aria-hidden="true" />

              <div className="prod-detail__intro-grid">
                <div className="prod-detail__intro-left">
                  <span className="section-tag prod-detail__intro-tag">
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
                        <span className="prod-detail__glass-tag">
                          {buyers.title}
                        </span>
                      ) : null}
                      <p className="prod-detail__glass-text">
                        {inline(asideText, "aside")}
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>
            </>
          )}
        </Section>
      ) : null}

      {/* Applications — feature blocks */}
      {apps ? (
        <Section width="wide" className="prod-detail__apps">
          <header className="prod-detail__section-head">
            <h2 className="prod-detail__h">{apps.title}</h2>
            <span className="section-tag">{product.department.name}</span>
          </header>
          <div className="prod-detail__apps-body">
            <div className="prod-detail__apps-anim" aria-hidden="true">
              <div className="tetrominos">
                <div className="tetromino box1" />
                <div className="tetromino box2" />
                <div className="tetromino box3" />
                <div className="tetromino box4" />
              </div>
            </div>
            <div className="prod-detail__apps-right">
              <ul className="prod-detail__features">
                {firstList(apps).map((it, i) => {
                  const { label, text } = splitItem(it);
                  return (
                    <li key={i} className="prod-detail__feature">
                      {label ? (
                        <h3 className="prod-detail__feature-title">{label}</h3>
                      ) : null}
                      <p className="prod-detail__feature-body">
                        {inline(text, `f${i}`)}
                      </p>
                    </li>
                  );
                })}
              </ul>

              {appCards.length ? (
                <div className="prod-detail__cards">
                  {appCards.map((c, i) => (
                    <article key={i} className="prod-detail__card">
                      <header className="prod-detail__card-top">
                        <span className="prod-detail__card-label">{c.label}</span>
                        <ShurikenIcon />
                      </header>
                      <p className="prod-detail__card-info">{c.info}</p>
                    </article>
                  ))}
                </div>
              ) : null}

              {/* Grades / logistics — large statement + mono subtext, offset. */}
              {detailBlocks.map((b, i) => (
                <div
                  key={i}
                  className={
                    "prod-detail__dblock" +
                    (i % 2 ? " prod-detail__dblock--alt" : "")
                  }
                >
                  <span className="section-tag">{b.title}</span>
                  <p className="prod-detail__dblock-lead">
                    {b.lead}
                    {b.muted ? (
                      <>
                        {" "}
                        <span className="prod-detail__dblock-muted">
                          {b.muted}
                        </span>
                      </>
                    ) : null}
                  </p>
                  {b.sub ? (
                    <p className="prod-detail__dblock-sub">{b.sub}</p>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </Section>
      ) : null}

      {/* Closing + CTA (the "buyers" note now lives in the intro glass box) */}
      <Section width="wide" className="prod-detail__close">
        <div className="prod-detail__cta">
          <Button href="/contact">Contact Us</Button>
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

      {/* More products — index of the rest of the range */}
      <Section width="wide" className="prod-detail__more" ariaLabel="More products">
        <header className="prod-detail__section-head">
          <h2 className="prod-detail__h">More products</h2>
          <Link href="/products" className="section-tag">
            All products
          </Link>
        </header>
        <ul className="prod-detail__more-list">
          {PRODUCT_DEPARTMENTS.map((dept) => {
            const items = dept.products.filter((p) => p.id !== product.id);
            if (!items.length) return null;
            return (
              <li key={dept.id} className="prod-detail__more-group">
                <span className="prod-detail__more-group-label">
                  {dept.name}
                </span>
                <ul className="prod-detail__more-sublist">
                  {items.map((p) => (
                    <li key={p.id}>
                      <Link
                        href={`/products/${p.id}`}
                        className="prod-detail__more-item"
                      >
                        <span className="prod-detail__more-name">{p.name}</span>
                        <span
                          className="prod-detail__more-arrow"
                          aria-hidden="true"
                        >
                          →
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
      </Section>
    </article>
  );
}
