import type { Metadata } from "next";
import ProductsHero from "@/components/sections/ProductsHero";
import ProductsOverview from "@/components/sections/ProductsOverview";
import ProductsCta from "@/components/sections/ProductsCta";

export const metadata: Metadata = {
  title: "Products",
  description:
    "PV Link Energy's product portfolio — refined petroleum products (LPG, distillates, fuel oil, bitumen, base oil) and fertilizers (urea, ammonia, NPK, DAP, ammonium sulfate) — sourced and delivered on-spec worldwide.",
  alternates: { canonical: "/products" },
};

export default function ProductsPage() {
  return (
    <main id="main-content">
      <ProductsHero />
      <ProductsOverview />
      <ProductsCta />
    </main>
  );
}
