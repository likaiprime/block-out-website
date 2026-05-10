"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { ArrowUpRight, Trophy, PlayCircle } from "lucide-react";

import levelData from "@/level/level.json";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Section } from "@/components/ui/section";
import {
  ACCENT_CLASSES,
  accentForDifficulty,
} from "@/lib/design-tokens";

const HIGHLIGHTS = [1, 10, 25, 50, 75, 100];

const CDN_BASE =
  process.env.NEXT_PUBLIC_THUMBNAIL_CDN || "https://cdn.blockout.cc";

export function LevelHighlights() {
  const t = useTranslations("level");
  const lang = useLocale();
  const maxLevel = levelData.length;
  const visible = HIGHLIGHTS.filter((n) => n <= maxLevel);
  const labels = t.raw("difficultyLabels") as Record<string, string>;

  return (
    <Section className="relative">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div className="max-w-2xl">
          <Badge accent="purple" icon={<Trophy />}>
            Highlights
          </Badge>
          <h2 className="mt-4 text-3xl sm:text-4xl font-black tracking-tight">
            {t("highlightsTitle")}
          </h2>
          <p className="mt-3 text-muted-foreground text-lg">
            {t("highlightsSubtitle")}
          </p>
        </div>
        <Link
          href="/level/"
          className="group inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-all"
        >
          {t("viewAll")}
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>

      <ul className="mt-10 grid gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-3">
        {visible.map((n, i) => {
          const lvl = levelData.find((l) => l.Level === n);
          const accent = accentForDifficulty(lvl?.difficulty as string);
          const cls = ACCENT_CLASSES[accent];
          const difficultyLabel =
            labels[lvl?.difficulty as string] ??
            lvl?.difficulty?.replace("-", " ") ??
            "easy";
          const yt = (lvl?.youtubeid || "").trim();
          // Stagger the tilt direction so the grid feels hand-laid like game tiles.
          const tilt = i % 2 === 0 ? "hover:-rotate-2" : "hover:rotate-2";
          return (
            <li
              key={n}
              style={{ animationDelay: `${i * 70}ms` }}
              className="opacity-0 animate-slide-up"
            >
              <Link
                href={`/level/${n}/`}
                className={cn(
                  "group relative block aspect-[4/3] min-h-[44px] overflow-hidden rounded-2xl",
                  "shadow-[0_10px_30px_-12px_hsl(var(--foreground)/0.35),inset_0_1px_0_hsl(0_0%_100%/0.35),inset_0_-3px_0_hsl(0_0%_0%/0.18)]",
                  "transition-all duration-300 will-change-transform",
                  "hover:shadow-[0_20px_40px_-12px_hsl(var(--foreground)/0.45),inset_0_1px_0_hsl(0_0%_100%/0.45),inset_0_-3px_0_hsl(0_0%_0%/0.2)] hover:-translate-y-1.5",
                  tilt,
                  !yt && cls.bg,
                )}
              >
                {yt ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`${CDN_BASE}/thumbnails/${yt}.avif`}
                      alt={`Block Out! Level ${n} walkthrough thumbnail`}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <span
                      aria-hidden
                      className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"
                    />
                    {/* Color difficulty bar across the top, signature game-tile cue */}
                    <span
                      aria-hidden
                      className={cn("absolute inset-x-0 top-0 h-1.5", cls.bg)}
                    />
                    <span className="absolute top-3 right-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-black/45 backdrop-blur-md text-white shadow-md shadow-black/40 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                      <PlayCircle className="h-5 w-5" strokeWidth={2.5} />
                    </span>
                    <div className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-2">
                      <span className="rounded-2xl bg-black/45 backdrop-blur-md px-3 py-1.5 text-white font-black tabular-nums text-4xl sm:text-5xl shadow-md shadow-black/40">
                        {n}
                      </span>
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold text-white shadow-sm shadow-black/40",
                          cls.bg,
                        )}
                      >
                        {difficultyLabel}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <span
                      aria-hidden
                      className="absolute inset-0 block-shimmer opacity-60"
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-white">
                      <span className="text-7xl sm:text-8xl font-black tabular-nums italic transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_3px_0_hsl(0_0%_0%/0.18)]">
                        {n}
                      </span>
                    </span>
                    <span className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2">
                      <span className="text-[10px] uppercase tracking-wider text-white/90 font-bold">
                        {t("levelLabel")}
                      </span>
                      <span className="rounded-full px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold bg-white/25 backdrop-blur-sm text-white">
                        {difficultyLabel}
                      </span>
                      <span className={cn("hidden", cls.text)} />
                    </span>
                  </>
                )}
              </Link>
            </li>
          );
        })}

      </ul>
    </Section>
  );
}
