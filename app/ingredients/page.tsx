// app/ingredients/page.tsx
import fs from "fs";
import path from "path";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@supabase/supabase-js";

// Show this when there are no active listings
const PLACEHOLDER_USD_PER_KG = 10;

function priceLabel(row: Row) {
  if (row.min_price != null) {
    return (
      <>
        From <span className="font-semibold">${Number(row.min_price).toFixed(2)}</span>
        <span className="text-neutral-500"> / kg</span>
      </>
    );
  }
  return (
    <>
      From <span className="font-semibold">${PLACEHOLDER_USD_PER_KG.toFixed(2)}</span>
      <span className="text-neutral-500"> / kg (indicative)</span>
    </>
  );
}

/** ---------------- Config / constants ---------------- */

export function IngredientsAlias(props: { params: { slug: string } }) {
  return IngredientPage(props); // optional alias; or remove this function
}

const VIEW = "ingredient_stats_plus"; // change if you switch views/tables

// Keep selected fields in one place
const SELECT_FIELDS =
  "id,name,slug,image_url,min_price,category,source_type,has_verified,description";

const PAGE_SIZE_DEFAULT = 12 as const;

const CATEGORIES = ["Adaptogen", "Antioxidant", "Longevity", "Nootropic"] as const;
const SOURCES = ["Botanicals", "Mushrooms"] as const;

const SORT_OPTIONS = {
  popularity: { label: "Sort: Popularity" }, // fallback to name asc
  name: { label: "Sort: Name" },
  price_asc: { label: "Price: Low → High" },
  price_desc: { label: "Price: High → Low" },
} as const;

type SortKey = keyof typeof SORT_OPTIONS;

type SearchParams = Record<string, string | string[] | undefined>;

type Row = {
  id: number;
  name: string;
  slug: string;
  image_url: string | null;
  min_price: number | null;
  category: string | null;
  source_type: string | null;
  has_verified: boolean | null;
  description?: string | null;
};

/** ---------------- Param helpers ---------------- */

function getFirst(v: string | string[] | undefined): string {
  if (Array.isArray(v)) return v[0] ?? "";
  return v ?? "";
}
function parseString(v: SearchParams[keyof SearchParams]): string {
  return getFirst(v).trim();
}
function parseNumber(v: SearchParams[keyof SearchParams]): number | undefined {
  const s = getFirst(v).trim();
  if (!s) return undefined;
  const n = Number(s);
  return Number.isFinite(n) ? n : undefined;
}
function parseBool(v: SearchParams[keyof SearchParams]): boolean {
  const s = getFirst(v).toLowerCase();
  return s === "1" || s === "true" || s === "on" || s === "yes";
}
function clampPage(n: number | undefined): number {
  const v = Math.max(1, n ?? 1);
  return Number.isFinite(v) ? v : 1;
}
function clampLimit(n: number | undefined): number {
  const v = Math.max(1, n ?? PAGE_SIZE_DEFAULT);
  return Number.isFinite(v) ? v : PAGE_SIZE_DEFAULT;
}

/** ---------------- URL param utilities ---------------- */

function paramsWithout(sp: SearchParams, keys: string[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(sp)) {
    if (keys.includes(k)) continue;
    const first = getFirst(v);
    if (first) out[k] = first;
  }
  return out;
}
function paramsWith(sp: SearchParams, extra: Record<string, string>): Record<string, string> {
  return { ...paramsWithout(sp, []), ...extra };
}

/** Build an href by merging current params and deleting some (like page). */
function buildHref(sp: SearchParams, extra: Record<string, string | null>, drop: string[] = ["page"]) {
  const qs = new URLSearchParams(paramsWithout(sp, drop));
  for (const [k, v] of Object.entries(extra)) {
    if (v == null || v === "") qs.delete(k);
    else qs.set(k, v);
  }
  const s = qs.toString();
  return `/ingredients${s ? `?${s}` : ""}`;
}

/** ---------------- Image resolution (local fallbacks) ---------------- */

const PUBLIC_DIR = path.join(process.cwd(), "public");
function existsPublic(relPath: string): boolean {
  try {
    return fs.existsSync(path.join(PUBLIC_DIR, relPath));
  } catch {
    return false;
  }
}

/**
 * Best image URL for a row:
 *   1) trusted remote `image_url`
 *   2) local /public/images/ingredients/* candidates
 *   3) universal placeholder
 */
