// app/api/coa/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const url  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    const { filename, type } = await req.json();
    if (!filename) return NextResponse.json({ error: "filename required" }, { status: 400 });

    const supabase = createClient(url, anon);
    const ext = String(filename).split(".").pop() || "bin";
    const key = `raw/${crypto.randomUUID()}.${ext}`;

    // provisional DB row
    const { data: submission, error: subErr } = await supabase
      .from("coa_submissions")
      .insert({ file_path: key, file_mime: type || "application/octet-stream", status: "queued" })
      .select("id, public_token")
      .single();
    if (subErr) return NextResponse.json({ error: `DB insert failed: ${subErr.message}` }, { status: 500 });

    // Build REST upload URL (*** POST ***)
    const encodedKey = key.split("/").map(encodeURIComponent).join("/");
    const uploadUrl  = `${url}/storage/v1/object/coa_uploads/${encodedKey}`;

    return NextResponse.json({
      submissionId: submission!.id,
      publicToken: submission!.public_token,
      uploadUrl,
      uploadHeaders: {
        Authorization: `Bearer ${anon}`,
        apikey: anon,
        "x-upsert": "true",
        "Content-Type": type || "application/octet-stream",
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "unexpected error" }, { status: 500 });
  }
}
