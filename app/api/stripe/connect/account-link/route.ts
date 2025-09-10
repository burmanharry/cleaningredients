import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { accountId } = await req.json();
  const link = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${process.env.NEXT_PUBLIC_SITE_URL}/onboarding/refresh`,
    return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/onboarding/return`,
    type: "account_onboarding",
  });
  return NextResponse.json({ url: link.url });
}
