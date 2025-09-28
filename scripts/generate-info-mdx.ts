// scripts/generate-info-mdx.ts
import { promises as fs } from "node:fs";
import path from "node:path";
import { INFO_TOPICS, InfoTopic } from "./data/info-topics";

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, "content", "information");

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function fm(t: InfoTopic) {
  const today = new Date().toISOString().slice(0, 10);
  const updatedAt = t.updatedAt ?? today;
  const slug = t.slug ?? slugify(t.title);
  const desc = t.description ?? `${t.title} — guide, definitions, and checklists.`;
  const tags = (t.tags ?? []).map((x) => `"${x}"`).join(", ");
  const author = t.author ? `\nauthor: "${t.author}"` : "";
  return `---
title: "${t.title}"
description: "${desc}"
category: "${t.category}"
tags: [${tags}]
image: "/og/information-default.png"${author}
updatedAt: "${updatedAt}"
---
`;
}

function bodyTemplate(t: InfoTopic) {
  return `
<callout type="tip">
This page is the **hub** for ${t.category.toLowerCase()}. Start here, then dive into the focused guides below.
</callout>

## Recommended reading

- <!-- Add internal links like --> [Common ingredient fraud cases](/information/common-ingredient-fraud-cases-dilution-substitution)

---

## What this hub covers

- Key definitions and why they matter  
- Practical checklists and “what good looks like”  
- Common pitfalls and how to avoid them  
- Links to in-depth, related guides

> Want a guide added? Open the contact form and tell us what you're stuck on.
`;
}

async function ensureDir(d: string) {
  await fs.mkdir(d, { recursive: true });
}

async function writeIfMissing(fp: string, content: string) {
  try {
    await fs.access(fp);
    // exists → skip (don’t overwrite your edits)
  } catch {
    await fs.writeFile(fp, content, "utf8");
    console.log("created:", path.relative(ROOT, fp));
  }
}

async function main() {
  await ensureDir(CONTENT_DIR);

  for (const topic of INFO_TOPICS) {
    const slug = topic.slug ?? slugify(topic.title);
    const filepath = path.join(CONTENT_DIR, `${slug}.mdx`);
    const file = fm(topic) + bodyTemplate(topic);
    await writeIfMissing(filepath, file);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
