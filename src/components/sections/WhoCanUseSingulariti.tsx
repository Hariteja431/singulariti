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
  Layers, 
  Sparkles,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export type UserGroup = {
  title: string;
  description: string;
  usefulFor: string[];
  perspectiveTitle: string;
  perspective: string;
  icon: React.ElementType;
};

const userGroups: UserGroup[] = [
  {
    title: "Students",
    description: "Students can use Singulariti for assignments, projects, resumes, reports, and documents.",
    usefulFor: [
      "Compressing PDFs before upload",
      "Converting images to PDF",
      "Counting words for assignments",
      "Creating QR codes for projects",
      "Using calculators for academic work",
      "Formatting text and notes",
      "Editing images for presentations"
    ],
    perspectiveTitle: "Life/project perspective",
    perspective: "It saves time during college work, project submissions, resume preparation, and online form uploads.",
    icon: GraduationCap
  },
  {
    title: "Job Seekers",
    description: "Job seekers often need to upload resumes, certificates, documents, and application files.",
    usefulFor: [
      "Compressing resume PDFs",
      "Converting JPG certificates to PDF",
      "Merging multiple documents",
      "Splitting only required pages",
      "Counting resume words",
      "Creating professional document formats"
    ],
    perspectiveTitle: "Life/project perspective",
    perspective: "It helps job seekers quickly prepare documents for job portals, interviews, internships, and company applications.",
    icon: Briefcase
  },
  {
    title: "Developers",
    description: "Developers can use Singulariti for formatting, validating, encoding, decoding, and previewing code-related content.",
    usefulFor: [
      "JSON formatting",
      "XML formatting",
      "SQL formatting",
      "Code beautifying",
      "Base64 encoding and decoding",
      "URL encoding and decoding",
      "UUID generation",
      "JWT decoding",
      "HTML previewing"
    ],
    perspectiveTitle: "Project perspective",
    perspective: "It helps developers clean code, debug data, test formats, and speed up development tasks without opening multiple websites.",
    icon: Code2
  },
  {
    title: "Content Writers and Bloggers",
    description: "Writers need text tools, SEO tools, and readability support.",
    usefulFor: [
      "Word counting",
      "Character counting",
      "Keyword density checking",
      "Meta tag generation",
      "Heading structure checking",
      "Text comparison",
      "Case conversion",
      "Slug generation"
    ],
    perspectiveTitle: "Project perspective",
    perspective: "It helps writers create SEO-friendly content, clean text, compare drafts, and prepare blog content faster.",
    icon: PenLine
  },
  {
    title: "Small Business Owners",
    description: "Small businesses need simple tools for documents, images, QR codes, and calculations.",
    usefulFor: [
      "Generating QR codes",
      "Creating invoice PDFs",
      "Compressing images",
      "Calculating GST",
      "Calculating discounts",
      "Creating social media image formats",
      "Converting files"
    ],
    perspectiveTitle: "Life/business perspective",
    perspective: "It helps small businesses handle daily digital work without hiring someone for every small task.",
    icon: Store
  },
  {
    title: "Teachers and Trainers",
    description: "Teachers can use Singulariti for preparing learning materials and sharing resources.",
    usefulFor: [
      "Merging PDFs",
      "Splitting study materials",
      "Creating QR codes for notes",
      "Compressing files before sharing",
      "Converting images to PDF",
      "Using calculators",
      "Preparing text content"
    ],
    perspectiveTitle: "Project/life perspective",
    perspective: "It helps teachers create and share clean study materials quickly.",
    icon: BookOpen
  },
  {
    title: "Office Workers",
    description: "Office workers handle documents, images, reports, and daily file tasks.",
    usefulFor: [
      "PDF merge",
      "PDF split",
      "PDF compression",
      "File conversion",
      "Text cleanup",
      "Document organization",
      "Image resizing",
      "QR code generation"
    ],
    perspectiveTitle: "Work perspective",
    perspective: "It reduces small repetitive office tasks and makes document handling faster.",
    icon: Building2
  },
  {
    title: "General Users",
    description: "Anyone can use Singulariti for everyday file, text, image, and calculation tasks.",
    usefulFor: [
      "Reducing file size",
      "Converting files",
      "Editing images",
      "Creating QR codes",
      "Calculating values",
      "Cleaning text",
      "Checking document details"
    ],
    perspectiveTitle: "Life perspective",
    perspective: "It helps users solve common digital problems quickly without installing extra software.",
    icon: Users
  }
];

const taglines = [
  "One place for everyday digital tools.",
  "Simple tools for files, text, images, code, and calculations.",
  "Finish daily digital tasks faster with Singulariti.",
  "Useful tools for study, work, projects, and life."
];

