// components/IngredientsFilters.tsx
"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type Initial = {
  q: string;
  category: string;
  verified: boolean;
  min?: number | string;
  max?: number | string;
  sort: string;
};

export default function IngredientsFilters({
  categories,
  initial,
}: {
  categories: string[];
  initial: Initial;
}) {
  const router = useRouter();
  const sp = useSearchParams();

  const [q, setQ] = useState(initial.q ?? "");
  const [category, setCategory] = useState(initial.category ?? "");
  const [verified, setVerified] = useState(!!initial.verified);
  const [min, setMin] = useState((initial.min ?? "").toString());
  const [max, setMax] = useState((initial.max ?? "").toString());
  const [sort, setSort] = useState(initial.sort ?? "popularity");

  useEffect(() => {
    setQ(sp.get("q") ?? "");
    setCategory(sp.get("category") ?? "");
    setVerified(!!sp.get("verified"));
    setMin(sp.get("min") ?? "");
    setMax(sp.get("max") ?? "");
    setSort(sp.get("sort") ?? "popularity");
  }, [sp]);

  function apply(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (category) params.set("category", category);
    if (verified) params.set("verified", "1");
    if (min.trim()) params.set("min", min.trim());
    if (max.trim()) params.set("max", max.trim());
    if (sort) params.set("sort", sort);
    router.push(`/ingredients?${params.toString()}`);
  }

  function clearAll() {
    router.push("/ingredients");
  }

  return (
    <form onSubmit={apply} className="rounded-2xl border bg-white p-4 text-sm text-neutral-900 space-y-3">
      <div className="grid gap-3 md:grid-cols-7">
        <input
          className="rounded-xl border px-3 py-2 md:col-span-2"
          placeholder="Search…"
          value={q}
          onChange={(e)=>setQ(e.target.value)}
        />
        <select
          className="rounded-xl border px-3 py-2"
          value={category}
          onChange={(e)=>setCategory(e.target.value)}
        >
          <option value="">All categories</option>
          {categories.map((c)=> <option key={c} value={c}>{c}</option>)}
        </select>
        <label className="inline-flex items-center gap-2 px-2">
          <input type="checkbox" checked={verified} onChange={(e)=>setVerified(e.target.checked)} />
          Verified only
        </label>
        <input className="rounded-xl border px-3 py-2" type="number" step="0.01"
               placeholder="Min $" value={min} onChange={(e)=>setMin(e.target.value)} />
        <input className="rounded-xl border px-3 py-2" type="number" step="0.01"
               placeholder="Max $" value={max} onChange={(e)=>setMax(e.target.value)} />
        <select
          className="rounded-xl border px-3 py-2"
          value={sort}
          onChange={(e)=>setSort(e.target.value)}
        >
          <option value="popularity">Sort: Popularity</option>
          <option value="price">Sort: Price (asc)</option>
          <option value="name">Sort: Name (A–Z)</option>
        </select>
      </div>
      <div className="flex gap-2">
        <button className="rounded-xl bg-black px-4 py-2 text-white" type="submit">Apply</button>
        <button className="rounded-xl border px-4 py-2" type="button" onClick={clearAll}>Clear</button>
      </div>
    </form>
  );
}
