import type { Metadata } from "next";
import AboutHero from "@/components/sections/AboutHero";
import AboutStory from "@/components/sections/AboutStory";
import AboutServices from "@/components/sections/AboutServices";
import AboutFinale from "@/components/sections/AboutFinale";

export const metadata: Metadata = {
  title: "About",
  description:
    "PV Link Energy — an international energy and commodities trading company connecting supply and demand across global markets with precision and purpose.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main id="main-content">
      <AboutHero />
      <AboutStory />
      <AboutServices />
      <AboutFinale />
    </main>
  );
}
