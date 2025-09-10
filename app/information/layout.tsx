// app/information/layout.tsx
export default function InformationLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <article className="prose prose-neutral max-w-none">
        {children}
      </article>
    </main>
  );
}
