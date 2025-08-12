import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE!;

// Optional: tiny email check
const isEmail = (v: unknown) =>
  typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = body?.email?.trim();
    const source = body?.source ?? "landing";

    if (!isEmail(email)) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

    const { error } = await supabase
      .from("leads")
      .insert({ email, source });

    if (error) {
      // Handle duplicates gracefully if you added the unique index
      if ((error as any).code === "23505") {
        return NextResponse.json({ ok: true, duplicate: true });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Unknown error" }, { status: 500 });
  }
}

