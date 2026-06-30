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
};

export default nextConfig;
