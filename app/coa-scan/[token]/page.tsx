// app/coa-scan/[token]/page.tsx
import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";

export const revalidate = 10; // refresh every 10s while processing

export default async function CoaResultPage({ params }: { params: { token: string } }) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // 1) Find the submission by public token
  const { data: sub, error: subErr } = await supabase
    .from("coa_submissions")
    .select("id, status, trust_score, public_token")
    .eq("public_token", params.token)
    .maybeSingle();

  if (subErr || !sub) return notFound();

  // 2) Load parsed fields + flags for that submission
  const [{ data: parsed }, { data: flags = [] }] = await Promise.all([
    supabase
      .from("coa_parsed")
      .select("ingredient, batch_lot, lab_name, report_date")
      .eq("submission_id", sub.id)
      .maybeSingle(),
    supabase
      .from("coa_flags")
      .select("code, severity, message, details")
      .eq("submission_id", sub.id)
      .order("id", { ascending: true }),
  ]);

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-2">COA Scan Result</h1>
      <div className="mb-6 text-sm text-neutral-600">Token: {params.token}</div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <Stat label="Status" value={sub.status} />
        <Stat label="Trust Score" value={sub.trust_score ?? "—"} />
        <Stat label="Ingredient" value={parsed?.ingredient ?? "—"} />
        <Stat label="Batch/Lot" value={parsed?.batch_lot ?? "—"} />
        <Stat label="Lab" value={parsed?.lab_name ?? "—"} />
        <Stat label="Report Date" value={parsed?.report_date ?? "—"} />
      </div>

      {sub.status !== "done" ? (
        <div className="text-sm text-neutral-600">
          We’re still processing this file. Check back shortly…
        </div>
      ) : (
        <>
          <h2 className="text-lg font-medium mb-2">Flags</h2>
          {flags.length ? (
            <ul className="space-y-2">
              {flags.map((f: any, i: number) => (
                <li key={i} className="rounded-2xl border p-3">
                  <div className="text-sm font-semibold">[{f.severity}] {f.code}</div>
                  <div className="text-sm text-neutral-700">{f.message}</div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-sm text-neutral-600">No flags recorded yet.</div>
          )}
        </>
      )}
    </main>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl border p-3">
      <div className="text-xs text-neutral-500">{label}</div>
      <div className="text-sm font-medium">{String(value)}</div>
    </div>
  );
}
