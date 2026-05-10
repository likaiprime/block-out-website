"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import LangSwitcher from "@/components/common/LanguageSwitcher";
import ThemeSwitcher from "@/components/common/ThemeSwitcher";
import MenuButton from "@/components/common/MenuButton";

type NavItem = { name: string; href: string };

// Game palette in the order the player meets it. Logo + nav rotate through this.
const NAV_PALETTE = [
  { fill: "bg-block-red", text: "text-block-red", soft: "bg-block-red/10" },
  { fill: "bg-block-orange", text: "text-block-orange", soft: "bg-block-orange/10" },
  { fill: "bg-block-yellow", text: "text-block-yellow", soft: "bg-block-yellow/10" },
  { fill: "bg-block-green", text: "text-block-green", soft: "bg-block-green/10" },
  { fill: "bg-block-blue", text: "text-block-blue", soft: "bg-block-blue/10" },
  { fill: "bg-block-purple", text: "text-block-purple", soft: "bg-block-purple/10" },
] as const;

export function Header() {
  const t = useTranslations("header");
  const lang = useLocale();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const gameName = process.env.NEXT_PUBLIC_GAME_NAME || "Block Out!";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const baseNavigation = t.raw("navigation") as ReadonlyArray<NavItem>;
  const navItems: NavItem[] = [
    ...baseNavigation.slice(0, 2),
    { name: "Blog", href: "/blog/" },
    ...baseNavigation.slice(2),
  ];

  const isActive = (href: string) => {
    const full = (lang === "en" ? href : `/${lang}${href}`).replace(/\/+$/, "");
    const current = (pathname ?? "").replace(/\/+$/, "");
    if (href === "/" || href === "")
      return lang === "en" ? current === "" || current === "/" : current === `/${lang}`;
    return current === full || current.startsWith(`${full}/`);
  };

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-200",
        scrolled
          ? "bg-background/85 backdrop-blur-md border-b border-border shadow-[0_1px_0_0_hsl(var(--border))]"
          : "bg-background/0 backdrop-blur-0 border-b border-transparent",
      )}
    >
      <div className="container">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-3 font-black tracking-tight group"
          >
            {/* Six-color stair-step logo — directly references the game's block palette */}
            <span
              aria-hidden
              className="flex items-end gap-[3px] transition-transform duration-300 group-hover:-rotate-3"
            >
              {NAV_PALETTE.map((p, i) => (
                <span
                  key={p.fill}
                  className={cn(
                    "block-tile w-1.5 rounded-[4px]",
                    p.fill,
                  )}
                  style={{
                    height: `${10 + i * 3}px`,
                    transitionDelay: `${i * 30}ms`,
                  }}
                />
              ))}
            </span>
            <span className="text-base font-black tracking-tight">
              {gameName}
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1.5">
            {navItems.map((item, i) => {
              const active = isActive(item.href);
              const palette = NAV_PALETTE[i % NAV_PALETTE.length];
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group/nav relative inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-bold tracking-tight transition-all duration-300",
                    active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "block-tile inline-block h-2.5 w-2.5 transition-transform duration-300 group-hover/nav:scale-125 group-hover/nav:-translate-y-0.5",
                      active
                        ? palette.fill
                        : cn(
                            "bg-transparent border border-current opacity-50",
                            palette.text,
                          ),
                    )}
                    style={{ borderRadius: 4 }}
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1">
            <LangSwitcher />
            <ThemeSwitcher />
            <div className="md:hidden">
              <MenuButton navbarOpen={open} onClick={() => setOpen((o) => !o)} />
            </div>
          </div>
        </div>

        {open && (
          <nav className="md:hidden pb-4 grid gap-1 animate-fade-in">
            {navItems.map((item, i) => {
              const active = isActive(item.href);
              const palette = NAV_PALETTE[i % NAV_PALETTE.length];
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "rounded-xl px-3 py-2.5 text-sm font-bold tracking-tight transition-colors min-h-[44px] flex items-center gap-3",
                    active
                      ? cn(palette.soft, palette.text)
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary",
                  )}
                  onClick={() => setOpen(false)}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "block-tile inline-block h-3 w-3",
                      active
                        ? palette.fill
                        : cn(
                            "bg-transparent border border-current opacity-50",
                            palette.text,
                          ),
                    )}
                    style={{ borderRadius: 4 }}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        )}
      </div>

      {/* Six-color signature bar — visible at the very top of every page */}
      <div
        aria-hidden
        className={cn(
          "absolute inset-x-0 -bottom-1 flex h-1 transition-opacity duration-300",
          scrolled ? "opacity-100" : "opacity-70",
        )}
      >
        {NAV_PALETTE.map((p) => (
          <span key={p.fill} className={cn("flex-1", p.fill)} />
        ))}
      </div>
    </header>
  );
}
