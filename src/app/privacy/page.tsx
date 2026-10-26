import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { buildMetadata } from '@/lib/seo/metadata';
import { getPageSEO } from '@/lib/seo/pageMetadata';

const seo = getPageSEO('privacy')!;
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

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="flex-1 w-full flex flex-col items-center pt-24 pb-12">
        <section className="container mx-auto px-4 max-w-3xl font-sans text-slate">
          <h1 className="font-display font-bold text-4xl text-ink mb-3">Privacy Policy</h1>
          <p className="text-sm text-slate mb-8">Last Updated: October 2026</p>
          <p className="mb-6 leading-relaxed">
            Privacy and transparency are core values at Singulariti. This Privacy Policy outlines how your information, files, and data are treated when you use our website, tools, and services.
          </p>

          <h2 className="font-display font-bold text-2xl text-ink mt-8 mb-4">1. No Login, Signup, or User Accounts</h2>
          <p className="mb-4 leading-relaxed">
            Singulariti does not require or offer user account registration. You can access and use all our utility tools without creating a profile, providing your name, email address, password, or any personal identification details.
          </p>

          <h2 className="font-display font-bold text-2xl text-ink mt-8 mb-4">2. Browser-Side (Local) Processing Architecture</h2>
          <p className="mb-4 leading-relaxed">
            Our tools are built using modern web standards including HTML5 Canvas, WebAssembly, Web Workers, and the Web Cryptography API. All file conversions, PDF modifications, image compression, formatting, calculations, and text manipulations are performed entirely within your web browser on your own device.
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2 leading-relaxed">
            <li><strong>Zero Server Uploads:</strong> Your documents, images, and inputs are never transmitted, stored, or processed on our servers.</li>
            <li><strong>Local Volatile Memory:</strong> Files are held temporarily in your browser&apos;s RAM only during your active session.</li>
            <li><strong>Immediate Clearing:</strong> Once you reload the page, close the browser tab, or click &quot;Reset&quot;, all temporary data is instantly cleared from memory.</li>
            <li><strong>Complete Confidentiality:</strong> Singulariti team members and third parties have no access to your files or content.</li>
          </ul>

          <h2 className="font-display font-bold text-2xl text-ink mt-8 mb-4">3. Data Collection and Usage</h2>
          <p className="mb-4 leading-relaxed">
            We do not sell, rent, trade, or monetize personal data or uploaded file contents. We do not inspect, log, or harvest file contents, developer code snippets, QR code values, financial calculation inputs, or personal documents.
          </p>

          <h2 className="font-display font-bold text-2xl text-ink mt-8 mb-4">4. Google AdSense &amp; Third-Party Advertising</h2>
          <p className="mb-4 leading-relaxed">
            To provide our utility tools completely free of charge, we partner with third-party advertising networks, primarily Google AdSense. In compliance with Google Publisher Policies and data transparency guidelines:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2 leading-relaxed">
            <li>Third-party vendors, including Google, use cookies to serve ads based on a user&apos;s prior visits to this website or other websites across the Internet.</li>
            <li>Google&apos;s use of advertising cookies enables it and its partners to serve personalized or contextual advertisements to visitors based on browsing history.</li>
            <li>Users may opt out of personalized advertising at any time by visiting <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Ads Settings</a>.</li>
            <li>Alternatively, users can opt out of a third-party vendor&apos;s use of cookies for personalized advertising by visiting <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.aboutads.info</a> or <a href="https://youronlinechoices.eu/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Your Online Choices</a>.</li>
          </ul>

          <h2 className="font-display font-bold text-2xl text-ink mt-8 mb-4">5. Cookies and Web Storage</h2>
          <p className="mb-4 leading-relaxed">
            Singulariti uses minimal cookies and local web storage strictly for:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2 leading-relaxed">
            <li>Remembering your user interface preferences (such as Dark/Light theme).</li>
            <li>Recording your cookie consent selection.</li>
            <li>Aggregated, anonymized traffic analytics (via Google Analytics 4) to monitor website uptime, popular utilities, and technical performance.</li>
          </ul>

          <h2 className="font-display font-bold text-2xl text-ink mt-8 mb-4">6. External Links</h2>
          <p className="mb-4 leading-relaxed">
            Our articles and guides may contain reference links to third-party websites or official documentation. Singulariti is not responsible for the privacy practices, terms, or content of external third-party websites.
          </p>

          <h2 className="font-display font-bold text-2xl text-ink mt-8 mb-4">7. Contact &amp; Inquiries</h2>
          <p className="mb-4 leading-relaxed">
            If you have questions, concerns, or feedback regarding our privacy practices or this policy, please contact our team:
          </p>
          <div className="bg-surface border border-border rounded-xl p-6 mt-6 mb-8">
            <h3 className="font-display font-bold text-lg text-ink mb-4">Singulariti Labs</h3>
            <p className="mb-2 text-[15px]"><strong>Email:</strong> <a href="mailto:singulariti.contact@gmail.com" className="text-primary hover:underline">singulariti.contact@gmail.com</a></p>
            <p className="text-[15px]"><strong>Address:</strong> Visakhapatnam, Andhra Pradesh 530001, India</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
