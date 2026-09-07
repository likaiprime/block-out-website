"use client";

import { useState } from "react";

import {
  getCdnThumbnailUrl,
  getYouTubeThumbnailUrl,
} from "@/lib/thumbnails";

interface LevelThumbnailProps {
  youtubeId: string;
  alt?: string;
  className?: string;
  loading?: "lazy" | "eager";
  width?: number;
  height?: number;
}

/** CDN AVIF first; falls back to YouTube hqdefault when CDN is missing. */
export function LevelThumbnail({
  youtubeId,
  alt = "",
  className,
  loading = "lazy",
  width,
  height,
}: LevelThumbnailProps) {
  const id = youtubeId.trim();
  const [src, setSrc] = useState(() => getCdnThumbnailUrl(id));

  const handleError = () => {
    const fallback = getYouTubeThumbnailUrl(id);
    setSrc((current) => (current === fallback ? current : fallback));
  };

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      decoding="async"
      onError={handleError}
      className={className}
    />
  );
}
