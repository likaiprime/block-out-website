/** @type {import('next-sitemap').IConfig} */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://blockout.cc";

const LOCALES = [
  "en",
  "de",
  "zh",
  "tw",
  "ja",
  "fr",
  "ko",
  "es",
  "it",
  "ar",
  "fa",
  "ru",
  "tr",
  "lo",
];

const AI_TRAINING_BOTS = [
  "GPTBot",
  "CCBot",
  "ClaudeBot",
  "Google-Extended",
  "Bytespider",
  "Amazonbot",
  "Applebot-Extended",
  "meta-externalagent",
];

module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: ["/404", "/500"],
  alternateRefs: [
    { href: SITE_URL, hreflang: "x-default" },
    ...LOCALES.map((l) => ({
      href: `${SITE_URL}/${l}`,
      hreflang: l === "zh" ? "zh-CN" : l === "tw" ? "zh-TW" : l,
    })),
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
      ...AI_TRAINING_BOTS.map((userAgent) => ({
        userAgent,
        disallow: "/",
      })),
    ],
  },
  transform: async (config, path) => {
    const formatted = path.replace(/\/$/, "") || "/";
    if (formatted === "/") {
      return {
        loc: formatted,
        changefreq: "weekly",
        priority: 1.0,
        lastmod: new Date().toISOString(),
      };
    }
    if (/\/level\/[0-9]+$/.test(formatted)) {
      return {
        loc: formatted,
        changefreq: "monthly",
        priority: 0.7,
        lastmod: new Date().toISOString(),
      };
    }
    return {
      loc: formatted,
      changefreq: "monthly",
      priority: 0.5,
      lastmod: new Date().toISOString(),
    };
  },
};
