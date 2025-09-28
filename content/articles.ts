// content/articles.ts
export type Article = {
  slug: string;
  title: string;
  tag: string;       // ingredient tag (e.g., "Ashwagandha") or "All Ingredients"
  category: string;  // high-level grouping
};

const slugify = (s: string) =>
  s.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const GENERAL_SECTIONS: { category: string; items: string[] }[] = [
  {
    category: "Verification & Trust",
    items: [
      "How do we verify ingredient suppliers?",
      "What certifications (cGMP, ISO, USDA Organic) matter most?",
      "How often are suppliers re-audited?",
      "How can buyers confirm lab tests are legitimate?",
      "What red flags in a COA should buyers look for?",
    ],
  },
  {
    category: "Lab Testing & Quality",
    items: [
      "Which lab tests are required for each ingredient type?",
      "What’s the difference between in-house vs 3rd-party testing?",
      "Why potency and identity testing matters (HPLC, FTIR).",
      "Heavy metals: safe limits and testing methods (ICP-MS).",
      "Microbial testing: how to read results.",
      "Residual solvents and pesticides—when are they required?",
      "Differences between U.S., EU, and China testing standards.",
      "What’s the shelf-life of a COA?",
    ],
  },
  {
    category: "Compliance & Regulation",
    items: [
      "FDA requirements for dietary supplement ingredients.",
      "EU vs U.S. labeling requirements.",
      "What makes an ingredient “USDA Organic” vs “Organic in China/EU”?",
      "What does “non-GMO” certification actually mean?",
      "What is GRAS status, and which ingredients have it?",
      "How does Prop 65 in California affect ingredient sourcing?",
    ],
  },
  {
    category: "Pricing & Payment",
    items: [
      "Why prices vary widely for the same ingredient.",
      "How minimum order quantities (MOQs) are set.",
      "Spot market vs contracted pricing—pros & cons.",
      "How escrow protects buyers in ingredient deals.",
      "What are hidden costs in importing ingredients?",
      "How to negotiate fair payment terms with suppliers.",
    ],
  },
  {
    category: "Sourcing & Supply Chain",
    items: [
      "Top regions producing high-quality botanicals.",
      "Seasonal factors that affect availability and price.",
      "Wild-crafted vs cultivated botanicals.",
      "Traceability: how far back should buyers go?",
      "What logistics partners specialize in food & supplement imports?",
      "How ingredient recalls are handled.",
    ],
  },
  {
    category: "Buyer Risk & Protection",
    items: [
      "Common ingredient fraud cases (dilution, substitution).",
      "How escrow and CI verification reduce fraud risk.",
      "Insurance options for ingredient imports.",
      "How to dispute a bad shipment.",
    ],
  },
  {
    category: "Performance & Formulation",
    items: [
      "How to compare potency claims across suppliers.",
      "What lab data formulators value most.",
      "Which ingredients are trending in consumer supplements (2025).",
      "How to choose between multiple “top suppliers” for the same ingredient.",
    ],
  },
];

const INGREDIENT_SPECIFIC: { title: string; tag: string }[] = [
  { title: "Ashwagandha: KSM-66 vs Sensoril vs generic root.", tag: "Ashwagandha" },
  { title: "Lion’s Mane: fruiting body vs mycelium extract.", tag: "Lion's Mane" },
  { title: "NMN vs NR: what’s the regulatory status?", tag: "NMN" },
  { title: "Berberine: purity levels and common adulterants.", tag: "Berberine" },
  { title: "Tongkat Ali: sustainability concerns in sourcing.", tag: "Tongkat Ali" },
  { title: "Cordyceps: wild vs cultivated.", tag: "Cordyceps" },
  { title: "Reishi: beta-glucan vs polysaccharide testing.", tag: "Reishi" },
  { title: "Ginseng: American vs Asian varieties.", tag: "Ginseng" },
  { title: "Curcumin: bioavailability and absorption issues.", tag: "Curcumin" },
  { title: "Collagen: marine vs bovine vs vegan alternatives.", tag: "Collagen" },
  { title: "Hemp protein: THC/heavy metal limits.", tag: "Hemp Protein" },
];

export const ARTICLES: Article[] = [
  // General articles tagged as "All Ingredients"
  ...GENERAL_SECTIONS.flatMap(({ category, items }) =>
    items.map<Article>((title) => ({
      slug: slugify(title),
      title,
      tag: "All Ingredients",
      category,
    }))
  ),
  // Ingredient-specific
  ...INGREDIENT_SPECIFIC.map<Article>(({ title, tag }) => ({
    slug: slugify(title),
    title,
    tag,
    category: "Ingredient-Specific",
  })),
];
