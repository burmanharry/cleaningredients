import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabaseServer";
import EditListingForm from "@/components/EditListingForm";

export default async function EditListingPage({ params }: { params: { id: string } }) {
  const sb = await supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect("/signin");

  // fetch listing + check access
  const { data: me } = await sb.from("profiles").select("role").eq("id", user.id).single();
  const isAdmin = me?.role === "admin";

  const { data: listing, error } = await sb
    .from("listings")
    .select("id, supplier_id, status, price_per_kg, moq_kg, lead_time_days, origin_country, verified, ingredient:ingredients(id, name)")
    .eq("id", params.id)
    .single();

  if (error || !listing) return <div className="mx-auto max-w-3xl p-6">Listing not found.</div>;
  if (!isAdmin && listing.supplier_id !== user.id) redirect("/dashboard/listings");

  return (
    <div className="mx-auto max-w-3xl p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Edit listing</h1>
      <div className="rounded-2xl border bg-white p-4 text-neutral-900">
        <div className="text-sm">Ingredient: {listing.ingredient?.name ?? "—"}</div>
        <div className="text-xs text-neutral-500 mt-1">
          Note: You can edit price, MOQ, lead time, origin, and status. Verification is controlled by admin.
        </div>
      </div>
      <EditListingForm
        id={listing.id}
        initial={{
          price_per_kg: listing.price_per_kg ?? "",
          moq_kg: listing.moq_kg ?? "",
          lead_time_days: listing.lead_time_days ?? "",
          origin_country: listing.origin_country ?? "",
          status: listing.status as "active" | "inactive",
        }}
      />
    </div>
  );
}
