// components/WhatYouGet.tsx
import { ShieldCheck, FlaskConical, CreditCard } from "lucide-react";
import * as React from "react";

type Feature = {
  title: string;
  desc: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const features: readonly Feature[] = [
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
    Icon: FlaskConical, // swap to Beaker if you prefer the look
  },
  {
    title: "Direct Purchase",
    desc:
      "Buy instantly—no back-and-forth with reps. Funds are held in trusted escrow until goods ship as agreed.",
    Icon: CreditCard,
  },
];

export default function WhatYouGet() {
  return (
    <section className="mx-auto max-w-6xl px-6 pt-10 md:pt-14 pb-10 md:pb-14">
      <h2 className="text-3xl font-semibold tracking-tight">What You Get</h2>

      <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
        {features.map((f) => (
          <li
            key={f.title}
            className="flex flex-col items-center text-center rounded-3xl ring-1 ring-neutral-200 bg-white p-8"
          >
            <div className="grid place-items-center h-20 w-20 rounded-2xl ring-1 ring-neutral-200 bg-gradient-to-b from-white to-neutral-50">
              <f.Icon
                className="h-10 w-10 text-neutral-900"
                strokeWidth={2.25}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              />
            </div>

            <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
            <p className="mt-2 text-sm text-neutral-600">{f.desc}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
