"use client";

import { getYouTubeThumbnailUrl } from "@/lib/thumbnails";

interface LevelThumbnailProps {
  youtubeId: string;
  alt?: string;
  className?: string;
  loading?: "lazy" | "eager";
  width?: number;
  height?: number;
}

/** YouTube walkthrough frame — reliable for all levels with a video id. */
export function LevelThumbnail({
  youtubeId,
  alt = "",
  className,
  loading = "lazy",
  width,
  height,
}: LevelThumbnailProps) {
  const id = youtubeId.trim();
  if (!id) return null;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={getYouTubeThumbnailUrl(id)}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      decoding="async"
      referrerPolicy="no-referrer"
      className={className}
    />
  );
}
