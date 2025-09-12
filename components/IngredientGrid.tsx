// components/IngredientGrid.tsx
import IngredientCard, { type IngredientTile } from "./IngredientCard";

export default function IngredientGrid({ items }: { items: IngredientTile[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((it) => (
        <IngredientCard key={it.id} {...it} />
      ))}
    </div>
  );
}
