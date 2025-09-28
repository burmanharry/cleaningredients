// lib/posts.ts
import fs from "node:fs/promises";
import path from "node:path";
import type { ReactElement } from "react";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

const ROOT = path.join(process.cwd(), "content", "information");
const CAT_ROOT = path.join(process.cwd(), "content", "categories");

export type PostMeta = {
  slug: string;
  title?: string;
  description?: string;
  category?: string;
  tags?: string[];
  updatedAt?: string; // ISO
  author?: string;
  image?: string;
  faqs?: { q: string; a: string }[];
  howto?: { name?: string; steps?: string[] };
};

// ---------- Listing ----------
export async function listPostSlugs(): Promise<string[]> {
  const entries = await fs.readdir(ROOT, { withFileTypes: true });
  return entries
    .filter((e) => e.isFile() && e.name.endsWith(".mdx"))
    .map((e) => e.name.replace(/\.mdx$/, ""));
}

export async function listPosts(): Promise<PostMeta[]> {
  const slugs = await listPostSlugs();
  const rows: PostMeta[] = [];

  for (const slug of slugs) {
    const source = await fs.readFile(path.join(ROOT, `${slug}.mdx`), "utf8");
    const { frontmatter } = await compileMDX<PostMeta>({
      source,
      options: { parseFrontmatter: true },
    });

    rows.push({
      slug,
      title: frontmatter.title ?? slug,
      description: frontmatter.description ?? "",
      category: frontmatter.category ?? "General",
      tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
      updatedAt: frontmatter.updatedAt ?? "",
      author: (frontmatter as any).author ?? "",
      image: (frontmatter as any).image ?? "",
      faqs: Array.isArray((frontmatter as any).faqs)
        ? (frontmatter as any).faqs
        : [],
      howto: (frontmatter as any).howto ?? {},
    });
  }

  rows.sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || ""));
  return rows;
}

// ---------- Single Post ----------
export async function getPost(
  slug: string
): Promise<{ meta: PostMeta; Content: ReactElement }> {
  const filePath = path.join(ROOT, `${slug}.mdx`);
  const source = await fs.readFile(filePath, "utf8");

  const { content, frontmatter } = await compileMDX<PostMeta>({
    source,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [
            rehypeAutolinkHeadings,
            { behavior: "wrap", properties: { className: "no-underline" } },
          ],
        ],
      },
    },
  });

  const meta: PostMeta = {
    slug,
    title: frontmatter.title ?? slug,
    description: frontmatter.description ?? "",
    category: frontmatter.category ?? "General",
    tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
    updatedAt: frontmatter.updatedAt ?? "",
    author: (frontmatter as any).author ?? "",
    image: (frontmatter as any).image ?? "",
    faqs: Array.isArray((frontmatter as any).faqs)
      ? (frontmatter as any).faqs
      : [],
    howto: (frontmatter as any).howto ?? {},
  };

  return { meta, Content: content };
}

// ---------- Related ----------
export async function getRelatedPosts(
  currentSlug: string,
  limit = 3
): Promise<PostMeta[]> {
  const all = await listPosts();
  const current = all.find((p) => p.slug === currentSlug);
  if (!current) return all.slice(0, limit);

  const toSet = (a?: string[]) => new Set((a ?? []).map((s) => s.toLowerCase()));
  const words = (s = "") =>
    new Set(s.toLowerCase().split(/\W+/).filter((w) => w.length > 3));

  const currentTags = toSet(current.tags);
  const currentWords = words(current.title ?? "");

  const scored = all
    .filter((p) => p.slug !== currentSlug)
    .map((p) => {
      let score = 0;
      if (p.category === current.category) score += 3;
      const t = toSet(p.tags);
      for (const tag of t) if (currentTags.has(tag)) score += 2;
      const overlap = [...words(p.title ?? "")].filter((w) =>
        currentWords.has(w)
      ).length;
      score += Math.min(overlap, 3);
      return { p, score };
    })
    .filter((x) => x.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        (b.p.updatedAt || "").localeCompare(a.p.updatedAt || "")
    )
    .slice(0, limit)
    .map((x) => x.p);

  return scored.length
    ? scored
    : all.filter((p) => p.slug !== currentSlug).slice(0, limit);
}

// ---------- Categories ----------
export function categorySlugify(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function listCategories(): Promise<
  { name: string; slug: string; count: number; latest?: string }[]
> {
  const posts = await listPosts();
  const map = new Map<string, { count: number; latest?: string }>();

  for (const p of posts) {
    const c = p.category?.trim() || "General";
    const prevLatest = map.get(c)?.latest || "";
    const latest = (p.updatedAt || "") > prevLatest ? p.updatedAt : prevLatest;
    map.set(c, { count: (map.get(c)?.count || 0) + 1, latest });
  }

  return Array.from(map.entries())
    .map(([name, v]) => ({
      name,
      slug: categorySlugify(name),
      count: v.count,
      latest: v.latest,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function getCategoryPosts(
  name: string
): Promise<PostMeta[]> {
  const posts = await listPosts();
  return posts
    .filter((p) => (p.category?.trim() || "General") === name)
    .sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || ""));
}

export async function getCategoryIntro(
  categoryName: string
): Promise<{ Content: ReactElement | null; meta: Record<string, any> }> {
  try {
    const slug = categorySlugify(categoryName);
    const file = path.join(CAT_ROOT, `${slug}.mdx`);
    const source = await fs.readFile(file, "utf8");

    const { content, frontmatter } = await compileMDX({
      source,
      options: { parseFrontmatter: true },
    });

    return { Content: content as ReactElement, meta: (frontmatter as any) || {} };
  } catch {
    return { Content: null, meta: {} };
  }
}
