import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendScanReportEmail } from "@/lib/email";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const { token, email } = await req.json();
    if (!token || !email) return NextResponse.json({ error: "token and email required" }, { status: 400 });
    if (!EMAIL_RE.test(email)) return NextResponse.json({ error: "invalid email" }, { status: 400 });

    // Call token-scoped RPC with anon client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data, error } = await supabase.rpc("claim_submission_email", {
      p_token: token, p_email: email,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    if (!data) return NextResponse.json({ error: "invalid token" }, { status: 404 });

    // fire-and-forget email (await to surface errors during dev)
    await sendScanReportEmail(email, token);

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "unexpected error" }, { status: 500 });
  }
}