function resolveImage(r: Row): string {
  if (r.image_url && r.image_url.trim()) {
    // Ensure next.config.ts images.remotePatterns allows this domain.
    return r.image_url.trim();
  }

  const base = r.slug.trim();
  const candidates = [
    `/images/ingredients/${base}.jpg`,
    `/images/ingredients/${base}.jpeg`,
    `/images/ingredients/${base}.png`,
    `/images/ingredients/${base}-extract.jpg`,
    `/images/ingredients/${base}-1.jpg`,
  ];

  for (const rel of candidates) {
    if (existsPublic(rel)) return rel;
  }

  return `/images/ingredient-fallback.jpg`;
}

/** ---------------- Supabase fetch (server-side) ---------------- */

async function fetchIngredients(opts: {
  q?: string;
  category?: string;
  source?: string;
  verifiedOnly?: boolean;
  min?: number;
  max?: number;
  sort?: SortKey;
  from: number;
  to: number;
}): Promise<{ rows: Row[]; total: number }> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  let q = supabase.from(VIEW).select(SELECT_FIELDS, { count: "exact", head: false });

  // Text search — name OR description
  if (opts.q) {
    const escaped = opts.q.replaceAll(",", " ");
    q = q.or(`name.ilike.%${escaped}%,description.ilike.%${escaped}%`);
  }

  // Filters
  if (opts.category) q = q.eq("category", opts.category);
  if (opts.source) q = q.eq("source_type", opts.source);
  if (opts.verifiedOnly) q = q.eq("has_verified", true);
  if (typeof opts.min === "number") q = q.gte("min_price", opts.min);
  if (typeof opts.max === "number") q = q.lte("min_price", opts.max);

  // Sorting
  switch (opts.sort) {
    case "price_asc":
      q = q.order("min_price", { ascending: true, nullsFirst: true });
      break;
    case "price_desc":
      q = q.order("min_price", { ascending: false, nullsFirst: false });
      break;
    case "name":
      q = q.order("name", { ascending: true });
      break;
    default:
      // popularity not present → stable fallback
      q = q.order("name", { ascending: true });
      break;
  }

  const { data, count, error } = await q.range(opts.from, opts.to);
  if (error) {
    console.error("Supabase ingredients query error:", error);
  }

  const rows = (Array.isArray(data) ? data : []) as Row[];
  const total = typeof count === "number" ? count : rows.length;
  return { rows, total };
}

/** ---------------- Page ---------------- */

