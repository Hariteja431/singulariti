import React from 'react';

interface PremiumIconContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function PremiumIconContainer({ children, className = "w-12 h-12" }: PremiumIconContainerProps) {
  return (
    <div className={`relative flex items-center justify-center ${className} bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm group-hover:shadow-md group-hover:border-primary/30 transition-all duration-300`}>
      {/* Main Object Icon */}
      <div className="relative z-10 text-primary transition-transform duration-300 ease-out group-hover:scale-110">
        {React.isValidElement(children) ? React.cloneElement(children as React.ReactElement<any>, { strokeWidth: 2, className: "w-6 h-6" }) : children}
      </div>
      
      {/* Soft Glow Ring on Hover */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 ring-1 ring-primary/20 dark:ring-primary/30 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
}
