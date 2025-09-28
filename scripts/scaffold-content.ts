// scripts/scaffold-content.ts
import fs from "node:fs";
import path from "node:path";

type PostDef = {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags?: string[];
};

const POSTS: PostDef[] = [
  // === Hubs (already exist but safe to skip if present) ===
  { slug: "buyer-risk-protection-guide", title: "Buyer Risk & Protection: Complete Guide", description: "Authoritative hub for buyer risk & protection — curated guides, checklists, and definitions.", category: "Buyer Risk & Protection", tags: ["pillar","evergreen"] },
  { slug: "compliance-regulation-guide", title: "Compliance & Regulation: Complete Guide", description: "Your regulation hub: core concepts and practical compliance steps.", category: "Compliance & Regulation", tags: ["pillar","evergreen"] },
  { slug: "lab-testing-quality-guide", title: "Lab Testing & Quality: Complete Guide", description: "Testing methods, COAs, and quality systems explained.", category: "Lab Testing & Quality", tags: ["pillar","evergreen"] },
  { slug: "performance-formulation-guide", title: "Performance & Formulation: Complete Guide", description: "Formulation basics, performance benchmarks, and validation approaches.", category: "Performance & Formulation", tags: ["pillar","evergreen"] },
  { slug: "pricing-payment-guide", title: "Pricing & Payment: Complete Guide", description: "Incoterms, payment methods, risk balancing, and negotiation.", category: "Pricing & Payment", tags: ["pillar","evergreen"] },
  { slug: "sourcing-supply-chain-guide", title: "Sourcing & Supply Chain: Complete Guide", description: "Supplier selection, qualification, and logistics considerations.", category: "Sourcing & Supply Chain", tags: ["pillar","evergreen"] },
  { slug: "verification-trust-guide", title: "Verification & Trust: Complete Guide", description: "Escrow, third-party verification, and anti-fraud controls.", category: "Verification & Trust", tags: ["pillar","evergreen"] },

  // === Articles referenced in your site map / MDX ===
  { slug: "common-ingredient-fraud-cases-dilution-substitution", title: "Common Ingredient Fraud Cases: Dilution & Substitution", description: "Patterns, signals, and how to protect purchases against dilution and substitution.", category: "Buyer Risk & Protection" },
  { slug: "differences-between-us-eu-and-china-testing-standards", title: "Differences Between US, EU, and China Testing Standards", description: "How testing standards vary across markets — and what importers must know.", category: "Lab Testing & Quality" },
  { slug: "how-escrow-and-ci-verification-reduce-fraud-risk", title: "How Escrow and CI Verification Reduce Fraud Risk", description: "When and how to use escrow and verification to prevent loss.", category: "Verification & Trust" },
  { slug: "how-to-dispute-a-bad-shipment", title: "How to Dispute a Bad Shipment", description: "Step-by-step: evidence, timelines, and resolution paths.", category: "Buyer Risk & Protection" },
  { slug: "insurance-options-for-ingredient-imports", title: "Insurance Options for Ingredient Imports", description: "Cargo, trade credit, and liability coverage: what to choose and why.", category: "Sourcing & Supply Chain" },
  { slug: "how-escrow-protects-buyers-and-suppliers", title: "How Escrow Protects Buyers and Suppliers", description: "Align incentives, reduce disputes, and keep cash safe.", category: "Verification & Trust" },
  { slug: "how-minimum-order-quantities-affect-risk", title: "How Minimum Order Quantities Affect Risk", description: "MOQ, batch risk, and strategies to de-risk first buys.", category: "Pricing & Payment" },
  { slug: "how-to-negotiate-fair-payment-terms", title: "How to Negotiate Fair Payment Terms", description: "Milestones, documents, and leverage for safer deals.", category: "Pricing & Payment" },
  { slug: "how-escrow-and-ci-verification-avoid-chargebacks", title: "Avoid Chargebacks with Escrow & Verification", description: "Reduce chargebacks and returns by building verification into the flow.", category: "Verification & Trust" },
  // add more here anytime; re-run the script and it will only create missing files
];

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "content", "information");

const TEMPLATE = (p: PostDef) => `---
title: "${p.title}"
description: "${p.description}"
category: "${p.category}"
tags: ${JSON.stringify(p.tags ?? ["evergreen"])}
author: "harry-burman"
image: "/og/information-default.png"
updatedAt: "${new Date().toISOString().slice(0,10)}"

faqs: []
howto:
  name: ""
  steps: []
---

<Callout type="tip">
Quick summary of who this is for and the core outcome in 1–2 lines.
</Callout>

<AutoTOC />

## Key takeaways
- …

## Definitions
- …

## Checklist
- [ ] …

## What good looks like
- …

## Recommended reading
- [Link to a related article](/information/verification-trust-guide)
`;

(async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  let created = 0;
  for (const post of POSTS) {
    const file = path.join(OUT_DIR, `${post.slug}.mdx`);
    if (fs.existsSync(file)) {
      console.log(`skip  • ${post.slug} (exists)`);
      continue;
    }
    fs.writeFileSync(file, TEMPLATE(post), "utf8");
    console.log(`create • ${post.slug}`);
    created++;
  }

  console.log(`\nDone. ${created} file(s) created in content/information/`);
})();
