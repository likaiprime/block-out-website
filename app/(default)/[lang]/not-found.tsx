"use client";

import { Link } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";

type NavItem = { name: string; href: string };

export default function NotFound() {
  const tHeader = useTranslations("header");
  const lang = useLocale();
  const nav = tHeader.raw("navigation") as ReadonlyArray<NavItem>;
  return (
    <main className="pt-32 pb-24">
      <div className="container max-w-xl text-center">
        <div className="block-grid mx-auto mb-8 max-w-[220px]">
          {[
            "bg-block-red",
            "bg-block-blue",
            "bg-block-yellow",
            "bg-block-green",
            "bg-block-purple",
            "bg-block-orange",
          ].map((c, i) => (
            <div
              key={c}
              className={`block-tile aspect-square ${c} flex items-center justify-center text-white font-black text-2xl sm:text-3xl`}
            >
              {["4", "0", "4", "?", "?", "?"][i]}
            </div>
          ))}
        </div>
        <p className="text-sm font-bold text-block-blue uppercase tracking-wider">
          404
        </p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-black tracking-tight">
          Page not found
        </h1>
        <p className="mt-3 text-muted-foreground">
          That level or page doesn&apos;t exist (yet).
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl bg-primary px-5 h-11 text-sm font-semibold text-primary-foreground hover:-translate-y-0.5 transition-transform shadow-sm shadow-primary/30"
          >
            {nav[0]?.name ?? "Home"}
          </Link>
          <Link
            href="/level/"
            className="inline-flex items-center justify-center rounded-xl border px-5 h-11 text-sm font-semibold hover:border-foreground/30 hover:-translate-y-0.5 transition-all"
          >
            {nav[1]?.name ?? "Levels"}
          </Link>
        </div>
      </div>
    </main>
  );
}
