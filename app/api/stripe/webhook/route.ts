import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
// import supabase to update order row

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.text();
  const sig = headers().get("stripe-signature")!;
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;
    const pi = session.payment_intent as string;

    // Fetch PI to get charge id
    const paymentIntent = await stripe.paymentIntents.retrieve(pi, { expand: ["latest_charge"] });
    const chargeId = typeof paymentIntent.latest_charge === "string"
      ? paymentIntent.latest_charge
      : paymentIntent.latest_charge?.id;

    const orderId = session.metadata?.orderId;

    // TODO: update Supabase order: set paid, save pi & charge
    // await supabase.from("orders").update({
    //   status: "paid",
    //   stripe_payment_intent_id: pi,
    //   stripe_charge_id: chargeId
    // }).eq("id", orderId);

  }

  return NextResponse.json({ received: true });
}
