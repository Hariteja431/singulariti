"use client";
import Script from 'next/script';
import React, { useEffect, useState } from 'react';

const PUB_ID = 'ca-pub-7596639289168349';

/**
 * Always-present AdSense site-linking script.
 *
 * This tiny script is required for:
 * 1. Google AdSense site verification (crawler checks for it unconditionally)
 * 2. Auto Ads initialisation once the user consents
 *
 * It does NOT serve ads or set cookies on its own — it only links the site to
 * the publisher account. Loading it without consent is safe under GDPR because
 * no personal data is processed until adsbygoogle.push({}) is called, which
 * only happens inside AdsenseAutoAds after the user accepts cookies.
 */
export function AdsenseVerification() {
  const pubId = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID || PUB_ID;
  const formattedPubId = pubId.startsWith('ca-pub-')
    ? pubId
    : `ca-pub-${pubId.replace(/^pub-/, '')}`;
  return (
    <Script
      id="adsense-verification"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${formattedPubId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}

/**
 * Consent-gated Auto Ads activation.
 *
 * Only activates adsbygoogle after the user explicitly accepts cookies.
 * This is the component that triggers personalised ad delivery.
 */
export function AdsenseAutoAds() {
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    const check = () => {
      if (localStorage.getItem('cookie-consent') === 'accepted') setConsented(true);
    };
    check();
    window.addEventListener('storage', check);
    return () => window.removeEventListener('storage', check);
  }, []);

  useEffect(() => {
    if (!consented) return;
    try {
      const w = window as Window & { adsbygoogle?: unknown[] };
      w.adsbygoogle = w.adsbygoogle || [];
      (w.adsbygoogle as unknown[]).push({
        google_ad_client: process.env.NEXT_PUBLIC_ADSENSE_PUB_ID || PUB_ID,
        enable_page_level_ads: true,
      });
    } catch {
      // script not yet loaded — Auto Ads will initialise when it does
    }
  }, [consented]);

  return null;
}

/**
 * @deprecated Use AdsenseVerification + AdsenseAutoAds separately.
 * Kept for backward compatibility during migration.
 */
export function AdsenseScript() {
  return (
    <>
      <AdsenseVerification />
      <AdsenseAutoAds />
    </>
  );
}
