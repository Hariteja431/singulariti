"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, ArrowRight } from 'lucide-react';
import { getAllTools } from '@/registry';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();

  // Reset active index when query changes
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Close on Escape
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const tools = getAllTools();
  const filteredTools = tools.filter(tool => 
    tool.name.toLowerCase().includes(query.toLowerCase()) || 
    tool.description.toLowerCase().includes(query.toLowerCase())
  );

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (filteredTools.length > 0 ? (prev + 1) % filteredTools.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (filteredTools.length > 0 ? (prev - 1 + filteredTools.length) % filteredTools.length : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredTools.length > 0 && filteredTools[activeIndex]) {
        router.push(filteredTools[activeIndex].path);
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] px-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-dark/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-xl bg-surface border border-border rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center px-4 py-3 border-b border-border">
          <Search className="w-5 h-5 text-slate mr-3" />
          <input
            autoFocus
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-ink text-[15px] font-sans placeholder:text-slate"
            placeholder="Search tools..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleInputKeyDown}
            aria-label="Search tools"
          />
          <button 
            onClick={onClose} 
            className="p-1 rounded-md hover:bg-slate/10 text-slate transition-colors"
            aria-label="Close search"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {filteredTools.length > 0 ? (
            <div className="space-y-1">
              <div className="px-3 py-2 text-[11px] font-bold text-slate uppercase tracking-wider">
                Tools
              </div>
              {filteredTools.map((tool, idx) => {
                const isActiveIdx = idx === activeIndex;
                return (
                  <button
                    key={tool.id}
                    className={`w-full text-left flex items-center justify-between px-3 py-3 rounded-lg text-ink transition-colors group ${
                      isActiveIdx 
                        ? "bg-primary/10 text-primary-text" 
                        : "hover:bg-primary/5 hover:text-primary-text"
                    }`}
                    onClick={() => {
                      router.push(tool.path);
                      onClose();
                    }}
                  >
                    <div>
                      <div className="font-display font-bold text-[15px] mb-0.5">{tool.name}</div>
                      <div className="font-sans text-[12px] text-slate line-clamp-1">{tool.description}</div>
                    </div>
                    <ArrowRight className={`w-4 h-4 transition-all ${
                      isActiveIdx ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                    }`} />
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center text-slate font-sans text-[13px]">
              No tools found matching &quot;{query}&quot;
            </div>
          )}
        </div>
        
        <div className="px-4 py-3 bg-background border-t border-border flex items-center justify-between text-[11px] font-sans text-slate">
          <span>Search the Singulariti Ecosystem</span>
          <div className="flex items-center gap-2">
            <span>Use <kbd className="px-1.5 py-0.5 rounded bg-border text-ink">↑</kbd> <kbd className="px-1.5 py-0.5 rounded bg-border text-ink">↓</kbd> to navigate</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-border text-ink">Enter</kbd> to select</span>
          </div>
        </div>
      </div>
    </div>
  );
}
