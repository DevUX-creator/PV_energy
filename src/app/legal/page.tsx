import type { Metadata } from "next";
import LegalView from "@/components/sections/Legal/LegalView";

export const metadata: Metadata = {
  title: "Legal & Policies",
  description:
    "Imprint, Privacy Policy and Cookie Policy for PV Link Energy — the notices and policies governing this website and how we handle your data.",
  alternates: { canonical: "/legal" },
};

export default function LegalPage() {
  return <LegalView />;
}
