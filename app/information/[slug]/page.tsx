// app/information/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ARTICLES } from "@/content/articles";

export function generateStaticParams(): Array<{ slug: string }> {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const article = ARTICLES.find((a) => a.slug === slug);

  return {
    title: article
      ? `${article.title} • CleanIngredients`
      : "Information • CleanIngredients",
    description: article
      ? `Learn about ${article.title.replace(/\.$/, "")} — ${article.tag}.`
      : "Information articles.",
  };
}

export default async function ArticlePage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const article = ARTICLES.find((a) => a.slug === slug);
  if (!article) notFound();

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <div className="text-sm text-neutral-500">
        <Link href="/information" className="hover:underline">Information</Link>
        <span className="mx-2">/</span>
        <span>{article.category}</span>
      </div>

      <h1 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight">
        {article.title}
      </h1>

      <div className="mt-3 flex items-center gap-2">
        <span className="inline-flex items-center rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-xs font-medium text-neutral-700">
          {article.tag}
        </span>
      </div>

      <div className="prose prose-neutral mt-8 max-w-none">
        <p>
          Full article coming soon. This topic falls under <strong>{article.category}</strong>
          {article.tag !== "All Ingredients" ? (
            <> and focuses on <strong>{article.tag}</strong>.</>
          ) : (
            "."
          )}
        </p>

        <h2>What you&apos;ll learn</h2>
        <ul>
          <li>Key definitions and why this matters when sourcing.</li>
          <li>How we verify and what evidence buyers should request.</li>
          <li>Practical tips, common pitfalls, and compliance notes.</li>
        </ul>

        <p className="mt-6">
          Looking for suppliers now?{" "}
          <Link href="/ingredients" className="underline">Browse ingredients</Link>{" "}
          or{" "}
          <Link href="/requests/new" className="underline">request a quote</Link>.
        </p>
      </div>
    </main>
  );
}
