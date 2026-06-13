"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ToolLayout } from '../shared/ToolLayout';
import { Button } from '@/components/ui/Button';
import { Plus, Trash2, Trophy } from 'lucide-react';
import { ToolRegistryItem } from '@/registry/types';

interface WheelSpinnerProps {
  tool: ToolRegistryItem;
}

export function WheelSpinner({ tool }: WheelSpinnerProps) {
  const [entries, setEntries] = useState<string[]>([
    'Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5', 'Option 6'
  ]);
  const [newEntry, setNewEntry] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState<string | null>(null);
  const [showWinner, setShowWinner] = useState(false);
  
  const wheelRef = useRef<HTMLDivElement>(null);
  
  // High contrast vibrant colors
  const colors = [
    '#EF4444', '#F97316', '#F59E0B', '#84CC16', '#10B981', '#14B8A6', 
    '#06B6D4', '#0EA5E9', '#3B82F6', '#6366F1', '#8B5CF6', '#D946EF', '#F43F5E'
  ];

  const addEntry = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (newEntry.trim()) {
      setEntries([...entries, newEntry.trim()]);
      setNewEntry('');
      setWinner(null);
      setShowWinner(false);
    }
  };

  const removeEntry = (index: number) => {
    if (entries.length <= 2) return; // Keep at least 2 entries
    const newEntries = [...entries];
    newEntries.splice(index, 1);
    setEntries(newEntries);
    setWinner(null);
    setShowWinner(false);
  };

  const spin = () => {
    if (isSpinning || entries.length < 2) return;
    
    setIsSpinning(true);
    setWinner(null);
    setShowWinner(false);
    
    const minSpins = 5;
    const maxSpins = 10;
    const spins = Math.floor(Math.random() * (maxSpins - minSpins + 1)) + minSpins;
    
    // Calculate random exact angle
    const extraDegrees = Math.floor(Math.random() * 360);
    const targetRotation = rotation + (spins * 360) + extraDegrees;
    
    setRotation(targetRotation);
    
    // Calculate winner
    // CSS rotation goes clockwise. 0 degrees is the right side (3 o'clock).
    // Our pointer is usually at the top (12 o'clock), which is -90 degrees from 0.
    // Wait, let's look at how we draw it. We use conic-gradient starting from 0 (top).
    // The rotation rotates the entire element. Pointer is at the top.
    
    setTimeout(() => {
      setIsSpinning(false);
      // Actual rotation modulo 360
      const finalRotation = targetRotation % 360;
      
      // Calculate which slice is at the top.
      // 0 degrees is top. As the wheel rotates clockwise, the top points to negative angles in the wheel's local space.
      const sliceAngle = 360 / entries.length;
      
      // We need to reverse the rotation to find the slice
      const normalizedRotation = (360 - finalRotation) % 360;
      
      // The starting point of slices is at the top (0 degrees).
      const winningIndex = Math.floor(normalizedRotation / sliceAngle);
      
      setWinner(entries[winningIndex]);
      setShowWinner(true);
    }, 4000); // 4s animation duration
  };

  // Generate conic gradient for the wheel
  const getConicGradient = () => {
    if (entries.length === 0) return 'none';
    
    const sliceAngle = 100 / entries.length; // percentages
    let gradientParts = [];
    
    for (let i = 0; i < entries.length; i++) {
      const color = colors[i % colors.length];
      const start = i * sliceAngle;
      const end = (i + 1) * sliceAngle;
      gradientParts.push(`${color} ${start}% ${end}%`);
    }
    
    return `conic-gradient(from 0deg, ${gradientParts.join(', ')})`;
  };

  return (
    <ToolLayout title={tool.name} description={tool.description} categoryName="Random Tools" categoryPath="/random">
      <div className="w-full max-w-6xl mx-auto my-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Wheel Area */}
          <div className="lg:col-span-8 bg-surface border border-border rounded-2xl p-8 shadow-sm flex flex-col items-center justify-center overflow-hidden min-h-[500px] relative">
            
            {showWinner && winner ? (
              <div className="absolute inset-0 z-20 bg-background/90 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-300">
                <Trophy className="w-16 h-16 text-yellow-500 mb-4 animate-bounce" />
                <h3 className="text-xl font-medium text-slate uppercase tracking-widest mb-2">We have a winner!</h3>
                <p className="text-5xl font-display font-black text-ink text-center px-4 break-words">
                  {winner}
                </p>
                <Button variant="primary" onClick={() => setShowWinner(false)} className="mt-8 px-8">
                  Close
                </Button>
              </div>
            ) : null}

            {/* Pointer */}
            <div className="absolute top-8 z-10 drop-shadow-md">
              <div className="w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-t-[32px] border-ink" />
            </div>

            {/* Wheel Container */}
            <div className="relative w-[320px] h-[320px] sm:w-[400px] sm:h-[400px]">
              {/* The Wheel */}
              <div 
                ref={wheelRef}
                className="w-full h-full rounded-full overflow-hidden shadow-lg border-4 border-surface"
                style={{
                  background: getConicGradient(),
                  transform: `rotate(${rotation}deg)`,
                  transition: isSpinning ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none'
                }}
              >
                {/* Labels */}
                {entries.map((entry, i) => {
                  const sliceAngle = 360 / entries.length;
                  const rotationAngle = (i * sliceAngle) + (sliceAngle / 2);
                  return (
                    <div 
                      key={i}
                      className="absolute top-0 left-0 w-full h-full flex items-start justify-center origin-center"
                      style={{ transform: `rotate(${rotationAngle}deg)` }}
                    >
                      <div className="pt-6 sm:pt-10 max-w-[40%] break-words">
                        <span 
                          className="text-white font-bold text-sm sm:text-base drop-shadow-md block text-center"
                          style={{
                            writingMode: 'vertical-rl',
                            textOrientation: 'mixed',
                          }}
                        >
                          {entry.length > 20 ? entry.substring(0, 18) + '...' : entry}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Center Button */}
              <button
                onClick={spin}
                disabled={isSpinning || entries.length < 2}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-ink rounded-full flex items-center justify-center shadow-xl border-4 border-surface hover:scale-105 active:scale-95 transition-transform z-10 disabled:opacity-50 disabled:hover:scale-100"
              >
                <span className="text-surface font-bold text-xl uppercase tracking-wider">Spin</span>
              </button>
            </div>
          </div>

          {/* Entries Sidebar */}
          <div className="lg:col-span-4 bg-surface border border-border rounded-2xl p-6 shadow-sm flex flex-col max-h-[600px]">
            <h3 className="font-display font-bold text-lg text-ink mb-4">Wheel Entries ({entries.length})</h3>
            
            <form onSubmit={addEntry} className="flex gap-2 mb-6">
              <input
                type="text"
                value={newEntry}
                onChange={(e) => setNewEntry(e.target.value)}
                placeholder="Add new option..."
                className="flex-1 p-3 bg-background border border-border rounded-xl text-ink outline-none focus:border-primary transition-colors text-sm"
              />
              <button 
                type="submit"
                disabled={!newEntry.trim()}
                className="p-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 disabled:opacity-50 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </form>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-2">
              {entries.map((entry, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-background border border-border rounded-xl group hover:border-slate/30 transition-colors">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div 
                      className="w-4 h-4 rounded-full shrink-0" 
                      style={{ backgroundColor: colors[i % colors.length] }} 
                    />
                    <span className="text-sm font-medium text-ink truncate">{entry}</span>
                  </div>
                  <button
                    onClick={() => removeEntry(i)}
                    disabled={entries.length <= 2}
                    className="p-1.5 text-slate hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-0"
                    title="Remove entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="pt-4 mt-4 border-t border-border">
              <Button 
                variant="outline" 
                onClick={() => setEntries(['Yes', 'No', 'Maybe'])}
                className="w-full text-sm"
              >
                Reset to Default
              </Button>
            </div>
          </div>
          
        </div>
      </div>
    </ToolLayout>
  );
}
