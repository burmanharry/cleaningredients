// app/information/category/[slug]/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { listCategories, getCategoryPosts, getCategoryIntro } from "@/lib/posts";

export const revalidate = 1800; // 30 min
export const dynamicParams = true;

const siteUrl =
  process.env.NEXT_PUBLIC_BASE_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

function titleCase(s: string) {
  return s.trim().replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
}

export async function generateStaticParams() {
  const cats = await listCategories();
  return cats.map((c) => ({ slug: `${c.slug}-guide` }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const raw = slug.replace(/-guide$/, "");
  const cats = await listCategories();
  const match = cats.find((c) => c.slug === raw);
  const categoryName = match?.name ?? titleCase(raw);

  const url = `${siteUrl}/information/category/${slug}`;
  const title = `${categoryName} Guide • CleanIngredients`;
  const desc = `Deep-dive hub on ${categoryName}: curated articles, checklists, and how-tos.`;

  return {
    title,
    description: desc,
    alternates: { canonical: url },
    openGraph: { title, description: desc, url, type: "website", images: [{ url: "/og/information-default.png" }] },
    twitter: { card: "summary_large_image", title, description: desc, images: ["/og/information-default.png"] },
  };
}

export default async function CategoryHub(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const cats = await listCategories();
  const raw = slug.replace(/-guide$/, "");
  const match = cats.find((c) => c.slug === raw);
  const categoryName = match?.name ?? titleCase(raw);

  const { Content: Intro } = await getCategoryIntro(categoryName);
  const items = await getCategoryPosts(categoryName);

  const pageUrl = `${siteUrl}/information/category/${slug}`;
  const breadcrumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Information", item: `${siteUrl}/information` },
      { "@type": "ListItem", position: 2, name: `${categoryName} Guide`, item: pageUrl },
    ],
  };
  const webPageLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${categoryName} Guide`,
    url: pageUrl,
    description: `Deep-dive hub on ${categoryName}: curated articles, checklists, and how-tos.`,
  };

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <Script id="ld-cat-bc" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsLd) }} />
      <Script id="ld-cat-web" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageLd) }} />

      <div className="mb-6 text-sm text-neutral-600">
        <Link href="/information" className="underline">Information</Link>{" / "}
        <span>{categoryName} Guide</span>
      </div>

      <h1 className="text-3xl font-semibold tracking-tight">{categoryName} Guide</h1>

      {Intro ? (
        <article className="prose prose-neutral max-w-none mt-6">{Intro}</article>
      ) : (
        <p className="mt-4 text-neutral-700">
          Curated resources for {categoryName}. Browse the articles below.
        </p>
      )}

      <section className="mt-10">
        <h2 className="text-lg font-semibold mb-3">Articles in this guide</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <Link key={p.slug} href={`/information/${p.slug}`} className="rounded-2xl border p-4 hover:shadow-sm transition">
              <div className="font-medium">{p.title}</div>
              {p.updatedAt && (
                <div className="mt-1 text-xs text-neutral-500">
                  Updated {new Date(p.updatedAt).toLocaleDateString()}
                </div>
              )}
              {p.description && (
                <p className="mt-2 text-sm text-neutral-700 line-clamp-3">{p.description}</p>
              )}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
