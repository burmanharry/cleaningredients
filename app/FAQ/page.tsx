// app/FAQ/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ • CleanIngredients",
  description: "Answers about verification, lab testing, pricing, and how buying works.",
};

const faqs = [
  {
    q: "How do you verify suppliers?",
    a: "We review certificates (cGMP/ISO), facility history, dispute rates, and sample COAs before any listing goes live. Vendors are re-reviewed periodically and after any quality incident.",
  },
  {
    q: "What lab tests do you require?",
    a: "At minimum: potency/identity (HPLC/UV/FTIR as appropriate), heavy metals (Pb/Cd/Hg/As; ICP-MS/ICP-OES), microbials (TPC, yeast/mold, E. coli, Salmonella). Depending on the ingredient and region: residual solvents, pesticides, PAHs, ETO/irradiation status.",
  },
  {
    q: "How does payment & escrow work?",
    a: "Buyers pay into escrow at checkout. Funds are released to the supplier only after goods ship according to the agreed spec and INCOTERMS. If there’s a dispute, we mediate and require documentation (COA, BOL, photos).",
  },
  {
    q: "Can I request samples?",
    a: "Yes. Many listings offer paid or free samples. Sample size, cost, and lead time are shown on the product page, or you can request them in the quote form.",
  },
  {
    q: "What certifications do you support?",
    a: "USDA Organic, Non-GMO, Vegan, Kosher/Halal, cGMP/ISO. Certifications vary by supplier; we display uploaded certificates and verify validity dates.",
  },
  {
    q: "How are prices determined?",
    a: "Prices are set by each supplier. We surface tiered pricing (by kg), MOQ, and lead time; you can negotiate via the quote request if you have a larger volume or specific spec.",
  },
];

export default function FAQPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Frequently Asked Questions</h1>

      <div className="mt-8 space-y-4">
        {faqs.map(({ q, a }) => (
          <details
            key={q}
            className="group rounded-2xl border border-black/10 bg-white p-5 open:shadow-sm"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
              <span className="text-base md:text-lg font-medium">{q}</span>
              <span className="shrink-0 rounded-full border border-black/10 w-6 h-6 grid place-items-center text-sm transition group-open:rotate-45">
                +
              </span>
            </summary>
            <div className="mt-3 text-neutral-700 leading-7 text-[15px]">{a}</div>
          </details>
        ))}
      </div>

      {/* Helpful CTA */}
      <div className="mt-12 rounded-2xl border border-black/10 p-6">
        <p className="text-sm text-neutral-600">Still have questions?</p>
        <div className="mt-2 flex flex-wrap gap-3">
          <a href="/contact" className="inline-flex items-center rounded-xl bg-black px-4 py-2 text-white text-sm font-medium hover:bg-black/90">
            Contact us
          </a>
          <a href="/ingredients" className="inline-flex items-center rounded-xl ring-1 ring-neutral-300 px-4 py-2 text-sm font-medium hover:bg-neutral-50">
            Browse ingredients
          </a>
          <a href="/requests/new" className="inline-flex items-center rounded-xl ring-1 ring-neutral-300 px-4 py-2 text-sm font-medium hover:bg-neutral-50">
            Request a quote
          </a>
        </div>
      </div>

      {/* SEO: FAQPage structured data */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map(({ q, a }) => ({
              "@type": "Question",
              name: q,
              acceptedAnswer: { "@type": "Answer", text: a },
            })),
          }),
        }}
      />
    </main>
  );
}
