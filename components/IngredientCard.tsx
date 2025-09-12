// components/IngredientCard.tsx
import Link from "next/link";

type Item = {
  id: number;
  name: string;
  slug: string;
  image_url?: string | null;
  category?: string | null;
  source_type?: string | null;
  short_description?: string | null;
  has_verified?: boolean | null;
  min_price?: number | null;
};

export default function IngredientCard({ item }: { item: Item }) {
  const href  = `/ingredients/${encodeURIComponent(item.slug)}`;
  const image = item.image_url || `/images/ingredients/${item.slug}.jpg`;

  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded-2xl border border-black/10 bg-white hover:shadow-md transition"
    >
      <div className="relative aspect-[4/3] bg-neutral-100">
        <img
          src={image}
          alt={item.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          loading="lazy"
        />
        {item.has_verified ? (
          <span className="absolute top-3 left-3 rounded-full bg-white/95 px-2 py-1 text-xs font-semibold shadow ring-1 ring-black/10">
            Verified
          </span>
        ) : null}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="font-medium">{item.name}</div>
          {item.category && (
            <span className="shrink-0 rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-700">
              {item.category}
            </span>
          )}
        </div>

        {item.short_description && (
          <p className="mt-1 text-sm text-neutral-700 line-clamp-2">
            {item.short_description}
          </p>
        )}

        <div className="mt-2 text-sm text-neutral-700">
          {item.min_price != null ? (
            <>From <span className="font-semibold">${Number(item.min_price).toFixed(2)}</span> / kg</>
          ) : (
            <span className="text-neutral-500">No active listings</span>
          )}
        </div>
      </div>
    </Link>
  );
}
