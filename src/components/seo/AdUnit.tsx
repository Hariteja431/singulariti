"use client";
import { useEffect, useRef } from "react";

interface AdUnitProps {
  /** Slot ID from AdSense dashboard — e.g., "1234567890" */
  slotId: string;
  /** Ad format: "auto" | "rectangle" | "horizontal" | "vertical" */
  format?: string;
  className?: string;
}

export function AdUnit({ slotId, format = "auto", className }: AdUnitProps) {
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    try {
      const w = window as Window & { adsbygoogle?: unknown[] };
      w.adsbygoogle = w.adsbygoogle || [];
      w.adsbygoogle.push({});
      pushed.current = true;
    } catch {
      // adsbygoogle not yet loaded; will be handled when script loads
    }
  }, []);

  return (
    <ins
      className={`adsbygoogle${className ? ` ${className}` : ""}`}
      style={{ display: "block" }}
      data-ad-client="ca-pub-7596639289168349"
      data-ad-slot={slotId}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  );
}
