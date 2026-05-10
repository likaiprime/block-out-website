/**
 * Single source of truth for difficulty → accent mapping.
 *
 * Canonical: DESIGN.md §2.3.
 *
 * Replaces the duplicated DIFFICULTY_TILE / DIFFICULTY_TEXT / DIFFICULTY_DOT
 * maps that were previously copy-pasted across LevelList, LevelHighlights, etc.
 */

import type { AccentName } from "./accents";

export const DIFFICULTIES = [
  "easy",
  "medium",
  "hard",
  "expert",
  "super-hard",
] as const;

export type Difficulty = (typeof DIFFICULTIES)[number];

export const DIFFICULTY_TO_ACCENT: Record<Difficulty, AccentName> = {
  easy: "green",
  medium: "yellow",
  hard: "orange",
  expert: "red",
  "super-hard": "purple",
};

/** Safe lookup: unknown difficulty falls back to blue (i.e. "neutral / unranked"). */
export function accentForDifficulty(value: string | null | undefined): AccentName {
  if (!value) return "blue";
  return (DIFFICULTY_TO_ACCENT as Record<string, AccentName>)[value] ?? "blue";
}
