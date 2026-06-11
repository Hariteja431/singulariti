import React from "react";
import { Blog7 } from "./Blog7";

const demoData = {
  tagline: "Singulariti Guides",
  heading: "Simple Guides for Smarter Tools",
  description:
    "Learn how to use PDF tools, image tools, developer utilities, SEO tools, calculators, converters, and productivity tools with clear step-by-step guides.",
  buttonText: "Explore all guides",
  buttonUrl: "/blog",
  posts: [
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
};

export function Blog7Demo() {
  return <Blog7 {...demoData} />;
}

export default Blog7Demo;
