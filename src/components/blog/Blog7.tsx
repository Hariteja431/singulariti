import React from "react";
import Link from "next/link";
import { ArrowRight, Calendar, Clock, FileText, Wrench } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/Card";

export interface Post {
  id: string;
  title: string;
  summary: string;
  label: string;
  published: string;
  readTime?: string;
  url: string;
  image?: string;
  toolUrl?: string;
}

export interface Blog7Props {
  tagline?: string;
  heading?: string;
  description?: string;
  buttonText?: string;
  buttonUrl?: string;
  posts?: Post[];
}

const Blog7 = ({
  tagline = "Singulariti Guides",
  heading = "Simple Guides for Smarter Tools",
  description = "Learn how to use PDF tools, image tools, developer utilities, SEO tools, calculators, converters, and productivity tools with clear step-by-step guides.",
  buttonText = "Explore all guides",
  buttonUrl = "/blog",
  posts = [
    {
      id: "post-1",
      title: "How to Compress PDF Files",
      summary:
        "Learn how PDF compression helps reduce file size for uploads, emails, applications, and document sharing.",
      label: "PDF Tools",
      published: "Jun 11, 2026",
      readTime: "5 min read",
      url: "/blog/guides/compress-pdf-guide",
      toolUrl: "/tools/pdf/compress-pdf",
      image: "https://images.unsplash.com/photo-1568667256549-094345857637?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: "post-2",
      title: "How to Resize Images",
      summary:
        "Understand how image resizing works and when to reduce image dimensions for websites, forms, and sharing.",
      label: "Image Tools",
      published: "Jun 11, 2026",
      readTime: "4 min read",
      url: "/blog/guides/image-resizer-guide",
      toolUrl: "/editing/tools/image-resizer",
      image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: "post-3",
      title: "How to Format JSON",
      summary:
        "Clean, format, and read JSON data easily with a simple guide for developers, students, and beginners.",
      label: "Developer Tools",
      published: "Jun 11, 2026",
      readTime: "4 min read",
      url: "/blog/guides/json-formatter-guide",
      toolUrl: "/tools/dev/json-formatter",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop",
    },
  ],
}: Blog7Props) => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-teal-50/20 border-t border-slate-100">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-12 md:gap-16">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="secondary" className="bg-teal-50 border border-teal-200/80 text-teal-700 px-3 py-1 font-semibold rounded-full text-[11px] font-sans">
            {tagline}
          </Badge>
          <h2 className="text-pretty text-3xl font-extrabold md:text-4xl lg:text-5xl text-slate-900 tracking-tight leading-tight">
            {heading}
          </h2>
          <p className="text-slate-500 text-sm md:text-base lg:text-lg leading-relaxed max-w-2xl mx-auto font-sans">
            {description}
          </p>
          <div className="pt-2">
            <Button className="w-full sm:w-auto bg-teal-700 hover:bg-teal-800 text-white font-semibold text-sm px-6 py-2.5 rounded-full transition-all duration-200 shadow-sm" asChild>
              <Link href={buttonUrl}>
                <span>{buttonText}</span>
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Responsive Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 w-full">
          {posts.map((post) => {
            const hasImage = !!post.image;
            return (
              <Card key={post.id} className="grid grid-rows-[auto_auto_1fr_auto] bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-teal-300 hover:-translate-y-1 transition-all duration-200 overflow-hidden">
                {/* Image Section */}
                <div className="aspect-[16/9] w-full relative bg-slate-100/50">
                  {hasImage ? (
                    <Link href={post.url} className="block w-full h-full hover:opacity-90 transition-opacity">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="h-full w-full object-cover object-center"
                        onError={(e) => {
                          // Fallback to gradient if image fails to load
                          (e.target as HTMLElement).style.display = "none";
                          const sibling = (e.target as HTMLElement).nextElementSibling;
                          if (sibling) (sibling as HTMLElement).style.display = "flex";
                        }}
                      />
                      {/* Gradient Fallback Container */}
                      <div className="hidden absolute inset-0 bg-gradient-to-br from-teal-500/20 to-teal-700/10 flex-col items-center justify-center text-teal-750 p-4">
                        <FileText className="w-8 h-8 opacity-60 mb-2" />
                        <span className="text-xs font-semibold text-center">{post.title}</span>
                      </div>
                    </Link>
                  ) : (
                    <Link href={post.url} className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-teal-700/20 flex flex-col items-center justify-center text-teal-750 p-4 hover:opacity-90 transition-opacity">
                      <FileText className="w-8 h-8 opacity-65 mb-2" />
                      <span className="text-xs font-semibold text-center font-sans">{post.title}</span>
                    </Link>
                  )}
                </div>

                {/* Card Header with Badges */}
                <CardHeader className="p-5 space-y-3">
                  <div className="flex items-center justify-between gap-2 text-[11px] font-sans text-slate-400">
                    <span className="font-bold uppercase tracking-wider text-teal-700 bg-teal-50 border border-teal-100 px-2 py-0.5 rounded-full">
                      {post.label}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {post.published}
                    </span>
                  </div>

                  <Link href={post.url} className="block">
                    <h3 className="text-xl font-semibold text-slate-900 hover:text-teal-700 transition-colors line-clamp-2 leading-snug">
                      {post.title}
                    </h3>
                  </Link>
                </CardHeader>

                {/* Summary */}
                <CardContent className="p-5 pt-0">
                  <p className="text-sm text-slate-600 line-clamp-3 leading-6 font-sans">
                    {post.summary}
                  </p>
                </CardContent>

                {/* Footer with Actions */}
                <CardFooter className="p-5 pt-0 flex items-center justify-between border-t border-slate-100 mt-2">
                  <Link
                    href={post.url}
                    className="inline-flex items-center text-sm font-medium text-teal-700 hover:text-teal-800 transition-colors group/btn font-sans"
                  >
                    <span>Read More</span>
                    <ArrowRight className="ml-1 size-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                  </Link>

                  {post.toolUrl && (
                    <Link
                      href={post.toolUrl}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-700 hover:bg-teal-50 px-2.5 py-1.5 rounded-lg border border-teal-100 transition-all font-sans"
                    >
                      <Wrench className="w-3 h-3 text-teal-700" />
                      <span>Use Tool</span>
                    </Link>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export { Blog7 };
export default Blog7;
