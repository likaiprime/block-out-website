"use client";

import { Link } from "@/i18n/routing";
import {
  ChevronLeft,
  ChevronRight,
  List,
  Clock,
  Gauge,
  Lightbulb,
  HelpCircle,
  Apple,
  PlayCircle,
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import levelData from "@/level/level.json";
import AdSlot from "@/components/common/AdSlot";
import { cn } from "@/lib/utils";

interface LevelInfo {
  Level: number;
  youtubeid: string;
  Width: number;
  Height: number;
  Duration: number;
  difficulty?: string;
  batch?: string;
  has_video?: boolean;
  super_hard_youtubeid?: string;
  super_hard_duration?: number;
}

export interface LevelGuide {
  level: number;
  difficulty: string;
  description: string;
  tips: string[];
  faq: { q: string; a: string }[];
}

interface LevelSolutionProps {
  levelNumber: string;
  levelInfo: LevelInfo;
  guide: LevelGuide;
  frameSrc?: string | null;
  frameAlt?: string;
}

const DIFFICULTY_BADGE: Record<string, string> = {
  easy: "bg-block-green text-white",
  medium: "bg-block-yellow text-white",
  hard: "bg-block-orange text-white",
  expert: "bg-block-red text-white",
  "super-hard": "bg-block-purple text-white",
};

const DIFFICULTY_TILE: Record<string, string> = {
  easy: "bg-block-green",
  medium: "bg-block-yellow",
  hard: "bg-block-orange",
  expert: "bg-block-red",
  "super-hard": "bg-block-purple",
};

const CDN_BASE =
  process.env.NEXT_PUBLIC_THUMBNAIL_CDN || "https://cdn.blockout.cc";

// rotating accents for tip cards
const TIP_ACCENTS = [
  "bg-block-blue",
  "bg-block-orange",
  "bg-block-green",
  "bg-block-purple",
  "bg-block-red",
  "bg-block-yellow",
];

export function LevelSolution({
  levelNumber,
  levelInfo,
  guide,
  frameSrc,
  frameAlt,
}: LevelSolutionProps) {
  const t = useTranslations("level");
  const tHeader = useTranslations("header");
  const lang = useLocale();
  const homeLabel =
    (tHeader.raw("navigation") as Array<{ name: string }>)[0]?.name ?? "Home";
  const labels = t.raw("difficultyLabels") as Record<string, string>;
  const maxLevel = levelData.length;
  const current = levelInfo.Level;
  const prevLevel = current > 1 ? current - 1 : null;
  const nextLevel = current < maxLevel ? current + 1 : null;
  const minutes = Math.floor(levelInfo.Duration / 60);
  const seconds = Math.floor(levelInfo.Duration % 60);
  const difficulty = guide.difficulty;
  const difficultyLabel =
    labels[difficulty] ?? difficulty.replace("-", " ");

  const related = buildRelatedLevels(current, maxLevel);

  const ytid = (levelInfo.youtubeid || "").trim();
  const cdnFallback = ytid ? `${CDN_BASE}/thumbnails/${ytid}.avif` : null;
  const effectiveFrameSrc = frameSrc ?? cdnFallback;
  const frameIsPhoneShot = !!frameSrc;

  return (
    <section className="pt-[calc(5rem+env(safe-area-inset-top))] pb-28 md:pb-16">
      <div className="container max-w-4xl">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="text-sm text-muted-foreground mb-6"
        >
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link
                href="/"
                className="hover:text-foreground transition-colors"
              >
                {homeLabel}
              </Link>
            </li>
            <li aria-hidden className="text-muted-foreground/50">
              /
            </li>
            <li>
              <Link
                href="/level/"
                className="hover:text-foreground transition-colors"
              >
                {t("levelList")}
              </Link>
            </li>
            <li aria-hidden className="text-muted-foreground/50">
              /
            </li>
            <li className="text-foreground font-semibold">
              {t("levelLabel")} {current}
            </li>
          </ol>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 flex-wrap mb-4">
            <span
              className={cn(
                "badge-difficulty capitalize",
                DIFFICULTY_BADGE[difficulty] || "bg-muted text-muted-foreground"
              )}
            >
              <Gauge className="h-3 w-3" strokeWidth={2.5} />
              {difficultyLabel}
            </span>
            <span className="badge-difficulty bg-secondary text-secondary-foreground">
              <Clock className="h-3 w-3" strokeWidth={2.5} />
              {minutes > 0 ? `${minutes}m ` : ""}
              {seconds}s
            </span>
            <span className="badge-difficulty bg-block-blue/10 text-block-blue border border-block-blue/25">
              <PlayCircle className="h-3 w-3" strokeWidth={2.5} />
              Video walkthrough
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-balance leading-[1.1]">
            {t("solutionTitle").replace("{level}", levelNumber)}
          </h1>
          <p className="mt-4 text-muted-foreground text-base sm:text-lg leading-relaxed">
            {guide.description}
          </p>
        </header>

        {/* Level frame screenshot — phone-mockup for true portrait shots,
            simple shadow card when falling back to CDN video thumbnail. */}
        {effectiveFrameSrc ? (
          <figure className="mb-8 flex flex-col items-center">
            {frameIsPhoneShot ? (
              <div className="relative max-w-[280px] sm:max-w-[320px] w-full">
                <div className="relative rounded-[2.25rem] overflow-hidden bg-foreground shadow-2xl shadow-foreground/30">
                  {/* Notch */}
                  <div
                    aria-hidden
                    className="absolute top-0 left-1/2 -translate-x-1/2 z-10 h-5 w-24 bg-foreground rounded-b-2xl"
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={effectiveFrameSrc}
                    alt={frameAlt ?? `Block Out! Level ${levelNumber} preview`}
                    width={1080}
                    height={1920}
                    loading="eager"
                    className="block w-full h-auto"
                  />
                </div>
              </div>
            ) : (
              <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-black shadow-2xl shadow-foreground/25">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={effectiveFrameSrc}
                  alt={frameAlt ?? `Block Out! Level ${levelNumber} preview`}
                  loading="eager"
                  className="block w-full h-auto"
                />
              </div>
            )}
            <figcaption className="mt-4 text-xs text-muted-foreground text-center max-w-md">
              {frameAlt ?? `Level ${levelNumber} starting board preview.`}
            </figcaption>
          </figure>
        ) : null}

        {/* Video — responsive aspect ratio, capped at 500px tall on desktop */}
        {levelInfo.youtubeid ? (
          <>
            <div
              className="relative mx-auto w-full max-w-4xl overflow-hidden rounded-2xl bg-black shadow-2xl shadow-foreground/25 transition-shadow duration-300 hover:shadow-foreground/40 max-h-[min(70vh,500px)]"
              style={{
                aspectRatio: `${levelInfo.Width} / ${levelInfo.Height}`,
              }}
            >
              <iframe
                key={levelInfo.youtubeid}
                src={`https://www.youtube.com/embed/${levelInfo.youtubeid}?rel=0&modestbranding=1`}
                title={t("solutionTitle").replace("{level}", levelNumber)}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
                className="absolute inset-0 h-full w-full"
              />
            </div>
            {levelInfo.batch ? (
              <p className="text-xs text-muted-foreground/80 mt-3 text-center">
                {t("batchNote")
                  .replace("{level}", levelNumber)
                  .replace("{batch}", levelInfo.batch)}
              </p>
            ) : null}
          </>
        ) : (
          <div className="rounded-2xl bg-card/70 backdrop-blur-md p-6 text-sm text-muted-foreground shadow-lg shadow-foreground/5">
            {t("noVideoNote")}
          </div>
        )}

        {/* Super-Hard variant */}
        {levelInfo.super_hard_youtubeid ? (
          <div className="mt-4 rounded-2xl border border-block-purple/30 bg-block-purple/5 p-5">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-3">
                <span className="block-tile inline-flex h-10 w-10 items-center justify-center bg-block-purple text-white">
                  <Gauge className="h-4 w-4" strokeWidth={2.5} />
                </span>
                <div>
                  <div className="font-bold text-block-purple">
                    {t("superHardTitle")}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t("superHardNote")}
                  </p>
                </div>
              </div>
              <Button asChild size="sm" variant="outline">
                <a
                  href={`https://www.youtube.com/watch?v=${levelInfo.super_hard_youtubeid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("watchSuperHard")}
                </a>
              </Button>
            </div>
          </div>
        ) : null}

        {/* Prev / List / Next — fixed bar on phones */}
        <div className="fixed bottom-0 inset-x-0 z-40 md:static md:z-auto border-t border-border bg-background/95 backdrop-blur-md md:border-0 md:bg-transparent md:backdrop-blur-none px-4 md:px-0 pt-3 md:pt-0 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:pb-0 mt-0 md:mt-6">
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <Button
            asChild
            variant="outline"
            className="h-12 min-h-11 justify-start min-w-0"
            disabled={!prevLevel}
          >
            {prevLevel ? (
              <Link
                href={`/level/${prevLevel}/`}
                aria-label={`${t("prevLevel")} ${prevLevel}`}
              >
                <ChevronLeft className="h-4 w-4 shrink-0" />
                <span className="ml-1 truncate text-sm">
                  <span className="font-bold tabular-nums">{prevLevel}</span>
                </span>
              </Link>
            ) : (
              <span className="opacity-50">—</span>
            )}
          </Button>
          <Button asChild variant="outline" className="h-12 min-h-11 justify-center px-2">
            <Link href="/level/">
              <List className="h-4 w-4 shrink-0" />
              <span className="ml-1 truncate text-sm hidden min-[380px]:inline">
                {t("levelList")}
              </span>
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-12 min-h-11 justify-end min-w-0"
            disabled={!nextLevel}
          >
            {nextLevel ? (
              <Link
                href={`/level/${nextLevel}/`}
                aria-label={`${t("nextLevel")} ${nextLevel}`}
              >
                <span className="mr-1 truncate text-sm">
                  <span className="font-bold tabular-nums">{nextLevel}</span>
                </span>
                <ChevronRight className="h-4 w-4 shrink-0" />
              </Link>
            ) : (
              <span className="opacity-50">—</span>
            )}
          </Button>
          </div>
        </div>

        <AdSlot className="my-12" placeholderRatio="6 / 1" />

        {/* Tips */}
        <section aria-labelledby="tips-heading" className="mt-12">
          <h2
            id="tips-heading"
            className="flex items-center gap-2.5 text-2xl sm:text-3xl font-black tracking-tight"
          >
            <span className="block-tile inline-flex h-9 w-9 items-center justify-center bg-block-yellow text-white">
              <Lightbulb className="h-4 w-4" strokeWidth={2.5} />
            </span>
            {t("tipsTitle")}
          </h2>
          <ol className="mt-6 space-y-3">
            {guide.tips.map((tip, i) => {
              const accent = TIP_ACCENTS[i % TIP_ACCENTS.length];
              return (
                <li
                  key={i}
                  className="spring-hover relative flex gap-4 rounded-2xl border bg-card p-5 hover:border-foreground/15 hover:shadow-md hover:shadow-foreground/5 overflow-hidden"
                >
                  <span
                    aria-hidden
                    className={`absolute inset-y-0 left-0 w-1 ${accent}`}
                  />
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${accent} text-white text-sm font-black tabular-nums`}
                  >
                    {i + 1}
                  </span>
                  <p className="text-sm sm:text-base leading-relaxed pt-1.5">
                    {tip}
                  </p>
                </li>
              );
            })}
          </ol>
        </section>

        {/* Game info */}
        <section aria-labelledby="info-heading" className="mt-12">
          <h2
            id="info-heading"
            className="text-2xl sm:text-3xl font-black tracking-tight"
          >
            {t("gameInfoTitle")}
          </h2>
          <dl className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              [t("infoGame"), process.env.NEXT_PUBLIC_GAME_NAME || "Block Out!"],
              [
                t("infoDeveloper"),
                process.env.NEXT_PUBLIC_GAME_DEVELOPER || "Grand Games",
              ],
              [t("infoPlatform"), "iOS"],
              [t("infoGenre"), "Color sort puzzle"],
            ].map(([k, v]) => (
              <div
                key={k}
                className="rounded-2xl border bg-card p-4 spring-hover hover:border-foreground/15"
              >
                <dt className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                  {k}
                </dt>
                <dd className="mt-1.5 font-bold">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm" className="gap-2">
              <a
                href={
                  process.env.NEXT_PUBLIC_APP_STORE_URL ||
                  "https://apps.apple.com/us/app/block-out-color-sort-puzzle/id6752672568"
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                <Apple className="h-4 w-4" /> App Store
              </a>
            </Button>
          </div>
        </section>

        {/* Related levels */}
        {related.length > 0 && (
          <section aria-labelledby="related-heading" className="mt-12">
            <h2
              id="related-heading"
              className="text-2xl sm:text-3xl font-black tracking-tight"
            >
              {t("relatedTitle")}
            </h2>
            <ul className="mt-6 grid grid-cols-3 sm:grid-cols-5 gap-3">
              {related.map((n) => {
                const m = levelData.find((l) => l.Level === n);
                const tile =
                  DIFFICULTY_TILE[m?.difficulty as string] ?? "bg-block-blue";
                const yt = (m?.youtubeid || "").trim();
                const diffLabel = m?.difficulty
                  ? labels[m.difficulty] ?? m.difficulty.replace("-", " ")
                  : "";
                return (
                  <li key={n}>
                    <Link
                      href={`/level/${n}/`}
                      className={cn(
                        "group relative block aspect-square min-h-[44px] overflow-hidden rounded-2xl",
                        "shadow-xl shadow-foreground/15 ring-1 ring-foreground/5",
                        "transition-all duration-300 will-change-transform",
                        "hover:shadow-2xl hover:shadow-foreground/30 hover:-translate-y-0.5 hover:scale-[1.03]",
                        !yt && tile
                      )}
                    >
                      {yt ? (
                        <>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={`${CDN_BASE}/thumbnails/${yt}.avif`}
                            alt={`Block Out! Level ${n} thumbnail`}
                            loading="lazy"
                            decoding="async"
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <span
                            aria-hidden
                            className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent"
                          />
                          <span className="absolute inset-x-2 bottom-2 flex items-center justify-between gap-2">
                            <span className="rounded-lg bg-black/35 backdrop-blur-md px-2 py-0.5 text-white font-black tabular-nums text-base shadow-md shadow-black/40">
                              {n}
                            </span>
                            {diffLabel && (
                              <span className="rounded-full bg-black/35 backdrop-blur-md px-2 py-0.5 text-[9px] uppercase tracking-wider font-bold text-white">
                                {diffLabel}
                              </span>
                            )}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="absolute inset-0 flex items-center justify-center text-white font-black tabular-nums text-2xl drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]">
                            {n}
                          </span>
                          {diffLabel && (
                            <span className="absolute inset-x-2 bottom-2 flex justify-center">
                              <span className="rounded-full bg-black/30 backdrop-blur-sm px-2 py-0.5 text-[9px] uppercase tracking-wider font-bold text-white">
                                {diffLabel}
                              </span>
                            </span>
                          )}
                        </>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {/* FAQ */}
        <section aria-labelledby="faq-heading" className="mt-12">
          <h2
            id="faq-heading"
            className="flex items-center gap-2.5 text-2xl sm:text-3xl font-black tracking-tight"
          >
            <span className="block-tile inline-flex h-9 w-9 items-center justify-center bg-block-purple text-white">
              <HelpCircle className="h-4 w-4" strokeWidth={2.5} />
            </span>
            {t("faqTitle")}
          </h2>
          <Accordion
            type="single"
            collapsible
            className="mt-6 rounded-2xl border bg-card divide-y divide-border overflow-hidden"
          >
            {guide.faq.map((item, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="border-b-0 px-5"
              >
                <AccordionTrigger className="text-left text-base font-semibold hover:no-underline py-4">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </div>
    </section>
  );
}

function buildRelatedLevels(current: number, max: number): number[] {
  const candidates = [
    current - 2,
    current - 1,
    current + 1,
    current + 2,
    current + 5,
  ];
  return candidates
    .filter((n) => n >= 1 && n <= max && n !== current)
    .slice(0, 5);
}
