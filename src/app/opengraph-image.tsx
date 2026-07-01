import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_TAGLINE, SITE_HOST } from "@/lib/site";

// Site-wide Open Graph / Twitter card (inherited by every route that doesn't
// define its own). Rendered on the server — no external assets/fonts.
export const alt = `${SITE_NAME} — ${SITE_TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
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
          <div style={{ fontSize: 28, letterSpacing: 8, color: "#cfe6f5", display: "flex" }}>
            ENERGY &amp; COMMODITIES TRADING
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 104, fontWeight: 700, lineHeight: 1.02, display: "flex" }}>
            PV LINK ENERGY
          </div>
          <div style={{ fontSize: 40, color: "#9fb7c9", marginTop: 24, display: "flex" }}>
            {SITE_TAGLINE}
          </div>
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
          <div style={{ display: "flex" }}>Dubai · Athens · Hong Kong</div>
          <div style={{ display: "flex" }}>{SITE_HOST}</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
