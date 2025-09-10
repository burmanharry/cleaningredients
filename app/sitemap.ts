// app/sitemap.ts
import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // grab up to 1000 ingredients for the sitemap
  const { data: ingredients } = await supabase
    .from("ingredients")
    .select("slug, updated_at")
    .order("updated_at", { ascending: false })
    .limit(1000);

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${site}/`, lastModified: new Date() },
    { url: `${site}/ingredients`, lastModified: new Date() },
    { url: `${site}/suppliers`, lastModified: new Date() },
  ];

  const ingredientPages: MetadataRoute.Sitemap =
    (ingredients ?? []).map((i) => ({
      url: `${site}/ingredients/${i.slug}`,
      lastModified: i.updated_at ? new Date(i.updated_at) : new Date(),
    }));

  return [...staticPages, ...ingredientPages];
}
