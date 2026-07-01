import type { Metadata } from "next";
import ContactView from "@/components/sections/ContactView";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact PV Link Energy — email info@pvlinkenergy.com, call +971 4 577 5989, or reach our offices in Dubai (UAE), Athens (Greece) and Hong Kong.",
  keywords: [
    "contact PV Link Energy",
    "energy trading Dubai contact",
    "commodities trading Athens",
    "commodities trading Hong Kong",
  ],
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact PV Link Energy",
    description:
      "Reach our offices in Dubai (UAE), Athens (Greece) and Hong Kong — email, phone and locations.",
    url: "/contact",
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <main id="main-content">
      <ContactView />
    </main>
  );
}
