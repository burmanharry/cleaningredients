// app/api/coa/submit/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  const { submissionId } = await req.json();
  if (!submissionId) return NextResponse.json({ error: "submissionId required" }, { status: 400 });

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!    // <-- use service-role
  );

  await admin.from("coa_submissions").update({ status: "processing" }).eq("id", submissionId);

  // ... your stubbed parse + writes ...
  await admin.from("coa_parsed").upsert({ submission_id: submissionId /* ...fields... */ });
  await admin.from("coa_flags").insert([{ submission_id: submissionId, code: "PARSER_PLACEHOLDER", severity: 1, message: "Parsing not wired yet; this is a stub." }]);
  await admin.from("coa_submissions").update({ status: "done", trust_score: 72, completed_at: new Date().toISOString() }).eq("id", submissionId);

  const { data: sub, error } = await admin
    .from("coa_submissions")
    .select("public_token")
    .eq("id", submissionId)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, publicToken: sub!.public_token });
}
