import type { Metadata } from "next";
import Preloader from "@/components/ui/Preloader";
import ProductsHero from "@/components/sections/ProductsHero";
import ProductsOverview from "@/components/sections/ProductsOverview";
import ProductsCta from "@/components/sections/ProductsCta";

export const metadata: Metadata = {
  title: "Products",
  description:
    "PV Link Energy's product portfolio — refined petroleum products (LPG, distillates, fuel oil, bitumen, base oil) and fertilizers (urea, ammonia, NPK, DAP, ammonium sulfate) — sourced and delivered on-spec worldwide.",
  alternates: { canonical: "/products" },
  // WIP — keep out of the index until it ships.
  robots: { index: false, follow: true },
};

// Production (what the client sees) keeps the "coming soon" placeholder; local
// dev renders the real page we're building. Remove this gate at launch.
const SHOW_WIP = process.env.NODE_ENV !== "production";

export default function ProductsPage() {
  return (
    <main id="main-content">
      {SHOW_WIP ? (
        <>
          <ProductsHero />
          <ProductsOverview />
          <ProductsCta />
        </>
      ) : (
        <Preloader label="Products" />
      )}
    </main>
  );
}
