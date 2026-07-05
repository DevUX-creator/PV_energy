import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_HOST } from "@/lib/site";
import { ALL_PRODUCTS, getProduct } from "@/lib/products";

// Per-product Open Graph / Twitter card. Same brand frame as the site-wide
// banner (src/app/opengraph-image.tsx) but tailored to each product — the
// department as an eyebrow, the product name large, its tagline beneath — so
// every product shares with its own social banner instead of the generic one.
export const alt = `${SITE_NAME} — product`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Pre-render one banner per product at build time (mirrors the page route).
export function generateStaticParams() {
  return ALL_PRODUCTS.map((p) => ({ slug: p.id }));
}

export default async function ProductOgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  const eyebrow = (product?.department.name ?? "Energy & Commodities Trading").toUpperCase();
  const name = product?.name ?? SITE_NAME;
  const tagline = product?.tagline ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "linear-gradient(135deg, #1c1c1e 0%, #0a1f3c 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "22px" }}>
          <div style={{ width: 16, height: 60, background: "#019DDA", display: "flex" }} />
          <div style={{ fontSize: 26, letterSpacing: 7, color: "#cfe6f5", display: "flex" }}>
            {eyebrow}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 92, fontWeight: 700, lineHeight: 1.02, display: "flex" }}>
            {name}
          </div>
          {tagline ? (
            <div style={{ fontSize: 38, color: "#9fb7c9", marginTop: 24, display: "flex" }}>
              {tagline}
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 28,
            color: "#cfe6f5",
          }}
        >
          <div style={{ display: "flex" }}>{SITE_NAME}</div>
          <div style={{ display: "flex" }}>{SITE_HOST}</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
