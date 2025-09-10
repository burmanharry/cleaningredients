import Link from "next/link";
import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabaseServer";

export default async function ListingsDashboard() {
  const sb = await supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect("/signin");

  const { data: me } = await sb.from("profiles").select("role, company_name").eq("id", user.id).single();
  if (me?.role !== "supplier" && me?.role !== "admin") redirect("/account");

  const isAdmin = me?.role === "admin";

  const { data: rows, error } = await sb
    .from("listings")
    .select("id, status, price_per_kg, moq_kg, lead_time_days, origin_country, verified, ingredient:ingredients(id, name, slug)")
    .eq("supplier_id", isAdmin ? user.id : user.id)   // admins typically manage via other UI; leave as own for now
    .order("created_at", { ascending: false });

  if (error) return <div className="mx-auto max-w-5xl p-6">Error: {error.message}</div>;

  return (
    <div className="mx-auto max-w-5xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Your listings</h1>
        {isAdmin && <Link href="/dashboard/listings/new" className="rounded-xl bg-black px-4 py-2 text-white">Add listing</Link>}
      </div>

      {(!rows || rows.length === 0) ? (
        <div className="rounded-2xl border bg-white p-4 text-neutral-900">No listings yet.</div>
      ) : (
        <ul className="space-y-3">
          {rows.map((l) => (
            <li key={l.id} className="rounded-2xl border bg-white p-4 text-neutral-900">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="font-medium">{l.ingredient?.name ?? "Ingredient"}</div>
                  <div className="text-sm text-neutral-600">
                    ${l.price_per_kg ?? "—"}/kg · MOQ {l.moq_kg ?? "—"}kg · Lead {l.lead_time_days ?? "—"}d · {l.origin_country ?? "—"}
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span>{l.verified ? "✅ Verified" : "—"}</span>
                  <span className="uppercase">{l.status}</span>
                  <Link href={`/dashboard/listings/${l.id}/edit`} className="rounded-xl border px-3 py-1">Edit</Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
