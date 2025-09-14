// workers/parse-coa.ts
import { createClient } from "@supabase/supabase-js";

type Flag = { code: string; severity: number; message: string; details?: any };

export async function run(submissionId: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!url || !serviceKey) throw new Error("Supabase env missing");

  const admin = createClient(url, serviceKey);

  // 1) Fetch submission -> file_path
  const { data: sub, error: subErr } = await admin
    .from("coa_submissions")
    .select("id, file_path")
    .eq("id", submissionId)
    .single();
  if (subErr || !sub) throw new Error(`submission not found: ${subErr?.message ?? ""}`);

  // 2) Download file from private bucket
  const { data: blob, error: dlErr } = await admin.storage
    .from("coa_uploads")
    .download(sub.file_path);
  if (dlErr || !blob) throw new Error(`download failed: ${dlErr?.message ?? ""}`);

  // 3) Parse PDF to text
  const pdf = (await import("pdf-parse")).default as (b: Buffer) => Promise<{ text: string }>;
  const buf = Buffer.from(await blob.arrayBuffer());

  let text = "";
  try {
    const res = await pdf(buf);
    text = res?.text ?? "";
  } catch {
    /* leave text empty; rules will flag missing fields */
  }

  // 4) Extract fields + rules + score
  const fields = parseFields(text);
  const flags: Flag[] = rules(fields);
  const score = scoreFlags(flags);

  // 5) Persist results
  await admin.from("coa_parsed").upsert({ submission_id: submissionId, ...fields });
  await admin.from("coa_flags").delete().eq("submission_id", submissionId);
  if (flags.length) {
    await admin.from("coa_flags").insert(flags.map(f => ({ submission_id: submissionId, ...f })));
  }
  await admin
    .from("coa_submissions")
    .update({ status: "done", trust_score: score, completed_at: new Date().toISOString() })
    .eq("id", submissionId);
}

/* ---------- helpers ---------- */
function parseFields(text: string) {
  const m = (re: RegExp, g = 1) => text.match(re)?.[g]?.trim() ?? null;
  return {
    ingredient:  m(/Ingredient\s*:\s*(.+)/i),
    batch_lot:   m(/(?:Batch|Lot)\s*#?\s*:\s*([A-Z0-9\-]+)/i, 1),
    lab_name:    m(/Laboratory\s*:\s*(.+)/i) ?? m(/Lab Name\s*:\s*(.+)/i),
    report_date: m(/(?:Report|Issued)\s*Date\s*:\s*(\d{4}[/-]\d{1,2}[/-]\d{1,2}|\d{1,2}[/-]\d{1,2}[/-]\d{2,4})/i),
  };
}

function rules(fields: any): Flag[] {
  const out: Flag[] = [];
  if (!fields.batch_lot)   out.push({ code: "BATCH_MISSING",      severity: 3, message: "Batch/Lot number not found" });
  if (!fields.report_date) out.push({ code: "REPORT_DATE_MISSING", severity: 2, message: "Report date not found" });
  if (!fields.lab_name)    out.push({ code: "LAB_MISSING",         severity: 2, message: "Lab name not found" });
  return out;
}

function scoreFlags(flags: Flag[]) {
  let score = 100;
  for (const f of flags) score -= f.severity * 5;
  return Math.max(0, score);
}
