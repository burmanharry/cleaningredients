import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Standard Refund Policy | CleanIngredients",
  description:
    "Fair, clear refund policy for buyers and suppliers on CleanIngredients.",
};

export default function RefundPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-3xl font-semibold tracking-tight">Standard Refund Policy</h1>
      <p className="mt-2 text-sm text-neutral-500">
        Last updated: {new Date().toLocaleDateString()}
      </p>

      <div className="mt-6 space-y-6 text-neutral-800">
        <p>
          This policy is designed to be fair to <strong>Buyers</strong>,{" "}
          <strong>Suppliers</strong>, and <strong>CleanIngredients (“CI”)</strong>.
          It applies to purchases made on CI unless a written contract between Buyer
          and Supplier states otherwise and is uploaded with the order.
        </p>

        <section>
          <h2 className="text-xl font-semibold">1) Cancellation</h2>
          <ul className="mt-2 list-disc pl-5 space-y-2">
            <li>
              <strong>Within 24 hours (pre-shipment):</strong> Buyer may cancel for a
              full refund. Processor fees are refunded when supported by the processor;
              otherwise they are deducted at cost.
            </li>
            <li>
              <strong>After 24 hours but before shipment:</strong> Refund less any
              documented Supplier costs already incurred (e.g., testing, packaging,
              booking fees).
            </li>
            <li>
              <strong>After shipment:</strong> See Sections 2–4 below.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">2) Non-conforming or Quality Issues</h2>
          <p className="mt-2">
            If goods do not match the specifications agreed in the PO/COA or fail to
            meet legal limits, Buyer must open a claim within{" "}
            <strong>7 calendar days</strong> of delivery.
          </p>
          <ul className="mt-2 list-disc pl-5 space-y-2">
            <li>Provide order number, photos of packaging/labels, and a description of the variance.</li>
            <li>
              For quality disputes, testing by an <strong>ISO/IEC 17025</strong>{" "}
              accredited lab may be required. If results show a material deviation from PO
              specs, Supplier covers lab cost; otherwise Buyer covers it.
            </li>
            <li>
              If confirmed non-conforming: Supplier must{" "}
              <strong>replace</strong> or <strong>refund in full</strong> (product +
              original shipping). Return shipping is Supplier’s responsibility or a disposal
              letter may be authorized when returns are unsafe or uneconomical.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">3) Transit Damage or Loss</h2>
          <ul className="mt-2 list-disc pl-5 space-y-2">
            <li>Shipments are insured when booked through CI or per Supplier policy. Buyer should note damage on POD (if possible) and file within <strong>48 hours</strong>.</li>
            <li>Once the carrier accepts liability, Buyer may choose a replacement or refund. CI may hold funds in escrow pending reimbursement.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">4) Returns for Convenience (Unopened Only)</h2>
          <ul className="mt-2 list-disc pl-5 space-y-2">
            <li>Unopened, sealed containers in resalable condition may be returned within <strong>14 days</strong> of delivery with an RMA.</li>
            <li>Buyer pays return shipping and a <strong>10% restocking fee</strong>. Original shipping is non-refundable.</li>
            <li>Opened containers or custom/made-to-order items are <strong>not</strong> returnable unless non-conforming (Section 2).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">5) Handling, Storage & Chain-of-Custody</h2>
          <p className="mt-2">Buyer must store products according to label/COA requirements. Claims may be denied if mishandling after delivery is evident.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">6) Escrow & Payouts</h2>
          <ul className="mt-2 list-disc pl-5 space-y-2">
            <li>CI releases funds to Supplier after shipment confirmation unless a timely claim is opened.</li>
            <li>If a claim is opened, CI may hold funds until resolution. Approved refunds are issued to the original payment method within <strong>5–10 business days</strong>.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">7) Taxes, Duties, and Compliance</h2>
          <ul className="mt-2 list-disc pl-5 space-y-2">
            <li>Taxes and duties already remitted may be non-refundable depending on jurisdiction.</li>
            <li>Refusals or customs issues caused by incomplete Buyer documents are the Buyer’s responsibility.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">8) Dispute Resolution</h2>
          <p className="mt-2">
            Most issues are resolved by evidence review (photos, COAs, chain-of-custody, and lab results).
            If the parties cannot agree, CI will render a good-faith decision based on the policy and evidence.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">9) How to Start a Claim / RMA</h2>
          <ol className="mt-2 list-decimal pl-5 space-y-2">
            <li>
              Email{" "}
              <a className="underline" href="mailto:support@cleaningredients.co">
                support@cleaningredients.co
              </a>{" "}
              with the order number within the time window.
            </li>
            <li>Attach photos of packaging, labels, lot numbers, and a description of the issue.</li>
            <li>Keep all packaging until the claim is resolved. Do not dispose without written approval.</li>
          </ol>
        </section>
      </div>
    </div>
  );
}
