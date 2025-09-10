// app/browse/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import Image from "next/image";

interface Ingredient {
  name: string;
  category: string;
  image: string;
}

const INGREDIENTS: Ingredient[] = [
  {
    name: "Resveratrol",
    category: "antioxidant",
    image: "/images/ingredients/resveratrol.jpg",
  },
  {
    name: "Vitamin C",
    category: "antioxidant",
    image: "/images/ingredients/vitamin-c.jpg",
  },
  {
    name: "Ashwagandha",
    category: "adaptogen",
    image: "/images/ingredients/ashwagandha-extract.jpg",
  },
  {
    name: "Lion's Mane",
    category: "nootropic",
    image: "/images/ingredients/lions-mane.jpg",
  },
];

export default function Browse() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  const filtered = category
    ? INGREDIENTS.filter(
        (item) => item.category.toLowerCase() === category.toLowerCase()
      )
    : INGREDIENTS;

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-semibold tracking-tight mb-8">
        {category
          ? category.charAt(0).toUpperCase() + category.slice(1)
          : "All Ingredients"}
      </h1>

      {filtered.length === 0 ? (
        <p className="text-gray-600">No ingredients found in this category.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((item) => (
            <div
              key={item.name}
              className="group block overflow-hidden rounded-2xl border border-black/10 bg-white hover:shadow-md transition"
            >
              <div className="relative aspect-[4/3] bg-neutral-100">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />
              </div>
              <div className="p-4">
                <div className="font-medium">{item.name}</div>
                <div className="mt-1 text-sm text-muted-foreground">
                  Verified suppliers • U.S. lab-tested
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
