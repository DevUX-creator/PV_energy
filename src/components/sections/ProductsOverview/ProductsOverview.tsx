import Link from "next/link";
import Section from "@/components/ui/Section";
import RevealText from "@/animations/RevealText";
import { PRODUCT_DEPARTMENTS } from "@/lib/products";
import "./productsOverview.css";

/**
 * ProductsOverview — the two departments and every product as a card that
 * links to its detail page.
 */
export default function ProductsOverview() {
  return (
    <Section
      id="products"
      width="wide"
      className="prod-ov"
      ariaLabel="Our products"
    >
      {/* Centered intro. Step-by-step reveal: tag, then the headline
          word-by-word, then the subtext — each staggered as you scroll in. */}
      <div className="prod-ov__intro">
        <RevealText split="none">
          <span className="section-tag">Our products</span>
        </RevealText>
        <RevealText delay={0.06}>
          <h1 className="prod-ov__title">
            The commodities that keep industry moving
          </h1>
        </RevealText>
        <RevealText split="none" delay={0.35}>
          <p className="prod-ov__lead">
            A focused portfolio across two departments — refined petroleum
            products and crop-nutrition fertilizers — sourced, moved and
            delivered on-spec across global markets.
          </p>
        </RevealText>
      </div>

      {PRODUCT_DEPARTMENTS.map((dept) => (
        <section
          key={dept.id}
          id={dept.id}
          className="prod-ov__dept"
          aria-label={dept.name}
        >
          <div className="prod-ov__dept-head">
            <h2 className="prod-ov__dept-name">{dept.name}</h2>
            <p className="prod-ov__dept-intro">{dept.intro}</p>
          </div>

          <ul className="prod-ov__grid">
            {dept.products.map((p) => (
              <li key={p.id}>
                <Link href={`/products/${p.id}`} className="prod-ov__card">
                  <span className="prod-ov__card-media">
                    {p.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.image} alt={p.name} loading="lazy" />
                    ) : null}
                  </span>
                  <span className="prod-ov__card-body">
                    <span className="prod-ov__card-name">{p.name}</span>
                    <span className="prod-ov__card-tagline">{p.tagline}</span>
                    <span className="prod-ov__card-cta" aria-hidden="true">
                      View product →
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </Section>
  );
}
