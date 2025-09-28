// scripts/data/info-topics.ts
export type InfoTopic = {
  title: string;
  slug?: string;           // if omitted, we'll slugify title
  description?: string;
  category: string;        // e.g. "Buyer Risk & Protection"
  tags?: string[];         // e.g. ["pillar", "evergreen"]
  author?: string;         // key from content/authors.ts (optional)
  updatedAt?: string;      // "YYYY-MM-DD"; default: today
};

export const INFO_TOPICS: InfoTopic[] = [
  {
    title: "Buyer Risk & Protection: Complete Guide",
    slug: "buyer-risk-protection-guide",
    description:
      "Authoritative hub for buyer risk & protection — curated guides, checklists, and definitions.",
    category: "Buyer Risk & Protection",
    tags: ["pillar", "evergreen"],
    author: "harry-burman",
  },
  // add the rest of your planned pages here…
];
