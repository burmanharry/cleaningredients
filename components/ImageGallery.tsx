"use client";

import * as React from "react";
import Image from "next/image";

type Props = {
  images: string[];        // ordered by preference
  alt: string;
};

export default function ImageGallery({ images, alt }: Props) {
  // keep unique, non-empty strings
  const srcs = React.useMemo(
    () => Array.from(new Set(images.filter(Boolean))),
    [images]
  );

  const [active, setActive] = React.useState(0);

  if (srcs.length === 0) {
    return (
      <div className="aspect-square w-full rounded-2xl ring-1 ring-neutral-200 bg-neutral-50 grid place-items-center text-neutral-400">
        No image
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[80px_1fr] gap-4">
      {/* Thumbnails */}
      <ul className="flex flex-col gap-3 overflow-auto p-2">
        {srcs.map((src, i) => (
          <li key={src} className="shrink-0">
<button
  onClick={() => setActive(i)}
  className={`relative aspect-square w-[70px] rounded-xl ring-1 ring-neutral-200 overflow-hidden
    ${i === active ? "outline outline-2 outline-black" : ""}
    p-2 flex items-center justify-center bg-white`}
  aria-label={`View image ${i + 1}`}
>
  <Image
    src={src}
    alt=""
    fill
    sizes="70px"
    className="object-contain object-center"
    priority={i === 0}
  />
</button>


          </li>
        ))}
      </ul>

      {/* Main image */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl ring-1 ring-neutral-200 bg-white">
        <Image
          key={srcs[active]}
          src={srcs[active]}
          alt={alt}
          fill
          sizes="(min-width:1024px) 50vw, 100vw"
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
}
