import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Don't advertise the framework.
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    // Serve modern formats where supported (falls back automatically).
    formats: ["image/avif", "image/webp"],
    // Next 16 requires every `quality` value used by any next/image call
    // to be declared here. Add new values as sections introduce them.
    qualities: [75, 85, 90, 95],
  },
  // The legal documents were unified onto a single /legal page with hash
  // deep-links; keep the old standalone URLs working for SEO / bookmarks.
  async redirects() {
    return [
      { source: "/imprint", destination: "/legal#imprint", permanent: true },
      {
        source: "/privacy-policy",
        destination: "/legal#privacy-policy",
        permanent: true,
      },
      {
        source: "/cookie-policy",
        destination: "/legal#cookie-policy",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
