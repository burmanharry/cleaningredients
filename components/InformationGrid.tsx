// components/InformationGrid.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

type Article = { slug: string; title: string; tag: string; category: string };

export default function InformationGrid({ articles }: { articles: Article[] }) {
  const router = useRouter();
  const sp = useSearchParams();

  // unique options
  const categories = useMemo(
    () => Array.from(new Set(articles.map(a => a.category))).sort(),
    [articles]
  );
  const tags = useMemo(
    () => Array.from(new Set(articles.map(a => a.tag))).sort(),
    [articles]
  );

  // state (hydrate from URL if present)
  const [q, setQ] = useState(sp.get("q") ?? "");
  const [cat, setCat] = useState(sp.get("cat") ?? "");
  const [tag, setTag] = useState(sp.get("tag") ?? "");

  // keep URL in sync (shareable filters)
  useEffect(() => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (cat) params.set("cat", cat);
    if (tag) params.set("tag", tag);
    const qs = params.toString();
    router.replace(qs ? `/information?${qs}` : "/information");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, cat, tag]);

  const filtered = useMemo(() => {
    const qLower = q.trim().toLowerCase();
    return articles.filter(a => {
      const matchesQ = !qLower || a.title.toLowerCase().includes(qLower);
      const matchesCat = !cat || a.category === cat;
      const matchesTag = !tag || a.tag === tag;
      return matchesQ && matchesCat && matchesTag;
    });
  }, [articles, q, cat, tag]);

  const clearFilters = () => {
    setQ(""); setCat(""); setTag("");
  };

  return (
    <section className="mt-6">
      {/* Filter bar */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-4">
        <div className="grid gap-3 md:grid-cols-3">
          <div>
            <label className="block text-xs font-medium text-neutral-600 mb-1">Search</label>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search articles…"
              className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-300"
              type="search"
              autoComplete="off"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-600 mb-1">Category</label>
            <select
              value={cat}
              onChange={(e) => setCat(e.target.value)}
              className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm bg-white"
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-600 mb-1">Tag</label>
            <select
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm bg-white"
            >
              <option value="">All tags</option>
              {tags.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between text-sm">
          <div className="text-neutral-600">
            Showing <span className="font-medium text-neutral-900">{filtered.length}</span> of{" "}
            <span className="font-medium text-neutral-900">{articles.length}</span>
          </div>
          <button
            onClick={clearFilters}
            className="rounded-lg px-3 py-1.5 ring-1 ring-neutral-300 hover:bg-neutral-50"
          >
            Clear filters
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((a) => (
          <Link
            key={a.slug}
            href={`/information/${a.slug}`}
            className="group rounded-2xl border border-neutral-200 bg-white p-5 transition hover:shadow-md"
          >
            <h3 className="text-lg font-semibold leading-6">{a.title}</h3>
            <div className="mt-3">
              <span className="inline-flex items-center rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-xs font-medium text-neutral-700">
                {a.tag}
              </span>
              <span className="ml-2 align-middle text-xs text-neutral-500">{a.category}</span>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-8 text-center text-sm text-neutral-500">No articles match your filters.</p>
      )}
    </section>
  );
}
