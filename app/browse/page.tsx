// app/browse/page.tsx
import { createClient } from "@supabase/supabase-js";
import FiltersPanel from "@/components/IngredientsFilters";
import ResultsToolbar from "@/components/ResultsToolbar";
import IngredientCard from "@/components/IngredientCard";
import Pagination from "@/components/Pagination";

export const revalidate = 300;

type SearchParams = {
  q?: string;
  category?: string;      // display label (e.g., "Adaptogen")
  source?: string;        // "Botanicals" | "Mushrooms" | ""
  verified?: string;      // "1"
  min?: string;           // dollars
  max?: string;           // dollars
  sort?: string;          // "popularity" | "price_asc" | "price_desc"
  page?: string;          // 1-based
  limit?: string;         // default 12
};

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
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
  } = searchParams || {};

  const pageNum = Math.max(1, parseInt(page || "1", 10));
  const pageSize = Math.min(48, Math.max(1, parseInt(limit || "12", 10)));
  const from = (pageNum - 1) * pageSize;
  const to = from + pageSize - 1;

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

  if (q) {
    // simple search on name + description
    query = query.ilike("name", `%${q}%`);
  }
  if (category) query = query.eq("category", category);
  if (source) query = query.eq("source_type", source);
  if (verified === "1") query = query.eq("has_verified", true);
  if (min) query = query.gte("min_price", Number(min) * 100);
  if (max) query = query.lte("min_price", Number(max) * 100);

  switch (sort) {
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
  if (error) {
    console.error(error);
  }

  // Facets (basic, fast): pull distincts for sidebar
  const [{ data: fcats }, { data: fsrcs }] = await Promise.all([
    supabase.from("ingredient_stats_plus").select("category").neq("category", "").then(r => ({ data: [...new Set((r.data ?? []).map(x => x.category))].sort() })),
    supabase.from("ingredient_stats_plus").select("source_type").neq("source_type", "").then(r => ({ data: [...new Set((r.data ?? []).map(x => x.source_type))].sort() })),
  ]);

  const facets = {
    categories: (fcats as string[]) ?? [],
    sources: (fsrcs as string[]) ?? [],
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
              active={{ category, source }}
            />
          </div>
        </aside>

        {/* Right: toolbar + grid */}
        <section className="lg:col-span-9">
          <ResultsToolbar
            q={q}
            category={category}
            verified={verified === "1"}
            min={min}
            max={max}
            sort={sort}
          />

          {/* Count */}
          <div className="mt-4 text-sm text-neutral-600">
            {count ?? 0} result{(count ?? 0) === 1 ? "" : "s"}
          </div>

          {/* Grid */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(rows ?? []).map((row) => (
              <IngredientCard key={row.id} item={row} />
            ))}

            {/* Skeletons (loading state / empty placeholders) */}
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
            searchParams={searchParams}
          />
        </section>
      </div>
    </div>
  );
}
