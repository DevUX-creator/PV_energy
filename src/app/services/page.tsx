import type { Metadata } from "next";
import Preloader from "@/components/ui/Preloader";

export const metadata: Metadata = {
  title: "Services",
  description: "PV Link Energy services — coming soon.",
};

// TEMPORARY — the Services subpages aren't built yet.
export default function ServicesPage() {
  return (
    <main id="main-content">
      <Preloader label="Services" />
    </main>
  );
}
