"use client";

import { useState, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";

import levelData from "@/level/level.json";
import { cn } from "@/lib/utils";
import {
  ACCENT_CLASSES,
  accentForDifficulty,
  DIFFICULTIES,
} from "@/lib/design-tokens";
import AdSlot from "@/components/common/AdSlot";
import { LevelThumbnail } from "@/components/common/LevelThumbnail";
import { resolveLevelVideoId } from "@/lib/thumbnails";

const GROUP_SIZE = 25;

export function LevelList() {
  const t = useTranslations("level");
  const lang = useLocale();
  const [active, setActive] = useState(0);
  const labels = t.raw("difficultyLabels") as Record<string, string>;

  const groups = useMemo(() => {
    const valid = levelData.filter((l) => typeof l.Level === "number");
    const max = valid.length;
    const groupCount = Math.ceil(max / GROUP_SIZE);
    return Array.from({ length: groupCount }, (_, i) => {
      const start = i * GROUP_SIZE + 1;
      const end = Math.min((i + 1) * GROUP_SIZE, max);
      return {
        start,
        end,
        items: valid.filter((l) => l.Level >= start && l.Level <= end),
      };
    });
  }, []);

  return (
    <section className="pt-[calc(5rem+env(safe-area-inset-top))] pb-16">
      <div className="container">
        <header className="mb-8 max-w-2xl">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            {t("title")}
          </h1>
          <p className="mt-3 text-muted-foreground text-lg">{t("subtitle")}</p>
        </header>

        <div className="sticky top-[calc(4rem+env(safe-area-inset-top))] z-30 -mx-5 md:mx-0 bg-background/90 backdrop-blur-md mb-8 shadow-lg shadow-foreground/5 border-b border-border/60 md:border-0">
          <div
            role="tablist"
            aria-label={t("title")}
            className="flex flex-wrap gap-2 px-5 md:px-0 py-3"
          >
            {groups.map((g, i) => (
              <button
                key={g.start}
                role="tab"
                aria-selected={active === i}
                onClick={() => setActive(i)}
                className={cn(
                  "px-3 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all min-h-11",
                  active === i
                    ? "bg-block-blue text-white shadow-md shadow-block-blue/40"
                    : "bg-card/70 backdrop-blur-sm text-muted-foreground hover:text-foreground hover:bg-card shadow-sm shadow-foreground/5",
                )}
              >
                {g.start}–{g.end}
              </button>
            ))}
          </div>
        </div>

        <AdSlot className="mb-8" placeholderRatio="8 / 1" />

        {groups.map((g, i) => (
          <div
            key={g.start}
            role="tabpanel"
            hidden={active !== i}
            className="animate-fade-in"
          >
            <h2 className="sr-only">
              {t("levelLabel")} {g.start}–{g.end}
            </h2>
            <ul className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-x-3 gap-y-5">
              {g.items.map((lvl) => {
                const accent = accentForDifficulty(lvl.difficulty as string);
                const cls = ACCENT_CLASSES[accent];
                const diffLabel =
                  labels[lvl.difficulty as string] ??
                  (lvl.difficulty || "").replace("-", " ");
                const yt = resolveLevelVideoId(lvl);
                return (
                  <li
                    key={lvl.Level}
                    className="flex flex-col items-stretch gap-1.5"
                  >
                    <Link
                      href={`/level/${lvl.Level}/`}
                      aria-label={`${t("levelLabel")} ${lvl.Level} — ${diffLabel}`}
                      className={cn(
                        "group relative block aspect-square min-h-[44px] overflow-hidden rounded-2xl",
                        "shadow-lg shadow-foreground/15",
                        "transition-all duration-300 will-change-transform",
                        "hover:shadow-2xl hover:shadow-foreground/35 hover:scale-105",
                        !yt && cls.bg,
                      )}
                    >
                      {yt ? (
                        <>
                          <LevelThumbnail
                            youtubeId={yt}
                            alt=""
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <span
                            aria-hidden
                            className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent"
                          />
                          <span className="absolute inset-x-0 bottom-1.5 flex justify-center">
                            <span className="rounded-lg bg-black/35 backdrop-blur-md px-2 py-0.5 text-white font-black tabular-nums text-base sm:text-lg shadow-md shadow-black/40">
                              {lvl.Level}
                            </span>
                          </span>
                        </>
                      ) : (
                        <span className="absolute inset-0 flex items-center justify-center text-white font-black tabular-nums text-base sm:text-lg drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]">
                          {lvl.Level}
                        </span>
                      )}
                    </Link>
                    <span
                      className={cn(
                        "text-center text-[10px] uppercase tracking-wider font-bold truncate",
                        cls.text,
                      )}
                    >
                      {diffLabel}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        <DifficultyLegend />
      </div>
    </section>
  );
}

function DifficultyLegend() {
  const t = useTranslations("level");
  const labels = t.raw("difficultyLabels") as Record<string, string>;
  return (
    <div className="mt-12 rounded-2xl bg-card/70 backdrop-blur-md p-5 shadow-lg shadow-foreground/5">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm">
        <span className="font-bold text-foreground">{t("difficultyLegend")}</span>
        {DIFFICULTIES.map((k) => {
          const cls = ACCENT_CLASSES[accentForDifficulty(k)];
          return (
            <span
              key={k}
              className="inline-flex items-center gap-2 text-muted-foreground"
            >
              <span className={cn("block-tile h-4 w-4", cls.bg)} />
              <span className="font-medium text-foreground">{labels[k]}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
