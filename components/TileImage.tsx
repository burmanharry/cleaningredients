"use client";

import { useEffect, useRef, useState } from "react";

export default function TileImage({
  sources,
  alt,
}: {
  sources: string[];
  alt: string;
}) {
  const [i, setI] = useState(0);
  const [loading, setLoading] = useState(true);
  const imgRef = useRef<HTMLImageElement>(null);

  // Final, safe src: try sources[i], else placeholder
  const src =
    (sources[i] && typeof sources[i] === "string" ? sources[i] : undefined) ??
    "/images/placeholder.jpg";

  // When src changes, show loader; if image is already cached, hide it immediately
  useEffect(() => {
    setLoading(true);
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth > 0) {
      setLoading(false);
    }
  }, [src]);

  // If we somehow ran past the list, just stop loading (placeholder will be used)
  useEffect(() => {
    if (i > sources.length) {
      setLoading(false);
    }
  }, [i, sources.length]);

  const handleError = () => {
    // Advance to next source (but don’t overflow infinitely)
    setI((prev) => (prev + 1 <= sources.length ? prev + 1 : prev));
  };

  return (
    <>
      {/* Real image fills the square container (parent is relative + aspect-square) */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading="lazy"
        className={`absolute inset-0 h-full w-full object-cover ${
          loading ? "opacity-0" : "opacity-100"
        } transition-opacity duration-300`}
        onLoad={() => setLoading(false)}
        onError={handleError}
      />

      {/* Skeleton overlay while loading */}
      {loading && <div className="absolute inset-0 animate-pulse bg-neutral-200" />}
    </>
  );
}
