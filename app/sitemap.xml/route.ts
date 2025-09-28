// app/sitemap.xml/route.ts
import { listPosts } from "@/lib/posts";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const revalidate = 3600; // 1h CDN cache

function baseUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL?.startsWith("http"))
    return process.env.NEXT_PUBLIC_SITE_URL!;
  if (process.env.NEXT_PUBLIC_BASE_URL?.startsWith("http"))
    return process.env.NEXT_PUBLIC_BASE_URL!;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export async function GET() {
  const BASE = baseUrl();
  const now = new Date();

  // Articles (from MDX)
  const posts = await listPosts();

  // Ingredients (from Supabase) - optional
  let ingredients: { slug: string; updated_at?: string | null }[] = [];
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      );
      const { data } = await supabase
        .from("ingredient_stats_plus")
        .select("slug,updated_at")
        .order("updated_at", { ascending: false });
      ingredients = data ?? [];
    }
  } catch (e) {
    console.error("[sitemap] supabase fetch failed", e);
  }

  const urls = [
    { loc: `${BASE}/`, lastmod: now },
    { loc: `${BASE}/information`, lastmod: now },
    ...posts.map((p) => ({
      loc: `${BASE}/information/${p.slug}`,
      lastmod: p.updatedAt ? new Date(p.updatedAt) : now,
    })),
    ...ingredients.map((r) => ({
      loc: `${BASE}/ingredients/${r.slug}`,
      lastmod: r.updated_at ? new Date(r.updated_at) : now,
    })),
  ];

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls
      .map((u) => {
        const lm =
          u.lastmod instanceof Date ? u.lastmod.toISOString() : new Date(u.lastmod).toISOString();
        return `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${lm}</lastmod>\n  </url>`;
      })
      .join("\n") +
    `\n</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
