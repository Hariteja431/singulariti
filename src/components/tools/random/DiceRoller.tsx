"use client";

import React, { useState } from 'react';
import { ToolLayout } from '../shared/ToolLayout';
import { Button } from '@/components/ui/Button';
import { Dices, Loader2 } from 'lucide-react';
import { ToolRegistryItem } from '@/registry/types';

interface DiceRollerProps {
  tool: ToolRegistryItem;
}

export function DiceRoller({ tool }: DiceRollerProps) {
  const [diceCount, setDiceCount] = useState(2);
  
  const [results, setResults] = useState<number[]>([1, 6]);
  const [isAnimating, setIsAnimating] = useState(false);

  const rollDice = () => {
    setIsAnimating(true);
    let iterations = 0;
    const interval = setInterval(() => {
      setResults(Array.from({ length: diceCount }, () => Math.floor(Math.random() * 6) + 1));
      iterations++;
      if (iterations > 10) {
        clearInterval(interval);
        setResults(Array.from({ length: diceCount }, () => Math.floor(Math.random() * 6) + 1));
        setIsAnimating(false);
      }
    }, 50);
  };



  const renderDiceFace = (val: number) => {
    // Simple dot layout for 6-sided dice
    const dots = [];
    if ([1, 3, 5].includes(val)) dots.push('middle-center');
    if ([2, 3, 4, 5, 6].includes(val)) { dots.push('top-left'); dots.push('bottom-right'); }
    if ([4, 5, 6].includes(val)) { dots.push('top-right'); dots.push('bottom-left'); }
    if (val === 6) { dots.push('middle-left'); dots.push('middle-right'); }

    return (
      <div className="relative w-16 h-16 sm:w-24 sm:h-24">
        {dots.map((pos, i) => {
          let styles = {};
          if (pos === 'top-left') styles = { top: '15%', left: '15%' };
          if (pos === 'top-right') styles = { top: '15%', right: '15%' };
          if (pos === 'bottom-left') styles = { bottom: '15%', left: '15%' };
          if (pos === 'bottom-right') styles = { bottom: '15%', right: '15%' };
          if (pos === 'middle-center') styles = { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
          if (pos === 'middle-left') styles = { top: '50%', left: '15%', transform: 'translateY(-50%)' };
          if (pos === 'middle-right') styles = { top: '50%', right: '15%', transform: 'translateY(-50%)' };

          return <div key={i} className="absolute w-3 h-3 sm:w-4 sm:h-4 bg-ink rounded-full" style={styles} />;
        })}
      </div>
    );
  };

  return (
    <ToolLayout title={tool.name} description={tool.description} categoryName="Random Tools" categoryPath="/random">
      <div className="w-full max-w-4xl mx-auto my-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Controls */}
          <div className="md:col-span-4 bg-surface border border-border rounded-2xl p-6 shadow-sm">
            <h3 className="font-display font-bold text-lg text-ink mb-6">Dice Settings</h3>
            <div className="space-y-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-slate">Number of Dice</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={diceCount}
                      onChange={(e) => setDiceCount(Number(e.target.value))}
                      className="p-3 bg-background border border-border rounded-xl text-ink outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <Button
                    variant="primary"
                    onClick={rollDice}
                    disabled={isAnimating}
                    className="w-full py-4 text-base mt-4"
                  >
                    {isAnimating ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Dices className="w-5 h-5 mr-2" />}
                    Roll Dice
                  </Button>
            </div>
          </div>

          {/* Results Area */}
          <div className="md:col-span-8 bg-surface border border-border rounded-2xl p-8 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-full">
                <div className="flex flex-wrap gap-4 justify-center max-h-[500px] overflow-y-auto p-4 custom-scrollbar">
                  {results.map((val, i) => (
                    <div
                      key={i}
                      className={`flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 bg-surface border-2 border-border rounded-2xl shadow-sm transition-transform duration-75 ${isAnimating ? 'scale-95 opacity-80' : 'scale-100 opacity-100'}`}
                    >
                      {renderDiceFace(val)}
                    </div>
                  ))}
                </div>
                {results.length > 1 && !isAnimating && (
                  <div className="mt-8 text-center animate-in fade-in zoom-in duration-300">
                    <p className="text-sm font-medium text-slate uppercase tracking-widest mb-1">Total Sum</p>
                    <p className="text-5xl font-display font-black text-primary">
                      {results.reduce((a, b) => a + b, 0)}
                    </p>
                  </div>
                )}
              </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
