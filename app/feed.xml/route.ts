// app/feed.xml/route.ts
import { NextResponse } from "next/server";
import { listPosts } from "@/lib/posts";

export async function GET() {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const items = await listPosts();

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
<title>CleanIngredients – Information</title>
<link>${base}/information</link>
<description>Guides on verification, testing, compliance, sourcing, pricing, and more.</description>
${items.map(p => `
<item>
  <title><![CDATA[${p.title}]]></title>
  <link>${base}/information/${p.slug}</link>
  <guid>${base}/information/${p.slug}</guid>
  <pubDate>${new Date(p.updatedAt || Date.now()).toUTCString()}</pubDate>
  ${p.description ? `<description><![CDATA[${p.description}]]></description>` : ""}
</item>`).join("")}
</channel></rss>`;

  return new NextResponse(rss, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
