import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Wrench, FileText, Image as ImageIcon, Calculator, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Page Not Found (404) | Singulariti',
  description: 'The page you are looking for does not exist or has been moved. Explore our collection of free browser-based utility tools.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex-1 w-full flex flex-col items-center justify-center pt-24 pb-16 px-4">
        <div className="max-w-2xl text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary/10 text-primary font-display font-black text-4xl border border-primary/20 shadow-sm">
            404
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-ink">
            Page Not Found
          </h1>
          <p className="text-base text-slate leading-relaxed max-w-lg mx-auto">
            The page or utility you requested could not be located. It may have moved or been updated. Choose from one of our popular categories below.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-6 text-left">
            <Link
              href="/tools/pdf"
              className="p-4 rounded-xl border border-border bg-surface hover:border-primary transition group flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-primary" />
                <div>
                  <span className="text-sm font-bold text-ink block">PDF Tools</span>
                  <span className="text-xs text-slate">Merge, compress, sign &amp; edit PDFs</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate group-hover:text-primary transition" />
            </Link>

            <Link
              href="/image"
              className="p-4 rounded-xl border border-border bg-surface hover:border-primary transition group flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <ImageIcon className="w-5 h-5 text-primary" />
                <div>
                  <span className="text-sm font-bold text-ink block">Image Tools</span>
                  <span className="text-xs text-slate">Compress, resize &amp; edit images</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate group-hover:text-primary transition" />
            </Link>

            <Link
              href="/tools/calculators"
              className="p-4 rounded-xl border border-border bg-surface hover:border-primary transition group flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Calculator className="w-5 h-5 text-primary" />
                <div>
                  <span className="text-sm font-bold text-ink block">Calculators</span>
                  <span className="text-xs text-slate">Financial, math &amp; daily calculators</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate group-hover:text-primary transition" />
            </Link>

            <Link
              href="/tools"
              className="p-4 rounded-xl border border-border bg-surface hover:border-primary transition group flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Wrench className="w-5 h-5 text-primary" />
                <div>
                  <span className="text-sm font-bold text-ink block">All Utilities</span>
                  <span className="text-xs text-slate">Explore all 180+ free browser tools</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate group-hover:text-primary transition" />
            </Link>
          </div>

          <div className="pt-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-dark font-bold text-sm hover:bg-primary/90 transition shadow-sm"
            >
              Return to Homepage
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
