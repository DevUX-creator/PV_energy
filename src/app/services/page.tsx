import type { Metadata } from "next";
import Preloader from "@/components/ui/Preloader";
import ServicesHero from "@/components/sections/ServicesHero";
import ServicesOverview from "@/components/sections/ServicesOverview";
import ServicesBand from "@/components/sections/ServicesBand";
import ServicesApproach from "@/components/sections/ServicesApproach";
import ServicesCta from "@/components/sections/ServicesCta";
import ServicesDrop from "@/components/sections/ServicesDrop";

export const metadata: Metadata = {
  title: "Services",
  description:
    "PV Link Energy's services span the full commodity value chain — trading, supply & distribution, storage & blending, shipping & chartering, hedging & risk management, and financial solutions.",
  alternates: { canonical: "/services" },
  // WIP — being built section by section; keep out of the index until complete.
  robots: { index: false, follow: true },
};

// While the Services page is under construction we build it in local dev, but
// production (what the client sees) keeps the "coming soon" placeholder. Remove
// this gate — and render <ServicesHero /> etc. directly — at launch.
const SHOW_WIP = process.env.NODE_ENV !== "production";

export default function ServicesPage() {
  return (
    <main id="main-content">
      {SHOW_WIP ? (
        <>
          <ServicesHero />
          <ServicesOverview />
          <ServicesBand />
          <ServicesApproach />
          <ServicesCta />
          <ServicesDrop />
        </>
      ) : (
        <Preloader label="Services" />
      )}
    </main>
  );
}
