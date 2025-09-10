// lib/images.ts
export function normalizeUrl(u?: string | null): string | undefined {
  if (!u) return undefined;
  if (u.startsWith("/") || /^https?:\/\//i.test(u)) return u;
  return "/" + u.replace(/^public\//, "").replace(/^\/+/, "");
}

/**
 * Build a deterministic list of image candidates for a tile or gallery.
 * - Local asset FIRST
 * - DB image (if any) SECOND
 * - Optional alternates
 * - Always end with a placeholder
 * - De-duplicate & cap length for consistency
 */
export function buildImageList(opts: {
  slug: string;
  dbImage?: string | null;
  limit?: number;      // how many you want to show (3 for tiles, 3–4 for detail gallery)
}): string[] {
  const { slug, dbImage, limit = 3 } = opts;

  const candidates = [
    `/images/ingredients/${slug}.jpg`,        // 1) local hero FIRST
    normalizeUrl(dbImage),                    // 2) DB override (if present)
    `/images/ingredients/${slug}-2.jpg`,      // 3) optional alternates you may have
    `/images/ingredients/${slug}-3.jpg`,
    `/images/ingredients/${slug}-4.jpg`,
    "/images/ingredients/placeholder.jpg",    // final safety net
  ];

  // Remove falsy & duplicates, then cap to requested size
  return Array.from(new Set(candidates.filter(Boolean))).slice(0, limit);
}
