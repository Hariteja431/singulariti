"use client";
import React, { useState, useEffect, useRef } from "react";
import { ArrowRight, ImageIcon, FileText, QrCode, Wand2, Calculator, Keyboard, Timer, Brush, Type, Code, Scale, Search, X } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
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
  
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Prepare data from registry
  const timelineData: TimelineItem[] = registry.categories.map(category => {
    // Flatten all tools across collections for the preview
    const allTools = category.collections.flatMap(c => c.tools);
    // Grab the first 8 tools to display as pills
    const previewTools = allTools.slice(0, 8).map(t => ({ name: t.name, path: t.path! }));
    
    return {
      id: category.id,
      title: category.name.replace(' Tools', ''),
      description: category.description,
      icon: iconMap[category.id] || Search,
      tools: previewTools,
    };
  });

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

  useEffect(() => {
    let rotationTimer: NodeJS.Timeout;

    if (autoRotate) {
      rotationTimer = setInterval(() => {
        setRotationAngle((prev) => {
          const newAngle = (prev + 0.15) % 360; // Slower, smoother rotation
          return Number(newAngle.toFixed(3));
        });
      }, 50);
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
    
    // We want the clicked node to end up generally on the right side or top (around 270 deg or 0 deg)
    // Adjusting math so active node is front and center
    setRotationAngle(270 - targetAngle);
  };

  const calculateNodePosition = (index: number, total: number) => {
    const angle = ((index / total) * 360 + rotationAngle) % 360;
    // Base radius is 180 for desktop, will scale via CSS for smaller screens
    const radius = 220; 
    const radian = (angle * Math.PI) / 180;

    const x = radius * Math.cos(radian);
    const y = radius * Math.sin(radian);

    // Z-index calculation for 3D depth feeling
    const zIndex = Math.round(100 + 50 * Math.cos(radian));
    const opacity = Math.max(
      0.3,
      Math.min(1, 0.4 + 0.6 * ((1 + Math.sin(radian)) / 2))
    );

    return { x, y, angle, zIndex, opacity };
  };

  return (
    <div
      className="relative w-full h-[600px] flex items-center justify-center overflow-visible"
      ref={containerRef}
      onClick={handleContainerClick}
    >
      {/* Massive subtle background Logo mark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none overflow-hidden">
        <svg 
          viewBox="0 0 100 100" 
          className="w-[800px] h-[800px] md:w-[1000px] md:h-[1000px]" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <polygon points="50,10 15,85 50,60" className="fill-slate" />
          <polygon points="50,10 85,85 50,60" className="fill-slate" />
          <polygon points="15,85 85,85 50,60" className="fill-primary" />
          <polygon points="50,10 15,85 85,85" className="stroke-slate" strokeWidth="2" strokeLinejoin="round" />
          <line x1="50" y1="10" x2="50" y2="60" className="stroke-slate" strokeWidth="1" strokeLinecap="round" />
          <line x1="15" y1="85" x2="50" y2="60" className="stroke-slate" strokeWidth="1" strokeLinecap="round" />
          <line x1="85" y1="85" x2="50" y2="60" className="stroke-slate" strokeWidth="1" strokeLinecap="round" />
        </svg>
      </div>

      <div className="relative w-full max-w-2xl h-full flex items-center justify-center">
        <div
          className="absolute w-full h-full flex items-center justify-center transition-transform duration-1000 ease-out"
          ref={orbitRef}
          style={{
            perspective: "1000px",
          }}
        >
          
          {/* Outer Orbit Rings */}
          <div className="absolute w-[300px] h-[300px] md:w-[440px] md:h-[440px] rounded-full border border-slate/10 dark:border-white/5 pointer-events-none"></div>
          <div className="absolute w-[200px] h-[200px] md:w-[280px] md:h-[280px] rounded-full border border-slate/5 dark:border-white/5 pointer-events-none"></div>

          {/* Central Prism Bulb */}
          <div className="absolute z-10 flex items-center justify-center">
            {/* Glowing Aura Rings */}
            <div className="absolute w-24 h-24 rounded-full border border-primary/20 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite] opacity-50"></div>
            <div className="absolute w-32 h-32 rounded-full border border-primary/10 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite] opacity-30" style={{ animationDelay: "1s" }}></div>
            
            {/* The Bulb from Logo */}
            <svg 
              viewBox="0 0 100 100" 
              className="w-16 h-16 drop-shadow-[0_0_15px_var(--color-primary)]" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="50" cy="50" r="25" className="fill-primary">
                <animate attributeName="r" values="22;28;22" dur="3s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.7;1;0.7" dur="3s" repeatCount="indefinite" />
              </circle>
            </svg>
          </div>

          {/* Orbiting Nodes */}
          {timelineData.map((item, index) => {
            const position = calculateNodePosition(index, timelineData.length);
            const isExpanded = expandedItems[item.id];
            const Icon = item.icon;

            const nodeStyle = {
              transform: `translate(${position.x}px, ${position.y}px)`,
              zIndex: isExpanded ? 200 : position.zIndex,
              opacity: isExpanded ? 1 : position.opacity,
            };

            return (
              <div
                key={item.id}
                ref={(el) => { nodeRefs.current[item.id] = el; }}
                className="absolute transition-all duration-700 cursor-pointer"
                style={nodeStyle}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleItem(item.id);
                }}
              >
                
                {/* Node Label (hidden when expanded to prevent clutter) */}
                <div
                  className={`
                    absolute top-14 left-1/2 -translate-x-1/2 whitespace-nowrap
                    text-[11px] font-semibold tracking-wider font-display
                    transition-all duration-300 pointer-events-none
                    ${isExpanded ? "opacity-0" : "text-ink/60 dark:text-slate/60"}
                  `}
                >
                  {item.title}
                </div>

                {/* Node Icon Circle */}
                <div
                  className={`
                  w-12 h-12 rounded-full flex items-center justify-center relative
                  ${
                    isExpanded
                      ? "bg-primary text-white scale-125 border-transparent shadow-[0_0_20px_var(--color-primary)]"
                      : "bg-surface dark:bg-[#111111] text-ink dark:text-white border border-slate/20 dark:border-white/10 hover:border-primary/50 hover:text-primary transition-colors"
                  }
                  transition-all duration-300 transform
                `}
                >
                  <Icon size={isExpanded ? 20 : 18} strokeWidth={isExpanded ? 2 : 1.5} />
                </div>

                {/* Expanded Card Detail */}
                {isExpanded && (
                  <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[320px] z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="rounded-xl bg-surface/95 dark:bg-[#0a0a0a]/95 backdrop-blur-xl border border-slate/10 dark:border-white/10 shadow-2xl p-5">
                      
                      {/* Header */}
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2 text-primary">
                          <Icon size={16} strokeWidth={2} />
                          <h3 className="font-display font-bold text-base text-ink dark:text-white leading-tight">
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
                      <p className="text-xs text-slate dark:text-slate/80 leading-relaxed mb-4">
                        {item.description}
                      </p>

                      {/* Tool Pills Grid */}
                      <div className="space-y-2">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate/50 mb-2">Popular Tools</div>
                        <div className="flex flex-wrap gap-1.5">
                          {item.tools.map((tool, idx) => (
                            <Link 
                              key={idx} 
                              href={tool.path}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Badge 
                                variant="outline" 
                                className="text-[10px] py-0.5 px-2 font-medium bg-transparent hover:bg-primary/5 dark:hover:bg-primary/10 border-slate/20 dark:border-white/10 text-slate dark:text-slate/90 transition-colors"
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
                              className="text-[10px] py-0.5 px-2 font-medium bg-primary/10 text-primary hover:bg-primary/20 border-transparent transition-colors group flex items-center gap-1"
                            >
                              View All
                              <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
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
