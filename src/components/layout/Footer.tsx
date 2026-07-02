import React from 'react';
import Link from 'next/link';

import { Logo } from '../ui/Logo';

export function Footer() {
  return (
    <footer className="w-full bg-surface border-t border-border mt-24">
      <div className="container mx-auto px-4 md:px-6 py-12 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center mb-6">
              <Logo />
            </Link>
            <p className="text-slate text-[13px] font-sans">
              One place. Every tool.<br />
              Fast, secure, browser-based utility tools.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a 
                href="https://www.youtube.com/@singulariti_in" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-slate hover:text-primary-text transition-colors duration-200"
                aria-label="YouTube"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.516 0-9.388.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.872.507 9.388.507 9.388.507s7.517 0 9.388-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a 
                href="https://www.instagram.com/singulariti.in?igsh=cml2ZjI3c2ZwZHdw" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-slate hover:text-primary-text transition-colors duration-200"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a 
                href="https://x.com/singulariti_in" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-slate hover:text-primary-text transition-colors duration-200"
                aria-label="X (formerly Twitter)"
              >
                <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a 
                href="https://www.reddit.com/user/singulariti_in/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-slate hover:text-primary-text transition-colors duration-200"
                aria-label="Reddit"
              >
                <svg className="w-[19px] h-[19px]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.505 1.12-.82 2.67-1.366 4.385-1.455l.88-4.128a.501.501 0 0 1 .585-.381l2.928.618a1.255 1.255 0 0 1 1.243-.661zM9.24 12c.89 0 1.615.726 1.615 1.615s-.725 1.615-1.615 1.615-1.615-.726-1.615-1.615S8.35 12 9.24 12zm5.52 0c.89 0 1.615.726 1.615 1.615s-.725 1.615-1.615 1.615-1.615-.726-1.615-1.615S13.87 12 14.76 12zm-5.28 4.25c.34.417.84.661 1.465.733 1.055.12 1.61-.412 1.642-.444a.498.498 0 0 0-.687-.723c-.02.018-.396.34-1.026.269-.47-.053-.787-.245-.981-.482a.5.5 0 0 0-.776.647z"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-display font-bold text-[15px] text-ink mb-4">Ecosystem</h3>
            <nav className="space-y-2 flex flex-col" aria-label="Ecosystem">
              <Link href="/tools/pdf" className="text-[13px] text-slate hover:text-primary-text transition-colors">PDF Tools</Link>
              <Link href="/image" className="text-[13px] text-slate hover:text-primary-text transition-colors">Image Tools</Link>
              <Link href="/tools/text" className="text-[13px] text-slate hover:text-primary-text transition-colors">Text Tools</Link>
              <Link href="/tools/dev" className="text-[13px] text-slate hover:text-primary-text transition-colors">Developer Tools</Link>
              <Link href="/tools/calculators" className="text-[13px] text-slate hover:text-primary-text transition-colors">Calculators</Link>
              <Link href="/tools/convert" className="text-[13px] text-slate hover:text-primary-text transition-colors">Converters</Link>
              <Link href="/tools/qr" className="text-[13px] text-slate hover:text-primary-text transition-colors">QR Tools</Link>
              <Link href="/tools/seo" className="text-[13px] text-slate hover:text-primary-text transition-colors">SEO Tools</Link>
              <Link href="/pomodoro-timer" className="text-[13px] text-slate hover:text-primary-text transition-colors">Pomodoro Timer</Link>
              <Link href="/typing-speed-test" className="text-[13px] text-slate hover:text-primary-text transition-colors">Typing Speed Test</Link>
            </nav>
          </div>
          
          <div>
            <h3 className="font-display font-bold text-[15px] text-ink mb-4">Company</h3>
            <nav className="space-y-2 flex flex-col" aria-label="Company">
              <Link href="/about" className="text-[13px] text-slate hover:text-primary-text transition-colors">About</Link>
              <Link href="/blog" className="text-[13px] text-slate hover:text-primary-text transition-colors">Blog</Link>
              <Link href="/contact" className="text-[13px] text-slate hover:text-primary-text transition-colors">Contact</Link>
              <Link href="/feedback" className="text-[13px] text-slate hover:text-primary-text transition-colors">Feedback & Requests</Link>
              <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="text-[13px] text-slate hover:text-primary-text transition-colors">Sitemap</a>
            </nav>
          </div>
          
          <div>
            <h3 className="font-display font-bold text-[15px] text-ink mb-4">Legal</h3>
            <nav className="space-y-2 flex flex-col" aria-label="Legal">
              <Link href="/privacy" className="text-[13px] text-slate hover:text-primary-text transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-[13px] text-slate hover:text-primary-text transition-colors">Terms of Service</Link>
              <Link href="/cookie-policy" className="text-[13px] text-slate hover:text-primary-text transition-colors">Cookie Policy</Link>
              <Link href="/editorial-policy" className="text-[13px] text-slate hover:text-primary-text transition-colors">Editorial Policy</Link>
              <Link href="/disclaimer" className="text-[13px] text-slate hover:text-primary-text transition-colors">Disclaimer</Link>
            </nav>
          </div>
        </div>
        
        <div className="w-full h-px bg-border my-8"></div>
        
        <div className="flex justify-between items-center text-[11px] text-slate font-sans">
          <span>&copy; 2026 Singulariti Labs. All rights reserved.</span>
          <span>Designed with precision.</span>
        </div>
      </div>
    </footer>
  );
}
