"use client";

import React, { useState, useEffect } from 'react';
import { Terminal, Trash2, Copy, X, ChevronUp, ChevronDown } from 'lucide-react';

interface LogMessage {
  id: string;
  type: 'log' | 'info' | 'warn' | 'error';
  content: string;
  timestamp: number;
}

interface ConsoleOverlayProps {
  logs: LogMessage[];
  onClear: () => void;
}

export function ConsoleOverlay({ logs, onClear }: ConsoleOverlayProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!isOpen && logs.length > 0) {
      setUnreadCount(prev => prev + 1);
    }
  }, [logs]);

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
    }
  }, [isOpen]);

  const handleCopy = () => {
    const text = logs.map(l => `[${l.type.toUpperCase()}] ${l.content}`).join('\n');
    navigator.clipboard.writeText(text);
  };

  const getLogColor = (type: string) => {
    switch(type) {
      case 'error': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'warn': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'info': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      default: return 'text-ink bg-transparent border-transparent';
    }
  };

  return (
    <div className={`absolute bottom-0 left-0 right-0 transition-all duration-300 ease-in-out bg-surface border-t border-border z-40 flex flex-col ${isOpen ? 'h-64' : 'h-10'}`}>
      {/* Header / Toggle */}
      <div 
        className="flex items-center justify-between px-4 h-10 cursor-pointer hover:bg-slate/5 transition-colors shrink-0"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-slate" />
          <span className="text-[13px] font-sans font-bold text-ink tracking-wide">Console</span>
          {!isOpen && unreadCount > 0 && (
            <span className="bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {isOpen && (
            <>
              <button 
                onClick={(e) => { e.stopPropagation(); handleCopy(); }}
                className="p-1.5 text-slate hover:text-ink transition-colors rounded-md hover:bg-slate/10"
                title="Copy Console Output"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onClear(); }}
                className="p-1.5 text-slate hover:text-red-500 transition-colors rounded-md hover:bg-red-500/10"
                title="Clear Console"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
          <button className="p-1.5 text-slate">
            {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Logs Area */}
      {isOpen && (
        <div className="flex-1 overflow-y-auto bg-background p-2 font-mono text-[12px] space-y-1">
          {logs.length === 0 ? (
            <div className="flex items-center justify-center h-full text-slate/50 italic">
              Console output will appear here...
            </div>
          ) : (
            logs.map((log) => (
              <div 
                key={log.id} 
                className={`px-3 py-1.5 rounded border-l-2 ${getLogColor(log.type)} whitespace-pre-wrap break-words`}
              >
                {log.content}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
