import { Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import "@/app/globals.css";
import { routing } from "@/i18n/routing";
import { Providers } from "@/components/providers";
import { MainLayout } from "@/components/layouts/main-layout";
import GoogleAdsense from "@/components/adsense";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((lang) => ({ lang }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(routing.locales, lang)) {
    notFound();
  }
  setRequestLocale(lang);
  const messages = await getMessages();
  const isRTL = lang === "ar" || lang === "fa";

  return (
    <html
      lang={lang}
      dir={isRTL ? "rtl" : "ltr"}
      suppressHydrationWarning
    >
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider locale={lang} messages={messages}>
            <MainLayout>{children}</MainLayout>
          </NextIntlClientProvider>
        </Providers>
        <GoogleAdsense />
      </body>
    </html>
  );
}
