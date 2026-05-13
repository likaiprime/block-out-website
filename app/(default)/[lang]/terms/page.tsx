import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { LegalPage } from "@/components/legal/legal-page";
import { routing, type Locale } from "@/i18n/routing";
import { getLegalMetadata, getLegalPageContent } from "@/lib/legal-pages";

export async function generateStaticParams() {
  return routing.locales.map((lang) => ({ lang }));
}

interface Props {
  params: Promise<{ lang: Locale }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  setRequestLocale(lang);
  return getLegalMetadata(lang, "terms");
}

export default async function TermsPage({ params }: Props) {
  const { lang } = await params;
  setRequestLocale(lang);
  return <LegalPage content={getLegalPageContent(lang, "terms")} />;
}
