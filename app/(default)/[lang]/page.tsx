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
import { getTotalLevels, getWalkthroughCount } from "@/lib/level-stats";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://blockout.cc";
const GAME_NAME = process.env.NEXT_PUBLIC_GAME_NAME || "Block Out!";
const APP_STORE_URL =
  process.env.NEXT_PUBLIC_APP_STORE_URL ||
  "https://apps.apple.com/us/app/block-out-color-sort-puzzle/id6752672568";

const OG_IMAGE = `${SITE_URL}/og-image.png`;

interface Props {
  params: Promise<{ lang: Locale }>;
}

export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  setRequestLocale(lang);
  const t = await getTranslations({ locale: lang, namespace: "home" });
  const totalLevels = getTotalLevels();
  const walkthroughs = getWalkthroughCount();
  const title = t("meta.title").replace("{totalLevels}", totalLevels.toString());
  const description = `${t("meta.description")} ${totalLevels} levels, ${walkthroughs} video walkthroughs.`;

  const langUrl = getLocaleUrl(lang, "/");

  return {
    title,
    description: description.slice(0, 160),
    alternates: {
      canonical: langUrl,
      languages: getAlternateLanguageUrls("/"),
    },
    openGraph: {
      title,
      description: description.slice(0, 160),
      url: langUrl,
      type: "website",
      images: [
        {
          url: OG_IMAGE,
          width: 1200,
          height: 630,
          alt: `${GAME_NAME} walkthrough guides`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: description.slice(0, 160),
      images: [OG_IMAGE],
    },
  };
}

export default async function Home({ params }: Props) {
  const { lang } = await params;
  setRequestLocale(lang);
  const tFaq = await getTranslations({ locale: lang, namespace: "faq" });
  const faqItems = tFaq.raw("questions") as ReadonlyArray<{
    question: string;
    answer: string;
  }>;

  const homeUrl = getLocaleUrl(lang, "/");
  const levelSearchBase = getLocaleUrl(lang, "/level").replace(/\/$/, "");

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: GAME_NAME + " Walkthrough",
    description: `${getTotalLevels()} level guides with ${getWalkthroughCount()} video walkthroughs`,
    url: homeUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${levelSearchBase}/{level_number}/`,
      "query-input": "required name=level_number",
    },
  };

  const faqPageSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
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
      <StructuredData data={[websiteSchema, softwareSchema, faqPageSchema]} />
      <Hero />
      <LevelHighlights />
      <Features />
      <HowToPlay />
      <AppDownload />
      <FAQ />
    </>
  );
}
