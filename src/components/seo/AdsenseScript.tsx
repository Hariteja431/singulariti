import React from 'react';

export function AdsenseScript() {
  const pubId = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID || 'pub-7596639289168349';
  const formattedPubId = pubId.startsWith('ca-pub-') ? pubId : `ca-pub-${pubId.replace(/^pub-/, '')}`;

  return (
    <script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${formattedPubId}`}
      crossOrigin="anonymous"
    />
  );
}
