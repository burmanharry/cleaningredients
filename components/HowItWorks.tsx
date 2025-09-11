import { EyeOff, FlaskConical, FileCheck2, ShieldCheck } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      title: "Anonymous sample request",
      desc: "We anonymously request samples from multiple suppliers—no buyer details shared.",
      Icon: EyeOff,
    },
    {
      title: "Forwarded to a U.S. lab",
      desc: "The sealed samples are sent to an independent U.S. laboratory for analysis.",
      Icon: FlaskConical,
    },
    {
      title: "Results cross-checked",
      desc: "We verify test results against the supplier’s specs/COA before listing, then feature the highest-quality option.",
      Icon: FileCheck2,
    },
    {
      title: "Buyer lot verification (optional)",
      desc: "Buyers can send a sample of the delivered lot through our Request-a-Test service.",
      Icon: ShieldCheck,
    },
  ] as const;

  return (
    <section className="mx-auto max-w-6xl px-6 py-20" aria-labelledby="how-it-works">
      <div className="mb-8 text-center">
        <p className="text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">How it works</p>
        <h2 id="how-it-works" className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
          Lab-verified sourcing you can trust
        </h2>
        <p className="mt-3 max-w-2xl mx-auto text-muted-foreground">
          We verify ingredients before they go live—and give buyers an easy way to validate delivered lots.
        </p>
      </div>

      <ol className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <li
            key={s.title}
            className="group relative rounded-2xl border bg-white p-8 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md flex flex-col"
          >
            <span className="absolute left-4 top-4 inline-flex h-7 min-w-7 items-center justify-center rounded-full border bg-white px-2 text-xs font-semibold">
              {i + 1}
            </span>

            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border bg-gradient-to-b from-white to-neutral-50 group-hover:shadow">
              <s.Icon className="h-8 w-8" aria-hidden />
            </div>

            <h3 className="text-center text-base font-semibold leading-tight">{s.title}</h3>
            <p className="mt-2 text-center text-sm text-muted-foreground">{s.desc}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
