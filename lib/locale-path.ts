import { routing, type Locale } from "@/i18n/routing";
import { ensureTrailingSlash } from "@/lib/utils";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://blockout.cc";

/** Locale-aware path with trailing slash. Default locale (en) has no /en prefix. */
export function getLocalePath(locale: Locale, pathname: string = "/"): string {
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;

  if (locale === routing.defaultLocale) {
    return normalized === "/" ? "/" : ensureTrailingSlash(normalized);
  }

  if (normalized === "/") {
    return ensureTrailingSlash(`/${locale}`);
  }

  return ensureTrailingSlash(`/${locale}${normalized}`);
}

export function getLocaleUrl(locale: Locale, pathname: string = "/"): string {
  const base = SITE_URL.replace(/\/$/, "");
  const path = getLocalePath(locale, pathname);
  return path === "/" ? `${base}/` : `${base}${path}`;
}

export function getAlternateLanguageUrls(
  pathname: string = "/",
): Record<string, string> {
  return Object.fromEntries(
    routing.locales.map((locale) => {
      const hreflang =
        locale === "zh" ? "zh-CN" : locale === "tw" ? "zh-TW" : locale;
      return [hreflang, getLocaleUrl(locale, pathname)];
    }),
  );
}
