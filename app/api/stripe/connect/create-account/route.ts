import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
// import { createClient } from "@supabase/supabase-js"; // if you want to save here

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { supplierId, email } = await req.json();

  // create or reuse
  const account = await stripe.accounts.create({
    type: "express",
    email,
    capabilities: { transfers: { requested: true } },
    business_type: "company", // or "individual" if that’s your case
    // metadata: { supplierId }
  });

  // save account.id to suppliers.stripe_connect_id in Supabase here, if you want

  const refreshUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/onboarding/refresh`;
  const returnUrl  = `${process.env.NEXT_PUBLIC_SITE_URL}/onboarding/return`;

  const link = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: refreshUrl,
    return_url: returnUrl,
    type: "account_onboarding",
  });

  return NextResponse.json({ accountId: account.id, url: link.url });
}
