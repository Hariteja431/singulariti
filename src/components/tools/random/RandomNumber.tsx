"use client";

import React, { useState } from 'react';
import { ToolLayout } from '../shared/ToolLayout';
import { Button } from '@/components/ui/Button';
import { RefreshCw, Copy, Check } from 'lucide-react';
import { ToolRegistryItem } from '@/registry/types';

interface RandomNumberProps {
  tool: ToolRegistryItem;
}

export function RandomNumber({ tool }: RandomNumberProps) {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [quantity, setQuantity] = useState(1);
  const [allowDuplicates, setAllowDuplicates] = useState(true);
  
  const [results, setResults] = useState<number[]>([42]);
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateNumbers = () => {
    setIsGenerating(true);
    
    // Quick animation effect
    let iterations = 0;
    const interval = setInterval(() => {
      setResults(Array.from({ length: quantity }, () => Math.floor(Math.random() * (max - min + 1)) + min));
      iterations++;
      if (iterations > 10) {
        clearInterval(interval);
        
        // Final generation
        const newResults: number[] = [];
        if (!allowDuplicates && quantity > (max - min + 1)) {
          // If asking for more unique numbers than possible, just cap it or allow duplicates
          for (let i = min; i <= max; i++) newResults.push(i);
          // Shuffle
          for (let i = newResults.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newResults[i], newResults[j]] = [newResults[j], newResults[i]];
          }
          setResults(newResults.slice(0, quantity));
        } else if (!allowDuplicates) {
          const pool = new Set<number>();
          while (pool.size < quantity) {
            pool.add(Math.floor(Math.random() * (max - min + 1)) + min);
          }
          setResults(Array.from(pool));
        } else {
          for (let i = 0; i < quantity; i++) {
            newResults.push(Math.floor(Math.random() * (max - min + 1)) + min);
          }
          setResults(newResults);
        }
        setIsGenerating(false);
      }
    }, 40);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(results.join(', '));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout title={tool.name} description={tool.description} categoryName="Random Tools" categoryPath="/random">
      <div className="w-full max-w-4xl mx-auto my-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Controls */}
          <div className="md:col-span-5 bg-surface border border-border rounded-2xl p-6 shadow-sm">
            <h3 className="font-display font-bold text-lg text-ink mb-6">Settings</h3>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate">Min</label>
                  <input
                    type="number"
                    value={min}
                    onChange={(e) => setMin(Number(e.target.value))}
                    className="p-3 bg-background border border-border rounded-xl text-ink outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate">Max</label>
                  <input
                    type="number"
                    value={max}
                    onChange={(e) => setMax(Number(e.target.value))}
                    className="p-3 bg-background border border-border rounded-xl text-ink outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate">Quantity to Generate</label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="p-3 bg-background border border-border rounded-xl text-ink outline-none focus:border-primary transition-colors"
                />
              </div>

              {quantity > 1 && (
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="allowDuplicates"
                    checked={allowDuplicates}
                    onChange={(e) => setAllowDuplicates(e.target.checked)}
                    className="w-5 h-5 accent-primary"
                  />
                  <label htmlFor="allowDuplicates" className="text-sm text-slate select-none cursor-pointer">
                    Allow duplicate numbers
                  </label>
                </div>
              )}

              <Button
                variant="primary"
                onClick={generateNumbers}
                disabled={isGenerating}
                className="w-full py-4 text-base mt-4"
              >
                {isGenerating ? (
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="w-5 h-5 mr-2" />
                )}
                Generate Number{quantity > 1 ? 's' : ''}
              </Button>
            </div>
          </div>

          {/* Results Area */}
          <div className="md:col-span-7 bg-surface border border-border rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center min-h-[400px] relative">
            <button
              onClick={copyToClipboard}
              className="absolute top-4 right-4 p-2 text-slate hover:text-ink hover:bg-background rounded-lg transition-colors"
              title="Copy to clipboard"
            >
              {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
            </button>

            {results.length === 1 ? (
              <div className="text-9xl font-display font-black text-ink select-all text-center break-words max-w-full">
                {results[0]}
              </div>
            ) : (
              <div className="flex flex-wrap gap-3 justify-center content-start w-full max-h-[500px] overflow-y-auto p-4 custom-scrollbar">
                {results.map((num, i) => (
                  <div
                    key={i}
                    className="text-2xl font-display font-bold text-ink bg-background border border-border px-4 py-2 rounded-xl"
                  >
                    {num}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
