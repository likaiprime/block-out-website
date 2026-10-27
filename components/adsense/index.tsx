"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Crawlers, headless browsers and automation tools. Serving them ads only
// produces impressions AdSense discards as invalid traffic.
const BOT_UA =
  /bot|crawl|spider|slurp|headless|phantom|puppeteer|playwright|selenium|lighthouse|pagespeed|gtmetrix|preview|facebookexternalhit|bingpreview|python|curl|wget|httpclient|go-http/i;

const SCRIPT_ID = "adsbygoogle-init";

// Pages that should never carry ads (404s, empty pages) render an element
// with this attribute; see app/(default)/[lang]/not-found.tsx.
export const NO_ADS_ATTR = "data-no-ads";

export function canServeAds() {
  // Only on the production host: preview/workers.dev/localhost loads count
  // against the account without being real audience traffic.
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (siteUrl) {
    const host = new URL(siteUrl).hostname.replace(/^www\./, "");
    if (window.location.hostname.replace(/^www\./, "") !== host) return false;
  }
  if (navigator.webdriver) return false;
  if (BOT_UA.test(navigator.userAgent)) return false;
  // Never inside someone else's frame.
  if (window.top !== window.self) return false;
  if (document.querySelector(`[${NO_ADS_ATTR}]`)) return false;
  return true;
}

export default function GoogleAdsense() {
  const adsenseId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID;
  const pathname = usePathname();

  useEffect(() => {
    // Auto ads: the script is loaded exactly once per document and never
    // re-pushed on client navigation.
    if (!adsenseId || document.getElementById(SCRIPT_ID)) return;
    if (!canServeAds()) return;
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`;
    document.head.appendChild(script);
  }, [adsenseId, pathname]);

  return null;
}
