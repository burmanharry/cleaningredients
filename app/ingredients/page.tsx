// app/ingredients/page.tsx
import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
import IngredientsFilters from "@/components/IngredientsFilters";
import TileImage from "@/components/TileImage";

export const metadata: Metadata = {
  title: "Browse ingredients — CleanIngredients",
  description:
    "Discover verified supplement ingredients. Filter by category, source, verification, price, and more.",
};

/* ---------- small helpers ---------- */
const FUNCTIONAL_CATS = new Set(["Adaptogen", "Antioxidant", "Longevity", "Nootropic"]);

function bool(v?: string | null) {
  return v === "1" || v === "true";
}
function num(v?: string | null) {
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

/** Normalizes DB image urls (handles "public/images/..." or "images/..."). */
function normalizeImageUrl(u?: string | null): string | undefined {
  if (!u) return undefined;
  if (/^https?:\/\//i.test(u)) return u; // absolute
  if (u.startsWith("/")) return u; // already good
  return "/" + u.replace(/^public\//, "").replace(/^\/+/, "");
}

/**
 * Build a short list of image candidates for a grid tile.
 * Keeps length consistent (default 3), dedupes and preserves order.
 */
function buildImageList({
  slug,
  dbImage,
  limit = 3,
}: {
  slug: string;
  dbImage?: string | null;
  limit?: number;
}): string[] {
  const list = [
    normalizeImageUrl(dbImage),
    `/images/ingredients/${slug}.jpg`,
    "/images/ingredients/placeholder.jpg",
  ].filter(Boolean) as string[];

  // de-dupe while preserving order, then clamp to limit
  const seen = new Set<string>();
  const uniq = list.filter((s) => (seen.has(s) ? false : (seen.add(s), true)));
  return uniq.slice(0, limit);
}

/* ---------- page ---------- */
export default async function IngredientsIndex({
  searchParams,
}: {
  searchParams: { [k: string]: string | string[] | undefined };
}) {
  const q = (searchParams.q as string | undefined)?.trim() || "";
  let category = (searchParams.category as string | undefined) || ""; // functional category
  let source = (searchParams.source as string | undefined) || ""; // Botanicals | Mushrooms

  // Back-compat: if "category" was used for source previously, normalize it
  if (category && !FUNCTIONAL_CATS.has(category)) {
    if (category === "Botanical") source = "Botanicals";
    else if (category === "Mushroom") source = "Mushrooms";
    else if (category === "Botanicals" || category === "Mushrooms") source = category;
    category = "";
  }

  // UX rule: selecting a functional category clears source filter
  if (category) source = "";

  const verifiedOnly = bool(searchParams.verified as string | undefined);
  const min = num(searchParams.min as string | undefined);
  const max = num(searchParams.max as string | undefined);
  const sort = (searchParams.sort as string | undefined) || "popularity";

  const page = Math.max(parseInt((searchParams.page as string) ?? "1", 10) || 1, 1);
  const limit = Math.min(
    Math.max(parseInt((searchParams.limit as string) ?? "12", 10) || 12, 6),
    48
  );
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  // Server-side Supabase client (public reads)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  /* ---------- sidebar lists ---------- */
  // Functional categories present
  const { data: catsRaw } = await supabase
    .from("ingredient_stats")
    .select("category")
    .not("category", "is", null);

  const categories = Array.from(
    new Set((catsRaw ?? []).map((r: any) => r.category).filter((c: string) => FUNCTIONAL_CATS.has(c)))
  ).sort();

  // Source (for legacy “Botanicals/Mushrooms” section)
  const { data: srcRaw } = await supabase
    .from("ingredient_stats")
    .select("source_type")
    .not("source_type", "is", null);

  const sources = Array.from(new Set((srcRaw ?? []).map((r: any) => r.source_type)))
    .map((s) => (s === "Botanical" ? "Botanicals" : s === "Mushroom" ? "Mushrooms" : s))
    .filter((s) => s === "Botanicals" || s === "Mushrooms")
    .sort();

  /* ---------- main query ---------- */
  let qview = supabase
    .from("ingredient_stats")
    .select(
      "id,name,slug,description,category,source_type,image_url,min_price,has_verified,popularity",
      { count: "exact" }
    );

  if (q) qview = qview.or(`name.ilike.%${q}%,description.ilike.%${q}%`);
  if (category) qview = qview.eq("category", category);
  if (source) {
    const dbSource = source === "Botanicals" ? "Botanical" : source === "Mushrooms" ? "Mushroom" : source;
    qview = qview.eq("source_type", dbSource);
  }
  if (verifiedOnly) qview = qview.eq("has_verified", true);
  if (min !== undefined) qview = qview.gte("min_price", min);
  if (max !== undefined) qview = qview.lte("min_price", max);

  const orderCol = sort === "price" ? "min_price" : sort === "name" ? "name" : "popularity";
  const orderAsc = sort === "price" || sort === "name";

  const { data: rows, count } = await qview
    .order(orderCol, { ascending: orderAsc })
    .range(from, to);

  const total = count ?? 0;
  const pages = Math.max(1, Math.ceil(total / limit));
  const startNumber = total ? from + 1 : 0;
  const endNumber = total ? Math.min(to + 1, total) : 0;

  // Helper to keep params in links
  const keep = (extras: Record<string, string>) => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (category) p.set("category", category);
    if (source) p.set("source", source);
    if (verifiedOnly) p.set("verified", "1");
    if (min !== undefined) p.set("min", String(min));
    if (max !== undefined) p.set("max", String(max));
    if (sort) p.set("sort", sort);
    p.set("limit", String(limit));
    for (const [k, v] of Object.entries(extras)) p.set(k, v);
    return p.toString();
  };

  return (
    <div className="mx-auto max-w-6xl p-6 grid gap-6 md:grid-cols-[220px_1fr]">
      {/* Sidebar */}
      <aside className="space-y-8">
        <div>
          <h2 className="text-sm font-medium text-neutral-500">Categories</h2>
          <ul className="space-y-1 text-sm">
            <li>
              <Link
                className={`underline ${!category ? "font-semibold" : ""}`}
                href={`/ingredients?${keep({ category: "", source: "", page: "1" })}`}
              >
                All
              </Link>
            </li>
            {categories.map((c) => (
              <li key={c}>
                <Link
                  className={`underline ${category === c ? "font-semibold" : ""}`}
                  href={`/ingredients?${keep({ category: c, source: "", page: "1" })}`}
                >
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-medium text-neutral-500">Source</h2>
          <ul className="space-y-1 text-sm">
            <li>
              <Link
                className={`underline ${!source ? "font-semibold" : ""}`}
                href={`/ingredients?${keep({ source: "", category: "", page: "1" })}`}
              >
                All
              </Link>
            </li>
            {sources.map((s) => (
              <li key={s}>
                <Link
                  className={`underline ${source === s ? "font-semibold" : ""}`}
                  href={`/ingredients?${keep({ source: s, category: "", page: "1" })}`}
                >
                  {s}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Main */}
      <section className="space-y-4">
        {/* Sticky filter bar */}
        <section className="sticky top-0 z-10 -mx-6 border-b bg-white/80 px-6 py-3 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <IngredientsFilters
            categories={categories}
            initial={{ q, category, verified: verifiedOnly, min, max, sort }}
          />
        </section>

        {!rows || rows.length === 0 ? (
          <div className="rounded-xl border bg-white p-4 text-neutral-900">
            No ingredients found.
          </div>
        ) : (
          <>
            <p className="text-sm text-neutral-500">
              Showing {startNumber}–{endNumber} of {total} result{total === 1 ? "" : "s"}
            </p>

            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {rows.map((r: any) => (
                <li key={r.id}>
                  <Link
                    href={`/ingredients/${r.slug}`}
                    className="group flex h-full flex-col rounded-2xl border bg-white p-3 text-neutral-900 transition hover:shadow-md block"
                  >
                    {/* Square image area */}
                    <div className="relative aspect-square w-full overflow-hidden rounded-xl ring-1 ring-neutral-200">
                      <TileImage
                        sources={buildImageList({
                          slug: r.slug,
                          dbImage: r.image_url, // from ingredient_stats
                          limit: 3, // keep tiles consistent
                        })}
                        alt={r.name}
                      />
                    </div>

                    {/* Title + pills */}
                    <div className="mt-3 flex flex-1 flex-col">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-base font-medium line-clamp-1 group-hover:underline">
                          {r.name}
                        </h3>
                        <div className="flex gap-2">
                          {r.category && (
                            <span className="inline-block rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] text-neutral-700">
                              {r.category}
                            </span>
                          )}
                          {r.has_verified && (
                            <span className="inline-block rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-medium text-green-700">
                              Lab-certified
                            </span>
                          )}
                        </div>
                      </div>

                      {r.description && (
                        <p className="mt-1 text-sm text-neutral-600 line-clamp-2">
                          {r.description}
                        </p>
                      )}

                      <div className="mt-2 text-sm">
                        {r.min_price !== null ? (
                          <>
                            From{" "}
                            <span className="font-semibold">
                              ${Number(r.min_price).toFixed(2)}
                            </span>{" "}
                            / kg
                          </>
                        ) : (
                          <span className="text-neutral-500">No active listings</span>
                        )}
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>

            <Pager page={page} pages={pages} limit={limit} searchParams={searchParams} />
          </>
        )}
      </section>
    </div>
  );
}

/* ---------- pager ---------- */
function Pager({
  page,
  pages,
  limit,
  searchParams,
}: {
  page: number;
  pages: number;
  limit: number;
  searchParams: { [k: string]: string | string[] | undefined };
}) {
  const base = new URLSearchParams();
  for (const k of ["q", "category", "source", "verified", "min", "max", "sort"]) {
    const v = searchParams[k] as string | undefined;
    if (v) base.set(k, v);
  }
  base.set("limit", String(limit));

  const linkFor = (p: number) => {
    const params = new URLSearchParams(base);
    params.set("page", String(p));
    return `/ingredients?${params.toString()}`;
  };

  const windowSize = 2;
  const start = Math.max(1, page - windowSize);
  const end = Math.min(pages, page + windowSize);

  return (
    <nav className="mt-4 flex items-center justify-center gap-2" aria-label="Pagination">
      <Link
        className={`px-3 py-1 rounded border ${page <= 1 ? "pointer-events-none opacity-50" : ""}`}
        href={page <= 1 ? "#" : linkFor(page - 1)}
      >
        Prev
      </Link>

      {start > 1 && (
        <>
          <Link
            className={`px-3 py-1 rounded border ${page === 1 ? "bg-black text-white" : ""}`}
            href={linkFor(1)}
          >
            1
          </Link>
          {start > 2 && <span className="px-1">…</span>}
        </>
      )}

      {Array.from({ length: end - start + 1 }, (_, i) => start + i).map((p) => (
        <Link
          key={p}
          className={`px-3 py-1 rounded border ${p === page ? "bg-black text-white" : ""}`}
          href={linkFor(p)}
        >
          {p}
        </Link>
      ))}

      {end < pages && (
        <>
          {end < pages - 1 && <span className="px-1">…</span>}
          <Link
            className={`px-3 py-1 rounded border ${page === pages ? "bg-black text-white" : ""}`}
            href={linkFor(pages)}
          >
            {pages}
          </Link>
        </>
      )}

      <Link
        className={`px-3 py-1 rounded border ${page >= pages ? "pointer-events-none opacity-50" : ""}`}
        href={page >= pages ? "#" : linkFor(page + 1)}
      >
        Next
      </Link>
    </nav>
  );
}
