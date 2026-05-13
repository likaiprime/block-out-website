import type { Locale } from "@/i18n/routing";
import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import { ensureTrailingSlash } from "@/lib/utils";

export type LegalPageSlug =
  | "about"
  | "contact"
  | "privacy"
  | "terms"
  | "cookies"
  | "disclaimer";

export interface LegalSection {
  title: string;
  paragraphs?: string[];
  items?: string[];
}

export interface LegalPageContent {
  title: string;
  subtitle: string;
  lastUpdated: string;
  sections: LegalSection[];
}

const EMAIL = "contact@blockout.cc";
const LAST_UPDATED = "2026-05";

const localized: Partial<Record<Locale, Record<LegalPageSlug, Pick<LegalPageContent, "title" | "subtitle" | "lastUpdated">>>> = {
  en: {
    about: {
      title: "About this site",
      subtitle: "An independent walkthrough resource for Block Out! by Grand Games.",
      lastUpdated: `Last updated: ${LAST_UPDATED}`,
    },
    contact: {
      title: "Contact",
      subtitle: "Corrections, support, copyright, and privacy requests.",
      lastUpdated: `Last updated: ${LAST_UPDATED}`,
    },
    privacy: {
      title: "Privacy Policy",
      subtitle: "What blockout.cc collects, does not collect, and relies on to operate.",
      lastUpdated: `Last updated: ${LAST_UPDATED}`,
    },
    terms: {
      title: "Terms of Service",
      subtitle: "Rules for using this independent Block Out! walkthrough guide.",
      lastUpdated: `Last updated: ${LAST_UPDATED}`,
    },
    cookies: {
      title: "Cookie Policy",
      subtitle: "How cookies and similar technologies may be used on blockout.cc.",
      lastUpdated: `Last updated: ${LAST_UPDATED}`,
    },
    disclaimer: {
      title: "Disclaimer",
      subtitle: "Important notes about affiliation, accuracy, third-party content, and trademarks.",
      lastUpdated: `Last updated: ${LAST_UPDATED}`,
    },
  },
  zh: {
    about: { title: "关于本站", subtitle: "面向 Block Out! 玩家、独立于 Grand Games 的通关指南。", lastUpdated: `最后更新：${LAST_UPDATED}` },
    contact: { title: "联系我们", subtitle: "更正、支持、版权和隐私请求。", lastUpdated: `最后更新：${LAST_UPDATED}` },
    privacy: { title: "隐私政策", subtitle: "blockout.cc 收集什么、不收集什么，以及本站如何运行。", lastUpdated: `最后更新：${LAST_UPDATED}` },
    terms: { title: "服务条款", subtitle: "使用本独立 Block Out! 通关指南时适用的规则。", lastUpdated: `最后更新：${LAST_UPDATED}` },
    cookies: { title: "Cookie 政策", subtitle: "blockout.cc 可能如何使用 Cookie 和类似技术。", lastUpdated: `最后更新：${LAST_UPDATED}` },
    disclaimer: { title: "免责声明", subtitle: "关于关联关系、准确性、第三方内容和商标的重要说明。", lastUpdated: `最后更新：${LAST_UPDATED}` },
  },
  tw: {
    about: { title: "關於本站", subtitle: "面向 Block Out! 玩家、獨立於 Grand Games 的通關指南。", lastUpdated: `最後更新：${LAST_UPDATED}` },
    contact: { title: "聯絡我們", subtitle: "更正、支援、版權和隱私請求。", lastUpdated: `最後更新：${LAST_UPDATED}` },
    privacy: { title: "隱私權政策", subtitle: "blockout.cc 會收集什麼、不收集什麼，以及本站如何運作。", lastUpdated: `最後更新：${LAST_UPDATED}` },
    terms: { title: "服務條款", subtitle: "使用本獨立 Block Out! 通關指南時適用的規則。", lastUpdated: `最後更新：${LAST_UPDATED}` },
    cookies: { title: "Cookie 政策", subtitle: "blockout.cc 可能如何使用 Cookie 和類似技術。", lastUpdated: `最後更新：${LAST_UPDATED}` },
    disclaimer: { title: "免責聲明", subtitle: "關於關聯、準確性、第三方內容和商標的重要說明。", lastUpdated: `最後更新：${LAST_UPDATED}` },
  },
};

