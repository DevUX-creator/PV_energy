import type { MetadataRoute } from "next";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "PV Link",
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#1c1c1e",
    theme_color: "#0a1f3c",
    icons: [
      {
        src: "/LogoIcon.svg",
        type: "image/svg+xml",
        sizes: "any",
        purpose: "any",
      },
    ],
  };
}
