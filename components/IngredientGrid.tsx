// components/IngredientGrid.tsx
import IngredientCard, { type IngredientTile } from "./IngredientCard";

export default function IngredientGrid({ items }: { items: ReadonlyArray<IngredientTile> }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <IngredientCard key={String(item.slug ?? item.id)} item={item} />
      ))}
    </div>
  );
}
