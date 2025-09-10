// app/information/escrow/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How Escrow Works | CleanIngredients",
  description:
    "CleanIngredients escrow: how funds are held and released, and protections for buyers and suppliers.",
};

export default function EscrowPage() {
  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-3xl font-semibold tracking-tight">How Escrow Works</h1>
      <p className="mt-2 text-sm text-neutral-500">
        Last updated: {new Date().toLocaleDateString()}
      </p>

      <div className="mt-6 space-y-6 text-neutral-800">
        <p>
          We use a simple, fair escrow flow that protects both <strong>buyers</strong> and{" "}
          <strong>suppliers</strong>. Payment is authorized at checkout and held by
          CleanIngredients (“CI”) in escrow. Funds are released to the supplier once the
          shipment is confirmed picked up by the carrier (first scan / pickup confirmation).
        </p>

        <section>
          <h2 className="text-xl font-semibold">When funds are held</h2>
          <ul className="mt-2 list-disc pl-5 space-y-2">
            <li>Buyer pays at checkout; payment is held in CI escrow.</li>
            <li>Supplier prepares the order and applies the shipping label.</li>
            <li>Until pickup is confirmed, the supplier cannot access funds.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">When funds are released</h2>
          <ul className="mt-2 list-disc pl-5 space-y-2">
            <li>
              <strong>Release trigger:</strong> the first carrier event that proves handoff,
              typically “Picked up,” “Accepted,” or the first in-transit scan. CI monitors
              the tracking number provided on the order.
            </li>
            <li>
              For freight or scheduled pickups, the carrier pickup confirmation or BOL scan
              serves as the release trigger.
            </li>
            <li>Partial shipments: funds for each parcel are released upon that parcel’s pickup.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Buyer protections</h2>
          <ul className="mt-2 list-disc pl-5 space-y-2">
            <li>
              If no pickup occurs within the quoted lead time (or within 7 calendar days if
              none is quoted), the buyer may cancel for a full refund.
            </li>
            <li>
              If the shipment is picked up but product later proves non-conforming to the PO/COA,
              the <a href="/information/refund-policy" className="underline">Standard Refund Policy</a> applies
              (replace or full refund; supplier covers return/disposal for confirmed non-conformances).
            </li>
            <li>
              Chargebacks: CI provides carrier and order evidence; refunds are issued per policy
              when warranted.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Supplier protections</h2>
          <ul className="mt-2 list-disc pl-5 space-y-2">
            <li>After pickup, buyer cancellations for convenience are not allowed.</li>
            <li>
              Quality disputes require evidence (COA, photos, and when needed, ISO/IEC 17025 lab
              testing). If results meet spec, funds remain with the supplier.
            </li>
            <li>
              CI releases funds promptly at pickup; bank settlement times may vary by processor.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Edge cases</h2>
          <ul className="mt-2 list-disc pl-5 space-y-2">
            <li>
              <strong>Lost/damaged in transit:</strong> handled through the carrier/insurance policy.
              CI can assist with claims; funds may be advanced once liability is clear.
            </li>
            <li>
              <strong>Customs holds:</strong> buyer- or supplier-caused documentation issues follow
              the party at fault. Otherwise, CI helps coordinate resolution.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Need help?</h2>
          <p className="mt-2">
            Email <a href="mailto:support@cleaningredients.co" className="underline">
            support@cleaningredients.co</a> with your order number. We’ll review the tracking,
            documents, and evidence and respond quickly.
          </p>
        </section>
      </div>
    </div>
  );
}
