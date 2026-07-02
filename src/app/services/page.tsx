import type { Metadata } from "next";
import ServicesHero from "@/components/sections/ServicesHero";
import ServicesOverview from "@/components/sections/ServicesOverview";
import ServicesBand from "@/components/sections/ServicesBand";
import ServicesApproach from "@/components/sections/ServicesApproach";
import ServicesCta from "@/components/sections/ServicesCta";

export const metadata: Metadata = {
  title: "Services",
  description:
    "PV Link Energy's services span the full commodity value chain — trading, supply & distribution, storage & blending, shipping & chartering, hedging & risk management, and financial solutions.",
  alternates: { canonical: "/services" },
  // Still finishing the responsive pass — keep out of the index for now.
  robots: { index: false, follow: true },
};

export default function ServicesPage() {
  return (
    <main id="main-content">
      <ServicesHero />
      <ServicesOverview />
      <ServicesBand />
      <ServicesApproach />
      <ServicesCta />
    </main>
  );
}
