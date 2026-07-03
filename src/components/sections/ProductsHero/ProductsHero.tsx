import Button from "@/components/ui/Button";
import Logo3D from "@/components/ui/Logo3D";
import "./productsHero.css";

/**
 * ProductsHero — dark hero with a soft blue gradient wash (sui.io style) and a
 * real progressive blur over the word "Products": stacked backdrop-filter
 * layers whose masks ramp blur from a sharp centre out to fully-dissolved
 * edges. The 3D logo (above) and the buttons (below) sit over the blur stack
 * so they stay crisp.
 */
export default function ProductsHero() {
  return (
    <section className="prod-hero" aria-label="Products">
      <div className="prod-hero__bg" aria-hidden="true" />

      <div className="prod-hero__center">
        <div className="prod-hero__logo">
          <Logo3D />
        </div>

        <div className="prod-hero__wordstage">
          <h1 className="prod-hero__word">Products</h1>
          {/* Progressive-blur stack — each layer blurs the word behind it more,
              masked so only the sides accumulate blur. */}
          <div className="prod-hero__blur" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </div>
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
