// app/information/disclaimer/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Disclaimer | CleanIngredients",
  description:
    "Marketplace disclaimer and important notices for buyers and suppliers using CleanIngredients.",
};

export default function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-3xl font-semibold tracking-tight">Disclaimer</h1>
      <p className="mt-2 text-sm text-neutral-500">
        Last updated: {new Date().toLocaleDateString()}
      </p>

      <div className="mt-6 space-y-6 text-neutral-800">
        <p>
          CleanIngredients (“CI”) operates a marketplace platform connecting{" "}
          <strong>buyers</strong> with <strong>suppliers</strong>. Unless noted,
          CI is not the manufacturer or seller of listed products and does not
          independently certify supplier claims.
        </p>

        <section>
          <h2 className="text-xl font-semibold">Supplier-Provided Information</h2>
          <p className="mt-2">
            Product descriptions, specifications, certifications, and COAs are
            provided by suppliers. CI may perform checks for completeness or
            plausibility, but suppliers are solely responsible for the accuracy
            of their listings.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">No Medical, Legal, or Regulatory Advice</h2>
          <p className="mt-2">
            Information on CI is for general informational purposes only and is
            not medical, legal, safety, or regulatory advice. Buyers must
            determine suitability, compliance, labeling, and lawful use for
            their products and markets.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Quality, Testing & Compliance</h2>
          <ul className="mt-2 list-disc pl-5 space-y-2">
            <li>
              Buyers should review COAs, specifications, and applicable standards
              before purchase and upon receipt.
            </li>
            <li>
              Where disputes arise, testing by an{" "}
              <strong>ISO/IEC 17025</strong> accredited lab may be required per
              our{" "}
              <Link href="/information/refund-policy" className="underline">
                Standard Refund Policy
              </Link>
              .
            </li>
            <li>
              Storage, handling, and re-packaging after delivery can affect
              quality; claims may be denied where mishandling is evident.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Payments & Escrow</h2>
          <p className="mt-2">
            Payments made through CI are held in escrow and released to the
            supplier upon carrier pickup confirmation. See{" "}
            <Link href="/information/escrow" className="underline">
              How Escrow Works
            </Link>{" "}
            for details, and the{" "}
            <Link href="/information/refund-policy" className="underline">
              Standard Refund Policy
            </Link>{" "}
            for claims and refunds.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Liability</h2>
          <p className="mt-2">
            To the fullest extent permitted by law, CI disclaims all warranties
            (express or implied) regarding listings and supplier products and is
            not liable for indirect or consequential damages. Nothing herein
            limits liability where not permitted by law.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Contact</h2>
          <p className="mt-2">
            Questions? Email{" "}
            <a href="mailto:support@cleaningredients.co" className="underline">
              support@cleaningredients.co
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
