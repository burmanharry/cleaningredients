// components/IngredientsFilters.tsx
import Link from "next/link";

export type FiltersPanelProps = {
  categories: string[];
  sources: string[];
  active: {
    category?: string;
    source?: string;
  };
};

export default function FiltersPanel({ categories, sources, active }: FiltersPanelProps) {
  return (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="text-lg font-semibold">Categories</h3>
        <ul className="mt-2 space-y-1">
          <li>
            <Link
              href={`/browse${active.source ? `?source=${encodeURIComponent(active.source)}` : ""}`}
              className={!active.category ? "font-semibold underline" : "hover:underline"}
            >
              All
            </Link>
          </li>
          {categories.map((c) => (
            <li key={c}>
              <Link
                href={`/browse?category=${encodeURIComponent(c)}${
                  active.source ? `&source=${encodeURIComponent(active.source)}` : ""
                }`}
                className={active.category === c ? "font-semibold underline" : "hover:underline"}
              >
                {c}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Source */}
      <div>
        <h3 className="text-lg font-semibold">Source</h3>
        <ul className="mt-2 space-y-1">
          <li>
            <Link
              href={`/browse${active.category ? `?category=${encodeURIComponent(active.category)}` : ""}`}
              className={!active.source ? "font-semibold underline" : "hover:underline"}
            >
              All
            </Link>
          </li>
          {sources.map((s) => (
            <li key={s}>
              <Link
                href={`/browse?source=${encodeURIComponent(s)}${
                  active.category ? `&category=${encodeURIComponent(active.category)}` : ""
                }`}
                className={active.source === s ? "font-semibold underline" : "hover:underline"}
              >
                {s}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
