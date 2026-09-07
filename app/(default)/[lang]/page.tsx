import { Hero } from "@/components/sections/hero";
import { Features } from "@/components/sections/features";
import AppDownload from "@/components/sections/app-download";
import { FAQ } from "@/components/sections/faq";
import { HowToPlay } from "@/components/sections/how-to-play";
import { LevelHighlights } from "@/components/sections/level-highlights";
import { StructuredData } from "@/components/common/StructuredData";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { getAlternateLanguageUrls, getLocaleUrl } from "@/lib/locale-path";
import level from "@/level/level.json";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://blockout.cc";
const GAME_NAME = process.env.NEXT_PUBLIC_GAME_NAME || "Block Out!";
const APP_STORE_URL =
  process.env.NEXT_PUBLIC_APP_STORE_URL ||
  "https://apps.apple.com/us/app/block-out-color-sort-puzzle/id6752672568";

interface Props {
  params: Promise<{ lang: Locale }>;
}

export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  setRequestLocale(lang);
  const t = await getTranslations({ locale: lang, namespace: "home" });
  const title = t("meta.title").replace("{totalLevels}", level.length.toString());
  const description = t("meta.description");

  const langUrl = getLocaleUrl(lang, "/");

  return {
    title,
    description,
    alternates: {
      canonical: langUrl,
      languages: getAlternateLanguageUrls("/"),
    },
    openGraph: {
      title,
      description,
      url: langUrl,
      type: "website",
      images: [
        {
          url: `${SITE_URL}/images/store-assets/app_icon_512.png`,
          width: 512,
          height: 512,
          alt: `${GAME_NAME} app icon`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE_URL}/images/store-assets/app_icon_512.png`],
    },
  };
}

export default async function Home({ params }: Props) {
  const { lang } = await params;
  setRequestLocale(lang);

  const homeUrl = getLocaleUrl(lang, "/");

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: GAME_NAME + " Walkthrough",
    url: homeUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${getLocaleUrl(lang, "/level").replace(/\/$/, "")}/{level_number}/`,
      "query-input": "required name=level_number",
    },
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "MobileApplication",
    name: "Block Out! - Color Sort Puzzle",
    operatingSystem: "iOS",
    applicationCategory: "GameApplication",
    genre: "Puzzle",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: process.env.NEXT_PUBLIC_APP_RATING || "4.74",
      ratingCount: process.env.NEXT_PUBLIC_APP_RATING_COUNT || "41380",
      bestRating: "5",
      worstRating: "1",
    },
    publisher: {
      "@type": "Organization",
      name: "Grand Games A.Ş.",
    },
    downloadUrl: APP_STORE_URL,
    url: APP_STORE_URL,
  };

  return (
    <>
      <StructuredData data={[websiteSchema, softwareSchema]} />
      <Hero />
      <LevelHighlights />
      <Features />
      <HowToPlay />
      <AppDownload />
      <FAQ />
    </>
  );
}
