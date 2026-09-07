import type { Metadata } from "next";
import AppDownload from "@/components/sections/app-download";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { getAlternateLanguageUrls, getLocaleUrl } from "@/lib/locale-path";

export async function generateStaticParams() {
  return routing.locales.map((lang) => ({ lang }));
}

interface Props {
  params: Promise<{ lang: Locale }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  setRequestLocale(lang);
  const t = await getTranslations({ locale: lang, namespace: "appDownload" });
  return {
    title: t("meta.title"),
    description: t("meta.description"),
    alternates: {
      canonical: getLocaleUrl(lang, "/app"),
      languages: getAlternateLanguageUrls("/app"),
    },
  };
}

export default async function AppPage({ params }: Props) {
  const { lang } = await params;
  setRequestLocale(lang);
  return (
    <main className="pt-24">
      <AppDownload />
    </main>
  );
}
