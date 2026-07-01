import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Only routes that are actually built AND indexable. The Services and Products
// pages are "coming soon" placeholders (noindex) and their sub-routes
// (/services/trading, /products/lpg, …) aren't built yet — including them would
// point search engines at 404 / thin pages. Add them here as they ship.
const ROUTES: {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
}[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.8, changeFrequency: "monthly" },
  { path: "/legal", priority: 0.3, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ROUTES.map((r) => ({
    url: `${SITE_URL}${r.path === "/" ? "" : r.path}`,
    lastModified,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
