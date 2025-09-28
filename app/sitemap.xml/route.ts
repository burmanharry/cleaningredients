// app/sitemap.xml/route.ts
import { NextRequest } from "next/server";
import { listPosts } from "@/lib/posts";

const BASE =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXT_PUBLIC_BASE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const revalidate = 3600;
export const runtime = "nodejs";

function buildXml(urls: { loc: string; lastmod?: string }[]) {
  const items = urls
    .map(
      (u) =>
        `<url><loc>${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ""}</url>`
    )
    .join("");
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${items}</urlset>`;
}

export async function GET(_req: NextRequest) {
  const now = new Date().toISOString();
  const posts = await listPosts();

  const urls = [
    { loc: `${BASE}/`, lastmod: now },
    { loc: `${BASE}/information`, lastmod: now },
    ...posts.map((p) => ({
      loc: `${BASE}/information/${p.slug}`,
      lastmod: p.updatedAt ?? now,
    })),
  ];

  const xml = buildXml(urls);

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, max-age=3600",
    },
  });
}

// 👇 This fixes GSC “Couldn’t fetch”
export async function HEAD(req: NextRequest) {
  const res = await GET(req);
  return new Response(null, { status: res.status, headers: res.headers });
}
