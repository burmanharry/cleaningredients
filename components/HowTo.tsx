// components/HowTo.tsx
export default function HowTo({ name, steps }: { name?: string; steps?: string[] }) {
  if (!steps?.length) return null;
  return (
    <section className="mt-12 border-t pt-8">
      <h2 className="text-lg font-semibold mb-4">{name || "How to do it"}</h2>
      <ol className="space-y-2 list-decimal list-inside">
        {steps.map((s, i) => (
          <li key={i} className="text-sm text-neutral-800 leading-6">{s}</li>
        ))}
      </ol>
    </section>
  );
}
