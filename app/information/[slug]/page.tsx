// app/ingredients/[slug]/page.tsx
import { notFound } from "next/navigation";
import ImageGallery from "@/components/ImageGallery";
import { createClient } from "@supabase/supabase-js";
import BuyBox from "@/components/BuyBox";
import SpecTable from "@/components/SpecTable";

export const revalidate = 300;

const PLACEHOLDER_PRICE = 10; // temp per-kg price

export default async function IngredientPage({ params }: { params: { slug: string } }) {
  const slug = decodeURIComponent(params.slug);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: ing } = await supabase
    .from("ingredient_stats")
    .select("id,name,slug,description,category,source_type,image_url,min_price,has_verified")
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

  const specPairs: [string, React.ReactNode | null | undefined][] = [
    ["Packaging", "Drum, Plastic Container, Vacuum Packed, etc."],
    ["Cultivation method", "Artificial planting"],
    ["Grade", "Food Grade"],
    ["Form", "Powder"],
    ["Type", "Herbal Extract"],
    ["Extraction Type", "Solvent Extraction"],
    ["Part", "Root"],
    ["Place of Origin", "Shaanxi, China"],
    ["Brand Name", "Ausreson"],
    ["Model Number", "ASRN-ashwagandha powder"],
    ["Product Name", "Organic Ashwagandha Powder"],
    ["Test", "HPLC / UV"],
    ["Service", "OEM / ODM Private Label"],
    ["Certification", "ISO9001 / Halal / Kosher"],
    ["Active Ingredient", "Withanolides (e.g., KSM-66 equivalent)"],
    ["Storage", "Cool, dry place. Avoid sunlight."],
    ["Sample", "Available"],
    ["Shelf Life", "24 months"],
    ["Keyword", "ashwagandha supplements"],
  ];

  return (
    <div className="mx-auto max-w-6xl p-6">
      {/* Top: gallery + buy box */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* ...existing left/right columns... */}
      </div>

      {/* Optional description ... */}

      {/* Full-width specs table */}
      <SpecTable pairs={specPairs} />
    </div>
  );
}
