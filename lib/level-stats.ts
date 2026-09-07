import levelData from "@/level/level.json";
import { resolveLevelVideoId } from "@/lib/thumbnails";

export function getTotalLevels(): number {
  return levelData.length;
}

/** Levels with at least one walkthrough video id (main or super-hard). */
export function getWalkthroughCount(): number {
  return levelData.filter((l) => resolveLevelVideoId(l)).length;
}