export default async function IngredientsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;

  // Parse params from `sp`
  const q = parseString(sp.q);
  const category = parseString(sp.category);
  const source = parseString(sp.source);
  const verifiedOnly = parseBool(sp.verified);
  const min$ = parseNumber(sp.min);
  const max$ = parseNumber(sp.max);
  const sort = (parseString(sp.sort) || "popularity") as SortKey;

  const page = clampPage(parseNumber(sp.page));
  const limit = clampLimit(parseNumber(sp.limit));

  // Fetch
  const { rows, total } = await fetchIngredients({
    q,
    category,
    source,
    verifiedOnly,
    min: min$,
    max: max$,
    sort,
    from,
    to,
  });

  const showFrom = rows.length > 0 ? from + 1 : 0;
  const showTo = from + rows.length;

  return (
    <main className="mx-auto max-w-6xl px-4 pt-6 grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
      {/* ================= LEFT: Sidebar ================= */}
      <aside className="space-y-6 md:pt-1">
        {/* Categories */}
        <div>
          <h3 className="text-lg font-semibold">Categories</h3>
          <ul className="mt-2 space-y-2">
            <li>
              <Link
                href={buildHref(sp, { category: null })}
                className={!category ? "font-semibold underline" : "hover:underline"}
              >
                All
              </Link>
            </li>
            {CATEGORIES.map((c) => (
              <li key={c}>
                <Link
                  href={buildHref(sp, { category: c })}
                  className={category === c ? "font-semibold underline" : "hover:underline"}
                >
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Source */}
        <div>
          <h3 className="text-lg font-semibold">Source</h3>
          <ul className="mt-2 space-y-2">
            <li>
              <Link
                href={buildHref(sp, { source: null })}
                className={!source ? "font-semibold underline" : "hover:underline"}
              >
                All
              </Link>
            </li>
            {SOURCES.map((s) => (
              <li key={s}>
                <Link
                  href={buildHref(sp, { source: s })}
                  className={source === s ? "font-semibold underline" : "hover:underline"}
                >
                  {s}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* ================= RIGHT: Filters + Results ================= */}
      <section>
        {/* Filters bar (black outline), NO Min/Max */}
        <form
          action="/ingredients"
          method="get"
          className="mb-5 rounded-2xl border border-black/30 bg-white/80 p-4 shadow-sm backdrop-blur"
        >
          {/* Preserve source in form when user only searches/sorts, and same for category */}
          {source && <input type="hidden" name="source" value={source} />}
          {category && <input type="hidden" name="category" value={category} />}

          <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(380px,1.7fr)_minmax(220px,1fr)_minmax(220px,1fr)_auto]">
            {/* Search (wider) */}
            <div className="flex">
              <input
                type="search"
                name="q"
                defaultValue={q}
                placeholder="Search..."
                className="w-full rounded-xl border border-black/30 px-4 py-2 placeholder-neutral-400"
              />
            </div>

            {/* Sort */}
            <div className="flex">
              <select
                name="sort"
                defaultValue={sort}
                aria-label="Sort"
                className="w-full rounded-xl border border-black/30 px-3 py-2"
              >
                {Object.entries(SORT_OPTIONS).map(([value, cfg]) => (
                  <option key={value} value={value}>
                    {cfg.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Category (also switchable here) */}
            <div className="flex">
              <select
                name="category"
                defaultValue={category}
                aria-label="Category"
                className="w-full rounded-xl border border-black/30 px-3 py-2"
              >
                <option value="">All category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Verified only */}
            <label className="flex items-center gap-2 rounded-xl border border-black/30 px-3 py-2">
              <input type="checkbox" name="verified" defaultChecked={verifiedOnly} className="h-4 w-4" />
              <span className="text-sm">Verified only</span>
            </label>

            {/* Actions */}
            <div className="col-span-full flex items-center gap-3">
              <button type="submit" className="rounded-xl bg-black px-5 py-2 text-white">
                Apply
              </button>
              <Link href="/ingredients" className="rounded-xl border border-black/30 px-4 py-2">
                Clear
              </Link>
            </div>
          </div>
        </form>

        {/* Thin divider like your screenshot */}
        <div className="border-t border-black/15 mb-4" />

        {/* Results header */}
<p className="mb-3 text-sm text-neutral-600">
  {total === 0 ? "No results" : `Showing ${showFrom}–${showTo} of ${total} results`}
</p>

{/* Results grid */}
<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-10">
  {rows.map((r) => {
    const href = `/ingredients/${encodeURIComponent(r.slug)}`;
    const img = resolveImage(r);

    return (
      <Link
        key={r.id}
        href={href}
        className="group rounded-2xl border border-black/20 bg-white shadow-sm overflow-hidden"
      >
        <div className="relative aspect-[1/1] bg-neutral-100">
          <Image
            src={img}
            alt={r.name}
            fill
            sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
          {r.has_verified ? (
            <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-medium ring-1 ring-black/10">
              Verified
            </span>
          ) : null}
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-medium">{r.name}</h3>
            <span className="shrink-0 rounded-full border border-black/10 bg-neutral-50 px-2 py-0.5 text-xs">
              {r.category || r.source_type || "—"}
            </span>
          </div>

          <div className="mt-1 text-xs text-neutral-500">{r.source_type || "—"}</div>

          <div className="mt-2 text-sm">
            {r.min_price != null ? (
              <>
                From{" "}
                <span className="font-semibold">
                  ${Number(r.min_price).toFixed(2)}
                </span>
                <span className="text-neutral-500"> / kg</span>
              </>
            ) : (
              <>
                From{" "}
                <span className="font-semibold">
                  ${PLACEHOLDER_USD_PER_KG.toFixed(2)}
                </span>
                <span className="text-neutral-500"> / kg (indicative)</span>
              </>
            )}
          </div>
        </div>
      </Link>
    );
  })}
</div>



        {/* Pagination */}
        {total > limit && (
          <div className="mt-8 flex items-center justify-center gap-3">
            {page > 1 && (
              <Link
                href={`/ingredients?${new URLSearchParams({
                  ...paramsWith(sp, { page: String(page - 1) }),
                }).toString()}`}
                className="rounded-xl border border-black/10 px-4 py-2"
              >
                Previous
              </Link>
            )}
            {showTo < total && (
              <Link
                href={`/ingredients?${new URLSearchParams({
                  ...paramsWith(sp, { page: String(page + 1) }),
                }).toString()}`}
                className="rounded-xl border border-black/10 px-4 py-2"
              >
                Next
              </Link>
            )}
          </div>
        )}
      </section>
    </main>
  );
}

// Optional alias target; safe to keep if used elsewhere
async function IngredientPage(_: { params: { slug: string } }) {
  return null;
}
