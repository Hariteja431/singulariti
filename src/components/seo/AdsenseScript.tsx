import Script from 'next/script';
import React from 'react';

export function AdsenseScript() {
  const pubId = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID;

  if (!pubId) {
    return null; // Don't render anything if the ID isn't set yet
  }

  // Ensure the ID starts with 'ca-pub-'
  const formattedPubId = pubId.startsWith('ca-pub-') ? pubId : `ca-pub-${pubId.replace(/^pub-/, '')}`;

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${formattedPubId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
