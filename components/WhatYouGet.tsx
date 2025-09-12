import { ShieldCheck, FlaskConical, CreditCard } from "lucide-react";

const items = [
  {
    title: "Verified Suppliers",
    desc:
      "Facilities, certifications, and track record reviewed before any listing goes live.",
    Icon: ShieldCheck,
  },
  {
    title: "Real Lab Results",
    desc:
      "Every batch backed by U.S. lab reports—potency, purity, heavy metals, microbials.",
    Icon: FlaskConical,
  },
  {
    title: "Direct Purchase",
    desc:
      "Buy instantly—no back-and-forth with reps. Funds held in trusted escrow until goods ship.",
    Icon: CreditCard,
  },
] as const;

export default function WhatYouGet() {
  return (
    <section className="relative bg-white">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight pt-4 pb-6">
          What You Get
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((it) => (
            <article
              key={it.title}
              className="group rounded-2xl border bg-white/80 p-8 text-center shadow-sm hover:shadow-md transition"
            >
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl ring-1 ring-black/10 bg-gradient-to-b from-white to-neutral-50">
                <it.Icon className="h-9 w-9" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold leading-tight">
                {it.title}
              </h3>
              <p className="mt-1.5 text-sm md:text-base text-neutral-600">
                {it.desc}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

