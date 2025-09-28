import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!); // use dashboard default API version
const siteUrl =
  process.env.SITE_URL ||
  process.env.NEXT_PUBLIC_BASE_URL ||
  "http://localhost:3000";

export async function POST(req: NextRequest) {
  try {
    const { items, email } = (await req.json()) as {
      items: { price: string; quantity: number }[];
      email?: string;
    };

    if (!Array.isArray(items) || items.length === 0) {
      return new NextResponse("No items provided", { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email || undefined,
      line_items: items.map((i) => ({ price: i.price, quantity: i.quantity })),
      allow_promotion_codes: true,
      shipping_address_collection: { allowed_countries: ["US"] },
      automatic_tax: { enabled: false },
      success_url: `${siteUrl}/thank-you?sid={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/cart`,
    });

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (e: any) {
    console.error("Checkout error:", e);
    // return the message so you can see what's wrong during dev
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
