// app/faq/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ • CleanIngredients",
  description: "Frequently asked questions about CleanIngredients.",
};

export default function FAQPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">FAQ</h1>
      <p className="mt-2 text-neutral-700">
        Quick answers to common questions. If you don’t see what you need,
        reach out and we’ll help.
      </p>

      <section className="mt-8 space-y-6">
        <details className="rounded-lg border bg-white p-4">
          <summary className="cursor-pointer text-lg font-medium">
            What is CleanIngredients?
          </summary>
          <p className="mt-2 text-neutral-700">
            A directory of food ingredients with specs, pricing, and sourcing info.
          </p>
        </details>

        <details className="rounded-lg border bg-white p-4">
          <summary className="cursor-pointer text-lg font-medium">
            Where do prices come from?
          </summary>
          <p className="mt-2 text-neutral-700">
            Prices are gathered from suppliers and public listings and may be placeholders when marked.
          </p>
        </details>

        <details className="rounded-lg border bg-white p-4">
          <summary className="cursor-pointer text-lg font-medium">
            How often is data updated?
          </summary>
          <p className="mt-2 text-neutral-700">
            On a rolling basis; many pages use ISR so content refreshes automatically.
          </p>
        </details>
      </section>
    </main>
  );
}
