import Link from "next/link";

export default function RelatedPosts({ items }:{items:{slug:string,title:string,description?:string}[]}) {
  if (!items?.length) return null;
  return (
    <div className="not-prose mt-10">
      <h3 className="text-base font-semibold">Related</h3>
      <ul className="mt-2 space-y-2">
        {items.map(p => (
          <li key={p.slug}>
            <Link href={`/information/${p.slug}`} className="underline">{p.title}</Link>
            {p.description && <div className="text-sm text-neutral-600">{p.description}</div>}
          </li>
        ))}
      </ul>
    </div>
  );
}
