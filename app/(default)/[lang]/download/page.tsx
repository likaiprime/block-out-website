import type { Metadata } from "next";
import AppDownload from "@/components/sections/app-download";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { ensureTrailingSlash } from "@/lib/utils";

export async function generateStaticParams() {
  return routing.locales.map((lang) => ({ lang }));
}

interface Props {
  params: Promise<{ lang: Locale }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  setRequestLocale(lang);
  const t = await getTranslations({ locale: lang, namespace: "download" });
  return {
    title: t("meta.title"),
    description: t("meta.description"),
    alternates: {
      canonical: ensureTrailingSlash(`/${lang}/download`),
      languages: Object.fromEntries(
        routing.locales.map((locale) => [
          locale,
          ensureTrailingSlash(`/${locale}/download`),
        ])
      ),
    },
  };
}

export default async function DownloadPage({ params }: Props) {
  const { lang } = await params;
  setRequestLocale(lang);
  const t = await getTranslations({ locale: lang, namespace: "download" });
  const features = t.raw("features.list") as ReadonlyArray<{
    title: string;
    description: string;
  }>;
  const tips = t.raw("tips.list") as readonly string[];
  const steps = t.raw("howToPlay.steps") as readonly string[];

  return (
    <main className="pt-24 pb-16">
      <section className="container max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
            {t("title")}
          </h1>
          <p className="mt-3 text-muted-foreground text-lg">{t("subtitle")}</p>
        </div>
        <p className="text-base sm:text-lg leading-relaxed text-muted-foreground max-w-2xl mx-auto text-center">
          {t("description.main")}
        </p>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground max-w-2xl mx-auto text-center">
          {t("description.gameplay")}
        </p>
      </section>

      <AppDownload />

      <section className="container max-w-4xl mt-16">
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
          {t("features.title")}
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {features.map((f, i) => {
            const colors = [
              "bg-block-blue",
              "bg-block-orange",
              "bg-block-green",
              "bg-block-purple",
              "bg-block-yellow",
              "bg-block-red",
            ];
            const dot = colors[i % colors.length];
            return (
              <div
                key={f.title}
                className="rounded-2xl border bg-card p-5 spring-hover hover:border-foreground/15"
              >
                <div className="flex items-center gap-3">
                  <span className={`block-tile h-3 w-3 ${dot}`} aria-hidden />
                  <h3 className="font-bold tracking-tight">{f.title}</h3>
                </div>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {f.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="container max-w-4xl mt-12">
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
          {t("howToPlay.title")}
        </h2>
        <ol className="mt-6 space-y-3">
          {steps.map((step, i) => (
            <li
              key={step}
              className="flex gap-4 rounded-2xl border bg-card p-4 spring-hover hover:border-foreground/15"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-block-blue text-white text-sm font-black tabular-nums">
                {i + 1}
              </span>
              <p className="text-sm sm:text-base leading-relaxed pt-1 text-foreground/90">
                {step}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="container max-w-4xl mt-12">
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
          {t("tips.title")}
        </h2>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {tips.map((tip) => (
            <li
              key={tip}
              className="flex gap-3 rounded-2xl border bg-card p-4 spring-hover hover:border-foreground/15"
            >
              <span
                className="block-tile h-2.5 w-2.5 mt-2 shrink-0 bg-block-yellow"
                aria-hidden
              />
              <span className="text-sm leading-relaxed text-muted-foreground">
                {tip}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <p className="container max-w-4xl mt-12 text-center text-muted-foreground">
        {t("closing")}
      </p>
    </main>
  );
}
