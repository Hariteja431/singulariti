import React from 'react';

const pubId = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID || 'pub-7596639289168349';
const formattedPubId = pubId.startsWith('ca-pub-') ? pubId : `ca-pub-${pubId.replace(/^pub-/, '')}`;

export function AdsenseVerification() {
  return (
    <>
      <meta name="google-adsense-account" content={formattedPubId} />
      <script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${formattedPubId}`}
        crossOrigin="anonymous"
      />
    </>
  );
}

export function AdsenseAutoAds() {
  return null;
}

export function AdsenseScript() {
  return <AdsenseVerification />;
}
