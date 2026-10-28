"use client";

import { useEffect, useState } from "react";

// Crawlers, headless browsers and automation tools. Serving them ads only
// produces impressions the ad network discards as invalid traffic.
const BOT_UA =
  /bot|crawl|spider|slurp|headless|phantom|puppeteer|playwright|selenium|lighthouse|pagespeed|gtmetrix|preview|facebookexternalhit|bingpreview|python|curl|wget|httpclient|go-http/i;

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

// Adsterra banner units, one per size. Only plain banners: no popunder,
// social bar or interstitial formats.
const UNITS = {
  desktop: { key: process.env.NEXT_PUBLIC_ADSTERRA_728X90, width: 728, height: 90 },
  mobile: { key: process.env.NEXT_PUBLIC_ADSTERRA_320X50, width: 320, height: 50 },
};
// The loader URL Adsterra's "Get code" snippet uses, with the unit key at the end.
const SCRIPT_BASE =
  process.env.NEXT_PUBLIC_ADSTERRA_SCRIPT_BASE || "https://bauval.org/22/";

// Adsterra's snippet reads a global `atOptions`, so two units on one page
// clash. Each banner gets its own document instead.
function bannerDocument(key: string, width: number, height: number) {
  const options = JSON.stringify({ key, format: "iframe", height, width, params: {} });
  return `<!doctype html><html><body style="margin:0"><script>atOptions=${options};</script><script src="${SCRIPT_BASE}${key}"></script></body></html>`;
}

export default function AdBanner({ className = "" }: { className?: string }) {
  const [unit, setUnit] = useState<(typeof UNITS)["desktop"] | null>(null);

  // Decided on the client: bots, previews and framed loads get no banner.
  useEffect(() => {
    if (!canServeAds()) return;
    const candidate = window.innerWidth >= 768 ? UNITS.desktop : UNITS.mobile;
    if (candidate.key) setUnit(candidate);
  }, []);

  if (!unit?.key) return null;

  return (
    <div className={`flex justify-center ${className}`}>
      <iframe
        title="Advertisement"
        srcDoc={bannerDocument(unit.key, unit.width, unit.height)}
        width={unit.width}
        height={unit.height}
        loading="lazy"
        scrolling="no"
        sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox"
        // A light frame inside a dark page gets an opaque white canvas; matching
        // the frame's own scheme keeps an unfilled slot transparent.
        style={{ border: 0, maxWidth: "100%", colorScheme: "light" }}
      />
    </div>
  );
}
