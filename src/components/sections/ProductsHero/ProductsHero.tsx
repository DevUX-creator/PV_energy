import Button from "@/components/ui/Button";
import Logo3D from "@/components/ui/Logo3D";
import "./productsHero.css";

/**
 * ProductsHero — dark hero: a glowing blue ring + technical guides behind the
 * word "Products", which has a horizontal progressive blur (sharp centre,
 * blurred sides). The 3D logo (above) and the buttons (below) sit over the
 * blur so they stay crisp.
 */
export default function ProductsHero() {
  return (
    <section className="prod-hero" aria-label="Products">
      <div className="prod-hero__glow" aria-hidden="true" />
      <svg
        className="prod-hero__rings"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <circle cx="500" cy="500" r="340" />
        <circle cx="500" cy="500" r="255" />
      </svg>
      <div className="prod-hero__grid" aria-hidden="true" />

      <div className="prod-hero__center">
        <div className="prod-hero__logo">
          <Logo3D />
        </div>

        <div className="prod-hero__wordwrap">
          <span className="prod-hero__word prod-hero__word--blur" aria-hidden="true">
            Products
          </span>
          <h1 className="prod-hero__word prod-hero__word--sharp">Products</h1>
        </div>

        <div className="prod-hero__actions">
          <Button href="/products#petroleum" variant="outline" showArrow={false}>
            Petroleum
          </Button>
          <Button href="/products#fertilizers" variant="outline" showArrow={false}>
            Fertilizers
          </Button>
        </div>
      </div>
    </section>
  );
}
