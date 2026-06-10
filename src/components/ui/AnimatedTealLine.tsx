"use client";

import React from 'react';
import { motion } from 'framer-motion';

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

interface AnimatedTealLineProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  reverse?: boolean;
}

export function AnimatedTealLine({ orientation = 'horizontal', className, reverse = false }: AnimatedTealLineProps) {
  const isHorizontal = orientation === 'horizontal';
  
  return (
    <div className={cn("relative overflow-hidden pointer-events-none", className)}>
      <motion.div
        className="absolute inset-0 w-full h-full"
        initial={{ [isHorizontal ? "x" : "y"]: reverse ? "100%" : "-100%" }}
        animate={{ [isHorizontal ? "x" : "y"]: reverse ? "-100%" : "100%" }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 4,
          delay: reverse ? 2 : 0
        }}
        style={{
          background: isHorizontal
            ? "linear-gradient(90deg, transparent 0%, rgba(20,184,166,0) 20%, rgba(45,212,191,1) 50%, rgba(20,184,166,0) 80%, transparent 100%)"
            : "linear-gradient(180deg, transparent 0%, rgba(20,184,166,0) 20%, rgba(45,212,191,1) 50%, rgba(20,184,166,0) 80%, transparent 100%)"
        }}
      />
    </div>
  );
}
