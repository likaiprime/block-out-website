import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: [
    "en",
    "zh",
    "ja",
    "tw",
    "ko",
    "es",
    "ar",
    "de",
    "fr",
    "ru",
    "tr",
    "fa",
    "it",
    "lo",
  ],
  defaultLocale: "en",
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
