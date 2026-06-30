import type { MetadataRoute } from "next";

const SITE_URL = "https://pvlinkenergy.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: "pvlinkenergy.com",
  };
}
