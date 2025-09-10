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
        <p className="text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
          How it works
        </p>
        <h2 id="how-it-works" className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
          Lab-verified sourcing you can trust
        </h2>
        <p className="mt-3 max-w-2xl mx-auto text-muted-foreground">
          We verify ingredients before they go live—and give buyers an easy way to validate
          delivered lots.
        </p>
      </div>

      {/* items-stretch ensures equal card heights */}
      <ol className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
        {steps.map((s, i) => (
          <li
            key={s.title}
            className="group relative flex flex-col items-center text-center rounded-2xl border bg-white p-8 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            {/* step number */}
            <span className="absolute left-4 top-4 inline-flex h-7 min-w-7 items-center justify-center rounded-full border bg-white px-2 text-xs font-semibold">
              {i + 1}
            </span>

            {/* ICON + TITLE: fixed height so descriptions align across cards */}
            <div className="mt-2 flex flex-col items-center min-h-[100px] sm:min-h-[120px]">
              <div className="h-16 w-16 rounded-2xl border bg-gradient-to-b from-white to-neutral-50 grid place-items-center group-hover:shadow">
                <s.Icon className="h-8 w-8" aria-hidden />
              </div>
              <h3 className="mt-4 text-base font-semibold leading-tight">
                {s.title}
              </h3>
            </div>

            {/* DESCRIPTION — now starts at the same y-position for all cards */}
            <p className="mt-1 text-sm text-muted-foreground">
              {s.desc}
            </p>
          </li>
        ))}
      </ol>

      
    </section>
  );
}
