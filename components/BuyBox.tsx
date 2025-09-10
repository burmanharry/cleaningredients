"use client";

import * as React from "react";
import Link from "next/link";

type Props = {
  pricePerKg: number | null | undefined; // shown only in UI
  ingredientId: string | number;
  ingredientName: string;
  isPlaceholder?: boolean;               // disable checkout if we don't have a real price
};

export default function BuyBox({
  pricePerKg,
  ingredientId,
  ingredientName,
  isPlaceholder = false,
}: Props) {
  const [qty, setQty] = React.useState<number>(1);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const onQtyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setQty(Number.isFinite(v) && v >= 1 ? v : 1);
  };

  // 👉 Start Stripe Checkout
  const startCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      // Do NOT send price from the client.
      // Server will fetch the trusted price and build the Checkout Session.
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredientId,           // required by the server
          quantityKg: qty,        // required by the server
        }),
      });

      const data = await res.json();
      if (!res.ok || !data?.url) {
        throw new Error(data?.error || "Failed to start checkout");
      }

      // Redirect the user to Stripe Checkout
      window.location.href = data.url;
    } catch (err: any) {
      setError(err?.message || "Something went wrong starting checkout.");
    } finally {
      setLoading(false);
    }
  };

  const buttonDisabled = pricePerKg == null || isPlaceholder || loading;

  return (
    <div className="rounded-2xl border p-4 space-y-3">
      <div className="text-sm text-neutral-600">From</div>

      <div className="text-3xl font-semibold">
        {pricePerKg != null ? `$${pricePerKg.toFixed(2)} / kg` : "—"}
        {isPlaceholder && (
          <span className="ml-2 text-sm text-neutral-500">(indicative)</span>
        )}
      </div>

      <div className="text-sm text-neutral-600">Shipping calculated at checkout</div>

      {/* Quantity (number, then "kg", then native spinner) + Checkout */}
      <div className="flex items-center gap-2">
        <label htmlFor="qty" className="sr-only">
          Quantity (kg)
        </label>

        <div className="relative">
          <input
            id="qty"
            type="number"
            inputMode="numeric"
            min={1}
            step={1} // change to 0.5 to allow halves
            value={qty}
            onChange={onQtyChange}
            className="w-28 rounded-xl ring-1 ring-neutral-300 px-3 pr-16 py-2 text-base"
          />
          {/* number, then "kg", then spinner */}
          <span
            className="pointer-events-none absolute inset-y-0 right-8 flex items-center text-sm text-neutral-500"
            aria-hidden="true"
          >
            kg
          </span>
        </div>

        <button
          type="button"
          onClick={startCheckout}
          className="inline-flex items-center justify-center rounded-xl bg-black px-5 py-2.5 text-white font-medium hover:bg-black/90 disabled:opacity-50"
          disabled={buttonDisabled}
          title={buttonDisabled ? "Price pending" : undefined}
        >
          {loading ? "Redirecting…" : "Add to cart"}
        </button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <ul className="text-sm text-neutral-700 space-y-1 pt-2">
        <li>• Verified suppliers • U.S. lab-tested</li>
        <li>• Direct purchase, no reps</li>
        <li>
          •{" "}
          <Link href="/information/refund-policy" className="underline">
            Standard Refund Policy
          </Link>
        </li>
        <li>
          •{" "}
          <Link href="/information/escrow" className="underline">
            Secure escrow until goods ship
          </Link>
        </li>
      </ul>
    </div>
  );
}
