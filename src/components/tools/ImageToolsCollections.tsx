import React from 'react';
import Link from 'next/link';
import { ArrowRight, ImageIcon } from 'lucide-react';
import { ToolIcon } from './ToolIcon';

interface ToolItem {
  id: string;
  name: string;
  description: string;
  path: string;
}

interface CollectionItem {
  id: string;
  name: string;
  description: string;
  path: string;
  tools: ToolItem[];
}

interface ImageToolsCollectionsProps {
  collections: CollectionItem[];
}

export default function ImageToolsCollections({ collections }: ImageToolsCollectionsProps) {
  // Map collection names to standard display names as requested
  const collectionNameMap: Record<string, string> = {
    "image-compression": "Compression Tools",
    "image-conversion": "Conversion Tools",
    "image-utility": "Utility Tools",
    "image-developer": "Developer Tools"
  };

  const cleanDescription = (desc: string) => {
    // Remove repetitive "Free, secure, no upload to server" phrases
    let cleaned = desc
      .replace(/free,\s*secure,\s*no\s*upload\s*to\s*server\.?/gi, "")
      .replace(/free\s*online\s*image\s*tools?\s*to/gi, "To")
      .trim();
    
    // Capitalize first letter of cleaned sentence
    if (cleaned) {
      cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
    }
    
    // Take the first sentence only
    const firstSentence = cleaned.split(/[.!?]/)[0];
    return firstSentence ? firstSentence + "." : desc;
  };

  return (
    <div className="w-full space-y-16">
      {collections.map((collection) => {
        const displayName = collectionNameMap[collection.id] || collection.name;
        
        return (
          <div key={collection.id} className="space-y-6">
            {/* Collection Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800/80">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-slate-950 dark:text-white">
                  {displayName}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {collection.description}
                </p>
              </div>
              {collection.path && (
                <Link 
                  href={collection.path} 
                  className="text-teal-700 hover:text-teal-800 dark:text-teal-300 dark:hover:text-teal-200 text-sm font-semibold inline-flex items-center gap-1 transition-colors"
                >
                  View All <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>

            {/* Compact Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {collection.tools.map((tool) => (
                <div 
                  key={tool.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/40 flex items-center justify-center text-teal-600 dark:text-teal-400">
                      <ToolIcon toolId={tool.id} fallback={<ImageIcon className="w-5 h-5" />} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                        {tool.name}
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-350 line-clamp-2">
                        {cleanDescription(tool.description)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/60">
                    <Link 
                      href={tool.path}
                      className="text-teal-700 hover:text-teal-800 dark:text-teal-300 dark:hover:text-teal-200 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
                    >
                      Open Tool <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
