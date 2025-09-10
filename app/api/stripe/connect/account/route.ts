import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { accountId } = await req.json();
  const acct = await stripe.accounts.retrieve(accountId);
  // On the UI, block listings until requirements are past_due = false.
  return NextResponse.json({
    chargesEnabled: acct.charges_enabled,
    payoutsEnabled: acct.payouts_enabled,
    requirements: acct.requirements,
  });
}
