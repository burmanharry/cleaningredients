"use client";

import * as React from "react";
import Link from "next/link";

type Props = {
  pricePerKg: number | null | undefined;
  ingredientId: string | number;
  ingredientName: string;
  isPlaceholder?: boolean;
};

export default function BuyBox({
  pricePerKg,
  ingredientId,
  ingredientName,
  isPlaceholder = false,
}: Props) {
  const [qty, setQty] = React.useState<number>(1);

  const onQtyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setQty(Number.isFinite(v) && v >= 1 ? v : 1);
  };

  const addToCart = async () => {
    // Stub – replace with your real flow (create order + redirect to checkout)
    await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ingredientId,
        ingredientName,
        qtyKg: qty,
        pricePerKg,
      }),
    });
    alert("Added (demo). Wire this to your real checkout next.");
  };

  const disabled = pricePerKg == null || isPlaceholder;

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
            step={1}
            value={qty}
            onChange={onQtyChange}
            className="w-28 rounded-xl ring-1 ring-neutral-300 px-3 pr-16 py-2 text-base"
          />
          {/* number, then 'kg', then native spinner */}
          <span
            className="pointer-events-none absolute inset-y-0 right-8 flex items-center text-sm text-neutral-500"
            aria-hidden
          >
            kg
          </span>
        </div>

        <button
          type="button"
          onClick={addToCart}
          className="inline-flex items-center justify-center rounded-xl bg-black px-5 py-2.5 text-white font-medium hover:bg-black/90 disabled:opacity-50"
          disabled={disabled}
          title={disabled ? "Price pending" : undefined}
        >
          Add to cart
        </button>
      </div>

      <ul className="text-sm text-neutral-700 space-y-1 pt-2">
        <li>• Verified suppliers • U.S. lab-tested</li>
        <li>• Direct purchase, no reps</li>
        <li>
          •{" "}
          <Link href="/information/escrow" className="underline">
            Secure escrow until goods ship
          </Link>
        </li>
        <li>
          •{" "}
          <Link href="/information/refund-policy" className="underline">
            Standard Refund Policy
          </Link>
        </li>
      </ul>
    </div>
  );
}
