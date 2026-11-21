'use client';

import React, { useEffect, useRef } from 'react';

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

interface AdsenseSlotProps {
  slotId?: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  responsive?: boolean;
  className?: string;
}

export function AdsenseSlot({
  slotId,
  format = 'auto',
  responsive = true,
  className = '',
}: AdsenseSlotProps) {
  const adRef = useRef<HTMLModElement | null>(null);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
    } catch (e) {
      // Graceful error suppression when adblockers prevent push
    }
  }, []);

  return (
    <div className={`adsense-slot-wrapper my-6 overflow-hidden flex justify-center items-center ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', minHeight: '90px' }}
        data-ad-client={formattedPubId}
        data-ad-slot={slotId || '1234567890'}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
}
