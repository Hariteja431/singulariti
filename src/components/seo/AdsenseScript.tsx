"use client";
import Script from 'next/script';
import React, { useEffect, useState } from 'react';

export function AdsenseScript() {
  const pubId = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID;
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    const check = () => {
      if (localStorage.getItem('cookie-consent') === 'accepted') setConsented(true);
    };
    check();
    window.addEventListener('storage', check);
    return () => window.removeEventListener('storage', check);
  }, []);

  if (!pubId || !consented) return null;

  const formattedPubId = pubId.startsWith('ca-pub-') ? pubId : `ca-pub-${pubId.replace(/^pub-/, '')}`;
  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${formattedPubId}`}
      crossOrigin="anonymous"
      strategy="lazyOnload"
    />
  );
}
