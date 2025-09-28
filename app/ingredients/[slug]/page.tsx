// app/ingredients/[slug]/page.tsx
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import ImageGallery from "@/components/ImageGallery";
import BuyBox from "@/components/BuyBox";
import SpecTable from "@/components/SpecTable";

const PLACEHOLDER_PRICE = 10; // temp price per kg
export const revalidate = 300;

export default async function IngredientPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // prefer the wrapper view if you have it; otherwise switch to ingredient_stats
  const { data: ing } = await supabase
    .from("ingredient_stats_plus")
    .select(
      "id,name,slug,description,category,source_type,image_url,min_price,has_verified,specs"
    )
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

  const specPairs: [string, string][] = rawSpecs
    ? (ORDER.map(([key, label]) => {
        const v = rawSpecs[key as string];
        if (v == null || String(v).trim() === "") return null;
        return [label, String(v)] as [string, string];
      }).filter(Boolean) as [string, string][])
    : [];

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <ImageGallery images={images} alt={ing.name} />
        </div>

        <aside className="lg:col-span-5 space-y-4">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
        
          </h1>

          <div className="flex items-center gap-2 text-sm">
            {ing.category && (
              <span className="inline-block rounded-full bg-neutral-100 px-2 py-0.5">
                {ing.category}
              </span>
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
            // If you already fetch real Stripe prices for this ingredient,
            // pass them here as `prices` to enable the “Add to cart & Pay” flow.
          />
        </aside>
      </div>

      {ing.description && (
        <div className="mt-10">
          <h2 className="text-lg font-semibold">About this ingredient</h2>
          <p className="mt-2 leading-7 text-neutral-800">{ing.description}</p>
        </div>
      )}

      <SpecTable pairs={specPairs} />
    </div>
  );
}
