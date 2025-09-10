import { supabaseServer } from "@/lib/supabaseServer";
import Link from "next/link";

export default async function AccountPage() {
  const sb = await supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return <div className="mx-auto max-w-4xl p-6">Please <Link href="/signin" className="underline">sign in</Link>.</div>;

  const { data: profile } = await sb
    .from("profiles")
    .select("role, company_name, country")
    .eq("id", user.id)
    .single();

  const role = (profile?.role ?? "buyer") as "buyer" | "supplier" | "admin";

  return (
    <div className="mx-auto max-w-4xl p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Account</h1>
        <p className="text-sm text-neutral-500">Email: {user.email}</p>
        <p className="text-sm text-neutral-500">Role: {role}</p>
      </div>

      {role === "supplier" || role === "admin" ? (
        <div className="space-y-3">
          <div className="rounded-2xl border bg-white p-4 text-neutral-900">
            <div className="text-sm">Company: {profile?.company_name ?? "—"} · Country: {profile?.country ?? "—"}</div>
          </div>
          <div className="flex gap-3">
            <Link href="/dashboard/listings" className="rounded-xl border px-4 py-2">Manage listings</Link>
            {role === "admin" && (
              <Link href="/dashboard/listings/new" className="rounded-xl bg-black px-4 py-2 text-white">Add listing</Link>
            )}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border bg-white p-4 text-neutral-900">
          <div className="text-sm">
            You’re a buyer. Supplier access is by invitation only.  
            If you’ve been approved, we’ll upgrade your account.
          </div>
        </div>
      )}
    </div>
  );
}
