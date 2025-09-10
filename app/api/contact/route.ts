// app/api/contact/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Basic server-side validation
    if (!body.email || !body.message) {
      return NextResponse.json({ error: "Email and message are required." }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      // Prefer a service role key on the server; fallback to anon if you’ve set an insert policy
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const ua = req.headers.get("user-agent") || null;
    const ip =
      (req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "").split(",")[0] || null;

    const { error } = await supabase.from("contact_messages").insert({
      name: body.name || null,
      company: body.company || null,
      email: String(body.email),
      subject: body.subject || null,
      category: body.category || null,
      message: String(body.message),
      user_agent: ua,
      ip,
    });

    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Server error" }, { status: 500 });
  }
}
