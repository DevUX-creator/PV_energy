export type NavItem = {
  label: string;
  href: string;
  children?: NavItem[];
};

/**
 * Primary site navigation. Mirrors the PV Link Energy information
 * architecture extracted from the live site: Home, About, Services
 * (6 sub-services), Products (two departments), Contact.
 *
 * Product hrefs follow the existing live-site slugs where they exist;
 * the new Bitumen / Base Oil entries and the Fertilizer department are
 * additions per the client's brief (see docs/CONTENT.md).
 */
export const MAIN_NAV: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "Trading", href: "/services/trading" },
      { label: "Supply & Distribution", href: "/services/supply-distribution" },
      { label: "Storage & Blending", href: "/services/storage-blending" },
      { label: "Shipping & Chartering", href: "/services/shipping-chartering" },
      { label: "Hedging & Risk Management", href: "/services/hedging-risk-management" },
      { label: "Financial Solutions", href: "/services/financial-solutions" },
    ],
  },
  {
    label: "Products",
    href: "/products",
    children: [
      { label: "LPG", href: "/products/lpg" },
      { label: "Distillates: Naphtha & Mogas", href: "/products/distillates-naphtha-mogas" },
      { label: "Fuel Oil", href: "/products/fuel-oil" },
      { label: "Bitumen", href: "/products/bitumen" },
      { label: "Base Oil", href: "/products/base-oil" },
      { label: "Fertilizers", href: "/products/fertilizers" },
    ],
  },
  { label: "Contact", href: "/contact" },
];

/** Secondary / legal links, typically rendered in the footer. */
export const LEGAL_NAV: NavItem[] = [
  { label: "Imprint", href: "/legal#imprint" },
  { label: "Privacy Policy", href: "/legal#privacy-policy" },
  { label: "Cookie Policy", href: "/legal#cookie-policy" },
];
