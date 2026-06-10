import React from 'react';

interface PremiumIconContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function PremiumIconContainer({ children, className = "w-14 h-14" }: PremiumIconContainerProps) {
  // Premium Apple-Style Duotone Squircle for landing page
  return (
    <div className={`relative flex items-center justify-center ${className} bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30 rounded-2xl group-hover:scale-105 group-hover:-translate-y-1 group-hover:shadow-[0_8px_30px_rgba(20,184,166,0.2)] transition-all duration-300 overflow-hidden`}>
      {/* Inner subtle glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/5 dark:to-transparent pointer-events-none rounded-2xl" />
      
      {/* The Duotone Icon */}
      <div className="relative z-10 text-primary transition-transform duration-300 ease-out">
        {React.isValidElement(children) 
          ? React.cloneElement(children as React.ReactElement<any>, { 
              strokeWidth: 2, 
              className: "w-7 h-7",
              fill: "currentColor",
              fillOpacity: 0.2
            }) 
          : children}
      </div>
    </div>
  );
}
