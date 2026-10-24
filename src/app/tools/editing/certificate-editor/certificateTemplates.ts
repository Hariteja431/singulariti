export interface CertificateTheme {
  id: string;
  name: string;
  description: string;
  category: 'classic' | 'modern' | 'academic' | 'luxury';
  svg: string;
  textColor: string;
  accentColor: string;
  secondaryTextColor: string;
  badgeColor: string;
  titleFont: string;
  nameFont: string;
  bodyFont: string;
}

export const CERTIFICATE_TEMPLATES: Record<string, CertificateTheme> = {
  classic: {
    id: 'classic',
    name: 'Imperial Navy & Gold',
    description: 'Prestigious deep navy background with regal gold borders and corner filigree.',
    category: 'classic',
    textColor: '#e2e8f0',
    accentColor: '#f59e0b',
    secondaryTextColor: '#94a3b8',
    badgeColor: '#f59e0b',
    titleFont: 'Cinzel',
    nameFont: 'Great Vibes',
    bodyFont: 'Montserrat',
    svg: `<svg width="1000" height="707" viewBox="0 0 1000 707" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f59e0b" />
      <stop offset="35%" stop-color="#fbbf24" />
      <stop offset="70%" stop-color="#d97706" />
      <stop offset="100%" stop-color="#fef08a" />
    </linearGradient>
    <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#1e293b" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#090d16" stop-opacity="1"/>
    </radialGradient>
  </defs>
  <rect width="1000" height="707" fill="#090d16" />
  <rect width="1000" height="707" fill="url(#centerGlow)" />
  
  <!-- Outer Gold Frame -->
  <rect x="24" y="24" width="952" height="659" fill="none" stroke="url(#goldGrad)" stroke-width="4" rx="2" />
  
  <!-- Inner Subtle Accent Border -->
  <rect x="34" y="34" width="932" height="639" fill="none" stroke="#f59e0b" stroke-width="1" stroke-opacity="0.4" />
  <rect x="40" y="40" width="920" height="627" fill="none" stroke="#94a3b8" stroke-width="0.75" stroke-dasharray="6 4" stroke-opacity="0.3" />

  <!-- Corner Filigree Ornaments -->
  <!-- Top Left -->
  <g transform="translate(24, 24)">
    <path d="M0,0 L40,0 C25,10 10,25 0,40 Z" fill="url(#goldGrad)" opacity="0.85" />
    <path d="M6,6 L32,6 C20,14 14,20 6,32 Z" fill="#090d16" />
    <circle cx="16" cy="16" r="3" fill="url(#goldGrad)" />
  </g>
  <!-- Top Right -->
  <g transform="translate(976, 24) scale(-1, 1)">
    <path d="M0,0 L40,0 C25,10 10,25 0,40 Z" fill="url(#goldGrad)" opacity="0.85" />
    <path d="M6,6 L32,6 C20,14 14,20 6,32 Z" fill="#090d16" />
    <circle cx="16" cy="16" r="3" fill="url(#goldGrad)" />
  </g>
  <!-- Bottom Left -->
  <g transform="translate(24, 683) scale(1, -1)">
    <path d="M0,0 L40,0 C25,10 10,25 0,40 Z" fill="url(#goldGrad)" opacity="0.85" />
    <path d="M6,6 L32,6 C20,14 14,20 6,32 Z" fill="#090d16" />
    <circle cx="16" cy="16" r="3" fill="url(#goldGrad)" />
  </g>
  <!-- Bottom Right -->
  <g transform="translate(976, 683) scale(-1, -1)">
    <path d="M0,0 L40,0 C25,10 10,25 0,40 Z" fill="url(#goldGrad)" opacity="0.85" />
    <path d="M6,6 L32,6 C20,14 14,20 6,32 Z" fill="#090d16" />
    <circle cx="16" cy="16" r="3" fill="url(#goldGrad)" />
  </g>

  <!-- Watermark Rosette in Center -->
  <g transform="translate(500, 353)" opacity="0.035">
    <circle r="180" fill="none" stroke="#f59e0b" stroke-width="2" />
    <circle r="140" fill="none" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="8 6" />
    <polygon points="0,-160 40,-40 160,0 40,40 0,160 -40,40 -160,0 -40,-40" fill="none" stroke="#f59e0b" stroke-width="2" />
  </g>
</svg>`,
  },

  emerald: {
    id: 'emerald',
    name: 'Executive Emerald',
    description: 'Sophisticated deep emerald and champagne gold for academic and corporate honors.',
    category: 'academic',
    textColor: '#1e293b',
    accentColor: '#065f46',
    secondaryTextColor: '#475569',
    badgeColor: '#b45309',
    titleFont: 'Playfair Display',
    nameFont: 'Great Vibes',
    bodyFont: 'Inter',
    svg: `<svg width="1000" height="707" viewBox="0 0 1000 707" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="emGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#064e3b" />
      <stop offset="100%" stop-color="#047857" />
    </linearGradient>
    <linearGradient id="emGold" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#b45309" />
      <stop offset="50%" stop-color="#f59e0b" />
      <stop offset="100%" stop-color="#b45309" />
    </linearGradient>
  </defs>
  <rect width="1000" height="707" fill="#fbfcf8" />
  
  <!-- Outer Deep Emerald Margin Frame -->
  <rect x="20" y="20" width="960" height="667" fill="none" stroke="url(#emGrad)" stroke-width="6" />
  <rect x="32" y="32" width="936" height="643" fill="none" stroke="url(#emGold)" stroke-width="2" />
  <rect x="38" y="38" width="924" height="631" fill="none" stroke="#cbd5e1" stroke-width="1" />

  <!-- Corner Brackets -->
  <path d="M 20,65 L 65,20 M 980,65 L 935,20 M 20,642 L 65,687 M 980,642 L 935,687" stroke="url(#emGold)" stroke-width="2" />
  
  <!-- Corner Triangles -->
  <polygon points="20,20 50,20 20,50" fill="url(#emGrad)" />
  <polygon points="980,20 950,20 980,50" fill="url(#emGrad)" />
  <polygon points="20,687 50,687 20,657" fill="url(#emGrad)" />
  <polygon points="980,687 950,687 980,657" fill="url(#emGrad)" />

  <!-- Header Accent Line -->
  <line x1="250" y1="90" x2="750" y2="90" stroke="url(#emGold)" stroke-width="1.5" stroke-dasharray="12 4" />
</svg>`,
  },

  ruby: {
    id: 'ruby',
    name: 'Prestige Crimson & Gold',
    description: 'Ceremonial diploma styling with rich burgundy borders and formal insignia framing.',
    category: 'classic',
    textColor: '#1f2937',
    accentColor: '#881337',
    secondaryTextColor: '#4b5563',
    badgeColor: '#b45309',
    titleFont: 'Cinzel',
    nameFont: 'Alex Brush',
    bodyFont: 'EB Garamond',
    svg: `<svg width="1000" height="707" viewBox="0 0 1000 707" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="rubyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4c0519" />
      <stop offset="100%" stop-color="#881337" />
    </linearGradient>
    <linearGradient id="goldRibbon" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#d97706" />
      <stop offset="50%" stop-color="#fbbf24" />
      <stop offset="100%" stop-color="#b45309" />
    </linearGradient>
  </defs>
  <rect width="1000" height="707" fill="#fffdfa" />
  
  <!-- Dual Border Frame -->
  <rect x="22" y="22" width="956" height="663" fill="none" stroke="url(#rubyGrad)" stroke-width="8" />
  <rect x="34" y="34" width="932" height="639" fill="none" stroke="url(#goldRibbon)" stroke-width="2.5" />
  <rect x="42" y="42" width="916" height="623" fill="none" stroke="#9ca3af" stroke-width="1" stroke-dasharray="4 4" />

  <!-- Elegant Corner Squares with Star -->
  <g transform="translate(34, 34)">
    <rect x="-8" y="-8" width="16" height="16" fill="url(#rubyGrad)" />
    <circle cx="0" cy="0" r="3" fill="#fbbf24" />
  </g>
  <g transform="translate(966, 34)">
    <rect x="-8" y="-8" width="16" height="16" fill="url(#rubyGrad)" />
    <circle cx="0" cy="0" r="3" fill="#fbbf24" />
  </g>
  <g transform="translate(34, 673)">
    <rect x="-8" y="-8" width="16" height="16" fill="url(#rubyGrad)" />
    <circle cx="0" cy="0" r="3" fill="#fbbf24" />
  </g>
  <g transform="translate(966, 673)">
    <rect x="-8" y="-8" width="16" height="16" fill="url(#rubyGrad)" />
    <circle cx="0" cy="0" r="3" fill="#fbbf24" />
  </g>
</svg>`,
  },

  corporate: {
    id: 'corporate',
    name: 'Modern Corporate Blue',
    description: 'Clean contemporary tech/corporate award with geometric cobalt accents.',
    category: 'modern',
    textColor: '#0f172a',
    accentColor: '#1d4ed8',
    secondaryTextColor: '#64748b',
    badgeColor: '#2563eb',
    titleFont: 'Montserrat',
    nameFont: 'Playfair Display',
    bodyFont: 'Inter',
    svg: `<svg width="1000" height="707" viewBox="0 0 1000 707" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="blueBanner" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#1e3a8a" />
      <stop offset="100%" stop-color="#2563eb" />
    </linearGradient>
    <linearGradient id="cyanAccent" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#06b6d4" />
      <stop offset="100%" stop-color="#3b82f6" />
    </linearGradient>
  </defs>
  <rect width="1000" height="707" fill="#f8fafc" />

  <!-- Top Left Geometric Motif -->
  <polygon points="0,0 260,0 180,90 0,90" fill="url(#blueBanner)" />
  <polygon points="0,90 180,90 140,110 0,110" fill="url(#cyanAccent)" opacity="0.8" />
  
  <!-- Bottom Right Geometric Motif -->
  <polygon points="1000,707 740,707 820,617 1000,617" fill="url(#blueBanner)" />
  <polygon points="1000,617 820,617 860,597 1000,597" fill="url(#cyanAccent)" opacity="0.8" />

  <!-- Sleek Framing -->
  <rect x="25" y="25" width="950" height="657" fill="none" stroke="#e2e8f0" stroke-width="1.5" />
  <rect x="35" y="35" width="930" height="637" fill="none" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="8 6" />
</svg>`,
  },

  minimalist: {
    id: 'minimalist',
    name: 'Nordic Minimalist',
    description: 'Clean Scandinavian aesthetic with high elegance and generous whitespace.',
    category: 'modern',
    textColor: '#0f172a',
    accentColor: '#334155',
    secondaryTextColor: '#64748b',
    badgeColor: '#0f172a',
    titleFont: 'Cinzel',
    nameFont: 'Playfair Display',
    bodyFont: 'Inter',
    svg: `<svg width="1000" height="707" viewBox="0 0 1000 707" xmlns="http://www.w3.org/2000/svg">
  <rect width="1000" height="707" fill="#ffffff" />
  
  <!-- Fine Architecture Lines -->
  <rect x="24" y="24" width="952" height="659" fill="none" stroke="#0f172a" stroke-width="2" />
  <rect x="32" y="32" width="936" height="643" fill="none" stroke="#94a3b8" stroke-width="0.75" />

  <!-- Minimal Corner Notches -->
  <line x1="16" y1="24" x2="40" y2="24" stroke="#0f172a" stroke-width="4" />
  <line x1="24" y1="16" x2="24" y2="40" stroke="#0f172a" stroke-width="4" />

  <line x1="984" y1="24" x2="960" y2="24" stroke="#0f172a" stroke-width="4" />
  <line x1="976" y1="16" x2="976" y2="40" stroke="#0f172a" stroke-width="4" />

  <line x1="16" y1="683" x2="40" y2="683" stroke="#0f172a" stroke-width="4" />
  <line x1="24" y1="691" x2="24" y2="667" stroke="#0f172a" stroke-width="4" />

  <line x1="984" y1="683" x2="960" y2="683" stroke="#0f172a" stroke-width="4" />
  <line x1="976" y1="691" x2="976" y2="667" stroke="#0f172a" stroke-width="4" />

  <!-- Subtle Center Crosshair -->
  <circle cx="500" cy="50" r="2" fill="#0f172a" />
</svg>`,
  },

  vintage: {
    id: 'vintage',
    name: 'Vintage Parchment Diploma',
    description: 'Authentic parchment diploma look with antique flourish borders.',
    category: 'academic',
    textColor: '#292524',
    accentColor: '#78350f',
    secondaryTextColor: '#57534e',
    badgeColor: '#b45309',
    titleFont: 'Cinzel',
    nameFont: 'Pinyon Script',
    bodyFont: 'EB Garamond',
    svg: `<svg width="1000" height="707" viewBox="0 0 1000 707" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="parchmentBg" cx="50%" cy="50%" r="65%">
      <stop offset="0%" stop-color="#fffef7" />
      <stop offset="80%" stop-color="#fdf4e3" />
      <stop offset="100%" stop-color="#f5e6cc" />
    </radialGradient>
  </defs>
  <rect width="1000" height="707" fill="url(#parchmentBg)" />
  
  <!-- Classic Ornamental Frame -->
  <rect x="25" y="25" width="950" height="657" fill="none" stroke="#78350f" stroke-width="4" />
  <rect x="33" y="33" width="934" height="641" fill="none" stroke="#b45309" stroke-width="1.5" />
  <rect x="42" y="42" width="916" height="623" fill="none" stroke="#78350f" stroke-width="1" stroke-dasharray="5 3" />

  <!-- Ornate Corner Scrolls -->
  <g transform="translate(25, 25)">
    <path d="M0,0 C30,5 5,30 35,35 C15,35 0,20 0,0" fill="#78350f" />
  </g>
  <g transform="translate(975, 25) scale(-1, 1)">
    <path d="M0,0 C30,5 5,30 35,35 C15,35 0,20 0,0" fill="#78350f" />
  </g>
  <g transform="translate(25, 682) scale(1, -1)">
    <path d="M0,0 C30,5 5,30 35,35 C15,35 0,20 0,0" fill="#78350f" />
  </g>
  <g transform="translate(975, 682) scale(-1, -1)">
    <path d="M0,0 C30,5 5,30 35,35 C15,35 0,20 0,0" fill="#78350f" />
  </g>

  <!-- Central Watermark Crest -->
  <g transform="translate(500, 353)" opacity="0.04" stroke="#78350f" fill="none" stroke-width="2">
    <circle r="150" />
    <circle r="130" stroke-dasharray="10 5" />
    <path d="M -80,-80 L 80,80 M 80,-80 L -80,80" />
  </g>
</svg>`,
  },

  obsidian: {
    id: 'obsidian',
    name: 'Luxury Obsidian & Champagne',
    description: 'High-end dark luxury award with champagne gold accents and subtle geometry.',
    category: 'luxury',
    textColor: '#f1f5f9',
    accentColor: '#e2c275',
    secondaryTextColor: '#94a3b8',
    badgeColor: '#e2c275',
    titleFont: 'Cinzel',
    nameFont: 'Great Vibes',
    bodyFont: 'Montserrat',
    svg: `<svg width="1000" height="707" viewBox="0 0 1000 707" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="champagneGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ecd69a" />
      <stop offset="50%" stop-color="#caa257" />
      <stop offset="100%" stop-color="#f8e7ba" />
    </linearGradient>
  </defs>
  <rect width="1000" height="707" fill="#111216" />

  <!-- Dual Champagne Gold Borders -->
  <rect x="28" y="28" width="944" height="651" fill="none" stroke="url(#champagneGold)" stroke-width="3" />
  <rect x="36" y="36" width="928" height="635" fill="none" stroke="#334155" stroke-width="1" />
  <rect x="42" y="42" width="916" height="623" fill="none" stroke="url(#champagneGold)" stroke-width="0.75" stroke-dasharray="8 6" />

  <!-- Luxury Diamond Corner Accents -->
  <g transform="translate(28, 28)">
    <polygon points="0,-12 12,0 0,12 -12,0" fill="url(#champagneGold)" />
  </g>
  <g transform="translate(972, 28)">
    <polygon points="0,-12 12,0 0,12 -12,0" fill="url(#champagneGold)" />
  </g>
  <g transform="translate(28, 679)">
    <polygon points="0,-12 12,0 0,12 -12,0" fill="url(#champagneGold)" />
  </g>
  <g transform="translate(972, 679)">
    <polygon points="0,-12 12,0 0,12 -12,0" fill="url(#champagneGold)" />
  </g>
</svg>`,
  },

  artisan: {
    id: 'artisan',
    name: 'Modern Teal Award',
    description: 'Vibrant and modern with dynamic geometric corner ribbons and teal accents.',
    category: 'modern',
    textColor: '#134e4a',
    accentColor: '#0d9488',
    secondaryTextColor: '#475569',
    badgeColor: '#0d9488',
    titleFont: 'Montserrat',
    nameFont: 'Playfair Display',
    bodyFont: 'Inter',
    svg: `<svg width="1000" height="707" viewBox="0 0 1000 707" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="tealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f766e" />
      <stop offset="100%" stop-color="#14b8a6" />
    </linearGradient>
  </defs>
  <rect width="1000" height="707" fill="#f8fafc" />

  <!-- Diagonal Corner Ribbons -->
  <path d="M 0,0 L 220,0 L 0,220 Z" fill="url(#tealGrad)" opacity="0.15" />
  <path d="M 0,0 L 130,0 L 0,130 Z" fill="url(#tealGrad)" opacity="0.35" />
  <path d="M 1000,707 L 780,707 L 1000,487 Z" fill="url(#tealGrad)" opacity="0.15" />
  <path d="M 1000,707 L 870,707 L 1000,577 Z" fill="url(#tealGrad)" opacity="0.35" />

  <!-- Clean Precision Frame -->
  <rect x="26" y="26" width="948" height="655" fill="none" stroke="#cbd5e1" stroke-width="2" />
  <rect x="34" y="34" width="932" height="639" fill="none" stroke="#0d9488" stroke-width="1.5" />
</svg>`,
  },
};
