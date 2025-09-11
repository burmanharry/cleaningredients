import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Escrow Process | CleanIngredients",
  description:
    "How escrow protects both buyers and suppliers on CleanIngredients.",
};

export default function EscrowPage() {
  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-3xl font-semibold tracking-tight">Escrow Process</h1>
      <p className="mt-2 text-sm text-neutral-500">
        Last updated: {new Date().toLocaleDateString()}
      </p>

      <div className="mt-6 space-y-6">
        <section>
          <h2 className="text-xl font-semibold">Why Escrow?</h2>
          <p className="mt-2 text-neutral-800">
            Funds are held by CleanIngredients (“CI”) in a segregated account and released
            when the order is confirmed shipped. This protects Buyers from non-shipment and
            ensures Suppliers are paid promptly once goods are in transit.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">How it Works</h2>
          <ol className="mt-2 list-decimal pl-5 space-y-2 text-neutral-800">
            <li>Buyer places an order and pays into escrow via CI checkout.</li>
            <li>Supplier prepares goods. Tracking details and shipping docs are uploaded.</li>
            <li>When the package is picked up by the carrier (tracking shows acceptance), CI releases funds to the Supplier.</li>
            <li>Any timely claims (quality, damage, loss) follow our Standard Refund Policy.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Fair to Both Sides</h2>
          <ul className="mt-2 list-disc pl-5 space-y-2 text-neutral-800">
            <li>
              <strong>Buyers:</strong> payment is not released until the shipment is en route.
            </li>
            <li>
              <strong>Suppliers:</strong> no lengthy payment delays; funds are released at pickup.
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
