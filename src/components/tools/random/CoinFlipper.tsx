"use client";

import React, { useState } from 'react';
import { ToolLayout } from '../shared/ToolLayout';
import { Button } from '@/components/ui/Button';
import { Coins, Loader2 } from 'lucide-react';
import { ToolRegistryItem } from '@/registry/types';

interface Props {
  tool: ToolRegistryItem;
}

export function CoinFlipper({ tool }: Props) {
  const [coinResult, setCoinResult] = useState<'Heads' | 'Tails'>('Heads');
  const [isAnimating, setIsAnimating] = useState(false);

  const flipCoin = () => {
    setIsAnimating(true);
    let iterations = 0;
    const interval = setInterval(() => {
      setCoinResult(Math.random() > 0.5 ? 'Heads' : 'Tails');
      iterations++;
      if (iterations > 10) {
        clearInterval(interval);
        setCoinResult(Math.random() > 0.5 ? 'Heads' : 'Tails');
        setIsAnimating(false);
      }
    }, 50);
  };

  return (
    <ToolLayout title={tool.name} description={tool.description} categoryName="Random Tools" categoryPath="/random">
      <div className="w-full max-w-4xl mx-auto my-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Controls */}
          <div className="md:col-span-4 bg-surface border border-border rounded-2xl p-6 shadow-sm">
            <h3 className="font-display font-bold text-lg text-ink mb-6">Coin Settings</h3>
            <div className="space-y-6">
              <p className="text-sm text-slate leading-relaxed">
                A simple coin flip. It has a 50% chance of landing on Heads and a 50% chance of landing on Tails.
              </p>
              <Button
                variant="primary"
                onClick={flipCoin}
                disabled={isAnimating}
                className="w-full py-4 text-base mt-4"
              >
                {isAnimating ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Coins className="w-5 h-5 mr-2" />}
                Flip Coin
              </Button>
            </div>
          </div>

          {/* Results Area */}
          <div className="md:col-span-8 bg-surface border border-border rounded-2xl p-8 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center">
              <div 
                className={`flex items-center justify-center w-48 h-48 rounded-full border-[8px] transition-all duration-300 ${
                  isAnimating 
                    ? 'border-border bg-background animate-spin' 
                    : coinResult === 'Heads' 
                      ? 'border-yellow-400 bg-yellow-100' 
                      : 'border-slate-300 bg-slate-100'
                }`}
                style={{
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.5s ease-out',
                  transform: isAnimating ? 'rotateY(720deg)' : 'rotateY(0deg)'
                }}
              >
                <span className={`text-4xl font-display font-black text-slate-900 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
                  {coinResult}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* SEO Content Section */}
        <div className="mt-20 max-w-4xl mx-auto prose prose-slate dark:prose-invert">
          <h2 className="text-2xl font-display font-bold text-ink mb-4">How to Use the Online Coin Flipper</h2>
          <p className="text-slate mb-6">
            Our virtual coin flipper is the easiest way to settle a 50/50 dispute or make a quick random decision without needing a physical coin in your pocket. The tool provides a satisfying 3D spinning animation and an instant, mathematically unbiased result.
          </p>
          
          <div className="space-y-4">
            <details className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
              <summary className="font-semibold cursor-pointer text-slate-800 dark:text-slate-200">Are the coin flips guaranteed to be 50/50?</summary>
              <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Yes! The underlying code uses a strict boolean randomization algorithm. On every flip, the computer calculates a precise 50% probability for Heads and 50% for Tails, meaning the results are completely fair.
              </div>
            </details>
            <details className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
              <summary className="font-semibold cursor-pointer text-slate-800 dark:text-slate-200">Is my data safe when using this tool?</summary>
              <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Absolutely. Our coin flipper runs entirely in your local web browser. No data, flip results, or tracking information is ever sent back to our servers.
              </div>
            </details>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
