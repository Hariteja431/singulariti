import React from 'react';
import Link from 'next/link';
import { Clock, Calendar, ArrowRight, FileText, Image as ImageIcon, PenTool, Code, TrendingUp, QrCode, Calculator, Clock as ClockIcon, BookOpen } from 'lucide-react';
import { NormalizedBlogPost } from '@/data/audienceArticles';
import { getBlogImage } from '@/lib/blogImages';

interface BlogCardProps {
  post: NormalizedBlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  const imageUrl = getBlogImage(post);
  const isPlaceholder = imageUrl.startsWith('placeholder:');
  const placeholderType = isPlaceholder ? imageUrl.split(':')[1] : 'general';

  // Map categories to visual styles and icons
  const placeholderConfig: Record<string, { gradient: string; text: string; icon: React.ComponentType<any> }> = {
    pdf: {
      gradient: "from-red-500/20 via-orange-500/10 to-red-500/20 text-red-500 dark:text-red-400",
      text: "PDF Tools",
      icon: FileText
    },
    image: {
      gradient: "from-blue-500/20 via-teal-500/10 to-blue-500/20 text-blue-500 dark:text-blue-400",
      text: "Image Tools",
      icon: ImageIcon
    },
    text: {
      gradient: "from-purple-500/20 via-pink-500/10 to-purple-500/20 text-purple-500 dark:text-purple-400",
      text: "Text Tools",
      icon: PenTool
    },
    developer: {
      gradient: "from-indigo-500/20 via-slate-500/10 to-indigo-500/20 text-indigo-500 dark:text-indigo-400",
      text: "Developer Tools",
      icon: Code
    },
    seo: {
      gradient: "from-amber-500/20 via-orange-500/10 to-amber-500/20 text-amber-500 dark:text-amber-400",
      text: "SEO Tools",
      icon: TrendingUp
    },
    qr: {
      gradient: "from-cyan-500/20 via-sky-500/10 to-cyan-500/20 text-cyan-500 dark:text-cyan-400",
      text: "QR Tools",
      icon: QrCode
    },
    calculators: {
      gradient: "from-emerald-500/20 via-green-500/10 to-emerald-500/20 text-emerald-500 dark:text-emerald-400",
      text: "Calculator Tools",
      icon: Calculator
    },
    productivity: {
      gradient: "from-rose-500/20 via-pink-500/10 to-rose-500/20 text-rose-500 dark:text-rose-400",
      text: "Productivity Tools",
      icon: ClockIcon
    },
    general: {
      gradient: "from-teal-500/20 via-indigo-500/10 to-teal-500/20 text-teal-500 dark:text-teal-400",
      text: "General Guides",
      icon: BookOpen
    }
  };

  const config = placeholderConfig[placeholderType] || placeholderConfig.general;
  const IconComponent = config.icon;

  // Format short excerpt between 120 and 160 characters
  let formattedExcerpt = post.excerpt || post.description || "";
  if (formattedExcerpt.length > 160) {
    formattedExcerpt = formattedExcerpt.substring(0, 157) + "...";
  }
  if (formattedExcerpt.length < 120) {
    formattedExcerpt = (formattedExcerpt + " Read this complete tool guide on Singulariti to understand its functions, use cases, inputs, outputs, and privacy settings.").substring(0, 157) + "...";
  }

  return (
    <article className="rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-teal-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 flex flex-col h-full overflow-hidden">
      {/* Aspect-ratio image container */}
      <div className="aspect-[16/9] overflow-hidden bg-slate-100 dark:bg-slate-800 relative">
        {isPlaceholder ? (
          <div className={`flex w-full h-full items-center justify-center bg-gradient-to-br ${config.gradient} p-4`}>
            <IconComponent className="w-10 h-10 opacity-80 stroke-[1.5]" />
          </div>
        ) : (
          <img 
            src={imageUrl} 
            alt={post.imageAlt || `Illustration for ${post.title}`}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        )}
      </div>

      {/* Card Body */}
      <div className="p-5 flex flex-col justify-between flex-1 space-y-4">
        <div className="space-y-2.5">
          {/* Category, Date, and Read Time */}
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <span className="font-sans font-bold uppercase tracking-wider text-xs text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/40 px-2 py-0.5 rounded">
              {post.category}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" /> {post.published}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> {post.readTime}
            </span>
          </div>

          {/* Title */}
          <Link href={post.url} className="block">
            <h4 className="line-clamp-2 text-lg font-semibold text-slate-900 hover:text-teal-700 dark:text-white dark:hover:text-teal-300 transition-colors duration-200">
              {post.title}
            </h4>
          </Link>

          {/* Excerpt */}
          <p className="line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            {formattedExcerpt}
          </p>
        </div>

        {/* Read More Link */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60">
          <Link 
            href={post.url}
            className="inline-flex items-center gap-2 text-sm font-semibold text-teal-700 hover:text-teal-800 dark:text-teal-300 dark:hover:text-teal-200 transition-colors duration-200"
          >
            Read More <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
