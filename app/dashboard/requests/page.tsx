import Link from "next/link";
import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabaseServer";

type Row = {
  id: string;
  created_at: string;
  quantity_kg: number | null;
  ship_to: string | null;
  notes: string | null;
  listing: {
    id: string;
    price_per_kg: number | null;
    ingredient: { id: string; name: string; slug: string } | null;
    supplier_id?: string;
  } | null;
};

export default async function RequestsPage() {
  const sb = await supabaseServer();

  // who’s logged in?
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect("/signin");

  // what role?
  const { data: me } = await sb
    .from("profiles")
    .select("role, company_name")
    .eq("id", user.id)
    .single();

  const isSupplier = me?.role === "supplier";

  // fetch rows
  let rows: Row[] = [];

  if (isSupplier) {
    // requests for MY listings
    const { data, error } = await sb
      .from("sample_requests")
      .select(`
        id, created_at, quantity_kg, ship_to, notes,
        listing:listings!inner(
          id, price_per_kg, supplier_id,
          ingredient:ingredients(id, name, slug)
        )
      `)
      .eq("listing.supplier_id", user.id)
      .order("created_at", { ascending: false });
    if (error) throw error;
    rows = (data ?? []) as any;
  } else {
    // requests I submitted
    const { data, error } = await sb
      .from("sample_requests")
      .select(`
        id, created_at, quantity_kg, ship_to, notes,
        listing:listings(
          id, price_per_kg,
          ingredient:ingredients(id, name, slug)
        )
      `)
      .eq("buyer_id", user.id)
      .order("created_at", { ascending: false });
    if (error) throw error;
    rows = (data ?? []) as any;
  }

  return (
    <div className="mx-auto max-w-5xl p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Sample Requests</h1>
        <p className="text-sm text-neutral-500">
          Viewing as <span className="font-medium">{isSupplier ? "Supplier" : "Buyer"}</span>
          {isSupplier && me?.company_name ? ` · ${me.company_name}` : ""}
        </p>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-xl border bg-white p-4 text-neutral-900">No requests yet.</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-white text-neutral-900">
          <table className="min-w-full text-sm">
            <thead className="bg-neutral-100 text-neutral-700">
              <tr>
                <th className="px-3 py-2 text-left">Date</th>
                <th className="px-3 py-2 text-left">Ingredient</th>
                <th className="px-3 py-2 text-left">Qty (kg)</th>
                <th className="px-3 py-2 text-left">Ship to</th>
                <th className="px-3 py-2 text-left">Price/kg</th>
                <th className="px-3 py-2 text-left">Notes</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="px-3 py-2">{new Date(r.created_at).toLocaleString()}</td>
                  <td className="px-3 py-2">
                    {r.listing?.ingredient ? (
                      <Link href={`/ingredients/${r.listing.ingredient.slug}`} className="underline">
                        {r.listing.ingredient.name}
                      </Link>
                    ) : "—"}
                  </td>
                  <td className="px-3 py-2">{r.quantity_kg ?? "—"}</td>
                  <td className="px-3 py-2">{r.ship_to ?? "—"}</td>
                  <td className="px-3 py-2">{r.listing?.price_per_kg ?? "—"}</td>
                  <td className="px-3 py-2">{r.notes ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
