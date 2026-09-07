"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";

function getMeasurementId(): string | null {
  const raw = process.env.NEXT_PUBLIC_GA_ID?.trim();
  if (!raw || !/^G-[A-Z0-9]+$/i.test(raw)) return null;
  return raw;
}

/**
 * Loads GA4 when NEXT_PUBLIC_GA_ID is a valid Measurement ID (G-XXXXXXXX).
 * The snippet records the first page view; later client navigations are sent here.
 */
export default function GoogleAnalytics() {
  const gaId = getMeasurementId();
  const pathname = usePathname();
  const isFirstPath = useRef(true);

  useEffect(() => {
    if (!gaId) return;
    if (isFirstPath.current) {
      isFirstPath.current = false;
      return;
    }
    window.gtag?.("config", gaId, { page_path: pathname });
  }, [gaId, pathname]);

  if (!gaId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  );
}
