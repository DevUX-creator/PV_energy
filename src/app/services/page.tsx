import type { Metadata } from "next";
import ServicesHero from "@/components/sections/ServicesHero";

export const metadata: Metadata = {
  title: "Services",
  description:
    "PV Link Energy's services span the full commodity value chain — trading, supply & distribution, storage & blending, shipping & chartering, hedging & risk management, and financial solutions.",
  alternates: { canonical: "/services" },
  // WIP — being built section by section; keep out of the index until complete.
  robots: { index: false, follow: true },
};

export default function ServicesPage() {
  return (
    <main id="main-content">
      <ServicesHero />
    </main>
  );
}
