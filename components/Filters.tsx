"use client";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

type Props = {
  initialSearchParams?: Record<string, string | string[] | undefined>;
};

export default function Filters({ initialSearchParams }: Props) {
  const router = useRouter();
  const sp = useSearchParams();

  const [q, setQ] = React.useState<string>(
    (sp.get("q") || (initialSearchParams?.q as string)) ?? ""
  );
  const [cat, setCat] = React.useState<string>(
    (sp.get("category") || (initialSearchParams?.category as string)) ?? ""
  );
  const [verified, setVerified] = React.useState<boolean>(
    (sp.get("verified") || initialSearchParams?.verified) === "true"
  );
  const [min, setMin] = React.useState<string>(sp.get("min") || "");
  const [max, setMax] = React.useState<string>(sp.get("max") || "");
  const [sort, setSort] = React.useState<string>(sp.get("sort") || "popularity");

  const apply = (e?: React.FormEvent) => {
    e?.preventDefault();
    const params = new URLSearchParams(sp.toString());

    // set & clean
    q ? params.set("q", q) : params.delete("q");
    cat ? params.set("category", cat) : params.delete("category");
    verified ? params.set("verified", "true") : params.delete("verified");
    min ? params.set("min", min) : params.delete("min");
    max ? params.set("max", max) : params.delete("max");
    sort ? params.set("sort", sort) : params.delete("sort");

    // reset to page 1 on new filters
    params.delete("page");

    router.push(`/ingredients?${params.toString()}`);
  };

  const clear = () => {
    const params = new URLSearchParams();
    router.push(`/ingredients?${params.toString()}`);
  };

  return (
    <form
      onSubmit={apply}
      className="flex flex-wrap items-center gap-3"
      aria-label="Filters"
    >
      {/* Search */}
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search..."
        className="h-11 w-full sm:w-[420px] rounded-xl bg-white px-3 ring-1 ring-black/15 focus:outline-none"
      />

      {/* Category */}
      <select
        value={cat}
        onChange={(e) => setCat(e.target.value)}
        className="h-11 rounded-xl bg-white px-3 ring-1 ring-black/15"
      >
        <option value="">All category</option>
        <option value="Adaptogen">Adaptogen</option>
        <option value="Antioxidant">Antioxidant</option>
        <option value="Nootropic">Nootropic</option>
        <option value="Longevity">Longevity</option>
      </select>

      {/* Verified */}
      <label className="inline-flex h-11 items-center gap-2 rounded-xl bg-white px-3 ring-1 ring-black/15">
        <input
          type="checkbox"
          checked={verified}
          onChange={(e) => setVerified(e.target.checked)}
        />
        <span className="text-sm">Verified only</span>
      </label>

      {/* Min / Max */}
      <input
        inputMode="numeric"
        placeholder="Min $"
        value={min}
        onChange={(e) => setMin(e.target.value)}
        className="h-11 w-[110px] rounded-xl bg-white px-3 ring-1 ring-black/15"
      />
      <input
        inputMode="numeric"
        placeholder="Max $"
        value={max}
        onChange={(e) => setMax(e.target.value)}
        className="h-11 w-[110px] rounded-xl bg-white px-3 ring-1 ring-black/15"
      />

      {/* Sort */}
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="h-11 rounded-xl bg-white px-3 ring-1 ring-black/15"
      >
        <option value="popularity">Sort: Popularity</option>
        <option value="price_asc">Sort: Price (low → high)</option>
        <option value="price_desc">Sort: Price (high → low)</option>
        <option value="name_asc">Sort: Name (A → Z)</option>
      </select>

      {/* Buttons */}
      <button
        type="submit"
        className="h-11 rounded-xl bg-black px-5 font-medium text-white"
      >
        Apply
      </button>
      <button
        type="button"
        onClick={clear}
        className="h-11 rounded-xl border px-4 font-medium"
      >
        Clear
      </button>
    </form>
  );
}