export function WhoCanUseSingulariti() {
  return (
    <section className="w-full py-16 md:py-24 bg-gradient-to-b from-white via-teal-50/30 to-white dark:from-black dark:via-teal-950/10 dark:to-black border-t border-b border-slate-100 dark:border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Top Header with Badge */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex rounded-full bg-teal-50 px-4 py-2 text-sm font-semibold text-teal-700 ring-1 ring-teal-100 dark:bg-teal-950/20 dark:text-teal-400 dark:ring-teal-900/50 mb-4">
            Audience & Value
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-5xl dark:text-ink">
            Who Can Use Singulariti?
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-slate-600 md:text-lg dark:text-slate">
            Singulariti is built for anyone who works with files, text, images, calculations, code, or online content. It helps users complete small but important digital tasks faster, without complicated software or unnecessary steps.
          </p>
        </div>

        {/* User Cards Grid */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {userGroups.map((group, idx) => {
            const Icon = group.icon;
            return (
              <div 
                key={idx} 
                className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-teal-300 hover:shadow-md dark:border-border dark:bg-surface dark:hover:border-teal-700 flex flex-col justify-between"
              >
                <div>
                  {/* Icon Box */}
                  <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 ring-1 ring-teal-100 dark:bg-teal-950/30 dark:text-teal-400 dark:ring-teal-900/50">
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-ink">
                    {group.title}
                  </h3>
                  
                  <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate">
                    {group.description}
                  </p>

                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Useful for:
                    </span>
                    <ul className="mt-2 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                      {group.usefulFor.map((item, itemIdx) => (
                        <li key={itemIdx} className="flex items-start">
                          <CheckCircle2 className="w-4 h-4 mr-2 text-teal-500 dark:text-teal-400 mt-1 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Perspective Note */}
                <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700 dark:bg-slate-900/30 dark:text-slate-350">
                  <span className="font-semibold block mb-1 text-xs uppercase tracking-wide opacity-80">
                    {group.perspectiveTitle}
                  </span>
                  {group.perspective}
                </div>
              </div>
            );
          })}
        </div>

        {/* How Singulariti is Useful Section */}
        <div className="mt-24 pt-16 border-t border-slate-200 dark:border-border">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl md:text-3.5xl font-bold text-slate-900 dark:text-ink">
              How Singulariti Is Useful
            </h2>
            <p className="mt-4 text-base text-slate-600 dark:text-slate leading-7">
              Singulariti is useful for students, job seekers, developers, writers, businesses, teachers, office workers, and general users who need fast online tools for daily digital tasks.
            </p>
            <p className="mt-3 text-base text-slate-600 dark:text-slate leading-7">
              Instead of using many different websites for PDF tools, image tools, calculators, QR tools, text tools, developer tools, and SEO tools, users can complete many common tasks in one place.
            </p>
            <p className="mt-3 text-base text-slate-600 dark:text-slate leading-7">
              It helps users save time, reduce manual work, prepare files correctly, improve productivity, and complete project or personal tasks more easily.
            </p>
          </div>

          {/* Highlight Cards Grid */}
          <div className="mt-10 grid gap-5 lg:grid-cols-2 max-w-5xl mx-auto">
            {/* Project Highlight Card */}
            <div className="rounded-3xl border border-teal-100 bg-white p-7 shadow-sm dark:border-border dark:bg-surface flex gap-5 items-start">
              <div className="rounded-xl bg-teal-50 dark:bg-teal-950/30 p-3 text-teal-700 dark:text-teal-400 shrink-0">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-ink">
                  Useful for Projects
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  For projects, Singulariti helps users prepare files, clean content, format code, create QR codes, calculate values, and improve documents. It is useful for college projects, web development projects, business work, content writing, documentation, resumes, and digital submissions.
                </p>
              </div>
            </div>

            {/* Daily Life Highlight Card */}
            <div className="rounded-3xl border border-teal-100 bg-white p-7 shadow-sm dark:border-border dark:bg-surface flex gap-5 items-start">
              <div className="rounded-xl bg-teal-50 dark:bg-teal-950/30 p-3 text-teal-700 dark:text-teal-400 shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-ink">
                  Useful in Daily Life
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  In daily life, Singulariti helps users handle common online tasks such as uploading documents, reducing file size, converting images, checking text, calculating values, and sharing information through QR codes. It saves time and makes digital work easier.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Accent Taglines & CTA */}
        <div className="mt-20 flex flex-col items-center text-center">
          {/* Tagline chips */}
          <div className="mt-8 flex flex-wrap justify-center gap-3 max-w-4xl">
            {taglines.map((tagline, idx) => (
              <span 
                key={idx} 
                className="rounded-full border border-teal-100 bg-teal-50 px-4 py-2 text-sm font-medium text-teal-800 dark:border-teal-900/50 dark:bg-teal-950/20 dark:text-teal-300"
              >
                {tagline}
              </span>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-10">
            <Link href="/tools" className="inline-flex items-center rounded-full bg-teal-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-800 dark:bg-teal-650 dark:hover:bg-teal-600">
              Explore Tools
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
