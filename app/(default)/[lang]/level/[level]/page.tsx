import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import {
  getAlternateLanguageUrls,
  getLocaleUrl,
} from "@/lib/locale-path";
import {
  LevelSolution,
  type LevelGuide,
} from "@/components/sections/level/level-solution";
import { StructuredData } from "@/components/common/StructuredData";
import {
  getLevelFrameAlt,
  getLevelOgImage,
  hasLevelFrame,
} from "@/lib/level-frames";
import levelData from "@/level/level.json";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://blockout.cc";
const SITE_NAME =
  process.env.NEXT_PUBLIC_SITE_NAME ||
  "Block Out! - Color Sort Puzzle Walkthrough Guide";
const GAME_NAME = process.env.NEXT_PUBLIC_GAME_NAME || "Block Out!";

export async function generateStaticParams() {
  const params: { lang: string; level: string }[] = [];
  for (const lang of routing.locales) {
    for (const lvl of levelData) {
      params.push({ lang, level: lvl.Level.toString() });
    }
  }
  return params;
}

export const dynamic = "force-static";
export const dynamicParams = false;

interface Props {
  params: Promise<{ lang: Locale; level: string }>;
}

async function loadLevelMessages(
  lang: string,
  num: number
): Promise<{ description: string; tips: string[]; faq: { q: string; a: string }[] }> {
  try {
    const mod = await import(`@/messages/${lang}/levels/${num}.json`);
    return mod.default ?? mod;
  } catch {
    try {
      const mod = await import(`@/messages/en/levels/${num}.json`);
      return mod.default ?? mod;
    } catch {
      return { description: "", tips: [], faq: [] };
    }
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, level } = await params;
  setRequestLocale(lang);
  const t = await getTranslations({ locale: lang, namespace: "level" });
  const levelNumber = level;
  const num = Number(level);
  const meta = levelData.find((l) => l.Level === num);
  const difficulty = (meta?.difficulty as string) || "easy";

  const title = `${GAME_NAME} Level ${levelNumber} Walkthrough — ${
    difficulty === "super-hard" ? "Super Hard" : difficulty
  } | Video Guide`;
  const description = `Watch the ${GAME_NAME} Level ${levelNumber} solution video, see step-by-step tips, difficulty rating, and FAQs. Solve color-sort puzzle level ${levelNumber} fast.`;

  const ogImage = getLevelOgImage(num, SITE_URL);

  return {
    title: title.slice(0, 60),
    description: description.slice(0, 160),
    alternates: {
      canonical: getLocaleUrl(lang, `/level/${levelNumber}`),
      languages: getAlternateLanguageUrls(`/level/${levelNumber}`),
    },
    openGraph: {
      title: t("solutionTitle").replace("{level}", levelNumber),
      description,
      url: getLocaleUrl(lang, `/level/${levelNumber}`),
      siteName: SITE_NAME,
      type: "article",
      locale: lang,
      images: [
        {
          url: ogImage,
          width: 1080,
          height: 1920,
          alt: getLevelFrameAlt(num),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: title.slice(0, 60),
      description: description.slice(0, 160),
      images: [ogImage],
    },
  };
}

export default async function LevelDetailPage({ params }: Props) {
  const { lang, level } = await params;
  setRequestLocale(lang);
  const num = Number(level);
  const levelInfo = levelData.find((l) => l.Level === num);
  if (!levelInfo) {
    notFound();
  }

  const levelMessages = await loadLevelMessages(lang, num);
  const difficulty = (levelInfo.difficulty as LevelGuide["difficulty"]) || "easy";
  const guide: LevelGuide = {
    level: num,
    difficulty,
    description: levelMessages.description,
    tips: levelMessages.tips,
    faq: levelMessages.faq,
  };

  const canonicalUrl = getLocaleUrl(lang, `/level/${level}`);
  const homeUrl = getLocaleUrl(lang, "/");
  const indexUrl = getLocaleUrl(lang, "/level");
  const frameUrl = hasLevelFrame(num)
    ? `${SITE_URL}/images/levels/level_${num}.webp`
    : `${SITE_URL}/images/store-assets/app_icon_512.png`;

  const breadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: homeUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Levels",
        item: indexUrl,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `Level ${level}`,
        item: canonicalUrl,
      },
    ],
  };

  const howTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to solve ${GAME_NAME} Level ${level}`,
    description: guide.description,
    image: frameUrl,
    totalTime: `PT${Math.max(1, Math.round(levelInfo.Duration / 60))}M`,
    estimatedCost: { "@type": "MonetaryAmount", currency: "USD", value: "0" },
    supply: [{ "@type": "HowToSupply", name: `${GAME_NAME} app installed` }],
    tool: [{ "@type": "HowToTool", name: "iOS or Android device" }],
    step: guide.tips.map((tip, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: `Step ${i + 1}`,
      text: tip,
    })),
  };

  const videoObject = levelInfo.youtubeid
    ? {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        name: `${GAME_NAME} Level ${level} Walkthrough`,
        description: `Video walkthrough of ${GAME_NAME} Level ${level}, a ${guide.difficulty} color-sort puzzle.`,
        thumbnailUrl: [
          `https://i.ytimg.com/vi/${levelInfo.youtubeid}/hqdefault.jpg`,
          frameUrl,
        ],
        uploadDate: process.env.NEXT_PUBLIC_APP_RELEASE_DATE || "2025-10-31",
        duration: `PT${Math.round(levelInfo.Duration)}S`,
        embedUrl: `https://www.youtube.com/embed/${levelInfo.youtubeid}`,
        contentUrl: `https://www.youtube.com/watch?v=${levelInfo.youtubeid}`,
      }
    : null;

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: guide.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const schemas = videoObject
    ? [breadcrumbList, howTo, videoObject, faqPage]
    : [breadcrumbList, howTo, faqPage];

  return (
    <>
      <StructuredData data={schemas} />
      <LevelSolution
        levelNumber={level}
        levelInfo={levelInfo}
        guide={guide}
        frameSrc={hasLevelFrame(num) ? `/images/levels/level_${num}.webp` : null}
        frameAlt={getLevelFrameAlt(num)}
      />
    </>
  );
}
