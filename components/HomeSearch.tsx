"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function HomeSearch() {
  const router = useRouter();
  const [q, setQ] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const term = q.trim();
    if (!term) return;
    router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  return (
    <section className="relative isolate overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 -z-10">
        {/* Update the src to your actual image path if different */}
        <Image
          src="/images/hero.jpg"
          alt="Bowls of functional ingredients"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28 md:py-32">
        <h1 className="max-w-4xl text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight drop-shadow">
          The Trusted Marketplace
          <br className="hidden md:block" />
          <span className="block">for Functional Ingredients</span>
        </h1>

        {/* Search */}
        <form onSubmit={onSubmit} className="mt-8">
          <div className="flex w-full max-w-3xl items-center gap-3 rounded-2xl bg-white/95 p-2 shadow-lg ring-1 ring-black/10 backdrop-blur">
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="e.g. ashwagandha"
              className="flex-1 rounded-xl px-4 py-4 text-lg text-neutral-900 placeholder:text-neutral-400 outline-none"
            />
            <button
              type="submit"
              className="shrink-0 rounded-xl bg-black px-6 py-4 text-lg font-semibold text-white hover:bg-black/90"
            >
              Search
            </button>
          </div>
        </form>

        {/* Popular pills */}
        <div className="mt-4 flex items-center gap-3 text-white/90">
          <span className="text-sm/6">Popular:</span>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Ashwagandha", q: "ashwagandha" },
              { label: "Berberine", q: "berberine" },
              { label: "Curcumin", q: "curcumin" },
            ].map((p) => (
              <Link
                key={p.q}
                href={`/search?q=${encodeURIComponent(p.q)}`}
                className="rounded-full bg-white/90 px-3 py-1.5 text-sm font-medium text-neutral-900 hover:bg-white"
              >
                {p.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
