"use client";

import { Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

type NavItem = { name: string; href: string };

const PALETTE = [
  "bg-block-red",
  "bg-block-orange",
  "bg-block-yellow",
  "bg-block-green",
  "bg-block-blue",
  "bg-block-purple",
];

export function Footer() {
  const t = useTranslations("footer");
  const tHeader = useTranslations("header");
  const email =
    process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contact@blockout.cc";
  const gameName = process.env.NEXT_PUBLIC_GAME_NAME || "Block Out!";
  const developer = process.env.NEXT_PUBLIC_GAME_DEVELOPER || "Grand Games";
  const year = new Date().getFullYear();

  const headerNav = tHeader.raw("navigation") as ReadonlyArray<NavItem>;
  const levelsLabel = headerNav[1]?.name ?? "Levels";
  const legalLinks = [
    { href: "/about/", label: t("links.about") },
    { href: "/contact/", label: t("links.contact") },
    { href: "/privacy/", label: t("links.privacy") },
    { href: "/terms/", label: t("links.terms") },
    { href: "/cookies/", label: t("links.cookies") },
    { href: "/disclaimer/", label: t("links.disclaimer") },
  ];

  return (
    <footer className="relative border-t bg-card mt-auto">
      {/* Top color signature line — game palette */}
      <div aria-hidden className="absolute inset-x-0 top-0 flex h-1">
        {PALETTE.map((c) => (
          <span key={c} className={`flex-1 ${c}`} />
        ))}
      </div>

      <div className="container py-14">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
          <div className="col-span-2">
            <Link
              href="/"
              className="inline-flex items-center gap-3 font-black tracking-tight"
            >
              {/* Six-color stair-step logo — matches the header */}
              <span aria-hidden className="flex items-end gap-[3px]">
                {PALETTE.map((c, i) => (
                  <span
                    key={c}
                    className={`block-tile w-1.5 rounded-[4px] ${c}`}
                    style={{ height: `${10 + i * 3}px` }}
                  />
                ))}
              </span>
              <span className="text-base">{gameName} Guide</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs leading-relaxed">
              {t("tagline")}
            </p>
            <p className="mt-2 text-xs font-bold uppercase tracking-wider text-muted-foreground/80">
              {gameName} — Sort it out.
            </p>

            {/* Decorative color row — game palette signature */}
            <div className="mt-5 flex items-center gap-1.5">
              {PALETTE.map((c) => (
                <span
                  key={c}
                  className={`block-tile h-3 w-3 ${c}`}
                  aria-hidden
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold mb-4 tracking-tight">
              {t("links.about")}
            </h3>
            <nav className="flex flex-col gap-2.5 text-sm">
              {legalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/level/"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {levelsLabel}
              </Link>
            </nav>
          </div>

          <div>
            <h3 className="text-sm font-bold mb-4 tracking-tight">
              {t("links.contact")}
            </h3>
            <a
              href={`mailto:${email}`}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Mail className="h-4 w-4" />
              {email}
            </a>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-muted-foreground">
          <p>
            © {year} {gameName} Guide. {t("copyrightSuffix")}
          </p>
          <p className="text-balance max-w-2xl sm:text-right">
            {t("disclaimer")
              .replace("{game}", gameName)
              .replace("{developer}", developer)}
          </p>
        </div>
      </div>
    </footer>
  );
}
