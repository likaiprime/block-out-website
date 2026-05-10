"use client";

import { useTranslations } from "next-intl";
import { MousePointer2, Lightbulb, Trophy } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Section } from "@/components/ui/section";
import { AccentTile } from "@/components/ui/accent-tile";
import { cn } from "@/lib/utils";
import {
  ACCENT_CLASSES,
  pickAccent,
  type AccentName,
} from "@/lib/design-tokens";

const ICONS = [MousePointer2, Lightbulb, Trophy];
const STEP_ACCENTS: readonly AccentName[] = ["blue", "orange", "green"];

// Background tints for each step card — bg-block-*/[0.06] so the color is
// only barely there, like a colored game-board square.
const STEP_BG: Record<AccentName, string> = {
  red: "bg-block-red/[0.06]",
  orange: "bg-block-orange/[0.06]",
  yellow: "bg-block-yellow/[0.07]",
  green: "bg-block-green/[0.06]",
  blue: "bg-block-blue/[0.06]",
  purple: "bg-block-purple/[0.06]",
};

export function HowToPlay() {
  const t = useTranslations("howToUse");
  const steps = t.raw("steps") as ReadonlyArray<{
    title: string;
    description: string;
  }>;

  return (
    <Section
      id="how-to-play"
      tone="muted"
      eyebrow={<Badge accent="orange">How it works</Badge>}
      title={t("title")}
      subtitle={t("subtitle")}
    >
      <ol className="mt-12 grid gap-5 md:grid-cols-3">
        {steps.map((step, i) => {
          const Icon = ICONS[i % ICONS.length];
          const accent = pickAccent(i, STEP_ACCENTS);
          const a = ACCENT_CLASSES[accent];
          return (
            <li key={step.title}>
              <article
                className={cn(
                  "relative overflow-hidden rounded-2xl border p-6 pt-7 spring-hover hover:shadow-lg hover:shadow-foreground/5 hover:border-foreground/15",
                  STEP_BG[accent],
                )}
              >
                {/* Top accent stripe */}
                <span
                  aria-hidden
                  className={cn("absolute inset-x-0 top-0 h-1", a.bg)}
                />
                {/* Giant background numeral — drives the eye, signature game-tile look */}
                <span
                  aria-hidden
                  className={cn(
                    "pointer-events-none absolute -top-4 -right-2 leading-none tabular-nums select-none italic font-black",
                    a.text,
                  )}
                  style={{
                    fontSize: "130px",
                    opacity: 0.12,
                  }}
                >
                  {i + 1}
                </span>

                <div className="relative flex items-center gap-3">
                  <AccentTile color={accent} size="md">
                    <Icon className="h-5 w-5" strokeWidth={2.5} />
                  </AccentTile>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    {t("stepLabel")}
                    <span
                      className={cn(
                        "block text-2xl font-black tabular-nums",
                        a.text,
                      )}
                    >
                      0{i + 1}
                    </span>
                  </div>
                </div>
                <h3 className="relative mt-5 text-lg font-black tracking-tight">
                  {step.title}
                </h3>
                <p className="relative mt-2 text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </article>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
