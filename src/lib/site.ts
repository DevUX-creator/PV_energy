/**
 * Central site + SEO constants and the structured-data (JSON-LD) graph.
 *
 * This is the single source of truth for the canonical URL, brand strings,
 * per-office location data (NAP + geo for local SEO), and the schema.org graph
 * emitted site-wide. Keep the office data here in sync with
 * src/components/sections/Offices/config.ts (that one drives the UI; this one
 * carries the structured address parts + coordinates that search engines want).
 */

export const SITE_URL = "https://pvlinkenergy.com";
export const SITE_HOST = "pvlinkenergy.com";
export const SITE_NAME = "PV Link Energy";
/** Legal entity — PLACEHOLDER pending client confirmation (see docs/CONTENT.md). */
export const SITE_LEGAL_NAME = "PV Link Energy FZCO";

export const SITE_TAGLINE = "Empowering Global Energy Flows";

/**
 * Site-wide social share banner (the generated /opengraph-image route).
 * metadataBase resolves this to an absolute URL. Pages that declare their OWN
 * `openGraph` block must include this in `openGraph.images` — otherwise Next
 * does NOT cascade the root file-based banner into an overridden openGraph, and
 * the share card ships imageless. Pages without an openGraph override, and
 * product pages (own opengraph-image), don't need it.
 */
export const OG_IMAGE = "/opengraph-image";

export const SITE_DESCRIPTION =
  "PV Link Energy is an international energy and commodities trading company delivering LPG, distillates, fuel oil, bitumen, base oil and fertilizers across global markets — trading, supply, distribution, storage, shipping and risk management from Dubai, Athens and Hong Kong.";

export const CONTACT_EMAIL = "info@pvlinkenergy.com";
export const CONTACT_PHONE = "+971 4 577 5989";

/** Social / authoritative profiles (schema.org sameAs). */
export const SAME_AS: string[] = [
  "https://www.linkedin.com/company/pvlink-energy",
];

export type SeoOffice = {
  id: string;
  /** Branch name for the local entity, e.g. "PV Link Energy — Dubai". */
  name: string;
  streetAddress: string;
  addressLocality: string;
  addressRegion?: string;
  postalCode?: string;
  /** ISO 3166-1 alpha-2 country code. */
  countryCode: string;
  countryName: string;
  telephone?: string;
  email?: string;
  /** Approximate (neighbourhood-level) coordinates — a geolocation hint. */
  geo: { lat: number; lng: number };
};

export const SEO_OFFICES: SeoOffice[] = [
  {
    id: "dubai",
    name: "PV Link Energy — Dubai",
    streetAddress: "201, Emaar Square Building 4, Downtown",
    addressLocality: "Dubai",
    addressRegion: "Dubai",
    countryCode: "AE",
    countryName: "United Arab Emirates",
    telephone: "+971 4 577 5989",
    email: "info@pvlinkenergy.com",
    geo: { lat: 25.189, lng: 55.28 },
  },
  {
    id: "athens",
    name: "PV Link Energy — Athens",
    streetAddress: "Griva Digeni 2, Agios Dimitrios",
    addressLocality: "Athens",
    addressRegion: "Attica",
    postalCode: "173 43",
    countryCode: "GR",
    countryName: "Greece",
    geo: { lat: 37.9333, lng: 23.7392 },
  },
  {
    id: "hong-kong",
    name: "PV Link Energy — Hong Kong",
    streetAddress:
      "Unit 18, 8/F, Peter Leung Industrial Building, 103 Wai Yip Street, Kwun Tong",
    addressLocality: "Kowloon",
    addressRegion: "Hong Kong",
    countryCode: "HK",
    countryName: "Hong Kong",
    telephone: "+86 020 33974261",
    geo: { lat: 22.3141, lng: 114.2249 },
  },
];

/** Primary market regions the company serves (schema areaServed). */
export const AREA_SERVED = [
  "United Arab Emirates",
  "Greece",
  "Hong Kong",
  "Middle East",
  "Asia-Pacific",
  "Europe",
  "West Africa",
  "Americas",
  "Worldwide",
];

/** Topical expertise — feeds schema knowsAbout and the keyword set. */
export const KNOWS_ABOUT = [
  "Energy trading",
  "Commodities trading",
  "Petroleum products trading",
  "LPG (Liquefied Petroleum Gas)",
  "Naphtha and Mogas",
  "Fuel oil",
  "Bitumen",
  "Base oil",
  "Fertilizers",
  "Urea",
  "Ammonia",
  "Supply and distribution",
  "Storage and blending",
  "Shipping and chartering",
  "Hedging and risk management",
  "Trade finance",
];

/** Location-aware keyword set for <meta keywords> and page metadata. */
export const SITE_KEYWORDS = [
  "energy trading",
  "commodities trading",
  "oil trading company",
  "petroleum products",
  "LPG supplier",
  "fuel oil",
  "bitumen",
  "base oil",
  "fertilizers",
  "urea",
  "supply and distribution",
  "shipping and chartering",
  "trade finance",
  "energy trading Dubai",
  "commodities trading Dubai UAE",
  "energy trading Athens Greece",
  "commodities trading Hong Kong",
];

const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

/**
 * The site-wide schema.org graph: the parent Organization, the WebSite, and
 * one node per office (each linked back to the parent) so search engines can
 * associate the brand with all three locations — the basis of the multi-city
 * local presence.
 */
export function buildOrganizationJsonLd() {
  const officeNodes = SEO_OFFICES.map((o) => ({
    "@type": "Organization",
    "@id": `${SITE_URL}/#office-${o.id}`,
    name: o.name,
    parentOrganization: { "@id": ORG_ID },
    url: SITE_URL,
    ...(o.telephone ? { telephone: o.telephone } : {}),
    ...(o.email ? { email: o.email } : {}),
    address: {
      "@type": "PostalAddress",
      streetAddress: o.streetAddress,
      addressLocality: o.addressLocality,
      ...(o.addressRegion ? { addressRegion: o.addressRegion } : {}),
      ...(o.postalCode ? { postalCode: o.postalCode } : {}),
      addressCountry: o.countryCode,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: o.geo.lat,
      longitude: o.geo.lng,
    },
    areaServed: o.countryName,
  }));

  const hq = SEO_OFFICES[0];

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ORG_ID,
        name: SITE_NAME,
        legalName: SITE_LEGAL_NAME,
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/LogoIcon.svg`,
        },
        image: `${SITE_URL}/opengraph-image`,
        description: SITE_DESCRIPTION,
        email: CONTACT_EMAIL,
        telephone: CONTACT_PHONE,
        ...(SAME_AS.length ? { sameAs: SAME_AS } : {}),
        address: {
          "@type": "PostalAddress",
          streetAddress: hq.streetAddress,
          addressLocality: hq.addressLocality,
          ...(hq.addressRegion ? { addressRegion: hq.addressRegion } : {}),
          addressCountry: hq.countryCode,
        },
        location: SEO_OFFICES.map((o) => ({ "@id": `${SITE_URL}/#office-${o.id}` })),
        areaServed: AREA_SERVED,
        knowsAbout: KNOWS_ABOUT,
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "customer service",
            email: CONTACT_EMAIL,
            telephone: CONTACT_PHONE,
            areaServed: SEO_OFFICES.map((o) => o.countryCode),
            availableLanguage: ["en"],
          },
        ],
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: SITE_URL,
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        publisher: { "@id": ORG_ID },
        inLanguage: "en",
      },
      ...officeNodes,
    ],
  };
}
