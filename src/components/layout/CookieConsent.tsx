'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShow(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setShow(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom-5 duration-500">
      <div className="container mx-auto max-w-5xl">
        <div className="bg-surface border border-border shadow-2xl rounded-2xl p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex-1 font-sans">
            <h3 className="font-display font-bold text-[17px] text-ink mb-2">We value your privacy</h3>
            <p className="text-[14px] text-slate leading-relaxed">
              We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. 
              By clicking "Accept All", you consent to our use of cookies. Read our <Link href="/cookie-policy" className="text-primary hover:underline font-medium">Cookie Policy</Link> for more details.
            </p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
            <button 
              onClick={handleDecline}
              className="flex-1 md:flex-none px-5 py-2.5 rounded-lg border border-border bg-background text-ink font-bold text-[14px] hover:bg-border/50 transition-colors"
            >
              Decline
            </button>
            <button 
              onClick={handleAccept}
              className="flex-1 md:flex-none px-5 py-2.5 rounded-lg bg-primary text-white font-bold text-[14px] hover:bg-primary/90 transition-colors"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
