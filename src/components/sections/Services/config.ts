/** The 6 core services — verbatim from the live site /services page. */
export type Service = {
  id: string;
  name: string;
  href: string;
};

export const SERVICES: Service[] = [
  { id: "trading", name: "Trading", href: "/services/trading" },
  { id: "supply-distribution", name: "Supply & Distribution", href: "/services/supply-distribution" },
  { id: "storage-blending", name: "Storage & Blending", href: "/services/storage-blending" },
  { id: "shipping-chartering", name: "Shipping & Chartering", href: "/services/shipping-chartering" },
  { id: "hedging-risk-management", name: "Hedging & Risk Management", href: "/services/hedging-risk-management" },
  { id: "financial-solutions", name: "Financial Solutions", href: "/services/financial-solutions" },
];
