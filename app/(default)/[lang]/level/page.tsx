import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { getAlternateLanguageUrls, getLocaleUrl } from "@/lib/locale-path";
import { LevelList } from "@/components/sections/level/level-list";
import level from "@/level/level.json";

export async function generateStaticParams() {
  return routing.locales.map((lang) => ({ lang }));
}

interface Props {
  params: Promise<{ lang: Locale }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  setRequestLocale(lang);
  const t = await getTranslations({ locale: lang, namespace: "level" });
  return {
    title: t("meta.title").replace("{totalLevels}", level.length.toString()),
    description: t("meta.description"),
    alternates: {
      canonical: getLocaleUrl(lang, "/level"),
      languages: getAlternateLanguageUrls("/level"),
    },
  };
}

export default async function LevelPage({ params }: Props) {
  const { lang } = await params;
  setRequestLocale(lang);
  return <LevelList />;
}
