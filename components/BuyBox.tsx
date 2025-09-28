"use client";

import * as React from "react";
import Link from "next/link";

type PriceRow = {
  stripe_price_id: string;
  pack_size_g: number;             // e.g. 1000 for 1 kg
  unit_price_cents: number | null; // what you charge per pack
};

type Props = {
  /** keep your existing props for now (used for display if prices absent) */
  pricePerKg: number | null | undefined;
  ingredientId: string | number;
  ingredientName: string;
  isPlaceholder?: boolean;

  /** NEW: real Stripe prices for this product */
  prices?: PriceRow[];
};

export default function BuyBox({
  pricePerKg,
  ingredientId,
  ingredientName,
  isPlaceholder = false,
  prices = [],
}: Props) {
  const hasRealPrices = prices.length > 0;

  const [qty, setQty] = React.useState<number>(1);
  const [priceId, setPriceId] = React.useState<string>(
    hasRealPrices ? prices[0].stripe_price_id : ""
  );

  const onQtyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setQty(Number.isFinite(v) && v >= 1 ? v : 1);
  };

async function goToCheckout() {
  if (!hasRealPrices || !priceId) return;

  const res = await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items: [{ price: priceId, quantity: qty }] }),
  });

  if (!res.ok) {
    // bubble up the exact message from the API
    const bodyText = await res.text();
    alert(`Failed to start checkout:\n${bodyText}`);
    return;
  }

  const { url } = await res.json();
  window.location.href = url;
}

  const selected = prices.find(p => p.stripe_price_id === priceId);
  const selectedLabel = selected
    ? `${(selected.pack_size_g / 1000).toFixed(0)} kg — $${selected.unit_price_cents ? (selected.unit_price_cents / 100).toFixed(2) : "—"}`
    : null;

  const disabled = !hasRealPrices;

  return (
    <div className="rounded-2xl border p-4 space-y-3">
      <div className="text-sm text-neutral-600">From</div>

      {/* If you have real prices, show the first pack price; else fall back to /kg */}
      <div className="text-3xl font-semibold">
        {hasRealPrices
          ? (prices[0].unit_price_cents != null
              ? `$${(prices[0].unit_price_cents / 100).toFixed(2)}`
              : "—")
          : (pricePerKg != null ? `$${pricePerKg.toFixed(2)} / kg` : "—")}
        {!hasRealPrices && isPlaceholder && (
          <span className="ml-2 text-sm text-neutral-500">(indicative)</span>
        )}
      </div>

      <div className="text-sm text-neutral-600">Shipping calculated at checkout</div>

      {/* Pack size selector only if we have real Stripe prices */}
      {hasRealPrices && (
        <div className="space-y-2">
          <label className="block text-sm font-medium">Pack size</label>
          <select
            className="w-full rounded-xl ring-1 ring-neutral-300 px-3 py-2"
            value={priceId}
            onChange={(e) => setPriceId(e.target.value)}
          >
            {prices.map(p => (
              <option key={p.stripe_price_id} value={p.stripe_price_id}>
                {(p.pack_size_g / 1000).toFixed(0)} kg — $
                {p.unit_price_cents ? (p.unit_price_cents / 100).toFixed(2) : "—"}
              </option>
            ))}
          </select>
          {selectedLabel && (
            <div className="text-sm text-neutral-600">Selected: {selectedLabel}</div>
          )}
        </div>
      )}

      <div className="flex items-center gap-2">
        <label htmlFor="qty" className="sr-only">
          Quantity (packs)
        </label>

        <div className="relative">
          <input
            id="qty"
            type="number"
            inputMode="numeric"
            min={1}
            step={1}
            value={qty}
            onChange={onQtyChange}
            className="w-28 rounded-xl ring-1 ring-neutral-300 px-3 py-2 text-base"
          />
        </div>

        <button
          type="button"
          onClick={hasRealPrices ? goToCheckout : undefined}
          className="inline-flex items-center justify-center rounded-xl bg-black px-5 py-2.5 text-white font-medium hover:bg-black/90 disabled:opacity-50"
          disabled={disabled}
          title={disabled ? "Price pending" : undefined}
        >
          {hasRealPrices ? "Add to cart & Pay" : "Add to cart"}
        </button>
      </div>

      <ul className="text-sm text-neutral-700 space-y-1 pt-2">
        <li>• Verified suppliers • U.S. lab-tested</li>
        <li>• Direct purchase, no reps</li>
        {/* Removed escrow since you're stocking inventory */}
        <li>
          • <Link href="/information/refund-policy" className="underline">Standard Refund Policy</Link>
        </li>
        <li>• Ships to U.S. addresses only</li>
      </ul>
    </div>
  );
}
