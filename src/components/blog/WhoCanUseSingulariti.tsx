import React from 'react';
import Link from 'next/link';
import { 
  GraduationCap, 
  Briefcase, 
  Code, 
  PenTool, 
  Store, 
  BookOpen, 
  FileText, 
  User,
  ArrowRight
} from 'lucide-react';

type AudienceItem = {
  title: string;
  summary: string;
  slug: string;
  icon: React.ComponentType<any>;
};

const audiences: AudienceItem[] = [
  {
    title: "Students",
    summary: "Prepare assignments, project files, reports, resumes, and upload-ready documents faster.",
    slug: "singulariti-for-students",
    icon: GraduationCap
  },
  {
    title: "Job Seekers",
    summary: "Prepare resumes, certificates, merged PDFs, compressed files, and application documents quickly.",
    slug: "singulariti-for-job-seekers",
    icon: Briefcase
  },
  {
    title: "Developers",
    summary: "Format code, validate data, decode content, preview HTML, and speed up development tasks.",
    slug: "singulariti-for-developers",
    icon: Code
  },
  {
    title: "Content Writers and Bloggers",
    summary: "Check words, improve SEO basics, compare drafts, and prepare clean content faster.",
    slug: "singulariti-for-content-writers",
    icon: PenTool
  },
  {
    title: "Small Business Owners",
    summary: "Create QR codes, calculate values, compress files, and prepare simple business documents.",
    slug: "singulariti-for-small-business",
    icon: Store
  },
  {
    title: "Teachers and Trainers",
    summary: "Prepare study materials, share notes, create QR links, and organize documents quickly.",
    slug: "singulariti-for-teachers",
    icon: BookOpen
  },
  {
    title: "Office Workers",
    summary: "Manage PDFs, convert files, clean text, resize images, and reduce repetitive document work.",
    slug: "singulariti-for-office-workers",
    icon: FileText
  },
  {
    title: "General Users",
    summary: "Solve everyday file, image, text, QR, and calculation tasks without extra software.",
    slug: "singulariti-for-everyday-users",
    icon: User
  }
];

export default function WhoCanUseSingulariti() {
  return (
    <section className="w-full py-16 bg-gradient-to-b from-white via-teal-50/30 to-white text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
            Who Can Use Singulariti?
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Discover tailored workflows and resources explaining how different users leverage our offline-first tools.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {audiences.map((aud, index) => {
            const IconComponent = aud.icon;
            return (
              <div 
                key={index}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-teal-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/40 flex items-center justify-center text-teal-600 dark:text-teal-400 mb-4">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                    {aud.title}
                  </h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {aud.summary}
                  </p>
                </div>
                <div className="mt-5">
                  <Link 
                    href={`/blog/articles/${aud.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-teal-700 hover:text-teal-800 dark:text-teal-300 dark:hover:text-teal-200"
                  >
                    View Related Guides <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
