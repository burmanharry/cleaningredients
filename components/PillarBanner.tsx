"use client";
import Link from "next/link";

export default function PillarBanner({ category }: { category?: string }) {
  if (!category) return null;
  const hubSlug = `${category.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
  }-guide`;

  return (
    <div className="not-prose mt-8 rounded-xl border bg-neutral-50 p-4 text-sm">
      Part of <strong>{category}</strong>.{" "}
      <Link href={`/information/${hubSlug}`} className="underline">
        See the complete guide →
      </Link>
    </div>
  );
}