const titleFallbacks: Partial<Record<Locale, Record<LegalPageSlug, string>>> = {
  de: { about: "Uber diese Website", contact: "Kontakt", privacy: "Datenschutzerklarung", terms: "Nutzungsbedingungen", cookies: "Cookie-Richtlinie", disclaimer: "Haftungsausschluss" },
  fr: { about: "A propos du site", contact: "Contact", privacy: "Politique de confidentialite", terms: "Conditions d'utilisation", cookies: "Politique relative aux cookies", disclaimer: "Avertissement" },
  es: { about: "Sobre este sitio", contact: "Contacto", privacy: "Politica de privacidad", terms: "Terminos de servicio", cookies: "Politica de cookies", disclaimer: "Aviso legal" },
  it: { about: "Informazioni sul sito", contact: "Contatti", privacy: "Informativa sulla privacy", terms: "Termini di servizio", cookies: "Informativa sui cookie", disclaimer: "Dichiarazione di esclusione" },
  ja: { about: "このサイトについて", contact: "お問い合わせ", privacy: "プライバシーポリシー", terms: "利用規約", cookies: "Cookie ポリシー", disclaimer: "免責事項" },
  ko: { about: "사이트 소개", contact: "문의", privacy: "개인정보 처리방침", terms: "서비스 약관", cookies: "쿠키 정책", disclaimer: "면책 고지" },
  ru: { about: "О сайте", contact: "Контакты", privacy: "Политика конфиденциальности", terms: "Условия использования", cookies: "Политика cookie", disclaimer: "Отказ от ответственности" },
  tr: { about: "Bu site hakkinda", contact: "Iletisim", privacy: "Gizlilik Politikasi", terms: "Hizmet Sartlari", cookies: "Cerez Politikasi", disclaimer: "Sorumluluk Reddi" },
  ar: { about: "حول الموقع", contact: "اتصل بنا", privacy: "سياسة الخصوصية", terms: "شروط الخدمة", cookies: "سياسة ملفات تعريف الارتباط", disclaimer: "إخلاء المسؤولية" },
  fa: { about: "درباره سایت", contact: "تماس", privacy: "سیاست حریم خصوصی", terms: "شرایط استفاده", cookies: "سیاست کوکی", disclaimer: "سلب مسئولیت" },
  lo: { about: "ກ່ຽວກັບເວັບໄຊ", contact: "ຕິດຕໍ່", privacy: "ນະໂຍບາຍຄວາມເປັນສ່ວນຕົວ", terms: "ເງື່ອນໄຂການໃຊ້ງານ", cookies: "ນະໂຍບາຍ Cookie", disclaimer: "ຂໍ້ຈໍາກັດຄວາມຮັບຜິດ" },
};

