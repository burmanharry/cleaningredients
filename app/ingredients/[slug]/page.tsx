import { notFound } from "next/navigation";
import ImageGallery from "@/components/ImageGallery";
import { createClient } from "@supabase/supabase-js";
import BuyBox from "@/components/BuyBox";
import SpecTable from "@/components/SpecTable"; // ⬅️ add this

const PLACEHOLDER_PRICE = 10; // temp price per kg
export const revalidate = 300;

export default async function IngredientPage({ params }: { params: { slug: string } }) {
  const slug = decodeURIComponent(params.slug);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: ing } = await supabase
  .from("ingredient_stats_plus") // ← new wrapper view that includes specs
  .select("id,name,slug,description,category,source_type,image_url,min_price,has_verified,specs")
  .eq("slug", slug)
  .maybeSingle();

  if (!ing) notFound();

  const isPlaceholder = ing.min_price == null;
  const pricePerKg = isPlaceholder ? PLACEHOLDER_PRICE : Number(ing.min_price);

  const images: string[] = [
    ing.image_url || "",
    `/images/ingredients/${ing.slug}.jpg`,
    `/images/ingredients/${ing.slug}-2.jpg`,
    `/images/ingredients/${ing.slug}-3.jpg`,
  ];

type SpecsJson = Record<string, string | number | boolean | null | undefined>;

const ORDER: Array<[keyof SpecsJson, string]> = [
  ["packaging", "Packaging"],
  ["cultivation_method", "Cultivation method"],
  ["grade", "Grade"],
  ["form", "Form"],
  ["type", "Type"],
  ["extraction_type", "Extraction Type"],
  ["part", "Part"],
  ["place_of_origin", "Place of Origin"],
  ["brand_name", "Brand Name"],
  ["model_number", "Model Number"],
  ["product_name", "Product Name"],
  ["test", "Test"],
  ["service", "Service"],
  ["certification", "Certification"],
  ["active_ingredient", "Active Ingredient"],
  ["storage", "Storage"],
  ["sample", "Sample"],
  ["shelf_life", "Shelf Life"],
  ["keyword", "Keyword"],
];

const rawSpecs = (ing as any)?.specs as SpecsJson | null;

const specPairs: [string, string][] = [];
if (rawSpecs) {
  const used = new Set<string>();

  // 1) Add in your preferred order
  for (const [key, label] of ORDER) {
    const v = rawSpecs[key];
    if (v != null && String(v).trim() !== "") {
      specPairs.push([label, String(v)]);
      used.add(String(key));
    }
  }

  // 2) Append any remaining keys (handles mismatched casing/names)
  for (const [k, v] of Object.entries(rawSpecs)) {
    if (used.has(k) || v == null || String(v).trim() === "") continue;
    const label = k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    specPairs.push([label, String(v)]);
  }
}

  return (
    <div className="mx-auto max-w-6xl p-6">
      {/* Top: gallery + buy box */}
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <ImageGallery images={images} alt={ing.name} />
        </div>

        <aside className="lg:col-span-5 space-y-4">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">{ing.name}</h1>

          <div className="flex items-center gap-2 text-sm">
            {ing.category && (
              <span className="inline-block rounded-full bg-neutral-100 px-2 py-0.5">{ing.category}</span>
            )}
            {ing.has_verified && (
              <span className="inline-block rounded-full bg-green-100 px-2 py-0.5 font-medium text-green-700">
                Lab-certified
              </span>
            )}
          </div>

          <BuyBox
            pricePerKg={pricePerKg}
            ingredientId={ing.id}
            ingredientName={ing.name}
            isPlaceholder={isPlaceholder}
          />
        </aside>
      </div>

      {/* Optional short description */}
      {ing.description && (
        <div className="mt-10">
          <h2 className="text-lg font-semibold">About this ingredient</h2>
          <p className="mt-2 leading-7 text-neutral-800">{ing.description}</p>
        </div>
      )}

      {/* Full-width specs table */}
      <SpecTable pairs={specPairs} />
    </div>
  );
}
