import React from 'react';
import Link from 'next/link';
import { 
  GraduationCap, 
  Briefcase, 
  Code2, 
  PenLine, 
  Store, 
  BookOpen, 
  Building2, 
  Users, 
  ArrowRight
} from 'lucide-react';

type AudienceCard = {
  title: string;
  summary: string;
  href: string;
  icon: React.ElementType;
};

const userGroups: AudienceCard[] = [
  {
    title: "Students",
    summary: "Prepare assignments, project files, reports, resumes, and upload-ready documents faster.",
    href: "/blog/articles/singulariti-for-students",
    icon: GraduationCap
  },
  {
    title: "Job Seekers",
    summary: "Prepare resumes, certificates, merged PDFs, compressed files, and application documents quickly.",
    href: "/blog/articles/singulariti-for-job-seekers",
    icon: Briefcase
  },
  {
    title: "Developers",
    summary: "Format code, validate data, decode content, preview HTML, and speed up development tasks.",
    href: "/blog/articles/singulariti-for-developers",
    icon: Code2
  },
  {
    title: "Content Writers and Bloggers",
    summary: "Check words, improve SEO basics, compare drafts, and prepare clean content faster.",
    href: "/blog/articles/singulariti-for-content-writers",
    icon: PenLine
  },
  {
    title: "Small Business Owners",
    summary: "Create QR codes, calculate values, compress files, and prepare simple business documents.",
    href: "/blog/articles/singulariti-for-small-business",
    icon: Store
  },
  {
    title: "Teachers and Trainers",
    summary: "Prepare study materials, share notes, create QR links, and organize documents quickly.",
    href: "/blog/articles/singulariti-for-teachers",
    icon: BookOpen
  },
  {
    title: "Office Workers",
    summary: "Manage PDFs, convert files, clean text, resize images, and reduce repetitive document work.",
    href: "/blog/articles/singulariti-for-office-workers",
    icon: Building2
  },
  {
    title: "General Users",
    summary: "Solve everyday file, image, text, QR, and calculation tasks without extra software.",
    href: "/blog/articles/singulariti-for-everyday-users",
    icon: Users
  }
];

export function WhoCanUseSingulariti() {
  return (
    <section className="w-full py-12 bg-gradient-to-b from-white via-teal-50/30 to-white text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-white border-t border-b border-slate-200 dark:border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Top Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="inline-flex items-center rounded-full border border-teal-100 bg-teal-50 px-4 py-2 text-sm font-semibold text-teal-700 dark:border-teal-900 dark:bg-teal-950/40 dark:text-teal-300 mb-4">
            Audience Overview
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-slate-950 md:text-5xl dark:text-white">
            Who Can Use Singulariti?
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-slate-600 md:text-lg dark:text-slate-300">
            Singulariti is built for anyone who works with files, text, images, calculations, code, or online content. It helps users complete small but important digital tasks faster, without complicated software or unnecessary steps.
          </p>
        </div>

        {/* User Cards Compact Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {userGroups.map((group, idx) => {
            const Icon = group.icon;
            return (
              <div 
                key={idx} 
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-teal-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between"
              >
                <div>
                  {/* Icon Box */}
                  <div className="mb-5 flex size-12 items-center justify-center rounded-2xl border border-teal-100 bg-teal-50 text-teal-700 dark:border-teal-900 dark:bg-teal-950/40 dark:text-teal-300">
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                    {group.title}
                  </h3>
                  
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {group.summary}
                  </p>
                </div>

                {/* Redirect Link */}
                <div className="mt-5 pt-3 border-t border-slate-200 dark:border-slate-800">
                  <Link 
                    href={group.href} 
                    aria-label={`View related guides for ${group.title}`}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-teal-700 hover:text-teal-800 dark:text-teal-300 dark:hover:text-teal-200 group/link"
                  >
                    View Related Guides
                    <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA to Read Full Guide */}
        <div className="mt-10 flex justify-center">
          <Link 
            href="/blog/articles/who-can-use-singulariti" 
            className="inline-flex items-center rounded-full bg-teal-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-550 shadow-sm gap-1 group/btn"
          >
            Read full guide
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
          </Link>
        </div>

      </div>
    </section>
  );
}
