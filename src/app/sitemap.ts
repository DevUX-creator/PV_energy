import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { ALL_PRODUCTS } from "@/lib/products";

// Static, indexable routes. Services is still a "coming soon" (noindex) pass, so
// it's deliberately left out until it ships. The Products index and every
// product subpage ARE built and indexable now, so they're appended below,
// data-driven from ALL_PRODUCTS (add a product → it appears here automatically).
const STATIC_ROUTES: {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
}[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" },
  { path: "/products", priority: 0.9, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.8, changeFrequency: "monthly" },
  { path: "/legal", priority: 0.3, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: `${SITE_URL}${r.path === "/" ? "" : r.path}`,
    lastModified,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  const productEntries: MetadataRoute.Sitemap = ALL_PRODUCTS.map((p) => ({
    url: `${SITE_URL}/products/${p.id}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticEntries, ...productEntries];
}
