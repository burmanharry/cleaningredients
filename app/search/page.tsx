// app/search/page.tsx
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import SearchFilters from "@/components/SearchFilters";

function bool(v?: string | null) { return v === "1" || v === "true"; }
function num(v?: string | null) { const n = Number(v); return Number.isFinite(n) ? n : undefined; }

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const q = (searchParams.q as string | undefined)?.trim() || "";
  const verified = bool(searchParams.verified as string | undefined);
  const origin = (searchParams.origin as string | undefined)?.toUpperCase();
  const min = num(searchParams.min as string | undefined);
  const max = num(searchParams.max as string | undefined);
  const lead = num(searchParams.lead as string | undefined);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // If there's a query, find matching ingredients by name/description (basic full-text).
  let ingredientIds: string[] | undefined;
  if (q) {
    const { data: ingHits } = await supabase
      .from("ingredients")
      .select("id,name,description")
      .or(`name.ilike.%${q}%,description.ilike.%${q}%`);
    ingredientIds = (ingHits ?? []).map((r) => r.id);
    if (ingredientIds.length === 0) ingredientIds = ["00000000-0000-0000-0000-000000000000"]; // force empty
  }

  // Listings query (active only) joined to ingredient
  let query = supabase
    .from("listings")
    .select(`
      id, price_per_kg, moq_kg, lead_time_days, origin_country, verified, status,
      ingredient:ingredients(id, name, slug)
    `)
    .eq("status", "active");

  if (ingredientIds) query = query.in("ingredient_id", ingredientIds);
  if (verified) query = query.eq("verified", true);
  if (origin) query = query.eq("origin_country", origin);
  if (min !== undefined) query = query.gte("price_per_kg", min);
  if (max !== undefined) query = query.lte("price_per_kg", max);
  if (lead !== undefined) query = query.lte("lead_time_days", lead);

  const { data: listings, error } = await query.order("price_per_kg", { ascending: true });

  if (error) {
    return <div className="mx-auto max-w-5xl px-4 py-8">Error: {error.message}</div>;
  }

  const current = new URLSearchParams();
  if (q) current.set("q", q);
  if (verified) current.set("verified", "1");
  if (origin) current.set("origin", origin);
  if (min !== undefined) current.set("min", String(min));
  if (max !== undefined) current.set("max", String(max));
  if (lead !== undefined) current.set("lead", String(lead));

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Search results</h1>
        <p className="text-sm text-neutral-500">
          {q ? <>for “{q}” · </> : null}
          {listings?.length ?? 0} match{(listings?.length ?? 0) === 1 ? "" : "es"}
        </p>
      </div>

      <SearchFilters initial={Object.fromEntries(current.entries())} />

      {(!listings || listings.length === 0) ? (
        <div className="rounded-xl border bg-white p-4 text-neutral-900">No matches yet.</div>
      ) : (
        <ul className="space-y-3">
          {listings.map((l) => (
            <li key={l.id} className="rounded-2xl border bg-white p-4 text-neutral-900">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="min-w-0">
                  <Link
  href={`/ingredients/${l.ingredient?.slug ?? ""}`}
  className="font-medium underline"
>
  {l.ingredient?.name ?? "Unknown ingredient"}
</Link>
                  <div className="mt-1 text-sm text-neutral-600">
                    Origin: {l.origin_country ?? "—"} · Lead: {l.lead_time_days ?? "—"} days · MOQ: {l.moq_kg ?? "—"} kg
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-neutral-500">Price/kg</div>
                  <div className="text-lg font-semibold">${l.price_per_kg ?? "—"}</div>
                  <div className="mt-1 text-xs">{l.verified ? "✅ Verified" : "—"}</div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
