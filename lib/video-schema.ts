const DEFAULT_UPLOAD_DATE =
  process.env.NEXT_PUBLIC_APP_RELEASE_DATE || "2025-10-31";

export interface LevelVideoSource {
  youtubeid?: string;
  super_hard_youtubeid?: string;
  Duration?: number;
  super_hard_duration?: number;
  upload_date?: string;
  super_hard_upload_date?: string;
}

function maxResThumbnail(youtubeId: string): string {
  return `https://i.ytimg.com/vi/${youtubeId.trim()}/maxresdefault.jpg`;
}

function hqThumbnail(youtubeId: string): string {
  return `https://i.ytimg.com/vi/${youtubeId.trim()}/hqdefault.jpg`;
}

function toIsoDate(raw?: string): string {
  const value = (raw || "").trim();
  if (!value) return DEFAULT_UPLOAD_DATE;
  if (/^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0, 10);
  if (/^\d{8}$/.test(value)) {
    return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
  }
  return DEFAULT_UPLOAD_DATE;
}

function durationSeconds(seconds?: number): string {
  const s = Math.max(1, Math.round(seconds || 0));
  return `PT${s}S`;
}

export function buildVideoObjectSchema(options: {
  youtubeId: string;
  name: string;
  description: string;
  uploadDate?: string;
  durationSeconds?: number;
  frameUrl?: string;
}) {
  const id = options.youtubeId.trim();
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: options.name,
    description: options.description,
    thumbnailUrl: [
      maxResThumbnail(id),
      hqThumbnail(id),
      ...(options.frameUrl ? [options.frameUrl] : []),
    ],
    uploadDate: toIsoDate(options.uploadDate),
    duration: durationSeconds(options.durationSeconds),
    embedUrl: `https://www.youtube.com/embed/${id}`,
    contentUrl: `https://www.youtube.com/watch?v=${id}`,
  };
}

/** One VideoObject, or ItemList when main + super-hard differ. */
export function buildLevelVideoSchemas(options: {
  level: number;
  gameName: string;
  difficulty: string;
  description: string;
  levelInfo: LevelVideoSource;
  frameUrl?: string;
}): Record<string, unknown>[] {
  const { level, gameName, difficulty, description, levelInfo, frameUrl } =
    options;
  const mainId = (levelInfo.youtubeid || "").trim();
  const superId = (levelInfo.super_hard_youtubeid || "").trim();

  const entries: {
    id: string;
    label: string;
    duration?: number;
    uploadDate?: string;
  }[] = [];

  if (mainId) {
    entries.push({
      id: mainId,
      label: "Walkthrough",
      duration: levelInfo.Duration,
      uploadDate: levelInfo.upload_date,
    });
  }
  if (superId && superId !== mainId) {
    entries.push({
      id: superId,
      label: "Super Hard",
      duration: levelInfo.super_hard_duration ?? levelInfo.Duration,
      uploadDate: levelInfo.super_hard_upload_date ?? levelInfo.upload_date,
    });
  }

  if (entries.length === 0) return [];

  const baseDescription =
    description ||
    `Video walkthrough of ${gameName} Level ${level}, a ${difficulty} color-sort puzzle.`;

  if (entries.length === 1) {
    const e = entries[0];
    return [
      buildVideoObjectSchema({
        youtubeId: e.id,
        name: `${gameName} Level ${level} ${e.label}`,
        description: baseDescription,
        uploadDate: e.uploadDate,
        durationSeconds: e.duration,
        frameUrl,
      }),
    ];
  }

  return [
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `${gameName} Level ${level} Walkthroughs`,
      description: baseDescription,
      itemListElement: entries.map((e, i) => ({
        "@type": "VideoObject",
        position: i + 1,
        name: `${gameName} Level ${level} ${e.label} Walkthrough`,
        description: baseDescription,
        thumbnailUrl: maxResThumbnail(e.id),
        uploadDate: toIsoDate(e.uploadDate),
        duration: durationSeconds(e.duration),
        embedUrl: `https://www.youtube.com/embed/${e.id}`,
        contentUrl: `https://www.youtube.com/watch?v=${e.id}`,
      })),
    },
  ];
}
