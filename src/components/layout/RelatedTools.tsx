import React from 'react';
import Link from 'next/link';
import { registry } from '@/registry';

interface RelatedToolsProps {
  currentToolId: string;
}

export function RelatedTools({ currentToolId }: RelatedToolsProps) {
  // Find the category and collection this tool belongs to
  let foundCollection = null;
  let foundCategory = null;

  for (const cat of registry.categories) {
    for (const col of cat.collections) {
      if (col.tools.find(t => t.id === currentToolId)) {
        foundCollection = col;
        foundCategory = cat;
        break;
      }
    }
    if (foundCollection) break;
  }

  if (!foundCollection || !foundCategory) return null;

  // Get tools excluding the current one, limit to 4
  const otherTools = foundCollection.tools
    .filter(t => t.id !== currentToolId)
    .slice(0, 4);

  if (otherTools.length === 0) return null;

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 pt-12 border-t border-border/50">
      <h3 className="text-2xl font-bold font-display text-ink mb-6">Related {foundCategory.name} Tools</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {otherTools.map((tool) => (
          <Link 
            key={tool.id} 
            href={tool.path}
            className="block p-5 rounded-2xl bg-surface border border-border hover:border-primary/50 transition-colors group"
          >
            <h4 className="font-bold text-ink mb-2 group-hover:text-primary transition-colors">{tool.name}</h4>
            <p className="text-sm text-slate line-clamp-2">{tool.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
