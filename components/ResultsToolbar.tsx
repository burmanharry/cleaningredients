// components/ResultsToolbar.tsx
"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function ResultsToolbar({
  q,
  category,
  verified,
  min,
  max,
  sort,
}: {
  q: string;
  category: string;
  verified: boolean;
  min: string;
  max: string;
  sort: string;
}) {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  function update(entries: Record<string, string | null>) {
    const next = new URLSearchParams(sp.toString());
    for (const [k, v] of Object.entries(entries)) {
      if (v === null || v === "") next.delete(k);
      else next.set(k, v);
    }
    // Any change resets to page 1
    next.delete("page");
    router.push(`${pathname}?${next.toString()}`);
  }

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* search */}
        <input
          defaultValue={q}
          placeholder="Search..."
          className="md:col-span-5 rounded-xl ring-1 ring-neutral-300 px-3 py-2"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              update({ q: (e.target as HTMLInputElement).value || null });
            }
          }}
        />

        {/* category dropdown (optional mirror) */}
        <select
          value={category || ""}
          className="md:col-span-2 rounded-xl ring-1 ring-neutral-300 px-3 py-2"
          onChange={(e) => update({ category: e.target.value || null })}
        >
          <option value="">All categories</option>
          <option>Adaptogen</option>
          <option>Antioxidant</option>
          <option>Nootropic</option>
          <option>Longevity</option>
        </select>

        {/* verified */}
        <label className="md:col-span-2 inline-flex items-center gap-2 rounded-xl ring-1 ring-neutral-300 px-3 py-2">
          <input
            type="checkbox"
            defaultChecked={verified}
            onChange={(e) => update({ verified: e.target.checked ? "1" : null })}
          />
          Verified only
        </label>

        {/* min / max */}
        <input
          inputMode="numeric"
          placeholder="Min $"
          defaultValue={min}
          className="md:col-span-1 rounded-xl ring-1 ring-neutral-300 px-3 py-2"
          onBlur={(e) => update({ min: e.target.value || null })}
        />
        <input
          inputMode="numeric"
          placeholder="Max $"
          defaultValue={max}
          className="md:col-span-1 rounded-xl ring-1 ring-neutral-300 px-3 py-2"
          onBlur={(e) => update({ max: e.target.value || null })}
        />

        {/* sort */}
        <select
          value={sort || "popularity"}
          className="md:col-span-1 rounded-xl ring-1 ring-neutral-300 px-3 py-2"
          onChange={(e) => update({ sort: e.target.value || "popularity" })}
        >
          <option value="popularity">Sort: Popular</option>
          <option value="price_asc">Price: Low → High</option>
          <option value="price_desc">Price: High → Low</option>
        </select>

        {/* action buttons */}
        <div className="md:col-span-12 flex gap-2">
          <button
            className="rounded-xl bg-black text-white px-4 py-2"
            onClick={() => update({ q, category, min, max, sort, verified: verified ? "1" : null })}
          >
            Apply
          </button>
          <button
            className="rounded-xl border px-4 py-2"
            onClick={() =>
              update({ q: null, category: null, min: null, max: null, sort: "popularity", verified: null })
            }
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
