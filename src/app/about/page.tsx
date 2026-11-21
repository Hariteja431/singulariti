import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { buildMetadata } from '@/lib/seo/metadata';
import { getPageSEO } from '@/lib/seo/pageMetadata';
import { 
  ShieldCheck, 
  Cpu, 
  Code2, 
  Lock, 
  EyeOff, 
  CheckCircle2, 
  Mail, 
  MapPin, 
  Globe2, 
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';

const seo = getPageSEO('about')!;
export const metadata = buildMetadata({
  title: seo.title,
  description: seo.description,
  canonical: `https://www.singulariti.in${seo.path}`,
  robots: seo.robots,
  openGraph: {
    title: seo.openGraph.title,
    description: seo.openGraph.description,
    url: seo.openGraph.url,
    type: seo.openGraph.type,
    image: seo.openGraph.image,
  },
  twitter: {
    title: seo.twitter.title,
    description: seo.twitter.description,
    image: seo.twitter.image,
  },
});

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="flex-1 w-full bg-background text-foreground pt-28 pb-20 selection:bg-primary/20">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl space-y-16">
          
          {/* Hero Section */}
          <section className="text-center space-y-6 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Independent Engineering &amp; Client-First Architecture</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-display font-bold text-ink tracking-tight leading-tight">
              About Singulariti
            </h1>
            
            <p className="text-base md:text-lg text-slate leading-relaxed font-sans">
              Singulariti is an independent digital tools platform engineered to provide instant, browser-native utilities with zero data collection, zero forced cloud uploads, and total user privacy.
            </p>
          </section>

          {/* Mission & Problem Statement */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-surface border border-border rounded-3xl p-8 md:p-10 shadow-sm">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-primary font-mono">
                The Origin Story
              </span>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-ink">
                Why We Built Singulariti
              </h2>
              <p className="text-slate text-sm leading-relaxed font-sans">
                For years, simple everyday tasks—like compressing a PDF, resizing a screenshot, formatting JSON, or generating a QR code—have forced users into a dangerous trade-off. Traditional online converters require users to upload confidential documents, tax returns, personal photos, and sensitive source code to remote third-party cloud servers.
              </p>
              <p className="text-slate text-sm leading-relaxed font-sans">
                These legacy websites often monetize by capturing user data, displaying deceptive fake download buttons, and storing unencrypted files indefinitely. Singulariti was conceived as a principled alternative: a modern web application where every utility executes entirely inside the user’s local browser memory.
              </p>
            </div>

            <div className="bg-background border border-border rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-ink font-display">Client-Side Guarantee</h3>
                  <p className="text-xs text-slate">No file payloads ever leave your device</p>
                </div>
              </div>

              <ul className="space-y-3 pt-2 text-xs text-slate font-sans">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span><strong>Zero Server Storage:</strong> Your documents and images are never saved to any database.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span><strong>Instant Processing:</strong> Zero upload or download wait times; processing runs at local hardware speeds.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span><strong>Memory Purge on Exit:</strong> Closing or refreshing the browser tab immediately purges volatile RAM.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Technical Architecture */}
          <section className="space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-primary font-mono">
                Under the Hood
              </span>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-ink">
                Technical Architecture &amp; Security
              </h2>
              <p className="text-sm text-slate">
                How we achieve desktop-grade utility performance inside modern web browsers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-surface border border-border rounded-2xl p-6 space-y-4 shadow-sm hover:border-primary/40 transition-colors">
                <div className="p-3 w-fit rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
                  <Cpu className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-lg text-ink">
                  WebAssembly (WASM)
                </h3>
                <p className="text-xs text-slate leading-relaxed font-sans">
                  We compile high-performance native algorithms into sandboxed WebAssembly modules. This allows operations like multi-megabyte PDF parsing and image compression to run with native CPU multi-threading directly in your browser.
                </p>
              </div>

              <div className="bg-surface border border-border rounded-2xl p-6 space-y-4 shadow-sm hover:border-primary/40 transition-colors">
                <div className="p-3 w-fit rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  <Code2 className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-lg text-ink">
                  HTML5 Canvas API
                </h3>
                <p className="text-xs text-slate leading-relaxed font-sans">
                  Our image manipulation utilities leverage the browser’s hardware-accelerated Canvas 2D and OffscreenCanvas APIs to perform cropping, format conversion, watermarking, and color adjustments without sending a single pixel over HTTP.
                </p>
              </div>

              <div className="bg-surface border border-border rounded-2xl p-6 space-y-4 shadow-sm hover:border-primary/40 transition-colors">
                <div className="p-3 w-fit rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-lg text-ink">
                  Web Cryptography API
                </h3>
                <p className="text-xs text-slate leading-relaxed font-sans">
                  Security-critical operations—such as SHA-256 checksums, UUIDv4 generation, and local text obfuscation—are handled by the browser’s standard <code className="font-mono text-[11px] bg-background px-1 py-0.5 rounded">window.crypto.subtle</code> API.
                </p>
              </div>
            </div>
          </section>

          {/* Founder & Authorship / E-E-A-T */}
          <section className="bg-surface border border-border rounded-3xl p-8 md:p-10 space-y-6 shadow-sm">
            <div className="border-b border-border pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-primary font-mono">
                Leadership &amp; Ownership
              </span>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-ink mt-1">
                Founder &amp; Engineering Team
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              <div className="space-y-3 md:col-span-1">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-primary to-teal-400 flex items-center justify-center text-white text-2xl font-bold font-display shadow-md">
                  HT
                </div>
                <div>
                  <h3 className="text-lg font-bold text-ink font-display">Hari Teja</h3>
                  <p className="text-xs text-primary font-medium font-sans">Founder &amp; Lead Engineer</p>
                  <p className="text-xs text-slate mt-1 font-sans">Visakhapatnam, Andhra Pradesh, India</p>
                </div>
                <div className="pt-2 text-xs text-slate space-y-1 font-sans">
                  <p><strong>Focus:</strong> Client-Side Web Architecture, Systems Engineering &amp; WebAssembly</p>
                </div>
              </div>

              <div className="space-y-4 md:col-span-2 text-sm text-slate font-sans leading-relaxed">
                <p>
                  Hari Teja is a full-stack engineer and web performance enthusiast who founded Singulariti to build a clean, ad-clutter-free suite of everyday productivity utilities that anyone can use without compromising privacy or signing up for subscriptions.
                </p>
                <p>
                  Together with a small team of passionate developers, Hari oversees tool development, client-side algorithm verification, accessibility audits (WCAG 2.1 AA), and ongoing editorial research. Every tool released on Singulariti undergoes strict manual testing across Google Chrome, Mozilla Firefox, Microsoft Edge, and Apple Safari.
                </p>
                <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold">
                  <Link 
                    href="/editorial-policy" 
                    className="inline-flex items-center gap-1.5 text-primary hover:underline"
                  >
                    Read Our Editorial Policy <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link 
                    href="/contact" 
                    className="inline-flex items-center gap-1.5 text-primary hover:underline"
                  >
                    Contact the Engineering Team <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Contact, Location & Transparency */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface border border-border rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                  <Mail className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-ink font-display">Official Inquiries &amp; Support</h3>
              </div>
              <p className="text-xs text-slate leading-relaxed font-sans">
                Have a question, encountered a bug, or have an idea for a new client-side tool? Reach out directly to our team.
              </p>
              <div className="space-y-1.5 text-xs text-slate font-sans">
                <p><strong>Email:</strong> <a href="mailto:singulariti.contact@gmail.com" className="text-primary hover:underline">singulariti.contact@gmail.com</a></p>
                <p><strong>Response Time:</strong> Typically within 24 to 48 business hours</p>
              </div>
            </div>

            <div className="bg-surface border border-border rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                  <MapPin className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-ink font-display">Registered Location &amp; Socials</h3>
              </div>
              <div className="space-y-1.5 text-xs text-slate font-sans">
                <p><strong>Operational Location:</strong> Visakhapatnam, Andhra Pradesh 530001, India</p>
                <p><strong>X (Twitter):</strong> <a href="https://x.com/singulariti_in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">@singulariti_in</a></p>
                <p><strong>YouTube:</strong> <a href="https://www.youtube.com/@singulariti_in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">@singulariti_in</a></p>
                <p><strong>Instagram:</strong> <a href="https://www.instagram.com/singulariti.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">@singulariti.in</a></p>
              </div>
            </div>
          </section>

        </div>
      </main>
      <Footer />
    </>
  );
}
