/**
 * Accent token registry for the six Block Out! game colors.
 *
 * Canonical source: DESIGN.md §2.1 + §11.
 * Use these instead of ad-hoc `bg-block-*` strings so the palette stays consistent
 * and renames propagate from one place.
 *
 * Tailwind v4 needs class strings to appear verbatim in source for the JIT to
 * generate them — that's why each surface is written out (no template strings).
 */

export const ACCENT_NAMES = [
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "purple",
] as const;

export type AccentName = (typeof ACCENT_NAMES)[number];

export interface AccentClassSet {
  /** solid fill (e.g. block-tile background) */
  bg: string;
  /** soft tinted fill (10% opacity) for chip backgrounds */
  bgSoft: string;
  /** text color */
  text: string;
  /** border at 25% opacity for outlined chips */
  border: string;
  /** border at 30% opacity for ring/highlight */
  ring: string;
  /** 1px top accent bar inside cards */
  bar: string;
}

export const ACCENT_CLASSES: Record<AccentName, AccentClassSet> = {
  red: {
    bg: "bg-block-red",
    bgSoft: "bg-block-red/10",
    text: "text-block-red",
    border: "border-block-red/25",
    ring: "ring-block-red/30",
    bar: "bg-block-red",
  },
  orange: {
    bg: "bg-block-orange",
    bgSoft: "bg-block-orange/10",
    text: "text-block-orange",
    border: "border-block-orange/25",
    ring: "ring-block-orange/30",
    bar: "bg-block-orange",
  },
  yellow: {
    bg: "bg-block-yellow",
    bgSoft: "bg-block-yellow/10",
    text: "text-block-yellow",
    border: "border-block-yellow/30",
    ring: "ring-block-yellow/30",
    bar: "bg-block-yellow",
  },
  green: {
    bg: "bg-block-green",
    bgSoft: "bg-block-green/10",
    text: "text-block-green",
    border: "border-block-green/25",
    ring: "ring-block-green/30",
    bar: "bg-block-green",
  },
  blue: {
    bg: "bg-block-blue",
    bgSoft: "bg-block-blue/10",
    text: "text-block-blue",
    border: "border-block-blue/25",
    ring: "ring-block-blue/30",
    bar: "bg-block-blue",
  },
  purple: {
    bg: "bg-block-purple",
    bgSoft: "bg-block-purple/10",
    text: "text-block-purple",
    border: "border-block-purple/25",
    ring: "ring-block-purple/30",
    bar: "bg-block-purple",
  },
};

/** Cycle through accent names (modulo) — useful for grid-of-cards layouts. */
export function pickAccent(index: number, palette: readonly AccentName[] = ACCENT_NAMES): AccentName {
  return palette[((index % palette.length) + palette.length) % palette.length];
}
