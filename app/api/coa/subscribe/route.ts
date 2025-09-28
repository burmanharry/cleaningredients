// app/api/coa/subscribe/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";
// (Optional) ensure this route is always dynamic
// export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { email } = await req.json().catch(() => ({} as any));

  if (!email || !/\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Don’t break builds or local runs if email isn’t configured yet.
    console.warn("[/api/coa/subscribe] RESEND_API_KEY missing; skipping email.");
    return NextResponse.json({ ok: true, skipped: true });
  }

  const resend = new Resend(apiKey);

  try {
    // If you use an audience/list in Resend, set RESEND_AUDIENCE_ID
    const audienceId = process.env.RESEND_AUDIENCE_ID;
    if (audienceId) {
      await resend.contacts.create({ email, audienceId });
    }

    // Optional: send a confirmation email
    const from = process.env.RESEND_FROM || "CleanIngredients <noreply@cleaningredients.co>";
    await resend.emails.send({
      from,
      to: email,
      subject: "Thanks for subscribing",
      text: "You're on the list. We'll share new verification & supplier posts as they go live.",
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("[/api/coa/subscribe] Resend error:", err?.message || err);
    return NextResponse.json({ error: "Email failed" }, { status: 500 });
  }
}
