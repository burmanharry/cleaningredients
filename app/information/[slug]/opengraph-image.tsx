// app/information/[slug]/opengraph-image.tsx
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function titleCaseFromSlug(slug: string) {
  const s = decodeURIComponent(slug).replace(/-/g, " ");
  return s.replace(/\b\w/g, (m) => m.toUpperCase());
}

export default async function Image({
  params,
}: {
  params: { slug: string };
}) {
  const title = titleCaseFromSlug(params.slug);

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#ffffff",
          padding: "64px",
        }}
      >
        <div style={{ fontSize: 36, color: "#666" }}>CleanIngredients</div>
        <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.1 }}>
          {title}
        </div>
        <div style={{ marginTop: 16, fontSize: 28, color: "#444" }}>
          Information • Guide
        </div>
      </div>
    ),
    { width: size.width, height: size.height }
  );
}
