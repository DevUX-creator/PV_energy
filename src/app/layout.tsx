import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { fontVariables } from "@/styles/fonts";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CookieConsent from "@/components/ui/CookieConsent";
import "@/styles/globals.css";

const SITE_URL = "https://pvlinkenergy.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "PV Link Energy — Empowering Global Energy Flows",
    template: "%s | PV Link Energy",
  },
  description:
    "PV Link Energy is an international energy and commodities trading company delivering LPG, distillates, fuel oil, bitumen, base oil and fertilizers across global markets with precision and purpose.",
  keywords: [
    "energy trading",
    "commodities trading",
    "LPG",
    "fuel oil",
    "bitumen",
    "base oil",
    "urea",
    "fertilizers",
    "supply and distribution",
    "shipping and chartering",
  ],
  authors: [{ name: "PV Link Energy" }],
  creator: "PV Link Energy",
  publisher: "PV Link Energy",
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "PV Link Energy",
    title: "PV Link Energy — Empowering Global Energy Flows",
    description:
      "Critical energy and agricultural commodities across global markets — trading, supply, distribution, storage, shipping, and risk management.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#0a1f3c",
  colorScheme: "light",
};

const ORG_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "PV Link Energy",
  url: SITE_URL,
  description:
    "International energy and commodities trading company specializing in the supply, distribution, and risk-managed movement of essential energy and agro resources.",
  email: "info@pvlinkenergy.com",
  telephone: "+971 4 577 5989",
  address: {
    "@type": "PostalAddress",
    streetAddress: "201, Emaar Square Building 4, Downtown",
    addressLocality: "Dubai",
    addressCountry: "AE",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={fontVariables}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSON_LD) }}
        />
      </head>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Header />
        <SmoothScroll>
          {children}
          <Footer />
        </SmoothScroll>
        <CookieConsent />
      </body>
    </html>
  );
}
