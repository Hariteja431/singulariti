import React from 'react';
import { ToolRegistryItem } from '@/registry/types';
import { getToolDetails } from '@/lib/tool-content/allToolsDb';
import { CheckCircle2, AlertTriangle, ShieldCheck, HelpCircle, ListOrdered } from 'lucide-react';

interface DynamicToolArticleProps {
  tool: ToolRegistryItem;
}

export function DynamicToolArticle({ tool }: DynamicToolArticleProps) {
  const details = getToolDetails(tool.id, tool.name, tool.description);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": details.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": `How to use ${tool.name}`,
    "description": tool.description,
    "step": details.stepByStep.map((step, idx) => ({
      "@type": "HowToStep",
      "position": idx + 1,
      "text": step
    }))
  };

  return (
    <article className="w-full max-w-4xl mx-auto mt-16 mb-12 px-4 space-y-12">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />

      {/* 1. Overview & Purpose */}
      <section className="bg-surface border border-border rounded-2xl p-6 md:p-8 space-y-4 shadow-sm">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-ink">
          About the {tool.name}
        </h2>
        <p className="text-slate text-base md:text-lg leading-relaxed">
          {details.whyNeed}
        </p>
        <p className="text-slate text-base leading-relaxed">
          {details.whenToUse}
        </p>
      </section>

      {/* 2. Technical Architecture & Local Privacy */}
      <section className="bg-surface border border-border rounded-2xl p-6 md:p-8 space-y-4 shadow-sm">
        <div className="flex items-center gap-3 text-primary">
          <ShieldCheck className="w-7 h-7 flex-shrink-0" />
          <h3 className="text-xl md:text-2xl font-display font-bold text-ink">
            How Client-Side Processing Works
          </h3>
        </div>
        <p className="text-slate text-base leading-relaxed">
          {details.howWorks}
        </p>
        <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 text-sm text-slate leading-relaxed">
          <strong>Privacy Guarantee:</strong> Unlike traditional web services that upload your personal documents, images, or configuration files to third-party cloud servers, Singulariti executes all processing in your web browser&apos;s volatile memory. No files are transferred over the network, ensuring complete confidentiality.
        </div>
      </section>

      {/* 3. Step-by-Step Instructions */}
      <section className="bg-surface border border-border rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
        <div className="flex items-center gap-3 text-ink">
          <ListOrdered className="w-6 h-6 text-primary flex-shrink-0" />
          <h3 className="text-xl md:text-2xl font-display font-bold">
            Step-by-Step Guide: How to Use {tool.name}
          </h3>
        </div>
        <ol className="space-y-4">
          {details.stepByStep.map((step, idx) => (
            <li key={idx} className="flex items-start gap-4 text-slate">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm mt-0.5">
                {idx + 1}
              </span>
              <span className="text-base leading-relaxed pt-0.5">
                {step}
              </span>
            </li>
          ))}
        </ol>
      </section>

      {/* 4. Key Advantages */}
      <section className="bg-surface border border-border rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
        <h3 className="text-xl md:text-2xl font-display font-bold text-ink">
          Key Advantages &amp; Features
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {details.advantages.map((adv, idx) => (
            <div key={idx} className="flex items-start gap-3 p-4 bg-background/50 rounded-xl border border-border/60">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <p className="text-slate text-sm leading-relaxed">{adv}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Common Mistakes to Avoid */}
      {details.commonMistakes.length > 0 && (
        <section className="bg-surface border border-border rounded-2xl p-6 md:p-8 space-y-4 shadow-sm">
          <div className="flex items-center gap-3 text-amber-500">
            <AlertTriangle className="w-6 h-6 flex-shrink-0" />
            <h3 className="text-xl md:text-2xl font-display font-bold text-ink">
              Tips &amp; Common Mistakes to Avoid
            </h3>
          </div>
          <ul className="space-y-3">
            {details.commonMistakes.map((mistake, idx) => (
              <li key={idx} className="flex items-start gap-3 text-slate text-sm leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0 mt-2" />
                <span>{mistake}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 6. Frequently Asked Questions */}
      {details.faqs.length > 0 && (
        <section className="bg-surface border border-border rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
          <div className="flex items-center gap-3 text-ink">
            <HelpCircle className="w-6 h-6 text-primary flex-shrink-0" />
            <h3 className="text-xl md:text-2xl font-display font-bold">
              Frequently Asked Questions
            </h3>
          </div>
          <div className="space-y-4 divide-y divide-border/60">
            {details.faqs.map((faq, idx) => (
              <div key={idx} className={idx > 0 ? "pt-4" : ""}>
                <h4 className="text-base font-bold text-ink mb-2">
                  {faq.q}
                </h4>
                <p className="text-slate text-sm leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
