import { ImageResponse } from "next/og";

export const alt = "Gandhi Brothers — Ayurvedic Manufacturer, Junagadh since 1950";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Branded social-share card. Uses system fonts (no network fetch) for build robustness.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #F9F7F3 0%, #F2EEE9 100%)",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top: eyebrow */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 14, height: 14, borderRadius: 999, background: "#A69279" }} />
          <div
            style={{
              fontSize: 26,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "#A69279",
              fontWeight: 700,
            }}
          >
            Junagadh · Since 1950
          </div>
        </div>

        {/* Middle: title */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 96, fontWeight: 800, color: "#4A3F35", lineHeight: 1.05 }}>
            Gandhi Brothers
          </div>
          <div style={{ fontSize: 40, color: "#7B6651", marginTop: 24, maxWidth: 900 }}>
            Authentic, FDCA-licensed Ayurvedic Churnas &amp; Tailas — crafted the right way.
          </div>
        </div>

        {/* Bottom: badges */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              fontSize: 26,
              fontWeight: 700,
              color: "#fff",
              background: "#A69279",
              padding: "14px 28px",
              borderRadius: 999,
            }}
          >
            FDCA Licence GA/2079
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 26,
              fontWeight: 700,
              color: "#4A3F35",
              border: "3px solid #D4A351",
              padding: "12px 28px",
              borderRadius: 999,
            }}
          >
            gandhibrothers.co.in
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
