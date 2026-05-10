import levelData from "@/level/level.json";

const COLOR_SETS: Record<string, string[][]> = {
  easy: [
    ["red", "blue"],
    ["green", "yellow"],
    ["blue", "green"],
    ["red", "yellow"],
    ["blue", "purple"],
    ["green", "orange"],
  ],
  medium: [
    ["red", "blue", "green"],
    ["yellow", "purple", "orange"],
    ["blue", "green", "red"],
    ["green", "yellow", "purple"],
    ["red", "orange", "blue"],
  ],
  hard: [
    ["red", "blue", "green", "yellow"],
    ["purple", "orange", "blue", "red"],
    ["green", "yellow", "red", "purple"],
    ["blue", "orange", "green", "yellow"],
  ],
  expert: [
    ["red", "blue", "green", "yellow", "purple"],
    ["orange", "purple", "blue", "red", "green"],
    ["yellow", "red", "purple", "blue", "orange"],
  ],
  "super-hard": [
    ["red", "blue", "green", "yellow", "purple", "orange"],
    ["purple", "orange", "blue", "red", "green", "yellow"],
  ],
};

const LAYOUT_NOTES: Record<string, string[]> = {
  easy: [
    "open board with two main exits",
    "simple 4x6 grid",
    "wide playing field, few obstacles",
    "vertical stacked blocks layout",
    "tutorial-style layout",
    "horizontal lane layout",
  ],
  medium: [
    "split board with mid-level gate",
    "L-shaped piece configuration",
    "tight middle column with dual exits",
    "three-color sort layout",
    "cross-shaped block formation",
  ],
  hard: [
    "dense packed grid with overlapping pieces",
    "narrow corridor between block clusters",
    "four-gate configuration with rotation pieces",
    "top-heavy layout with bottom escape",
    "checkerboard arrangement",
  ],
  expert: [
    "multi-row maze with five exits",
    "tightly nested L and T pieces",
    "diagonal block chain blocking key gates",
    "hex-like packed grid with movable plugs",
  ],
  "super-hard": [
    "Super Hard variant: full 6-color sort with minimal free space",
    "all six colors with interlocked long pieces",
    "Super Hard 6x8 grid with chained dependencies",
    "every gate active with overlapping rotation pieces",
  ],
};

const DIFFICULTY_LABEL: Record<string, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
  expert: "Expert",
  "super-hard": "Super Hard",
};

function pick<T>(arr: T[], key: number): T {
  return arr[key % arr.length];
}

export function getLevelFrameSrc(level: number): string {
  return `/images/levels/level_${level}.webp`;
}

export function hasLevelFrame(level: number): boolean {
  // Frames exist for most levels >= 11; specific gaps live in /public/images/levels/.
  // We list available frames here so the build is fully static.
  return AVAILABLE_FRAMES.has(level);
}

// Frames present on disk in public/images/levels/
const AVAILABLE_FRAMES = new Set<number>([
  11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
  30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48,
  49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 60, 61, 62, 63, 65, 66, 67, 68, 70,
  71, 72, 73, 75, 76, 77, 78, 80, 81, 82, 83, 85, 86, 87, 90, 91, 92, 93, 95,
  96, 97, 98,
]);

export function getLevelFrameAlt(level: number): string {
  const meta = levelData.find((l) => l.Level === level);
  const difficulty = (meta?.difficulty as string) || "easy";
  const label = DIFFICULTY_LABEL[difficulty] ?? "Easy";

  const colors = pick(COLOR_SETS[difficulty] ?? COLOR_SETS.easy, level);
  const layout = pick(LAYOUT_NOTES[difficulty] ?? LAYOUT_NOTES.easy, level);
  const colorList = colors.join(", ");

  return `Block Out! Level ${level} - ${colorList} blocks in ${layout} - ${label} difficulty puzzle`;
}

export function getLevelOgImage(level: number, siteUrl: string): string {
  if (hasLevelFrame(level)) {
    return `${siteUrl}/images/levels/level_${level}.webp`;
  }
  return `${siteUrl}/images/store-assets/app_icon_512.png`;
}
