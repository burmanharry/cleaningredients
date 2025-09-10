// components/HomeSearch.tsx
"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type Item = { name: string; slug?: string | null };

/* ----- tiny fuzzy helpers ----- */
function levenshtein(a: string, b: string) {
  a = a.toLowerCase().trim();
  b = b.toLowerCase().trim();
  const m = a.length, n = b.length;
  if (!m) return n;
  if (!n) return m;
  const dp = Array.from({ length: m + 1 }, (_, i) => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,        // delete
        dp[i][j - 1] + 1,        // insert
        dp[i - 1][j - 1] + cost  // replace
      );
    }
  }
  return dp[m][n];
}
function similarity(a: string, b: string) {
  const L = Math.max(a.length, b.length) || 1;
  return 1 - levenshtein(a, b) / L; // 0..1
}

export default function HomeSearch({ items }: { items: Item[] }) {
  const router = useRouter();
  const [q, setQ] = useState("");

  // Build candidates with token keys: full name, slug (spaces), and individual words
  const candidates = useMemo(() => {
    const norm = (s: string) => s.toLowerCase().trim();
    return items.map((it) => {
      const keys = new Set<string>();
      const add = (s?: string | null) => {
        if (!s) return;
        const space = s.replace(/-/g, " ");
        keys.add(norm(space)); // whole phrase
        for (const w of space.split(/\W+/)) if (w) keys.add(norm(w)); // tokens
      };
      add(it.name);
      add(it.slug || undefined);
      return { label: it.name, keys: Array.from(keys) };
    });
  }, [items]);

  function bestMatch(input: string) {
    const raw = input.trim();
    if (!raw) return null;
    const needle = raw.toLowerCase();

    let bestLabel: string | null = null;
    let bestScore = 0;

    for (const c of candidates) {
      // quick substring win
      if (c.keys.some((k) => k.includes(needle))) {
        return c.label;
      }
      // otherwise compute max similarity across keys
      for (const k of c.keys) {
        const s = similarity(needle, k);
        if (s > bestScore) {
          bestScore = s;
          bestLabel = c.label;
        }
      }
    }
    // Slightly lower threshold for longer inputs to catch small typos
    const threshold = needle.length >= 6 ? 0.78 : 0.85;
    return bestScore >= threshold ? bestLabel : null;
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const guess = bestMatch(q);
    const useQ = guess ?? q.trim();
    const params = new URLSearchParams();
    if (useQ) params.set("q", useQ);
    router.push(`/ingredients?${params.toString()}`);
  }

  return (
    <form onSubmit={submit} className="w-full max-w-2xl">
      {/* Light-mode friendly input+button */}
      <div className="flex overflow-hidden rounded-2xl border border-neutral-300 bg-white shadow-sm">
        <input
          aria-label="Search ingredients"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search ingredients (e.g., ashwagandha)…"
          className="flex-1 bg-transparent px-4 py-3 text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
          autoComplete="off"
        />
        <button
          type="submit"
          className="px-5 py-3 bg-black text-white hover:opacity-90"
        >
          Search
        </button>
      </div>
    </form>
  );
}
