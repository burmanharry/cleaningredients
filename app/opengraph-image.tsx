import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background:
            "linear-gradient(135deg, #ffffff 0%, #f5f7fb 55%, #eef2ff 100%)",
          color: "#0a0a0a",
          fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Inter, Helvetica, Arial",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              background: "#111",
            }}
          />
          <div style={{ fontSize: 28, fontWeight: 700 }}>CleanIngredients</div>
        </div>

        <h1 style={{ fontSize: 72, margin: 0, fontWeight: 800 }}>
          Verified ingredient marketplace
        </h1>

        <div style={{ fontSize: 26, color: "#4b5563" }}>
          Sourcing, testing & compliance—done right
        </div>
      </div>
    ),
    { ...size }
  );
}
