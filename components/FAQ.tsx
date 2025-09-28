// components/FAQ.tsx
export default function FAQ({ items }: { items: { q: string; a: string }[] }) {
  if (!items?.length) return null;
  return (
    <section className="mt-12 border-t pt-8">
      <h2 className="text-lg font-semibold mb-4">Frequently asked questions</h2>
      <div className="space-y-4">
        {items.map((f, i) => (
          <details key={i} className="rounded-xl border p-4">
            <summary className="cursor-pointer font-medium">{f.q}</summary>
            <div className="mt-2 text-sm text-neutral-800 leading-6">{f.a}</div>
          </details>
        ))}
      </div>
    </section>
  );
}