const sharedSections: Record<LegalPageSlug, LegalSection[]> = {
  about: [
    {
      title: "What this site is",
      paragraphs: [
        "blockout.cc is an independent walkthrough guide for Block Out!, the color-sort puzzle published by Grand Games.",
        "The site helps players find level videos, written tips, difficulty notes, and quick navigation when they are stuck on a specific board.",
      ],
    },
    {
      title: "How the guide is maintained",
      items: [
        "We organize walkthroughs by level number and puzzle group.",
        "We write tips that explain the order of moves instead of only embedding a video.",
        "We update pages when a missing level, correction, or better walkthrough is reported.",
      ],
    },
    {
      title: "Funding and independence",
      paragraphs: [
        "The guide may be supported by advertising, including Google AdSense. Ads keep the walkthrough free to access.",
        "blockout.cc is not affiliated with, endorsed by, or sponsored by Grand Games.",
      ],
    },
    {
      title: "Contact",
      paragraphs: [`Corrections and questions can be sent to ${EMAIL}. Include the page URL and level number when possible.`],
    },
  ],
  contact: [
    {
      title: "Email",
      paragraphs: [`Send site questions, corrections, copyright notices, and privacy requests to ${EMAIL}.`],
    },
    {
      title: "What to include",
      items: [
        "The blockout.cc URL you are writing about.",
        "The level number, puzzle mode, or screenshot when reporting a walkthrough issue.",
        "A clear description of the problem and the correction you expect.",
        "For copyright or DMCA-style requests, identify the work, the allegedly infringing material, your authority to act, and a way to contact you.",
      ],
    },
    {
      title: "What we can help with",
      paragraphs: [
        "We can review missing levels, broken embeds, inaccurate tips, privacy questions, and takedown requests related to this website.",
        "We cannot provide official game support, account help, refunds, or App Store / Google Play purchase support for Block Out!.",
      ],
    },
  ],
  privacy: [
    {
      title: "The short version",
      paragraphs: [
        "blockout.cc is a static walkthrough site. We do not offer accounts, collect payments, or ask for personal profiles.",
        "Basic technical data may be processed by hosting, security, analytics, advertising, and embedded-video providers.",
      ],
    },
    {
      title: "Information we may process",
      items: [
        "Cloudflare or hosting request logs such as IP address, URL, timestamp, user-agent, and security events.",
        "Aggregate analytics data if analytics is enabled, such as page views, referrers, device class, and approximate region.",
        "Google AdSense data when ads load, subject to Google's own policies and consent controls where applicable.",
        "YouTube embed data when you load or play embedded walkthrough videos.",
        "Outbound App Store and Google Play links, which are handled by Apple and Google after you leave this site.",
      ],
    },
    {
      title: "What we do not collect",
      items: [
        "No blockout.cc accounts or passwords.",
        "No payment card data.",
        "No comments, chat messages, or user-uploaded walkthrough files.",
        "No sale of personal information by blockout.cc.",
      ],
    },
    {
      title: "Retention, rights, and children",
      paragraphs: [
        "Server and security logs are kept only as long as needed for operations, abuse prevention, analytics, and legal compliance. Third-party providers apply their own retention periods.",
        "Depending on your location, you may have rights to access, delete, correct, or object to certain processing. Contact us at the email below.",
        "This site is a general-audience walkthrough guide and is not directed to children under 13.",
      ],
    },
    {
      title: "Security and contact",
      paragraphs: [
        "The site is served over HTTPS and has no server-side account database. No website can promise perfect security.",
        `Privacy questions can be sent to ${EMAIL}.`,
      ],
    },
  ],
  terms: [
    {
      title: "Service description",
      paragraphs: [
        "blockout.cc provides informational walkthrough pages, level tips, and links or embeds related to Block Out! puzzles.",
        "The site is offered as a fan-made guide and does not replace official information from Grand Games, Apple, Google, or YouTube.",
      ],
    },
    {
      title: "Eligibility and acceptable use",
      items: [
        "Use the site only where lawful and in a way that does not interfere with other visitors.",
        "Do not scrape, copy, overload, reverse engineer, or abuse the site or its generated pages.",
        "Do not attempt to bypass security, inject code, impersonate others, or use automated traffic that harms availability.",
      ],
    },
    {
      title: "Third-party content and links",
      paragraphs: [
        "Walkthrough videos, app-store links, ads, analytics, and embeds may be provided by third parties. Their terms and policies apply when you interact with them.",
        "We may remove or change links, embeds, levels, and written tips without notice.",
      ],
    },
    {
      title: "Accuracy, availability, and limitation",
      paragraphs: [
        "We try to keep level guidance accurate, but puzzle layouts, app behavior, video availability, and external links can change.",
        "The site is provided as-is, without warranties. To the fullest extent allowed by law, blockout.cc is not liable for indirect losses or issues caused by relying on the guide.",
      ],
    },
    {
      title: "Changes and contact",
      paragraphs: [`We may update these terms as the site changes. Questions can be sent to ${EMAIL}.`],
    },
  ],
  cookies: [
    {
      title: "What cookies are",
      paragraphs: [
        "Cookies and similar technologies are small storage tools used by websites, browsers, and third-party services to remember settings, measure traffic, secure services, or show ads.",
      ],
    },
    {
      title: "How blockout.cc may use them",
      items: [
        "Essential preferences such as theme or language when the site or browser stores those choices.",
        "Analytics cookies or similar signals if analytics is enabled.",
        "Google AdSense cookies and ad identifiers when ads are shown.",
        "YouTube cookies or local storage when embedded walkthrough videos are loaded or played.",
      ],
    },
    {
      title: "Your choices",
      items: [
        "Use browser controls to delete or block cookies.",
        "Use Google Ads Settings or regional consent controls where available.",
        "Use privacy extensions or content blockers if you prefer to block ads, analytics, or embedded media.",
        "Browsers may send Do Not Track or Global Privacy Control signals; support varies by third-party provider.",
      ],
    },
    {
      title: "Contact",
      paragraphs: [`Cookie questions can be sent to ${EMAIL}.`],
    },
  ],
  disclaimer: [
    {
      title: "No affiliation",
      paragraphs: [
        "blockout.cc is an independent walkthrough resource. It is not affiliated with, endorsed by, or sponsored by Grand Games, Apple, Google, YouTube, or their affiliates.",
      ],
    },
    {
      title: "Walkthrough accuracy",
      paragraphs: [
        "We publish best-effort tips and videos for Block Out! levels. Game levels, app behavior, monetization, and video availability may change after a guide is written.",
        "Use the walkthroughs as a reference, not as an official or guaranteed solution.",
      ],
    },
    {
      title: "Third-party content and links",
      paragraphs: [
        "Embedded videos, app-store listings, ads, and outbound links are controlled by their respective providers. We are not responsible for third-party content or services.",
      ],
    },
    {
      title: "Trademarks and copyright",
      paragraphs: [
        "Block Out!, related game assets, Apple App Store marks, Google Play marks, YouTube marks, and all other trademarks or copyrighted materials belong to their respective owners.",
        `For corrections or takedown requests, contact ${EMAIL} with the URL and details of the material at issue.`,
      ],
    },
    {
      title: "No warranty",
      paragraphs: ["The site is provided as-is and may be updated, interrupted, or removed without notice."],
    },
  ],
};

export function getLegalPageContent(locale: Locale, slug: LegalPageSlug): LegalPageContent {
  const english = localized.en![slug];
  const copy = localized[locale]?.[slug];
  const fallbackTitle = titleFallbacks[locale]?.[slug];

  return {
    title: copy?.title ?? fallbackTitle ?? english.title,
    subtitle:
      copy?.subtitle ??
      `${fallbackTitle ?? english.title} for the independent Block Out! walkthrough guide at blockout.cc.`,
    lastUpdated: copy?.lastUpdated ?? `Last updated: ${LAST_UPDATED}`,
    sections: sharedSections[slug],
  };
}

export function getLegalMetadata(locale: Locale, slug: LegalPageSlug): Metadata {
  const content = getLegalPageContent(locale, slug);

  return {
    title: content.title,
    description: content.subtitle,
    alternates: {
      canonical: ensureTrailingSlash(`/${locale}/${slug}`),
      languages: Object.fromEntries(
        routing.locales.map((lang) => [
          lang,
          ensureTrailingSlash(`/${lang}/${slug}`),
        ])
      ),
    },
  };
}
