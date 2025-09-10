import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE! // server-only
);

export async function POST(req: Request) {
  try {
    const { ingredientId, quantityKg } = await req.json() as {
      ingredientId: string;
      quantityKg: number; // allow decimals if you want
    };

    if (!ingredientId || !quantityKg || quantityKg <= 0) {
      return NextResponse.json({ error: "Bad input" }, { status: 400 });
    }

    // 1) Get price & details from DB (server-trusted)
    const { data: ing, error } = await supabaseAdmin
      .from("ingredient_stats") // or your source of truth
      .select("id,slug,name,image_url,min_price,supplier_id")
      .eq("id", ingredientId)
      .maybeSingle();

    if (error || !ing) {
      return NextResponse.json({ error: "Ingredient not found" }, { status: 404 });
    }

    // Fallback placeholder if needed (use same value you show in UI)
    const PLACEHOLDER_PRICE = 10; // USD per kg
    const unitPriceDollars = ing.min_price ?? PLACEHOLDER_PRICE;
    const unitPriceCents = Math.round(Number(unitPriceDollars) * 100);

    // 2) Create the order row first
    const { data: order, error: orderErr } = await supabaseAdmin
      .from("orders")
      .insert({
        ingredient_id: ing.id,
        supplier_id: ing.supplier_id ?? null,
        qty_kg: quantityKg,
        unit_price_cents: unitPriceCents,
        currency: "usd",
        status: "init",
      })
      .select("id")
      .single();

    if (orderErr || !order) {
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }

    // Stripe quantity must be an integer; two approaches:
    // A) Only allow integer kg => quantity = quantityKg, unit_amount = per-kg
    // B) Allow decimals => quantity = 1, unit_amount = total cents
    const allowDecimalKg = true;

    const lineItems = allowDecimalKg
      ? [{
          price_data: {
            currency: "usd",
            product_data: {
              name: ing.name,
              images: ing.image_url ? [ing.image_url] : undefined,
            },
            unit_amount: Math.round(unitPriceCents * Number(quantityKg)),
          },
          quantity: 1,
        }]
      : [{
          price_data: {
            currency: "usd",
            product_data: {
              name: ing.name,
              images: ing.image_url ? [ing.image_url] : undefined,
            },
            unit_amount: unitPriceCents,
          },
          quantity: Math.round(Number(quantityKg)),
        }];

    // 3) Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/orders/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/ingredients/${ing.slug}?canceled=1`,
      metadata: {
        order_id: order.id,
        ingredient_id: ing.id,
        supplier_id: ing.supplier_id ?? "",
        qty_kg: String(quantityKg),
        unit_price_cents: String(unitPriceCents),
      },
    });

    // 4) Save session id to order
    await supabaseAdmin
      .from("orders")
      .update({ stripe_session_id: session.id })
      .eq("id", order.id);

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "Server error" }, { status: 500 });
  }
}
