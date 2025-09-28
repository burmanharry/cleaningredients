"use client";
import { useEffect, useState } from "react";

export default function AutoTOC() {
  const [links, setLinks] = useState<{id:string; text:string}[]>([]);
  useEffect(() => {
    const hs = Array.from(document.querySelectorAll("article h2, article h3")) as HTMLElement[];
    setLinks(hs.filter(h => h.id).map(h => ({ id: h.id, text: h.innerText })));
  }, []);
  if (!links.length) return null;
  return (
    <nav className="not-prose mb-8 rounded-xl border p-4 text-sm">
      <div className="font-medium mb-2">On this page</div>
      <ul className="space-y-1">
        {links.map(l => (
          <li key={l.id}><a className="underline" href={`#${l.id}`}>{l.text}</a></li>
        ))}
      </ul>
    </nav>
  );
}
