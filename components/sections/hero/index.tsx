"use client";

import { Link } from "@/i18n/routing";
import { useState } from "react";
import { ArrowRight, ListOrdered, Sparkles, Star } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Section } from "@/components/ui/section";
import { AccentTile } from "@/components/ui/accent-tile";
import levelData from "@/level/level.json";
import { ACCENT_CLASSES, type AccentName } from "@/lib/design-tokens";

export function Hero() {
  const t = useTranslations("hero");
  const lang = useLocale();
  const [level, setLevel] = useState("");
  const maxLevel = levelData.length;
  const rating = process.env.NEXT_PUBLIC_APP_RATING || "4.74";
  const ratingCount = process.env.NEXT_PUBLIC_APP_RATING_COUNT || "41380";
  const ratingCountFmt = Number(ratingCount).toLocaleString("en-US");

  const handleLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (v === "") return setLevel("");
    const n = parseInt(v, 10);
    if (!Number.isNaN(n) && n >= 1 && n <= maxLevel) setLevel(v);
  };

  const submit = () => {
    if (level)
      window.location.href = lang === "en" ? `/level/${level}/` : `/${lang}/level/${level}/`;
  };

  return (
    <Section
      density="hero"
      className="relative overflow-hidden"
      containerClassName="max-w-6xl"
    >
      {/* Checkerboard backdrop — game-board feel, no rainbow blobs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-checker opacity-60" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] items-center">
        {/* Copy + CTA column */}
        <div className="flex flex-col items-start text-left gap-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge accent="blue" icon={<Sparkles />}>
              {t("badge")}
            </Badge>
            <Badge accent="yellow">
              <Star className="h-3.5 w-3.5 text-block-yellow fill-current" />
              <span className="tabular-nums">{rating}</span>
              <span className="text-muted-foreground font-normal">
                ({ratingCountFmt})
              </span>
            </Badge>
          </div>

          <h1 className="text-balance text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05]">
            {t("title")}
          </h1>

          <p className="text-pretty max-w-xl text-base sm:text-lg text-muted-foreground leading-relaxed">
            {t("description")}
          </p>

          <form
            className="flex w-full max-w-xl items-stretch gap-2 mt-1"
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
          >
            <Input
              type="number"
              inputMode="numeric"
              placeholder={`${t("levelPlaceholder")} 1-${maxLevel}`}
              value={level}
              onChange={handleLevelChange}
              min={1}
              max={maxLevel}
              className="h-12 text-base rounded-2xl shadow-[inset_0_1px_0_hsl(0_0%_100%/0.4),inset_0_-2px_0_hsl(0_0%_0%/0.08)]"
              aria-label={t("levelPlaceholder")}
            />
            <Button
              type="submit"
              size="lg"
              className="gap-2 glow-primary rounded-2xl shadow-[inset_0_1px_0_hsl(0_0%_100%/0.3),inset_0_-3px_0_hsl(0_0%_0%/0.18)]"
            >
              <span className="hidden sm:inline">{t("viewSolution")}</span>
              <ArrowRight className="h-5 w-5" />
            </Button>
          </form>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
            <Button asChild variant="outline" size="lg" className="gap-2">
              <Link href="/level/">
                <ListOrdered className="h-4 w-4" />
                {t("viewAllLevels")}
              </Link>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <Link href="/download/">{t("downloadGame")}</Link>
            </Button>
          </div>

          <dl className="mt-6 grid grid-cols-3 gap-6 sm:gap-10">
            <Stat label={t("statLevels")} value={maxLevel} accent="blue" />
            <Stat label={t("statVideos")} value={maxLevel} accent="orange" />
            <Stat label={t("statLanguages")} value={14} accent="purple" />
          </dl>
        </div>

        {/* Block tower visual column — asymmetric, game-like composition */}
        <div className="relative mx-auto w-full max-w-[440px]">
          <BlockTower />
        </div>
      </div>
    </Section>
  );
}

function BlockTower() {
  return (
    <div className="relative aspect-square w-full">
      {/* Soft colored glow backdrop — replaces game-board grid for a screenshot showcase */}
      <div
        aria-hidden
        className="absolute inset-6 rounded-[2.5rem] bg-gradient-to-br from-block-blue/20 via-block-purple/10 to-block-orange/20 blur-3xl opacity-70"
      />

      {/* Three-screenshot fan — App Store-style preview composition */}
      <Screenshot
        src="/images/store-assets/screenshot_03_boosters.avif"
        alt="Block Out boosters and powerups gameplay"
        delay="0.1s"
        className="absolute left-[1%] bottom-[6%] w-[37%] -rotate-[9deg] z-10"
      />
      <Screenshot
        src="/images/store-assets/screenshot_04_obstacles.avif"
        alt="Block Out obstacles and special blocks"
        delay="0.22s"
        className="absolute right-[1%] bottom-[6%] w-[37%] rotate-[9deg] z-10"
      />
      <Screenshot
        src="/images/store-assets/screenshot_06_gameplay.avif"
        alt="Block Out core color sort gameplay"
        delay="0.36s"
        className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[42%] z-20"
      />

      {/* Floating accent screenshots in corners — decorative, smaller */}
      <Screenshot
        src="/images/store-assets/screenshot_01_cleartheboard.avif"
        alt="Clear the board challenge"
        delay="0.5s"
        floating
        className="hidden sm:block absolute top-[2%] -right-2 w-[20%] rotate-[12deg] z-30"
      />
      <Screenshot
        src="/images/store-assets/screenshot_05_clock.avif"
        alt="Timed level challenge"
        delay="0.64s"
        floating
        floatDelay="1.5s"
        className="hidden sm:block absolute top-[6%] -left-2 w-[20%] -rotate-[12deg] z-30"
      />

      {/* Tiny game-tile accents for color & flavor */}
      <AccentTile
        color="yellow"
        size="md"
        aria-hidden
        className="hidden sm:inline-flex absolute -top-3 left-[42%] -rotate-12 animate-float font-black z-40"
      >
        ★
      </AccentTile>
      <AccentTile
        color="green"
        size="sm"
        aria-hidden
        className="hidden sm:inline-flex absolute -bottom-2 right-[10%] rotate-6 animate-float z-40"
        style={{ animationDelay: "1.2s" }}
      />
    </div>
  );
}

function Screenshot({
  src,
  alt,
  delay,
  className,
  floating,
  floatDelay,
}: {
  src: string;
  alt: string;
  delay: string;
  className: string;
  floating?: boolean;
  floatDelay?: string;
}) {
  return (
    <div
      className={`${className} opacity-0 animate-slide-up`}
      style={{ animationDelay: delay }}
    >
      <div
        className={`relative rounded-2xl overflow-hidden border border-zinc-900/10 dark:border-white/10 bg-zinc-900 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.08)] transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-2 hover:scale-[1.04] hover:shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)] ${floating ? "animate-float" : ""}`}
        style={floating && floatDelay ? { animationDelay: floatDelay } : undefined}
      >
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="block w-full h-auto"
        />
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: number | string;
  accent: AccentName;
}) {
  const a = ACCENT_CLASSES[accent];
  return (
    <div className="flex items-center gap-3">
      <span
        aria-hidden
        className={`block-tile ${a.bg} h-9 w-9 shrink-0 hidden sm:inline-flex`}
      />
      <div className="min-w-0">
        <dt className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
          {label}
        </dt>
        <dd
          className={`mt-0.5 text-2xl sm:text-3xl font-black tabular-nums ${a.text}`}
        >
          {value}
        </dd>
      </div>
    </div>
  );
}
