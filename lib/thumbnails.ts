export const THUMBNAIL_CDN_BASE =
  process.env.NEXT_PUBLIC_THUMBNAIL_CDN || "https://cdn.blockout.cc";

export interface LevelVideoIds {
  youtubeid?: string;
  super_hard_youtubeid?: string;
}

/** Primary walkthrough id, then Super Hard variant when the main slot is empty. */
export function resolveLevelVideoId(level: LevelVideoIds): string {
  return (level.youtubeid || level.super_hard_youtubeid || "").trim();
}

export function getCdnThumbnailUrl(youtubeId: string): string {
  return `${THUMBNAIL_CDN_BASE}/thumbnails/${youtubeId.trim()}.avif`;
}

export function getYouTubeThumbnailUrl(
  youtubeId: string,
  quality: "hqdefault" | "mqdefault" = "hqdefault",
): string {
  return `https://i.ytimg.com/vi/${youtubeId.trim()}/${quality}.jpg`;
}
