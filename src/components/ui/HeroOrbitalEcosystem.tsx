"use client";
import React, { useState, useEffect, useRef } from "react";
import { ArrowRight, ImageIcon, FileText, QrCode, Wand2, Calculator, Keyboard, Timer, Brush, Type, Code, Scale, Search, X } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { registry } from "@/registry";
import Link from "next/link";

// Map category IDs to their specific Lucide Icons
const iconMap: Record<string, React.ElementType> = {
  image: ImageIcon,
  editing: Wand2,
  pdf: FileText,
  qr: QrCode,
  calculators: Calculator,
  text: Type,
  convert: Scale,
  dev: Code,
  seo: Search,
};

interface ToolPreview {
  name: string;
  path: string;
}

interface TimelineItem {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  tools: ToolPreview[];
}

export default function HeroOrbitalEcosystem() {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [radius, setRadius] = useState<number>(220);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Prepare data from registry
  const timelineData: TimelineItem[] = registry.categories.map(category => {
    const allTools = category.collections.flatMap(c => c.tools);
    const previewTools = allTools.slice(0, 8).map(t => ({ name: t.name, path: t.path! }));
    return {
      id: category.id,
      title: category.name.replace(' Tools', ''),
      description: category.description,
      icon: iconMap[category.id] || Search,
      tools: previewTools,
    };
  });

  // Handle Window Resize for Mobile Responsiveness
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) { // mobile
        setRadius(135);
      } else if (window.innerWidth < 1024) { // tablet
        setRadius(180);
      } else { // desktop
        setRadius(230);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      setExpandedItems({});
      setActiveNodeId(null);
      setAutoRotate(true);
    }
  };

  const toggleItem = (id: string) => {
    setExpandedItems((prev) => {
      const newState = { ...prev };
      Object.keys(newState).forEach((key) => {
        if (key !== id) {
          newState[key] = false;
        }
      });

      newState[id] = !prev[id];

      if (!prev[id]) {
        setActiveNodeId(id);
        setAutoRotate(false);
        centerViewOnNode(id);
      } else {
        setActiveNodeId(null);
        setAutoRotate(true);
      }

      return newState;
    });
  };

  // Steady, periodic, synchronized motion
  useEffect(() => {
    let rotationTimer: NodeJS.Timeout;

    if (autoRotate) {
      rotationTimer = setInterval(() => {
        setRotationAngle((prev) => {
          const newAngle = (prev + 0.1) % 360; // Smooth steady rotation
          return Number(newAngle.toFixed(3));
        });
      }, 30);
    }

    return () => {
      if (rotationTimer) {
        clearInterval(rotationTimer);
      }
    };
  }, [autoRotate]);

  const centerViewOnNode = (nodeId: string) => {
    if (!nodeRefs.current[nodeId]) return;
    const nodeIndex = timelineData.findIndex((item) => item.id === nodeId);
    const totalNodes = timelineData.length;
    const targetAngle = (nodeIndex / totalNodes) * 360;
    
    // Bring the expanded node to the right side (or bottom on mobile)
    const offset = window.innerWidth < 640 ? 90 : 270;
    setRotationAngle(offset - targetAngle);
  };

  const calculateNodePosition = (index: number, total: number) => {
    const angle = ((index / total) * 360 + rotationAngle) % 360;
    const radian = (angle * Math.PI) / 180;

    const x = radius * Math.cos(radian);
    const y = radius * Math.sin(radian);

    const zIndex = Math.round(100 + 50 * Math.cos(radian));
    const opacity = Math.max(
      0.4,
      Math.min(1, 0.4 + 0.6 * ((1 + Math.sin(radian)) / 2))
    );

    return { x, y, angle, zIndex, opacity };
  };

  return (
    <div
      className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px] flex items-center justify-center overflow-visible mt-10 lg:mt-0"
      ref={containerRef}
      onClick={handleContainerClick}
    >
      <div className="relative w-full max-w-2xl h-full flex items-center justify-center">
        <div
          className="absolute w-full h-full flex items-center justify-center transition-transform duration-1000 ease-out"
          ref={orbitRef}
          style={{ perspective: "1000px" }}
        >
          
          {/* Energy Rings - steady synced rotation */}
          {/* Outer Energy Stream */}
          <div 
            className="absolute rounded-full border border-slate/10 dark:border-white/5 pointer-events-none transition-all duration-500 flex items-center justify-center"
            style={{ width: radius * 2, height: radius * 2 }}
          >
            {/* Synchronized glowing trail rotating opposite to orbit nodes */}
            <div 
              className="absolute w-full h-full rounded-full border-t border-primary/40 dark:border-primary/60 blur-[1px]"
              style={{ transform: `rotate(-${rotationAngle * 2}deg)` }}
            ></div>
          </div>
          
          {/* Inner Energy Stream */}
          <div 
            className="absolute rounded-full border border-slate/5 dark:border-white/5 pointer-events-none transition-all duration-500 flex items-center justify-center"
            style={{ width: radius * 1.3, height: radius * 1.3 }}
          >
            <div 
              className="absolute w-full h-full rounded-full border-b border-primary/30 dark:border-primary/50 blur-[2px]"
              style={{ transform: `rotate(${rotationAngle * 1.5}deg)` }}
            ></div>
          </div>

          {/* Central High-Energy Prism Core */}
          <div className="absolute z-10 flex items-center justify-center scale-[0.6] sm:scale-[0.8] lg:scale-100">
            {/* Background intense glow */}
            <div className="absolute w-32 h-32 bg-primary/20 rounded-full blur-[40px] mix-blend-screen"></div>
            
            {/* 3D Wireframe Prism inside the circle */}
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg 
                viewBox="0 0 100 100" 
                className="w-full h-full drop-shadow-[0_0_20px_rgba(20,184,166,0.6)]" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                style={{ transform: `rotate(${rotationAngle * 0.5}deg)` }} // Steady sync
              >
                {/* Back faces (wireframe illusion) */}
                <polygon points="50,10 15,85 85,85" className="stroke-slate/30 dark:stroke-slate/40" strokeWidth="1" />
                
                {/* Front Wireframe */}
                <polygon points="50,10 15,85 85,85" className="stroke-primary" strokeWidth="1.5" strokeLinejoin="round" />
                
                {/* Inner 3D perspective lines */}
                <line x1="50" y1="10" x2="50" y2="60" className="stroke-primary" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="15" y1="85" x2="50" y2="60" className="stroke-primary" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="85" y1="85" x2="50" y2="60" className="stroke-primary" strokeWidth="1.5" strokeLinecap="round" />
                
                {/* Inner bottom face to give depth */}
                <polygon points="15,85 85,85 50,60" className="fill-primary/20 dark:fill-primary/30 backdrop-blur-sm" />
              </svg>

              {/* The Inner Pulsing Bulb Core */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-3">
                <svg 
                  viewBox="0 0 100 100" 
                  className="w-10 h-10 drop-shadow-[0_0_15px_var(--color-primary)]" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="50" cy="50" r="30" className="fill-primary">
                    <animate attributeName="r" values="25;35;25" dur="3s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.7;1;0.7" dur="3s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="50" cy="50" r="15" className="fill-white drop-shadow-[0_0_10px_white]">
                     <animate attributeName="opacity" values="0.8;1;0.8" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                </svg>
              </div>
            </div>
          </div>

          {/* Orbiting Nodes */}
          {timelineData.map((item, index) => {
            const position = calculateNodePosition(index, timelineData.length);
            const isExpanded = expandedItems[item.id];
            const Icon = item.icon;

            const nodeStyle = {
              transform: `translate(${position.x}px, ${position.y}px)`,
              zIndex: isExpanded ? 300 : position.zIndex,
              opacity: isExpanded ? 1 : position.opacity,
            };

            return (
              <div
                key={item.id}
                ref={(el) => { nodeRefs.current[item.id] = el; }}
                className="absolute transition-all duration-700 cursor-pointer flex flex-col items-center justify-center"
                style={nodeStyle}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleItem(item.id);
                }}
              >
                
                {/* Node Label (hidden when expanded to prevent clutter) */}
                <div
                  className={`
                    absolute top-14 sm:top-16 whitespace-nowrap
                    text-[10px] sm:text-[11px] font-bold tracking-wider font-display uppercase
                    transition-all duration-300 pointer-events-none
                    ${isExpanded ? "opacity-0" : "text-ink/80 dark:text-slate/80 drop-shadow-sm"}
                  `}
                >
                  {item.title}
                </div>

                {/* Node Diamond Icon Container to match the Prism vibe */}
                <div
                  className={`
                  w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center relative
                  ${
                    isExpanded
                      ? "scale-125"
                      : "hover:scale-110"
                  }
                  transition-transform duration-300
                `}
                >
                  {/* The Diamond Background */}
                  <div className={`
                    absolute inset-0 rotate-45 transition-colors duration-300
                    ${isExpanded 
                      ? "bg-primary border-primary shadow-[0_0_25px_var(--color-primary)]" 
                      : "bg-surface/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border border-slate/30 dark:border-white/10 shadow-[inset_0_0_10px_rgba(20,184,166,0.1)] group-hover:border-primary/50 group-hover:shadow-[0_0_15px_rgba(20,184,166,0.3)]"}
                  `}></div>

                  {/* The actual icon, counter-rotated so it stands upright */}
                  <div className="relative z-10 transition-colors duration-300">
                    <Icon 
                      size={isExpanded ? 18 : 16} 
                      strokeWidth={isExpanded ? 2.5 : 2} 
                      className={`
                        sm:w-5 sm:h-5
                        ${isExpanded ? "text-white" : "text-ink dark:text-white group-hover:text-primary"}
                      `} 
                    />
                  </div>
                </div>

                {/* Expanded Card Detail */}
                {isExpanded && (
                  <div className="absolute top-16 sm:top-20 left-1/2 -translate-x-1/2 w-[280px] sm:w-[320px] z-[300] animate-in fade-in zoom-in-95 duration-200">
                    <div className="rounded-xl bg-surface/95 dark:bg-[#0a0a0a]/95 backdrop-blur-xl border border-primary/20 dark:border-primary/30 shadow-[0_10px_40px_-10px_rgba(20,184,166,0.3)] p-4 sm:p-5">
                      
                      {/* Header */}
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2 text-primary">
                          <div className="w-6 h-6 rotate-45 bg-primary/20 flex items-center justify-center rounded-sm">
                            <Icon size={12} strokeWidth={2.5} className="-rotate-45 text-primary" />
                          </div>
                          <h3 className="font-display font-bold text-[15px] sm:text-base text-ink dark:text-white leading-tight">
                            {item.title}
                          </h3>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleItem(item.id);
                          }}
                          className="text-slate hover:text-ink dark:hover:text-white transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      
                      {/* Description */}
                      <p className="text-[11px] sm:text-xs text-slate dark:text-slate/80 leading-relaxed mb-4">
                        {item.description}
                      </p>

                      {/* Tool Pills Grid */}
                      <div className="space-y-2">
                        <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate/50 mb-2">Popular Tools</div>
                        <div className="flex flex-wrap gap-1.5">
                          {item.tools.map((tool, idx) => (
                            <Link 
                              key={idx} 
                              href={tool.path}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Badge 
                                variant="outline" 
                                className="text-[9px] sm:text-[10px] py-0.5 px-2 font-medium bg-transparent hover:bg-primary/5 dark:hover:bg-primary/10 border-slate/20 dark:border-white/10 text-slate dark:text-slate/90 transition-colors"
                              >
                                {tool.name}
                              </Badge>
                            </Link>
                          ))}
                          
                          <Link 
                            href={`/${item.id === 'pdf' ? 'tools/pdf' : item.id === 'qr' ? 'tools/qr' : item.id === 'calculators' ? 'tools/calculators' : item.id === 'text' ? 'tools/text' : item.id === 'dev' ? 'tools/dev' : item.id === 'seo' ? 'tools/seo' : item.id === 'convert' ? 'tools/convert' : item.id === 'image' ? 'image' : item.id === 'editing' ? 'editing' : item.id}`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Badge 
                              variant="default" 
                              className="text-[9px] sm:text-[10px] py-0.5 px-2 font-medium bg-primary/10 text-primary hover:bg-primary/20 border-transparent transition-colors group flex items-center gap-1"
                            >
                              View All
                              <ArrowRight size={8} className="group-hover:translate-x-0.5 transition-transform" />
                            </Badge>
                          </Link>
                        </div>
                      </div>

                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
