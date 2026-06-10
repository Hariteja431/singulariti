import React from 'react';
import { 
  // Base Objects
  Image as ImageIcon, FileText, Code2, Calculator, Search, Type, Ruler, QrCode, Database,
  // Modifiers
  Minimize2, ArrowRightLeft, Scissors, Maximize, RotateCw, Wand2, Filter, Palette, Stamp,
  Lock, Unlock, ShieldCheck, CheckCircle2, KeyRound, Sparkles, Binary, Link, Replace, Mail, Globe, 
  TrendingUp, Activity, Zap
} from 'lucide-react';

interface ToolIllustrationProps {
  toolId: string;
  className?: string;
}

export function ToolIllustration({ toolId, className = "w-16 h-16" }: ToolIllustrationProps) {
  const id = toolId.toLowerCase();

  // Mapping logic to determine Object and Modifier
  let ObjectIcon = Code2;
  let ModifierIcon: React.ElementType | null = null;
  let categoryColor = "from-primary/20 to-primary/5"; // default subtle gradient
  let badgeColor = "bg-primary text-background";

  // ==============================
  // 1. Determine Object (The Noun)
  // ==============================
  if (id.includes('image') || id.includes('jpg') || id.includes('png') || id.includes('webp') || id.includes('svg')) {
    ObjectIcon = ImageIcon;
    categoryColor = "from-blue-500/20 to-blue-500/5 dark:from-blue-500/30 dark:to-blue-500/10";
    badgeColor = "bg-blue-500 text-white";
  } else if (id.includes('pdf')) {
    ObjectIcon = FileText;
    categoryColor = "from-red-500/20 to-red-500/5 dark:from-red-500/30 dark:to-red-500/10";
    badgeColor = "bg-red-500 text-white";
  } else if (id.includes('json') || id.includes('xml') || id.includes('yaml') || id.includes('sql') || id.includes('jwt') || id.includes('base64')) {
    ObjectIcon = Database;
    categoryColor = "from-purple-500/20 to-purple-500/5 dark:from-purple-500/30 dark:to-purple-500/10";
    badgeColor = "bg-purple-500 text-white";
  } else if (id.includes('calculator') || id.includes('emi') || id.includes('tax') || id.includes('bmi')) {
    ObjectIcon = Calculator;
    categoryColor = "from-orange-500/20 to-orange-500/5 dark:from-orange-500/30 dark:to-orange-500/10";
    badgeColor = "bg-orange-500 text-white";
  } else if (id.includes('seo') || id.includes('meta') || id.includes('sitemap') || id.includes('robot')) {
    ObjectIcon = Search;
    categoryColor = "from-green-500/20 to-green-500/5 dark:from-green-500/30 dark:to-green-500/10";
    badgeColor = "bg-green-500 text-white";
  } else if (id.includes('text') || id.includes('word') || id.includes('case') || id.includes('sort')) {
    ObjectIcon = Type;
    categoryColor = "from-slate-500/20 to-slate-500/5 dark:from-slate-500/30 dark:to-slate-500/10";
    badgeColor = "bg-slate-700 dark:bg-slate-300 dark:text-slate-900 text-white";
  } else if (id.includes('convert') || id.includes('length') || id.includes('weight')) {
    ObjectIcon = Ruler;
    categoryColor = "from-primary/20 to-primary/5 dark:from-primary/30 dark:to-primary/10";
    badgeColor = "bg-primary text-primary-foreground";
  } else if (id.includes('qr')) {
    ObjectIcon = QrCode;
    categoryColor = "from-indigo-500/20 to-indigo-500/5 dark:from-indigo-500/30 dark:to-indigo-500/10";
    badgeColor = "bg-indigo-500 text-white";
  }

  // ==============================
  // 2. Determine Modifier (The Verb)
  // ==============================
  if (id.includes('compress')) ModifierIcon = Minimize2;
  else if (id.includes('to-') || id.includes('convert')) ModifierIcon = ArrowRightLeft;
  else if (id.includes('crop') || id.includes('split') || id.includes('remove')) ModifierIcon = Scissors;
  else if (id.includes('resize') || id.includes('upscale')) ModifierIcon = Maximize;
  else if (id.includes('rotate')) ModifierIcon = RotateCw;
  else if (id.includes('enhance') || id.includes('wand')) ModifierIcon = Wand2;
  else if (id.includes('filter') || id.includes('blur')) ModifierIcon = Filter;
  else if (id.includes('color') || id.includes('palette')) ModifierIcon = Palette;
  else if (id.includes('watermark') || id.includes('stamp')) ModifierIcon = Stamp;
  else if (id.includes('protect') || id.includes('lock')) ModifierIcon = Lock;
  else if (id.includes('unlock') || id.includes('decode')) ModifierIcon = Unlock;
  else if (id.includes('validate') || id.includes('check')) ModifierIcon = CheckCircle2;
  else if (id.includes('encode') || id.includes('jwt')) ModifierIcon = KeyRound;
  else if (id.includes('base64')) ModifierIcon = Binary;
  else if (id.includes('url')) ModifierIcon = Link;
  else if (id.includes('replace') || id.includes('reverse')) ModifierIcon = Replace;
  else if (id.includes('email') || id.includes('mail')) ModifierIcon = Mail;
  else if (id.includes('meta') || id.includes('globe')) ModifierIcon = Globe;
  else if (id.includes('investment') || id.includes('sip')) ModifierIcon = TrendingUp;
  else if (id.includes('health') || id.includes('bmi')) ModifierIcon = Activity;
  else if (id.includes('power') || id.includes('electricity')) ModifierIcon = Zap;

  return (
    <div className={`relative ${className} flex items-center justify-center group perspective`}>
      
      {/* Dynamic Background Blob / Glass Layer */}
      <div className={`absolute inset-0 bg-gradient-to-br ${categoryColor} rounded-[2rem] transform group-hover:scale-105 group-hover:rotate-1 transition-all duration-500 ease-out border border-white/10 dark:border-white/5 shadow-inner`}>
        {/* Subtle grid pattern overlay for premium feel */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.08]" 
             style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '8px 8px' }}>
        </div>
      </div>

      {/* Main Object Icon (The Noun) - Slightly lifted to create 3D isometric feel */}
      <div className="relative z-10 transform -translate-y-1 group-hover:-translate-y-2 transition-transform duration-500 ease-out drop-shadow-md text-slate-800 dark:text-slate-100">
        <ObjectIcon size={className.includes('w-20') || className.includes('w-24') ? 36 : 28} strokeWidth={1.5} />
      </div>

      {/* Action Modifier Badge (The Verb) - Floats in bottom right */}
      {ModifierIcon && (
        <div className={`absolute bottom-1 right-1 z-20 ${badgeColor} p-1.5 rounded-full shadow-lg border-2 border-white dark:border-slate-900 transform translate-y-1/4 translate-x-1/4 group-hover:scale-110 transition-transform duration-500 ease-out`}>
          <ModifierIcon size={className.includes('w-20') || className.includes('w-24') ? 16 : 14} strokeWidth={2.5} />
        </div>
      )}
      
      {/* Magic Sparkles on Hover for extra premium delight */}
      <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden rounded-[2rem]">
         <Sparkles className="absolute top-1 left-2 text-yellow-400/50 w-3 h-3 animate-pulse" />
         <Sparkles className="absolute bottom-2 right-6 text-blue-400/50 w-4 h-4 animate-pulse delay-150" />
      </div>

    </div>
  );
}
