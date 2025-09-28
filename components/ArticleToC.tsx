"use client";
import * as React from "react";

export default function ArticleToC() {
  const [items, setItems] = React.useState<{ id: string; text: string; level: number }[]>([]);
  const [active, setActive] = React.useState<string>("");

  React.useEffect(() => {
    const nodes = Array.from(document.querySelectorAll("article h2, article h3")) as HTMLHeadingElement[];
    const list = nodes.map(h => {
      const id = h.id || h.textContent?.toLowerCase().replace(/\s+/g,"-").replace(/[^\w-]/g,"") || "";
      if (!h.id) h.id = id;
      return { id, text: h.textContent || "", level: h.tagName === "H3" ? 3 : 2 };
    });
    setItems(list);

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive((visible[0].target as HTMLElement).id);
      },
      { rootMargin: "0px 0px -70% 0px", threshold: [0, 1] }
    );
    nodes.forEach(n => obs.observe(n));
    return () => obs.disconnect();
  }, []);

  if (items.length === 0) return null;

  return (
    <nav className="sticky top-24 hidden lg:block pl-6 border-l">
      <div className="text-xs uppercase tracking-wide text-neutral-500 mb-3">On this page</div>
      <ul className="space-y-2 text-sm">
        {items.map(i => (
          <li key={i.id} className={i.level === 3 ? "ml-3" : ""}>
            <a
              href={`#${i.id}`}
              className={`hover:underline ${active === i.id ? "font-semibold" : ""}`}
            >
              {i.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
