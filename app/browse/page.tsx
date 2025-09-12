// app/browse/page.tsx
import { createClient } from "@supabase/supabase-js";
import FiltersPanel from "@/components/IngredientsFilters";
import ResultsToolbar from "@/components/ResultsToolbar";
import IngredientCard from "@/components/IngredientCard";
import Pagination from "@/components/Pagination";

export const revalidate = 300;

// Collapse string | string[] | undefined to a single string
const first = (v: string | string[] | undefined, fallback = "") =>
  (Array.isArray(v) ? v[0] : v) ?? fallback;

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;

  // Raw (possibly string[]) with defaults
  const {
    q = "",
    category = "",
    source = "",
    verified = "",
    min = "",
    max = "",
    sort = "popularity",
    page = "1",
    limit = "12",
  } = sp ?? {};

  // Normalize to plain strings
  const qStr        = first(q, "");
  const categoryStr = first(category, "");
  const sourceStr   = first(source, "");
  const verifiedStr = first(verified, "");
  const minStr      = first(min, "");
  const maxStr      = first(max, "");
  const sortStr     = first(sort, "popularity");
  const pageStr     = first(page, "1");
  const limitStr    = first(limit, "12");

  const pageNum  = Math.max(1, parseInt(pageStr, 10));
  const pageSize = Math.min(48, Math.max(1, parseInt(limitStr, 10)));
  const from = (pageNum - 1) * pageSize;
  const to   = from + pageSize - 1;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // ---- Base query (view aggregates min_price, verified flag, etc.)
  let query = supabase
    .from("ingredient_stats_plus")
    .select(
      "id,slug,name,image_url,category,source_type,min_price,has_verified,description",
      { count: "exact" }
    );

  if (qStr) query = query.ilike("name", `%${qStr}%`);
  if (categoryStr) query = query.eq("category", categoryStr);
  if (sourceStr) query = query.eq("source_type", sourceStr);
  if (verifiedStr === "1") query = query.eq("has_verified", true);
  if (minStr) query = query.gte("min_price", Number(minStr) * 100);
  if (maxStr) query = query.lte("min_price", Number(maxStr) * 100);

  switch (sortStr) {
    case "price_asc":
      query = query.order("min_price", { ascending: true, nullsFirst: false });
      break;
    case "price_desc":
      query = query.order("min_price", { ascending: false, nullsFirst: true });
      break;
    default:
      // "popularity" (fallback to name)
      query = query.order("name", { ascending: true });
  }

  const { data: rows, count, error } = await query.range(from, to);
  if (error) console.error(error);

  // Facets (basic, fast)
  const [{ data: fcats }, { data: fsrcs }] = await Promise.all([
    supabase
      .from("ingredient_stats_plus")
      .select("category")
      .neq("category", "")
      .then((r) => ({ data: [...new Set((r.data ?? []).map((x: any) => x.category))].sort() })),
    supabase
      .from("ingredient_stats_plus")
      .select("source_type")
      .neq("source_type", "")
      .then((r) => ({ data: [...new Set((r.data ?? []).map((x: any) => x.source_type))].sort() })),
  ]);

  const facets = {
    categories: (fcats as string[]) ?? [],
    sources: (fsrcs as string[]) ?? [],
  };

  // Normalized params for components that might rebuild URLs
  const spNorm: Record<string, string> = {
    ...(qStr ? { q: qStr } : {}),
    ...(categoryStr ? { category: categoryStr } : {}),
    ...(sourceStr ? { source: sourceStr } : {}),
    ...(verifiedStr ? { verified: verifiedStr } : {}),
    ...(minStr ? { min: minStr } : {}),
    ...(maxStr ? { max: maxStr } : {}),
    ...(sortStr ? { sort: sortStr } : {}),
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="lg:grid lg:grid-cols-12 lg:gap-8">
        {/* Left: sticky filters */}
        <aside className="lg:col-span-3 mb-6 lg:mb-0">
          <div className="sticky top-24">
            <FiltersPanel
              categories={facets.categories}
              sources={facets.sources}
              active={{ category: categoryStr, source: sourceStr }}
            />
          </div>
        </aside>

        {/* Right: toolbar + grid */}
        <section className="lg:col-span-9">
          <ResultsToolbar
            q={qStr}
            category={categoryStr}
            verified={verifiedStr === "1"}
            min={minStr}
            max={maxStr}
            sort={sortStr}
          />

          {/* Count */}
          <div className="mt-4 text-sm text-neutral-600">
            {count ?? 0} result{(count ?? 0) === 1 ? "" : "s"}
          </div>

          {/* Grid */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(rows ?? []).map((row) => <IngredientCard key={row.id} item={row} />)}

            {/* Skeletons */}
            {(!rows || rows.length === 0) && (
              <>
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-72 rounded-2xl border border-neutral-200 bg-neutral-50 animate-pulse"
                  />
                ))}
              </>
            )}
          </div>

          {/* Pagination */}
          <Pagination
            total={count ?? 0}
            page={pageNum}
            limit={pageSize}
            pathname="/browse"
            searchParams={spNorm}
          />
        </section>
      </div>
    </div>
  );
}
