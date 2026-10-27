"use client";

import { useEffect, useRef, useState } from "react";
import { canServeAds } from "@/components/adsense";

interface AdSlotProps {
  slot?: string;
  format?: string;
  className?: string;
  /** Aspect-ratio style (CSS) for the placeholder when no AdSense ID is set. */
  placeholderRatio?: string;
}

/**
 * Renders an AdSense ad unit when NEXT_PUBLIC_GOOGLE_ADSENSE_ID is set.
 * Otherwise renders a non-intrusive placeholder so the layout slot is reserved.
 */
export default function AdSlot({
  slot,
  format = "auto",
  className = "",
  placeholderRatio = "8 / 1",
}: AdSlotProps) {
  const adsenseId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID;
  const insRef = useRef<HTMLModElement | null>(null);
  // Decided on the client: bots, previews and framed loads get no ad unit.
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    setAllowed(canServeAds());
  }, []);

  useEffect(() => {
    if (!adsenseId || !allowed || !insRef.current) return;
    try {
      // @ts-expect-error AdSense globally injected
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // no-op
    }
  }, [adsenseId, allowed]);

  if (!adsenseId) {
    return (
      <div
        className={`w-full rounded-lg border border-dashed border-border bg-muted/40 text-xs text-muted-foreground flex items-center justify-center select-none ${className}`}
        style={{ aspectRatio: placeholderRatio }}
        aria-hidden
      >
        Advertisement
      </div>
    );
  }

  if (!allowed) return null;

  return (
    <ins
      ref={insRef}
      className={`adsbygoogle block ${className}`}
      style={{ display: "block" }}
      data-ad-client={adsenseId}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  );
}
