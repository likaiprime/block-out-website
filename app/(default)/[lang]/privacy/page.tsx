import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { ensureTrailingSlash } from "@/lib/utils";
import { FileText, Database, Lock, Shield, User, Mail } from "lucide-react";

export async function generateStaticParams() {
  return routing.locales.map((lang) => ({ lang }));
}

interface Props {
  params: Promise<{ lang: Locale }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  setRequestLocale(lang);
  const t = await getTranslations({ locale: lang, namespace: "privacy" });
  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: {
      canonical: ensureTrailingSlash(`/${lang}/privacy`),
      languages: Object.fromEntries(
        routing.locales.map((locale) => [
          locale,
          ensureTrailingSlash(`/${locale}/privacy`),
        ])
      ),
    },
  };
}

interface PrivacyContent {
  introduction: { title: string; text: string };
  dataCollection: {
    title: string;
    text: string;
    items: string[];
    nonCollected: { title: string; text: string; items: string[] };
  };
  dataUsage: { title: string; text: string; items: string[] };
  dataSecurity: { title: string; text: string };
  userRights: { title: string; text: string };
  contact: { title: string; text: string; email: string };
}

export default async function PrivacyPage({ params }: Props) {
  const { lang } = await params;
  setRequestLocale(lang);
  const t = await getTranslations({ locale: lang, namespace: "privacy" });
  const c = t.raw("content") as PrivacyContent;

  return (
    <main className="pt-24 pb-16">
      <section className="container max-w-3xl">
        <header className="mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
            {t("title")}
          </h1>
          <p className="mt-3 text-muted-foreground text-lg">{t("subtitle")}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t("lastUpdated")}</p>
        </header>

        <div className="space-y-5 text-muted-foreground leading-relaxed">
          <Section color="bg-block-blue" icon={FileText} title={c.introduction.title}>
            <p>{c.introduction.text}</p>
          </Section>

          <Section color="bg-block-orange" icon={Database} title={c.dataCollection.title}>
            <p className="mb-3">{c.dataCollection.text}</p>
            <ul className="list-disc list-inside space-y-2">
              {c.dataCollection.items.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
            <h3 className="mt-5 font-semibold text-foreground">
              {c.dataCollection.nonCollected.title}
            </h3>
            <p className="mt-2">{c.dataCollection.nonCollected.text}</p>
            <ul className="mt-2 list-disc list-inside space-y-2">
              {c.dataCollection.nonCollected.items.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
          </Section>

          <Section color="bg-block-green" icon={Lock} title={c.dataUsage.title}>
            <p className="mb-3">{c.dataUsage.text}</p>
            <ul className="list-disc list-inside space-y-2">
              {c.dataUsage.items.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
          </Section>

          <Section color="bg-block-purple" icon={Shield} title={c.dataSecurity.title}>
            <p>{c.dataSecurity.text}</p>
          </Section>

          <Section color="bg-block-yellow" icon={User} title={c.userRights.title}>
            <p>{c.userRights.text}</p>
          </Section>

          <Section color="bg-block-red" icon={Mail} title={c.contact.title}>
            <p>{c.contact.text}</p>
            <a
              href={`mailto:${c.contact.email}`}
              className="mt-2 inline-block font-semibold text-primary hover:underline"
            >
              {c.contact.email}
            </a>
          </Section>
        </div>
      </section>
    </main>
  );
}

function Section({
  icon: Icon,
  title,
  color,
  children,
}: {
  icon: typeof FileText;
  title: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border bg-card p-6 spring-hover hover:border-foreground/15">
      <div className="flex items-center gap-3 mb-3">
        <div
          className={`block-tile inline-flex h-10 w-10 items-center justify-center text-white ${color}`}
        >
          <Icon className="h-5 w-5" strokeWidth={2.25} />
        </div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}
