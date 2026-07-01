import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { fontVariables } from "@/styles/fonts";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CookieConsent from "@/components/ui/CookieConsent";
import {
  SITE_URL,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  buildOrganizationJsonLd,
} from "@/lib/site";
import "@/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "Energy & Commodities Trading",
  // Home canonical; each page overrides. metadataBase resolves the "/".
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
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
  // Geo hints for the HQ; the full multi-location detail lives in the JSON-LD.
  other: {
    "geo.region": "AE-DU",
    "geo.placename": "Dubai",
    "geo.position": "25.189;55.28",
    ICBM: "25.189, 55.28",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a1f3c",
  colorScheme: "light",
};

const ORG_JSON_LD = buildOrganizationJsonLd();

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
