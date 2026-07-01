import type { MetadataRoute } from "next";
import { SITE_URL, SITE_HOST } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_HOST,
  };
}
