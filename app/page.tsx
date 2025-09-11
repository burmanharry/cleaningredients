// app/page.tsx
import Image from "next/image";
import Link from "next/link";
import HowItWorks from "@/components/HowItWorks";
import WhatYouGet from "@/components/WhatYouGet";
import { Microscope, ShieldCheck, FlaskConical } from "lucide-react";

// helper to build the /ingredients URL with the correct category
function catHref(label: "Antioxidant" | "Adaptogen" | "Nootropic" | "Longevity") {
  const qs = new URLSearchParams({
    sort: "popularity",
    limit: "12",
    category: label, // your /ingredients page expects the display label
    source: "",
    page: "1",
  });
  return `/ingredients?${qs.toString()}`;
}

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* ================= Hero ================= */}
      <section className="relative isolate">
        <div className="relative h-[70vh] md:h-[75vh] overflow-hidden">
          <Image
            src="/images/hero.jpg"
            alt="CleanIngredients hero"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />

          <div className="absolute inset-x-0 top-[20vh] md:top-[22vh]">
            <div className="mx-auto max-w-6xl px-6 relative z-10">
              <h1 className="text-5xl md:text-6xl leading-[1.05] text-white font-semibold">
                <span className="block">The Trusted Marketplace</span>
                <span className="block">for Functional Ingredients</span>
              </h1>

              {/* SEARCH */}
              <form action="/search" method="GET" className="mt-6 w-full max-w-2xl">
                <label htmlFor="q" className="sr-only">
                  Search ingredients
                </label>
                <div className="flex items-center gap-2 rounded-2xl bg-white/95 backdrop-blur px-3 py-2 ring-1 ring-black/10 shadow">
                  <input
                    id="q"
                    name="q"
                    type="search"
                    placeholder="e.g. ashwagandha"
                    autoComplete="off"
                    enterKeyHint="search"
                    className="w-full bg-transparent placeholder-black/60 focus:outline-none text-base md:text-lg"
                  />
                  <button className="px-4 py-2 rounded-xl bg-black text-white font-medium">
                    Search
                  </button>
                </div>

                {/* Quick picks */}
                <div className="mt-3 text-white/80 text-sm">
                  Popular:
                  <span className="ml-2 space-x-2">
                    <a
                      href="/search?q=Ashwagandha"
                      className="inline-block rounded-full bg-white/90 text-gray-900 px-3 py-1 ring-1 ring-black/10 hover:bg-white"
                    >
                      Ashwagandha
                    </a>
                    <a
                      href="/search?q=Berberine"
                      className="inline-block rounded-full bg-white/90 text-gray-900 px-3 py-1 ring-1 ring-black/10 hover:bg-white"
                    >
                      Berberine
                    </a>
                    <a
                      href="/search?q=Curcumin"
                      className="inline-block rounded-full bg-white/90 text-gray-900 px-3 py-1 ring-1 ring-black/10 hover:bg-white"
                    >
                      Curcumin
                    </a>
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <WhatYouGet />

      {/* ================= Best Sellers ================= */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Best Sellers
          </h2>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: "Ashwagandha",
                image: "/images/ingredients/ashwagandha-extract.jpg",
                href: "/ingredients/ashwagandha-extract",
              },
              {
                name: "Berberine",
                image: "/images/ingredients/berberine.jpg",
                href: "/ingredients/berberine",
              },
              {
                name: "Curcumin",
                image: "/images/ingredients/curcumin.jpg",
                href: "/ingredients/curcumin",
              },
              {
                name: "Lion's Mane",
                image: "/images/ingredients/lions-mane.jpg",
                href: "/ingredients/lions-mane",
              },
            ].map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="group block overflow-hidden rounded-2xl border border-black/10 bg-white hover:shadow-md transition"
                aria-label={`Browse ${item.name} suppliers`}
              >
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw"
                    className="object-contain p-0 transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                </div>
                <div className="p-4">
                  <div className="font-medium">{item.name}</div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    Verified suppliers • U.S. lab-tested
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ================= How It Works ================= */}
      <HowItWorks />

      {/* ================= Categories ================= */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900 mb-8">
          Categories
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: "Antioxidants", img: "antioxidants", label: "Antioxidant" },
            { name: "Adaptogens",  img: "adaptogens",  label: "Adaptogen"  },
            { name: "Nootropics",  img: "nootropics",  label: "Nootropic"  },
            { name: "Longevity",   img: "longevity",   label: "Longevity"  },
          ].map((cat) => (
            <Link
              key={cat.name}
              href={catHref(cat.label)}
              className="relative group rounded-2xl overflow-hidden shadow-md block"
              prefetch
              aria-label={`Browse ${cat.name}`}
            >
              <Image
                src={`/images/${cat.img}.jpg`}
                alt={cat.name}
                width={600}
                height={600}
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <h3
                className="absolute bottom-28 left-1/2 -translate-x-1/2 text-4xl font-semibold text-white"
                style={{ textShadow: "0 2px 6px rgba(0,0,0,0.6)" }}
              >
                {cat.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* ================= What We Test For ================= */}
      <section className="bg-neutral-50">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-center text-neutral-900">
            What We Test For
          </h2>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Card */}
            <article className="group relative flex flex-col items-center rounded-2xl border border-neutral-200 bg-white/80 p-8 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg text-center">
              <div className="mb-4 inline-flex items-center justify-center rounded-2xl border border-neutral-200 bg-white p-3">
                <Microscope className="h-12 w-12 text-neutral-800" aria-hidden />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900">Heavy Metals</h3>
              <p className="mt-1 text-sm font-medium text-neutral-500">(Cd, As, Hg, Pb)</p>
              <p className="mt-4 text-[15px] leading-7 text-neutral-700">
                Every lot is screened using ICP-MS/ICP-OES per USP &lt;232&gt;/&lt;233&gt; (or equivalent).
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {["Cd", "As", "Hg", "Pb"].map((m) => (
                  <span
                    key={m}
                    className="inline-flex items-center rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-xs font-medium text-neutral-700"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </article>

            <article className="group relative flex flex-col items-center rounded-2xl border border-neutral-200 bg-white/80 p-8 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg text-center">
              <div className="mb-4 inline-flex items-center justify-center rounded-2xl border border-neutral-200 bg-white p-3">
                <ShieldCheck className="h-12 w-12 text-neutral-800" aria-hidden />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900">Purity</h3>
              <p className="mt-1 text-sm font-medium text-neutral-500">(Identity &amp; Safety)</p>
              <p className="mt-4 text-[15px] leading-7 text-neutral-700">
                Identity confirmed (HPLC/UV/FTIR). Safety panel includes microbials, residual solvents,
                pesticides, and PAHs/ETO as required.
              </p>
            </article>

            <article className="group relative flex flex-col items-center rounded-2xl border border-neutral-200 bg-white/80 p-8 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg text-center">
              <div className="mb-4 inline-flex items-center justify-center rounded-2xl border border-neutral-200 bg-white p-3">
                <FlaskConical className="h-12 w-12 text-neutral-800" aria-hidden />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900">Potency</h3>
              <p className="mt-1 text-sm font-medium text-neutral-500">(Active Compounds)</p>
              <p className="mt-4 text-[15px] leading-7 text-neutral-700">
                Actives quantified by validated methods (e.g., HPLC for withanolides/curcuminoids; GC/UV where applicable).
              </p>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
