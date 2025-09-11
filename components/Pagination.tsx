// components/Pagination.tsx
"use client";

import { useRouter } from "next/navigation";

export default function Pagination({
  total,
  page,
  limit,
  pathname,
  searchParams,
}: {
  total: number;
  page: number;
  limit: number;
  pathname: string;
  searchParams: Record<string, any>;
}) {
  const router = useRouter();
  const totalPages = Math.max(1, Math.ceil(total / limit));
  if (totalPages <= 1) return null;

  function go(to: number) {
    const next = new URLSearchParams(searchParams as any);
    next.set("page", String(to));
    router.push(`${pathname}?${next.toString()}`);
  }

  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      <button
        disabled={page <= 1}
        onClick={() => go(page - 1)}
        className="rounded-xl border px-3 py-1 disabled:opacity-50"
      >
        Prev
      </button>
      <div className="text-sm text-neutral-700">
        Page {page} of {totalPages}
      </div>
      <button
        disabled={page >= totalPages}
        onClick={() => go(page + 1)}
        className="rounded-xl border px-3 py-1 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
