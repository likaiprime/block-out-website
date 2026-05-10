import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { ensureTrailingSlash } from "@/lib/utils";
import {
  FileText,
  Sparkles,
  HelpCircle,
  Lightbulb,
  AlertCircle,
  Mail,
  GamepadIcon,
} from "lucide-react";

export async function generateStaticParams() {
  return routing.locales.map((lang) => ({ lang }));
}

interface Props {
  params: Promise<{ lang: Locale }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  setRequestLocale(lang);
  const t = await getTranslations({ locale: lang, namespace: "about" });
  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: {
      canonical: ensureTrailingSlash(`/${lang}/about`),
      languages: Object.fromEntries(
        routing.locales.map((locale) => [
          locale,
          ensureTrailingSlash(`/${locale}/about`),
        ])
      ),
    },
  };
}

export default async function AboutPage({ params }: Props) {
  const { lang } = await params;
  setRequestLocale(lang);
  const t = await getTranslations({ locale: lang, namespace: "about" });
  const c = t.raw("content") as {
    introduction: { title: string; text: string };
    gameInfo: { title: string; text: string };
    features: { title: string; items: string[] };
    howToPlay: { title: string; items: string[] };
    tips: { title: string; items: string[] };
    disclaimer: { title: string; text: string };
    contact: { title: string; text: string; email: string };
  };

  const blocks: { icon: typeof FileText; title: string; body: React.ReactNode }[] = [
    { icon: FileText, title: c.introduction.title, body: <p>{c.introduction.text}</p> },
    { icon: GamepadIcon, title: c.gameInfo.title, body: <p>{c.gameInfo.text}</p> },
    {
      icon: Sparkles,
      title: c.features.title,
      body: (
        <ul className="list-disc list-inside space-y-2">
          {c.features.items.map((it) => (
            <li key={it}>{it}</li>
          ))}
        </ul>
      ),
    },
    {
      icon: HelpCircle,
      title: c.howToPlay.title,
      body: (
        <ul className="list-disc list-inside space-y-2">
          {c.howToPlay.items.map((it) => (
            <li key={it}>{it}</li>
          ))}
        </ul>
      ),
    },
    {
      icon: Lightbulb,
      title: c.tips.title,
      body: (
        <ul className="list-disc list-inside space-y-2">
          {c.tips.items.map((it) => (
            <li key={it}>{it}</li>
          ))}
        </ul>
      ),
    },
    { icon: AlertCircle, title: c.disclaimer.title, body: <p>{c.disclaimer.text}</p> },
  ];

  const TILE_COLORS = [
    "bg-block-blue",
    "bg-block-orange",
    "bg-block-green",
    "bg-block-purple",
    "bg-block-yellow",
    "bg-block-red",
  ];

  return (
    <main className="pt-24 pb-16">
      <section className="container max-w-3xl">
        <header className="mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
            {t("title")}
          </h1>
          <p className="mt-3 text-muted-foreground text-lg">{t("subtitle")}</p>
        </header>

        <div className="space-y-5">
          {blocks.map(({ icon: Icon, title, body }, i) => (
            <section
              key={title}
              className="rounded-2xl border bg-card p-6 spring-hover hover:border-foreground/15"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`block-tile inline-flex h-10 w-10 items-center justify-center text-white ${TILE_COLORS[i % TILE_COLORS.length]}`}
                >
                  <Icon className="h-5 w-5" strokeWidth={2.25} />
                </div>
                <h2 className="text-xl font-bold tracking-tight">{title}</h2>
              </div>
              <div className="text-muted-foreground leading-relaxed">{body}</div>
            </section>
          ))}

          <section className="rounded-2xl border bg-card p-6 spring-hover hover:border-foreground/15">
            <div className="flex items-center gap-3 mb-3">
              <div className="block-tile inline-flex h-10 w-10 items-center justify-center bg-block-blue text-white">
                <Mail className="h-5 w-5" strokeWidth={2.25} />
              </div>
              <h2 className="text-xl font-bold tracking-tight">{c.contact.title}</h2>
            </div>
            <p className="text-muted-foreground">{c.contact.text}</p>
            <a
              href={`mailto:${c.contact.email}`}
              className="mt-2 inline-block font-semibold text-primary hover:underline"
            >
              {c.contact.email}
            </a>
          </section>
        </div>
      </section>
    </main>
  );
}
