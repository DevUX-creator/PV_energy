import type { MetadataRoute } from "next";
import { MAIN_NAV, LEGAL_NAV } from "@/lib/navigation";

const SITE_URL = "https://pvlinkenergy.com";

/** Flatten the nav trees into a unique set of routes. */
function collectRoutes(): string[] {
  const routes = new Set<string>(["/"]);
  [...MAIN_NAV, ...LEGAL_NAV].forEach((item) => {
    routes.add(item.href);
    item.children?.forEach((child) => routes.add(child.href));
  });
  return [...routes];
}

export default function sitemap(): MetadataRoute.Sitemap {
  return collectRoutes().map((path) => ({
    url: `${SITE_URL}${path === "/" ? "" : path}`,
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
