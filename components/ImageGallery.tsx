"use client";

import * as React from "react";
import clsx from "clsx";

type Props = {
  images: string[];
  alt: string;
};

export default function ImageGallery({ images, alt }: Props) {
  const valid = images.filter(Boolean);
  const [active, setActive] = React.useState(0);

  if (valid.length === 0) {
    return (
      <div className="grid aspect-square w-full place-items-center rounded-2xl border border-neutral-200 text-sm text-neutral-500">
        No image
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[64px_1fr] gap-4">
      {/* Thumbnails */}
      <div className="flex max-h-[480px] flex-col gap-3 overflow-auto">
        {valid.map((src, i) => (
          <button
            type="button"
            key={`${src}-${i}`}
            onClick={() => setActive(i)}
            aria-pressed={active === i}
            className={clsx(
              "relative h-16 w-16 overflow-hidden rounded-xl bg-white border border-neutral-200",
              active === i && "outline outline-2 -outline-offset-2 outline-black"
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>

      {/* Main image */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-white border border-neutral-200">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={valid[active]}
          alt={alt}
          className="absolute inset-0 h-full w-full object-contain"
        />
      </div>
    </div>
  );
}
