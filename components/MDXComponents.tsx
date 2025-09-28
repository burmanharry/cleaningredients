// components/MDXComponents.tsx
import * as React from "react";

export function Callout({
  children,
  type = "note",
}: { children: React.ReactNode; type?: "note" | "warn" | "tip" }) {
  const colors =
    type === "warn" ? "bg-amber-50 border-amber-200"
    : type === "tip"  ? "bg-emerald-50 border-emerald-200"
    :                   "bg-neutral-50 border-neutral-200";
  return (
    <div className={`not-prose my-4 rounded-xl border p-4 ${colors}`}>
      <div className="prose">{children}</div>
    </div>
  );
}

const MDXComponents = {
  a: (p: React.ComponentProps<"a">) => (
    <a {...p} className="underline decoration-neutral-400 hover:decoration-neutral-800" />
  ),
  img: (p: React.ComponentProps<"img">) => (
    <img {...p} className="rounded-xl border border-neutral-200" />
  ),
  table: (p: React.ComponentProps<"table">) => (
    <div className="not-prose overflow-x-auto">
      <table {...p} className="w-full border-collapse text-sm" />
    </div>
  ),
  pre: (p: React.ComponentProps<"pre">) => (
    <pre {...p} className="not-prose rounded-xl bg-neutral-950 text-neutral-100 p-4 overflow-x-auto" />
  ),
  code: (p: React.ComponentProps<"code">) => (
    <code {...p} className="rounded bg-neutral-100 px-1 py-0.5" />
  ),
  Callout,
};

export default MDXComponents;
