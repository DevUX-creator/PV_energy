import type { Metadata } from "next";
import ProductsOverview from "@/components/sections/ProductsOverview";

export const metadata: Metadata = {
  title: "Products",
  description:
    "PV Link Energy's product portfolio — refined petroleum products (LPG, distillates, fuel oil, bitumen, base oil) and fertilizers (urea, ammonia, NPK, DAP, ammonium sulfate) — sourced and delivered on-spec worldwide.",
  alternates: { canonical: "/products" },
  // WIP — keep out of the index until the responsive pass is done.
  robots: { index: false, follow: true },
};

export default function ProductsPage() {
  return (
    <main id="main-content">
      <ProductsOverview />
    </main>
  );
}
