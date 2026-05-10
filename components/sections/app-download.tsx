"use client";

import {
  Apple,
  Star,
  ShieldCheck,
  Download,
  Sparkles,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";

export default function AppDownload() {
  const t = useTranslations("appDownload");
  const appStore =
    process.env.NEXT_PUBLIC_APP_STORE_URL ||
    "https://apps.apple.com/us/app/block-out-color-sort-puzzle/id6752672568";
  const rating = process.env.NEXT_PUBLIC_APP_RATING || "4.74";
  const ratingCount = process.env.NEXT_PUBLIC_APP_RATING_COUNT || "41380";
  const ratingNum = Number(rating);
  const ratingCountFmt = Number(ratingCount).toLocaleString("en-US");

  return (
    <section
      id="download"
      className="relative py-20 sm:py-24 border-b overflow-hidden"
    >
      {/* subtle game-color wash */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-block-blue/5 via-transparent to-transparent" />
        <div className="absolute -top-20 left-1/4 h-72 w-72 rounded-full bg-block-orange/10 blur-3xl" />
        <div className="absolute -bottom-20 right-1/4 h-72 w-72 rounded-full bg-block-purple/10 blur-3xl" />
      </div>

      <div className="container max-w-5xl">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-block-green/25 bg-block-green/10 px-3 py-1 text-xs font-semibold text-block-green">
            <Sparkles className="h-3.5 w-3.5" />
            Free Download
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-black tracking-tight">
            {t("title")}
          </h2>
          {t("subtitle") && (
            <p className="mt-3 text-muted-foreground text-lg max-w-2xl mx-auto">
              {t("subtitle")}
            </p>
          )}
        </div>

        {/* Trust badges row */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-10">
          <div className="inline-flex items-center gap-3 rounded-2xl border bg-card px-4 py-3 shadow-sm spring-hover">
            <span
              className="flex items-center gap-0.5"
              aria-label={`${rating} out of 5 stars`}
            >
              {[0, 1, 2, 3, 4].map((i) => {
                const fill = Math.max(0, Math.min(1, ratingNum - i));
                return (
                  <span key={i} className="relative inline-block h-4 w-4">
                    <Star className="absolute inset-0 h-4 w-4 text-muted-foreground/30" />
                    <span
                      className="absolute inset-0 overflow-hidden"
                      style={{ width: `${fill * 100}%` }}
                    >
                      <Star
                        className="h-4 w-4 text-block-yellow"
                        fill="currentColor"
                      />
                    </span>
                  </span>
                );
              })}
            </span>
            <div className="flex flex-col leading-tight">
              <span className="text-base font-bold tabular-nums">{rating}</span>
              <span className="text-[11px] text-muted-foreground">
                {ratingCountFmt} ratings
              </span>
            </div>
          </div>

          <TrustBadge
            icon={<ShieldCheck className="h-4 w-4" strokeWidth={2.5} />}
            color="text-block-green"
            bg="bg-block-green/10"
            border="border-block-green/25"
            label="No ads"
            sub="Clean play"
          />
          <TrustBadge
            icon={<Download className="h-4 w-4" strokeWidth={2.5} />}
            color="text-block-blue"
            bg="bg-block-blue/10"
            border="border-block-blue/25"
            label="1M+"
            sub="Downloads"
          />
        </div>

        {/* Download CTA */}
        <div className="flex justify-center max-w-md mx-auto">
          <Button
            asChild
            size="lg"
            className="h-16 text-base gap-3 bg-foreground text-background hover:bg-foreground/90 px-8 rounded-2xl spring-hover shadow-lg shadow-foreground/20"
          >
            <Link href={appStore} target="_blank" rel="noopener noreferrer">
              <Apple className="!h-7 !w-7" />
              <span className="flex flex-col items-start leading-tight">
                <span className="text-[11px] font-medium opacity-80">
                  {t("platforms.ios.tagline")}
                </span>
                <span className="font-bold text-lg">App Store</span>
              </span>
            </Link>
          </Button>
        </div>

        {/* 6-color signature line */}
        <div
          aria-hidden
          className="mt-10 flex justify-center items-center gap-1.5"
        >
          {[
            "bg-block-red",
            "bg-block-orange",
            "bg-block-yellow",
            "bg-block-green",
            "bg-block-blue",
            "bg-block-purple",
          ].map((c) => (
            <span key={c} className={`h-1.5 w-8 rounded-full ${c}`} />
          ))}
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {t("developerLine").replace(
            "{developer}",
            process.env.NEXT_PUBLIC_GAME_DEVELOPER || "Grand Games"
          )}
        </p>
      </div>
    </section>
  );
}

function TrustBadge({
  icon,
  color,
  bg,
  border,
  label,
  sub,
}: {
  icon: React.ReactNode;
  color: string;
  bg: string;
  border: string;
  label: string;
  sub: string;
}) {
  return (
    <div
      className={`spring-hover inline-flex items-center gap-3 rounded-2xl border ${border} ${bg} px-4 py-3`}
    >
      <span
        className={`inline-flex h-9 w-9 items-center justify-center rounded-lg bg-card ${color}`}
      >
        {icon}
      </span>
      <div className="flex flex-col leading-tight">
        <span className="text-base font-bold">{label}</span>
        <span className="text-[11px] text-muted-foreground">{sub}</span>
      </div>
    </div>
  );
}
