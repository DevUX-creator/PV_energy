import type { Metadata } from "next";
import Preloader from "@/components/ui/Preloader";

export const metadata: Metadata = {
  title: "Services",
  description: "PV Link Energy services — coming soon.",
  alternates: { canonical: "/services" },
  // Thin placeholder — keep it out of the index until the real page ships.
  robots: { index: false, follow: true },
};

// TEMPORARY — the Services subpages aren't built yet.
export default function ServicesPage() {
  return (
    <main id="main-content">
      <Preloader label="Services" />
    </main>
  );
}
