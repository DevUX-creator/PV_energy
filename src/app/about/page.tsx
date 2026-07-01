import type { Metadata } from "next";
import AboutHero from "@/components/sections/AboutHero";
import AboutStory from "@/components/sections/AboutStory";
import AboutServices from "@/components/sections/AboutServices";
import AboutFinale from "@/components/sections/AboutFinale";

export const metadata: Metadata = {
  title: "About",
  description:
    "PV Link Energy is an international energy & commodities trading company connecting supply and demand across global markets — end-to-end from sourcing to delivery, with offices in Dubai, Athens and Hong Kong.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About PV Link Energy",
    description:
      "International energy & commodities trader connecting supply and demand across global markets — offices in Dubai, Athens and Hong Kong.",
    url: "/about",
    type: "website",
  },
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
