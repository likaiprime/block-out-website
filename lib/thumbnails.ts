export const THUMBNAIL_CDN_BASE =
  process.env.NEXT_PUBLIC_THUMBNAIL_CDN || "https://cdn.blockout.cc";

export function getCdnThumbnailUrl(youtubeId: string): string {
  return `${THUMBNAIL_CDN_BASE}/thumbnails/${youtubeId.trim()}.avif`;
}

export function getYouTubeThumbnailUrl(
  youtubeId: string,
  quality: "hqdefault" | "mqdefault" = "hqdefault",
): string {
  return `https://i.ytimg.com/vi/${youtubeId.trim()}/${quality}.jpg`;
}
