import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
// import supabase

export const runtime = "nodejs";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const orderId = params.id;

  // 1) Load the order (must be status=paid, not yet paid_out)
  // const { data: order } = await supabase.from("orders").select("*").eq("id", orderId).maybeSingle();
  const order = {
    // replace with real query
    id: orderId,
    total_cents: 2850,                 // example
    supplier_id: "uuid",
    // fetch supplier.stripe_connect_id:
    supplier_connect_id: "acct_123",
  };

  // 2) Compute transfer amount (platform fee example: 5%)
  const platformFee = Math.round(order.total_cents * 0.05);
  const transferAmount = order.total_cents - platformFee;

  // 3) Create the transfer to supplier
  const transfer = await stripe.transfers.create({
    amount: transferAmount,
    currency: "usd",
    destination: order.supplier_connect_id!,
    metadata: { orderId },
  });

  // 4) Mark the order
  // await supabase.from("orders").update({
  //   status: "paid_out",
  //   stripe_transfer_id: transfer.id
  // }).eq("id", orderId);

  return NextResponse.json({ ok: true, transferId: transfer.id });
}
