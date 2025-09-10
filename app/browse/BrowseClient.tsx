// app/browse/BrowseClient.tsx
"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Cat = "all" | "antioxidant" | "adaptogen" | "nootropic" | "longevity";

export default function BrowseClient({ initialCategory }: { initialCategory: Cat }) {
  const router = useRouter();
  const params = useSearchParams();

  const [category, setCategory] = React.useState<Cat>(initialCategory);

  // If the user navigates via back/forward and the query changes,
  // keep the select in sync with the URL.
  React.useEffect(() => {
    const q = (params.get("category") ?? "all").toLowerCase() as Cat;
    if (q !== category) setCategory(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  function handleChange(next: Cat) {
    setCategory(next);
    const qs = next === "all" ? "" : `?category=${next}`;
    router.replace(`/browse${qs}`); // keep URL in sync
    // call your existing "apply" filter here if needed
    // handleApply(next)
  }

  return (
    <select
      value={category}
      onChange={(e) => handleChange(e.target.value as Cat)}
      className="rounded-md border px-3 py-2"
      aria-label="Category"
    >
      <option value="all">All</option>
      <option value="antioxidant">Antioxidant</option>
      <option value="adaptogen">Adaptogen</option>
      <option value="nootropic">Nootropic</option>
      <option value="longevity">Longevity</option>
    </select>
  );
}

