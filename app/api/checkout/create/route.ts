import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '');

export async function POST(req: NextRequest) {
  try {
    // 0) Env sanity
    const missing = [
      !process.env.STRIPE_SECRET_KEY && 'STRIPE_SECRET_KEY',
      !process.env.STRIPE_PRICE_ID && 'STRIPE_PRICE_ID',
      !process.env.NEXT_PUBLIC_SITE_URL && 'NEXT_PUBLIC_SITE_URL',
    ].filter(Boolean) as string[];
    if (missing.length) {
      return NextResponse.json({ error: `Missing env: ${missing.join(', ')}` }, { status: 500 });
    }

    // 1) Auth from browser token
    const { access_token } = await req.json();
    if (!access_token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: `Bearer ${access_token}` } } }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Invalid user' }, { status: 401 });

    // Optional: block duplicates
    const { data: m } = await supabase
      .from('memberships')
      .select('is_active')
      .eq('user_id', user.id)
      .single();
    if (m?.is_active) {
      return NextResponse.json({ url: `${process.env.NEXT_PUBLIC_SITE_URL}/account?already=1` });
    }

    // 2) Create Checkout session
    console.log('[checkout] creating for user:', user.id, 'email:', user.email);
    console.log('[checkout] using price:', process.env.STRIPE_PRICE_ID);

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      ui_mode: 'hosted',
      line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
      client_reference_id: user.id,
      customer_email: user.email ?? undefined,
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/account?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/account?canceled=1`,
    });

    console.log('[checkout] session id:', session.id);
    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (e: any) {
    const msg = e?.raw?.message || e?.message || e?.error?.message || 'Checkout create failed';
    console.error('checkout create error:', e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
