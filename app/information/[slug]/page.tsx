// app/information/[slug]/page.tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";

import FAQ from "@/components/FAQ";
import HowTo from "@/components/HowTo";
import AutoTOC from "@/components/AutoTOC";
import PillarBanner from "@/components/PillarBanner";
import InfoCTA from "@/components/InfoCTA";

import { AUTHORS } from "@/content/authors";
import AuthorCard from "@/components/AuthorCard";

import {
  getPost,
  listPostSlugs,
  listPosts,
  getRelatedPosts,
} from "@/lib/posts";

export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await listPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;

  try {
    const { meta } = await getPost(slug);
    const base =
      process.env.NEXT_PUBLIC_BASE_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

    const url = `${base}/information/${meta.slug}`;
    const ogImage = (meta as any).image || "/og/information-default.png";

    return {
      title: meta.title || "Information",
      description: meta.description || "CleanIngredients — Information",
      alternates: { canonical: url },
      openGraph: {
        title: meta.title,
        description: meta.description,
        url,
        type: "article",
        images: [{ url: ogImage }],
      },
      twitter: {
        card: "summary_large_image",
        title: meta.title,
        description: meta.description,
        images: [ogImage],
      },
    };
  } catch {
    return { title: "Information" };
  }
}

function categoryToHubSlug(category?: string | null) {
  if (!category) return null;
  const s = category
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${s}-guide`;
}

const sortPosts = (a: any, b: any) =>
  (b.updatedAt || "").localeCompare(a.updatedAt || "") ||
  (a.title || a.slug).localeCompare(b.title || b.slug);

export default async function InfoArticle(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const { Content, meta } = await getPost(slug);

    const base =
      process.env.NEXT_PUBLIC_BASE_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

    const url = `${base}/information/${meta.slug}`;
    const hubSlug = categoryToHubSlug(meta.category);
    const ogImage = (meta as any).image || "/og/information-default.png";

    // Related + prev/next
    const related = await getRelatedPosts(slug, 3);
    const all = (await listPosts()).sort(sortPosts);
    const idx = all.findIndex((p) => p.slug === meta.slug);
    const prev = idx > 0 ? all[idx - 1] : null;
    const next = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null;

    // Optional author
    const author =
      meta.author && (AUTHORS as any)?.[meta.author]
        ? (AUTHORS as any)[meta.author]
        : null;

    // JSON-LD: Article
    const articleLd = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: meta.title,
      description: meta.description,
      url,
      datePublished: meta.updatedAt || undefined,
      dateModified: meta.updatedAt || undefined,
      articleSection: meta.category,
      mainEntityOfPage: url,
      author: author
        ? [
            {
              "@type": "Person",
              name: author.name,
              sameAs: author.sameAs,
              jobTitle: author.title,
            },
          ]
        : [{ "@type": "Organization", name: "CleanIngredients" }],
      publisher: {
        "@type": "Organization",
        name: "CleanIngredients",
        logo: { "@type": "ImageObject", url: `${base}/favicon.ico` },
      },
      image: ogImage,
      keywords: Array.isArray(meta.tags) ? meta.tags.join(", ") : undefined,
    };

    // JSON-LD: Breadcrumbs (note the /category/ path)
    const breadcrumbsLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Information", item: `${base}/information` },
        ...(hubSlug
          ? [{
              "@type": "ListItem",
              position: 2,
              name: meta.category,
              item: `${base}/information/category/${hubSlug}`,
            }]
          : []),
        { "@type": "ListItem", position: hubSlug ? 3 : 2, name: meta.title, item: url },
      ],
    };

    // JSON-LD: FAQ / HowTo (optional; from front-matter)
    const faqLd = (meta as any).faqs?.length
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: (meta as any).faqs.map((f: any) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }
      : null;

    const howToLd = (meta as any).howto?.steps?.length
      ? {
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: (meta as any).howto?.name || meta.title,
          step: (meta as any).howto.steps.map((s: string) => ({
            "@type": "HowToStep",
            text: s,
          })),
        }
      : null;

    return (
      <main className="mx-auto max-w-6xl px-6 py-10">
        {/* SEO: JSON-LD */}
        <Script id="ld-article" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
        <Script id="ld-breadcrumbs" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsLd) }} />
        {faqLd && <Script id="ld-faq" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />}
        {howToLd && <Script id="ld-howto" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToLd) }} />}

        {/* Breadcrumbs (clickable) */}
        <div className="mb-6 text-sm text-neutral-600">
          {meta.category ? (
            <>
              <Link href="/information" className="underline">Information</Link>
              {" / "}
              <Link
                href={`/information/category/${categoryToHubSlug(meta.category)}`}
                className="underline"
              >
                {meta.category}
              </Link>
            </>
          ) : (
            <Link href="/information" className="underline">Information</Link>
          )}
        </div>

        <h1 className="text-3xl font-semibold tracking-tight">{meta.title}</h1>

        {meta.description && <p className="mt-2 text-neutral-700">{meta.description}</p>}

        {meta.updatedAt && (
          <p className="mt-1 text-xs text-neutral-500">
            Updated {new Date(meta.updatedAt).toLocaleDateString()}
          </p>
        )}

        {/* Author (optional) */}
        {author && <AuthorCard author={author} />}

        {/* Pillar link + in-page TOC */}
        {hubSlug && <PillarBanner category={meta.category!} />}
        <AutoTOC />

        {/* Body */}
        <article className="prose prose-neutral max-w-none mt-4">
          {Content}
        </article>

        {/* HowTo / FAQ driven by front-matter */}
        {(meta as any).howto?.steps?.length ? (
          <HowTo name={(meta as any).howto?.name} steps={(meta as any).howto.steps} />
        ) : null}
        {(meta as any).faqs?.length ? <FAQ items={(meta as any).faqs} /> : null}

        {/* Related reading */}
        {related.length > 0 && (
          <section className="mt-12 border-t pt-8">
            <h2 className="text-lg font-semibold mb-4">Related reading</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={`/information/${p.slug}`}
                  className="rounded-2xl border p-4 hover:shadow-sm transition"
                >
                  <div className="text-sm text-neutral-500 mb-1">
                    {p.category || "Information"}
                  </div>
                  <div className="font-medium">{p.title}</div>
                  {p.updatedAt && (
                    <div className="mt-1 text-xs text-neutral-500">
                      Updated {new Date(p.updatedAt).toLocaleDateString()}
                    </div>
                  )}
                  {p.description && (
                    <p className="mt-2 text-sm text-neutral-700 line-clamp-3">
                      {p.description}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Prev / Next */}
        {(prev || next) && (
          <nav className="mt-10 flex justify-between gap-4 text-sm">
            <div>
              {prev && (
                <Link
                  className="underline decoration-neutral-400 hover:decoration-neutral-800"
                  href={`/information/${prev.slug}`}
                >
                  ← {prev.title}
                </Link>
              )}
            </div>
            <div className="text-right">
              {next && (
                <Link
                  className="underline decoration-neutral-400 hover:decoration-neutral-800"
                  href={`/information/${next.slug}`}
                >
                  {next.title} →
                </Link>
              )}
            </div>
          </nav>
        )}

        <InfoCTA />
      </main>
    );
  } catch {
    notFound();
  }
}
