// app/thank-you/page.tsx
export const dynamic = "force-dynamic";

export default function ThankYou() {
  // You can read ?sid=... here if you want to show a nicer message later
  return (
    <main className="mx-auto max-w-2xl p-8 text-center">
      <h1 className="text-3xl font-semibold">Thanks—order received!</h1>
      <p className="mt-3 text-neutral-700">
        We’ll email tracking as soon as it ships. Questions?{" "}
        <a className="underline" href="mailto:support@cleaningredients.com">
          support@cleaningredients.com
        </a>
      </p>
      <a className="inline-block mt-6 rounded-xl bg-black text-white px-5 py-2.5" href="/ingredients">
        Continue browsing
      </a>
    </main>
  );
}
