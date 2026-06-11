"use client";

import React, { useState } from 'react';
import { Plus, Minus, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  faqs: FAQItem[];
}

export function FAQAccordion({ faqs }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!faqs || faqs.length === 0) return null;

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="space-y-6 pt-10 border-t border-slate-200 dark:border-slate-800">
      <h3 className="font-display font-bold text-lg md:text-xl text-slate-950 dark:text-white flex items-center gap-2 mb-6">
        <HelpCircle className="w-5 h-5 text-teal-700 dark:text-teal-400" /> Frequently Asked Questions
      </h3>
      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className={`border rounded-xl overflow-hidden transition-all duration-200 bg-white dark:bg-slate-900 ${
                isOpen ? 'border-teal-200 dark:border-teal-850 shadow-sm' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <button
                onClick={() => toggleFaq(idx)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between p-5 text-left font-display font-bold text-sm md:text-[15px] text-slate-900 dark:text-white hover:text-teal-700 dark:hover:text-teal-300 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              >
                <span className="pr-4">{faq.question}</span>
                {isOpen ? (
                  <Minus className="w-4 h-4 text-teal-700 dark:text-teal-400 flex-shrink-0" />
                ) : (
                  <Plus className="w-4 h-4 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                )}
              </button>
              {isOpen && (
                <div 
                  className="px-5 pb-5 pt-0 text-[13px] md:text-sm font-sans text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 bg-teal-50/10 dark:bg-teal-950/5 animate-in fade-in slide-in-from-top-1 duration-200"
                >
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
