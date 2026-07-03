import Link from "next/link";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import { ALL_PRODUCTS, type ProductWithDept } from "@/lib/products";
import "./productDetail.css";

/**
 * ProductDetail — a single product page: hero (department, name, tagline),
 * image + description, applications/grades, and links to the other products.
 */
export default function ProductDetail({ product }: { product: ProductWithDept }) {
  const others = ALL_PRODUCTS.filter((p) => p.id !== product.id);

  return (
    <article className="prod-detail">
      <Section width="wide" className="prod-detail__main" ariaLabel={product.name}>
        <Link href="/products" className="prod-detail__back">
          ← All products
        </Link>

        <header className="prod-detail__head">
          <span className="section-tag">{product.department.name}</span>
          <h1 className="prod-detail__title">{product.name}</h1>
          <p className="prod-detail__tagline">{product.tagline}</p>
        </header>

        <div className="prod-detail__body">
          <figure className="prod-detail__media">
            {product.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={product.image} alt={product.name} />
            ) : null}
          </figure>

          <div className="prod-detail__info">
            {product.origin ? (
              <p className="prod-detail__origin">Sourcing · {product.origin}</p>
            ) : null}
            <p className="prod-detail__desc">{product.description}</p>
            <div className="prod-detail__cta">
              <Button href="/contact">Enquire about {product.name}</Button>
            </div>
          </div>
        </div>

        {product.points?.length ? (
          <div className="prod-detail__apps">
            <h2 className="prod-detail__apps-title">Applications &amp; grades</h2>
            <ul className="prod-detail__apps-grid">
              {product.points.map((pt) => (
                <li key={pt.id} className="prod-detail__app">
                  <h3 className="prod-detail__app-title">{pt.title}</h3>
                  <p className="prod-detail__app-body">{pt.body}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </Section>

      <Section
        surface
        width="wide"
        className="prod-detail__more"
        ariaLabel="Other products"
      >
        <p className="eyebrow">Explore more</p>
        <ul className="prod-detail__more-list">
          {others.map((p) => (
            <li key={p.id}>
              <Link href={`/products/${p.id}`} className="prod-detail__more-link">
                {p.name}
                <span aria-hidden="true">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </article>
  );
}
