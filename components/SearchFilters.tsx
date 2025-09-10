// components/SearchFilters.tsx
"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SearchFilters({ initial }: { initial: Record<string, string> }) {
  const router = useRouter();
  const sp = useSearchParams();

  const [q, setQ] = useState(initial.q ?? "");
  const [verified, setVerified] = useState(!!initial.verified);
  const [origin, setOrigin] = useState(initial.origin ?? "");
  const [min, setMin] = useState(initial.min ?? "");
  const [max, setMax] = useState(initial.max ?? "");
  const [lead, setLead] = useState(initial.lead ?? "");

  useEffect(() => {
    setQ(sp.get("q") ?? "");
    setVerified(!!sp.get("verified"));
    setOrigin(sp.get("origin") ?? "");
    setMin(sp.get("min") ?? "");
    setMax(sp.get("max") ?? "");
    setLead(sp.get("lead") ?? "");
  }, [sp]);

  function apply(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (verified) params.set("verified", "1");
    if (origin.trim()) params.set("origin", origin.trim().toUpperCase());
    if (min.trim()) params.set("min", min.trim());
    if (max.trim()) params.set("max", max.trim());
    if (lead.trim()) params.set("lead", lead.trim());
    router.push(`/search?${params.toString()}`);
  }

  function clearAll() {
    router.push("/search");
  }

  return (
    <form onSubmit={apply} className="rounded-2xl border bg-white p-4 text-sm text-neutral-900 space-y-3">
      <div className="grid gap-3 md:grid-cols-6">
        <input className="rounded-xl border px-3 py-2 md:col-span-2"
               placeholder="Search…" value={q} onChange={(e)=>setQ(e.target.value)} />
        <input className="rounded-xl border px-3 py-2"
               placeholder="Origin (e.g., IN, CN, US)" value={origin} onChange={(e)=>setOrigin(e.target.value)} />
        <input className="rounded-xl border px-3 py-2" type="number" step="0.01"
               placeholder="Min $" value={min} onChange={(e)=>setMin(e.target.value)} />
        <input className="rounded-xl border px-3 py-2" type="number" step="0.01"
               placeholder="Max $" value={max} onChange={(e)=>setMax(e.target.value)} />
        <input className="rounded-xl border px-3 py-2" type="number"
               placeholder="Max lead (days)" value={lead} onChange={(e)=>setLead(e.target.value)} />
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={verified} onChange={(e)=>setVerified(e.target.checked)} />
          Verified only
        </label>
      </div>
      <div className="flex gap-2">
        <button className="rounded-xl bg-black px-4 py-2 text-white" type="submit">Apply</button>
        <button className="rounded-xl border px-4 py-2" type="button" onClick={clearAll}>Clear</button>
      </div>
    </form>
  );
}
