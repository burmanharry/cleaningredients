// app/information/page.tsx
import type { Metadata } from "next";
import { Suspense } from "react";
import { ARTICLES } from "@/content/articles";
import InformationGrid from "@/components/InformationGrid";

export const metadata: Metadata = {
  title: "Information • CleanIngredients",
  description:
    "Guides on verification, lab testing, compliance, pricing, sourcing, and more.",
};

export default function InformationIndex() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Information</h1>
      <p className="mt-3 text-neutral-700">
        Articles on verification, quality, compliance, pricing, sourcing, formulation, and top botanicals.
      </p>

      {/* 👇 add this */}
      <Suspense fallback={<div className="mt-6">Loading…</div>}>
        <InformationGrid articles={ARTICLES} />
      </Suspense>
    </main>
  );
}
