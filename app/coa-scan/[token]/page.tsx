// app/coa-scan/[token]/page.tsx
import { notFound } from "next/navigation";
import type { Metadata, PageProps } from "next";

type Params = { token: string };

export const revalidate = 0;

export default async function Page(props: PageProps<Params>) {
  const { token } = await props.params;

  if (!token || token.length > 256) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-2xl font-semibold">COA Scan</h1>
      <p className="mt-2 text-sm text-gray-500">
        Token: <code className="rounded bg-gray-100 px-1 py-0.5">{token}</code>
      </p>

      <section className="mt-8 rounded-2xl border p-6">
        <p className="text-gray-700">
          This page is wired for Next 15. Add your data fetch/rendering using the token above.
        </p>
      </section>
    </main>
  );
}

export async function generateMetadata(
  props: PageProps<Params>
): Promise<Metadata> {
  const { token } = await props.params;
  return {
    title: `COA Scan • ${token?.slice(0, 8) ?? ""}`,
    description: "COA scan result",
  };
}
