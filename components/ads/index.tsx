"use client";

import { useEffect, useRef, useState } from "react";

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

// Adsterra's snippet, inserted into the page itself: Adsterra does not accept
// traffic generated within iframes, so wrapping it in a frame of our own got
// no fill. The loader draws the ad in its own iframe. It reads the global
// `atOptions`, so a page carries a single banner.
function insertSnippet(slot: HTMLElement, key: string, width: number, height: number) {
  const options = document.createElement("script");
  options.text = `atOptions = ${JSON.stringify({ key, format: "iframe", height, width, params: {} })};`;
  const loader = document.createElement("script");
  // Keeps Cloudflare Rocket Loader from rewriting it, per Adsterra's docs.
  loader.setAttribute("data-cfasync", "false");
  loader.src = `${SCRIPT_BASE}${key}`;
  slot.append(options, loader);
}

export default function AdBanner({ className = "" }: { className?: string }) {
  const [unit, setUnit] = useState<(typeof UNITS)["desktop"] | null>(null);
  const slotRef = useRef<HTMLDivElement>(null);

  // Decided on the client: bots, previews and framed loads get no banner.
  useEffect(() => {
    if (!canServeAds()) return;
    const candidate = window.innerWidth >= 768 ? UNITS.desktop : UNITS.mobile;
    if (candidate.key) setUnit(candidate);
  }, []);

  // Loaded only once the slot is near the viewport, so the ad never delays the
  // page and readers who leave early are not counted.
  useEffect(() => {
    const slot = slotRef.current;
    if (!unit?.key || !slot) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        observer.disconnect();
        insertSnippet(slot, unit.key!, unit.width, unit.height);
      },
      { rootMargin: "200px" },
    );
    observer.observe(slot);
    return () => {
      observer.disconnect();
      slot.replaceChildren();
    };
  }, [unit]);

  if (!unit?.key) return null;

  return (
    <div className={`flex justify-center ${className}`}>
      {/* Reserved size, so the page does not jump when the ad arrives. A light
          scheme matches the ad's own frame, so an unfilled one stays
          transparent instead of a white box on the dark theme. */}
      <div
        ref={slotRef}
        aria-label="Advertisement"
        style={{ width: unit.width, height: unit.height, maxWidth: "100%", overflow: "hidden", colorScheme: "light" }}
      />
    </div>
  );
}
