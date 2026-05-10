"use client";

import { useTranslations } from "next-intl";
import { CheckCircle2, Layers, Brain, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Section } from "@/components/ui/section";
import { cn } from "@/lib/utils";
import {
  ACCENT_CLASSES,
  pickAccent,
  type AccentName,
} from "@/lib/design-tokens";

const ICONS = [Layers, Brain, Sparkles, CheckCircle2];
const FEATURE_ACCENTS: readonly AccentName[] = [
  "blue",
  "orange",
  "purple",
  "green",
];

export function Features() {
  const t = useTranslations("features");
  const items = t.raw("list") as ReadonlyArray<{
    title: string;
    description: string;
  }>;

  return (
    <Section
      id="features"
      tone="bare"
      eyebrow={
        <Badge accent="blue" icon={<Sparkles />}>
          Features
        </Badge>
      }
      title={t("title")}
      subtitle={t("subtitle")}
    >
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {items.map((item, i) => {
          const Icon = ICONS[i % ICONS.length];
          const accent = pickAccent(i, FEATURE_ACCENTS);
          const a = ACCENT_CLASSES[accent];
          return (
            <article
              key={item.title}
              className="group relative flex flex-col rounded-2xl border bg-card overflow-hidden spring-hover hover:shadow-lg hover:shadow-foreground/5 hover:border-foreground/15"
            >
              {/* Big colored top — booster-style header that fills the card width */}
              <div
                className={cn(
                  "relative flex h-28 items-center justify-center overflow-hidden",
                  a.bg,
                )}
              >
                <span aria-hidden className="absolute inset-0 block-shimmer opacity-50" />
                <span
                  aria-hidden
                  className="absolute -right-3 -top-3 text-7xl font-black tabular-nums leading-none text-white/15 select-none"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={cn(
                    "relative inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-white shadow-[inset_0_1px_0_hsl(0_0%_100%/0.35),inset_0_-2px_0_hsl(0_0%_0%/0.15)]",
                    "transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110",
                  )}
                >
                  <Icon className="h-6 w-6" strokeWidth={2.5} />
                </span>
              </div>

              <div className="flex-1 p-6">
                <h3 className="text-lg font-black tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Subtle color bar at the bottom — game-tile signature stripe */}
              <span aria-hidden className={cn("h-1.5 w-full", a.bg)} />
            </article>
          );
        })}
      </div>
    </Section>
  );
}

export default Features;
