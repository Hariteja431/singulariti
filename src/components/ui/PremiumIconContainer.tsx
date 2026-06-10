import React from 'react';
import { Sparkles } from 'lucide-react';

interface PremiumIconContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function PremiumIconContainer({ children, className = "w-12 h-12" }: PremiumIconContainerProps) {
  return (
    <div className={`relative ${className} flex items-center justify-center group perspective`}>
      
      {/* Dynamic Background Blob / Glass Layer */}
      <div className={`absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 dark:from-primary/30 dark:to-primary/10 rounded-2xl transform group-hover:scale-105 group-hover:rotate-1 transition-all duration-500 ease-out border border-white/10 dark:border-white/5 shadow-sm`}>
        {/* Subtle grid pattern overlay for premium feel */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.08] rounded-2xl" 
             style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '6px 6px' }}>
        </div>
      </div>

      {/* Main Object Icon - Slightly lifted to create 3D isometric feel */}
      <div className="relative z-10 transform -translate-y-0.5 group-hover:-translate-y-1 transition-transform duration-500 ease-out drop-shadow-sm text-primary">
        {React.isValidElement(children) ? React.cloneElement(children as React.ReactElement<any>, { strokeWidth: 1.5, size: 24 }) : children}
      </div>
      
      {/* Magic Sparkles on Hover for extra premium delight */}
      <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden rounded-2xl">
         <Sparkles className="absolute top-1 left-1 text-yellow-400/50 w-2.5 h-2.5 animate-pulse" />
         <Sparkles className="absolute bottom-1 right-5 text-blue-400/50 w-3 h-3 animate-pulse delay-150" />
      </div>

    </div>
  );
}
