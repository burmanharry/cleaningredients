"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Props = {
  // read initial values from the URL
  initial: {
    q?: string;
    category?: string;
    verified?: string; // "1" or ""
    min?: string;
    max?: string;
    sort?: string;
  };
};

export default function IngredientsFilters({ initial }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const [q, setQ] = React.useState(initial.q ?? "");
  const [category, setCategory] = React.useState(initial.category ?? "");
  const [verified, setVerified] = React.useState(initial.verified === "1");
  const [min, setMin] = React.useState(initial.min ?? "");
  const [max, setMax] = React.useState(initial.max ?? "");
  const [sort, setSort] = React.useState(initial.sort ?? "popularity");

  const apply = (e?: React.FormEvent) => {
    e?.preventDefault();
    const params = new URLSearchParams(sp?.toString() ?? "");

    // set / clear params
    setParam(params, "q", q);
    setParam(params, "category", category);
    setParam(params, "verified", verified ? "1" : "");
    setParam(params, "min", min);
    setParam(params, "max", max);
    setParam(params, "sort", sort);

    router.push(`${pathname}?${params.toString()}`);
  };

  const clear = () => {
    router.push(pathname); // wipe all query params
  };

  return (
    <form
      onSubmit={apply}
      className="rounded-2xl border border-black/10 bg-white/80 p-4 md:p-5 shadow-sm"
    >
      {/* top row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="flex-1 min-w-[220px]">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            type="search"
            placeholder="Search..."
            className="w-full rounded-2xl px-4 py-2.5 ring-1 ring-black/10 focus:outline-none"
          />
        </div>

        {/* Category */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-2xl px-3 py-2.5 ring-1 ring-black/10 bg-white"
          aria-label="Category"
        >
          <option value="">All category</option>
          <option>Adaptogen</option>
          <option>Antioxidant</option>
          <option>Longevity</option>
          <option>Nootropic</option>
        </select>

        {/* Verified only */}
        <label className="inline-flex items-center gap-2 rounded-2xl px-3 py-2.5 ring-1 ring-black/10 bg-white cursor-pointer">
          <input
            type="checkbox"
            checked={verified}
            onChange={(e) => setVerified(e.target.checked)}
            className="h-4 w-4"
          />
          <span className="text-sm">Verified only</span>
        </label>

        {/* Min / Max */}
        <input
          value={min}
          onChange={(e) => setMin(e.target.value)}
          inputMode="decimal"
          placeholder="Min $"
          className="w-[96px] rounded-2xl px-3 py-2.5 ring-1 ring-black/10 bg-white"
        />
        <input
          value={max}
          onChange={(e) => setMax(e.target.value)}
          inputMode="decimal"
          placeholder="Max $"
          className="w-[96px] rounded-2xl px-3 py-2.5 ring-1 ring-black/10 bg-white"
        />

        {/* Sort (far right) */}
        <div className="ml-auto">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-2xl px-3 py-2.5 ring-1 ring-black/10 bg-white"
            aria-label="Sort"
          >
            <option value="popularity">Sort: Popularity</option>
            <option value="price_asc">Sort: Price (low → high)</option>
            <option value="price_desc">Sort: Price (high → low)</option>
            <option value="name_asc">Sort: Name (A → Z)</option>
          </select>
        </div>
      </div>

      {/* bottom row: Apply / Clear */}
      <div className="mt-3 flex items-center gap-3">
        <button
          type="submit"
          className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/90"
        >
          Apply
        </button>
        <button
          type="button"
          onClick={clear}
          className="rounded-xl border px-4 py-2 text-sm font-medium hover:bg-black/5"
        >
          Clear
        </button>
      </div>
    </form>
  );
}

function setParam(params: URLSearchParams, key: string, value?: string) {
  if (value && value.trim() !== "") params.set(key, value);
  else params.delete(key);
}
