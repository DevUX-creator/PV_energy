import type { Metadata } from "next";
import ContactView from "@/components/sections/ContactView";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with PV Link Energy — email, phone, and our offices in Dubai, Athens and Hong Kong.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main id="main-content">
      <ContactView />
    </main>
  );
}
