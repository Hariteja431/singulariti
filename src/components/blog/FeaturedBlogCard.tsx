import React from 'react';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight, FileText, Image as ImageIcon, PenTool, Code, TrendingUp, QrCode, Calculator, Clock as ClockIcon, BookOpen } from 'lucide-react';
import { NormalizedBlogPost } from '@/data/audienceArticles';
import { getBlogImage } from '@/lib/blogImages';

interface FeaturedBlogCardProps {
  post: NormalizedBlogPost;
}

export default function FeaturedBlogCard({ post }: FeaturedBlogCardProps) {
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

  let featuredExcerpt = post.excerpt || post.description || "";
  if (featuredExcerpt.length > 140) {
    featuredExcerpt = featuredExcerpt.substring(0, 137) + "...";
  }

  return (
    <article className="rounded-3xl border border-slate-800 bg-[#020617] text-white overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:border-teal-900 grid grid-cols-1 lg:grid-cols-12">
      {/* Featured Image Section */}
      <div className="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto min-h-[240px] bg-slate-900 overflow-hidden">
        {isPlaceholder ? (
          <div className={`absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br ${config.gradient} p-6`}>
            <IconComponent className="w-16 h-16 opacity-85 stroke-[1.5] mb-3" />
            <span className="text-xs uppercase tracking-widest font-mono opacity-60">{config.text}</span>
          </div>
        ) : (
          <img 
            src={imageUrl} 
            alt={post.imageAlt || `Illustration for ${post.title}`}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            loading="lazy"
          />
        )}
      </div>

      {/* Featured Content Section */}
      <div className="lg:col-span-5 p-6 md:p-8 flex flex-col justify-between space-y-6">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="font-sans font-bold uppercase tracking-wider text-teal-300 bg-teal-950/60 border border-teal-900/40 px-2.5 py-1 rounded-full">
              {post.category}
            </span>
            <span className="text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-teal-400" /> {post.readTime}
            </span>
          </div>

          <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-white leading-tight">
            {post.title}
          </h3>

          <p className="line-clamp-2 text-sm leading-6 text-slate-300">
            {featuredExcerpt}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-800/80">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> Published: {post.published}
          </span>
          <Link 
            href={post.url}
            className="inline-flex items-center gap-2 text-sm font-semibold text-teal-300 hover:text-teal-200 transition-colors"
          >
            Read More <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
