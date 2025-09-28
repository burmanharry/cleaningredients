// scripts/generate-category-pillars.ts
import fs from "node:fs/promises";
import path from "node:path";

type PostMeta = {
  slug: string;
  title?: string;
  description?: string;
  category?: string;
  updatedAt?: string;
};

// READ posts from here:
const INFO_DIR = path.join(process.cwd(), "content", "information");
// WRITE category intros here:
const CATS_DIR = path.join(process.cwd(), "content", "categories");

// Very small front-matter parser (no deps)
function parseFrontmatter(src: string): { meta: Record<string, string>; body: string } {
  if (!src.startsWith("---")) return { meta: {}, body: src };
  const end = src.indexOf("\n---", 3);
  if (end === -1) return { meta: {}, body: src };
  const raw = src.slice(3, end).trim();
  const body = src.slice(end + 4).replace(/^\s*\n/, "");
  const meta: Record<string, string> = {};
  for (const line of raw.split("\n")) {
    const m = line.match(/^([A-Za-z0-9_-]+)\s*:\s*(.*)$/);
    if (!m) continue;
    const key = m[1].trim();
    let val = m[2].trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    meta[key] = val;
  }
  return { meta, body };
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function listContent(): Promise<PostMeta[]> {
  const files = await fs.readdir(INFO_DIR, { withFileTypes: true });
  const mdxFiles = files.filter((f) => f.isFile() && f.name.endsWith(".mdx"));

  const out: PostMeta[] = [];
  for (const f of mdxFiles) {
    const full = path.join(INFO_DIR, f.name);
    const raw = await fs.readFile(full, "utf8");
    const { meta } = parseFrontmatter(raw);
    out.push({
      slug: f.name.replace(/\.mdx$/, ""),
      title: meta.title,
      description: meta.description,
      category: meta.category,
      updatedAt: meta.updatedAt,
    });
  }
  return out;
}

// NOTE: NO "-guide" here; your loader slugifies the category name itself
function pillarFilenameFor(category: string) {
  return `${slugify(category)}.mdx`;
}

function pillarTitleFor(category: string) {
  return `${category} Guide`;
}

function buildPillarMDX(category: string, posts: PostMeta[]) {
  posts.sort((a, b) => {
    const da = a.updatedAt ? Date.parse(a.updatedAt) : 0;
    const db = b.updatedAt ? Date.parse(b.updatedAt) : 0;
    if (db !== da) return db - da;
    return a.slug.localeCompare(b.slug);
  });

  const updated = new Date().toISOString().slice(0, 10);

  const items = posts
    .map((p) => {
      const line1 = `- [${p.title ?? p.slug}](/information/${p.slug})`;
      const line2 = p.description ? `  \n  ${p.description}` : "";
      return `${line1}${line2}`;
    })
    .join("\n");

  return `---
title: "${pillarTitleFor(category)}"
description: "Curated resources for ${category} — start here, then explore focused guides."
category: "${category}"
tags: ["pillar","evergreen"]
updatedAt: "${updated}"
---

<callout type="tip">
This page is the **hub** for ${category.toLowerCase()}. Start here, then dive into the focused guides below.
</callout>

## Recommended reading

${items}

---

## What this hub covers

- Key definitions and why they matter
- Practical checklists and “what good looks like”
- Common pitfalls and how to avoid them
- Links to in-depth, related guides

> Want a guide added? Open the contact form and tell us what you’re stuck on.
`;
}

async function main() {
  const posts = await listContent();

  // Group by category (skip posts without category)
  const groups = new Map<string, PostMeta[]>();
  for (const p of posts) {
    if (!p.category) continue;
    if (!groups.has(p.category)) groups.set(p.category, []);
    groups.get(p.category)!.push(p);
  }

  if (groups.size === 0) {
    console.log("[generate-category-pillars] No categories found in front-matter.");
    return;
  }

  await fs.mkdir(CATS_DIR, { recursive: true });

  let created = 0;
  for (const [category, items] of groups) {
    const filename = pillarFilenameFor(category);
    const full = path.join(CATS_DIR, filename);

    try {
      await fs.access(full);
      console.log(`Skip (exists): ${path.relative(process.cwd(), full)}`);
      continue;
    } catch {
      // not found — create it
    }

    const mdx = buildPillarMDX(category, items);
    await fs.writeFile(full, mdx, "utf8");
    console.log(`Created: ${path.relative(process.cwd(), full)}`);
    created++;
  }

  console.log(created ? `\nDone. Created ${created} pillar file(s).` : "\nNothing to do.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
