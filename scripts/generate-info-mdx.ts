// scripts/generate-info-mdx.ts
// Run with: npm run generate:info
// Works with several shapes from ../content/articles.ts:
// 1) export const GENERAL_SECTIONS = [{ category, items: string[] }, ...]
// 2) export default [{ category, items: string[] }, ...]
// 3) export const ARTICLES = { "Category": ["Title A", "Title B"], ... }
// 4) multiple arrays: export const VERIFICATION = ["..."]; export const LAB_TESTING = ["..."]

import fs from "node:fs/promises";
import path from "node:path";
import * as Articles from "../content/articles";

type Section = { category: string; items: string[] };

const ROOT = path.join(process.cwd(), "content", "information");

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function titleCase(s: string) {
  return s
    .replace(/[_\-]+/g, " ")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function esc(s: string) {
  return String(s).replace(/"/g, '\\"');
}

function mdxTemplate(title: string, category: string) {
  const today = new Date().toISOString().slice(0, 10);
  const description = `${title} — practical definitions, checklists, and what to ask suppliers.`;
  return `---
title: "${esc(title)}"
description: "${esc(description)}"
category: "${esc(category)}"
tags: []
updatedAt: "${today}"
---

<Callout type="tip">
This guide focuses on **what matters in the real world**: evidence, risk, and clear acceptance criteria.
</Callout>

## What you'll learn
- Why this topic matters for sourcing and quality
- What documents/evidence to request
- Minimum acceptance criteria (with examples)

## Key definitions
- *Term 1* — buyer-friendly definition.
- *Term 2* — concise definition.

## Checklist
- [ ] Required documents collected
- [ ] COA fields present (lot #, method refs, criteria, results)
- [ ] Identity + spec matched
- [ ] Red flags reviewed

## How to do it
1. **Request** baseline docs from the supplier.
2. **Verify** legal entity & facility details.
3. **Review** COA vs acceptance criteria.
4. **Escalate** any mismatches or missing method references.

## Red flags
- Missing method references
- Results without acceptance criteria
- Inconsistent lot/date metadata

## FAQ
**Q:** What if the supplier won't share recent COAs?  
**A:** Ask for anonymized COAs or third-party lab proof. No evidence = unacceptable risk.
`;
}

async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true });
}

async function fileExists(p: string) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

/** Normalizes whatever ../content/articles exports into [{category, items}] */
function normalizeSections(mod: any): Section[] {
  // 1) Explicit GENERAL_SECTIONS array
  if (Array.isArray(mod.GENERAL_SECTIONS)) return mod.GENERAL_SECTIONS as Section[];

  // 2) Default export array
  if (Array.isArray(mod.default)) return mod.default as Section[];

  // 3) ARTICLES as record: { "Cat": ["A","B"], ... }
  if (mod.ARTICLES && typeof mod.ARTICLES === "object" && !Array.isArray(mod.ARTICLES)) {
    const out: Section[] = [];
    for (const [cat, items] of Object.entries(mod.ARTICLES)) {
      if (Array.isArray(items) && items.every((x) => typeof x === "string")) {
        out.push({ category: String(cat), items: items as string[] });
      }
    }
    if (out.length) return out;
  }

  // 4) Fall back: scan all named exports; if an export is an array<string>, treat its key as category
  const fallback: Section[] = [];
  for (const [key, val] of Object.entries(mod)) {
    if (Array.isArray(val) && val.every((x) => typeof x === "string")) {
      fallback.push({ category: titleCase(key), items: val as string[] });
    }
  }
  return fallback;
}

async function main() {
  const sections = normalizeSections(Articles);
  if (!Array.isArray(sections) || sections.length === 0) {
    console.error(
      "[generate-info-mdx] Could not find any sections. " +
        "Export either `GENERAL_SECTIONS` as [{category, items:string[]}, ...], " +
        "`ARTICLES` as a record of {category: string[]}, " +
        "or arrays of titles per category."
    );
    process.exit(1);
  }

  await ensureDir(ROOT);

  let created = 0;
  let skipped = 0;

  for (const section of sections) {
    const category = section.category || "General";
    const items = Array.isArray(section.items) ? section.items : [];
    for (const title of items) {
      const slug = slugify(title);
      const outPath = path.join(ROOT, `${slug}.mdx`);

      if (await fileExists(outPath)) {
        skipped++;
        continue;
      }

      const content = mdxTemplate(title, category);
      await fs.writeFile(outPath, content, "utf8");
      created++;
    }
  }

  console.log(
    `MDX generation complete. Created: ${created}, Skipped (already existed): ${skipped}`
  );
}

main().catch((err) => {
  console.error("[generate-info-mdx] Failed:", err);
  process.exit(1);
});
