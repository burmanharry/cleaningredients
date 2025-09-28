// app/information/page.tsx
import Link from "next/link";
import { listPosts } from "@/lib/posts";

export const revalidate = 300;

export default async function InformationIndex(
  { searchParams }: { searchParams: Promise<{ q?: string }> }
) {
  const { q } = await searchParams;

  const posts = await listPosts();
  const filtered = q
    ? posts.filter((p) => {
        const hay = [
          p.title || "",
          p.description || "",
          p.category || "",
          ...(p.tags || []),
        ]
          .join(" ")
          .toLowerCase();
        return hay.includes(q.toLowerCase());
      })
    : posts;

  // group by category
  const groups = new Map<string, typeof filtered>();
  for (const p of filtered) {
    const cat = p.category?.trim() || "General";
    if (!groups.has(cat)) groups.set(cat, []);
    groups.get(cat)!.push(p);
  }
  const sections = Array.from(groups.entries()).sort(([a], [b]) =>
    a.localeCompare(b)
  );

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
        Information
      </h1>
      <p className="mt-3 text-neutral-700">
        Articles on verification, quality, compliance, pricing, sourcing,
        formulation, and top botanicals.
      </p>
      {q && (
        <div className="mt-2 text-sm text-neutral-600">
          Filtered by: <b>{q}</b>
        </div>
      )}

      {sections.map(([category, items]) => (
        <section
          key={category}
          className="mt-10"
          id={category.toLowerCase().replace(/\s+/g, "-")}
        >
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">{category}</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p) => (
              <Link
                key={p.slug}
                href={`/information/${p.slug}`}
                className="rounded-2xl border p-4 hover:shadow-sm transition"
              >
                <h3 className="font-medium">{p.title}</h3>
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
      ))}
    </main>
  );
}
