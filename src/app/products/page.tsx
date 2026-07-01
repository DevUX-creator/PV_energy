import type { Metadata } from "next";
import Preloader from "@/components/ui/Preloader";

export const metadata: Metadata = {
  title: "Products",
  description: "PV Link Energy products — coming soon.",
  alternates: { canonical: "/products" },
  // Thin placeholder — keep it out of the index until the real page ships.
  robots: { index: false, follow: true },
};

// TEMPORARY — the Products subpages aren't built yet.
export default function ProductsPage() {
  return (
    <main id="main-content">
      <Preloader label="Products" />
    </main>
  );
}
