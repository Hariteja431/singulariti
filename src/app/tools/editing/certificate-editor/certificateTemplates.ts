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
    name: 'Classic Navy',
    description: 'Deep navy background with regal gold foil borders and corner filigree.',
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
    <linearGradient id="goldGradClassic" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f59e0b" />
      <stop offset="35%" stop-color="#fbbf24" />
      <stop offset="70%" stop-color="#d97706" />
      <stop offset="100%" stop-color="#fef08a" />
    </linearGradient>
    <radialGradient id="navyCenterGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#1e293b" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#090d16" stop-opacity="1"/>
    </radialGradient>
  </defs>
  <rect width="1000" height="707" fill="#090d16" />
  <rect width="1000" height="707" fill="url(#navyCenterGlow)" />
  
  <!-- Outer Gold Frame -->
  <rect x="24" y="24" width="952" height="659" fill="none" stroke="url(#goldGradClassic)" stroke-width="4" rx="2" />
  
  <!-- Inner Subtle Accent Border -->
  <rect x="34" y="34" width="932" height="639" fill="none" stroke="#f59e0b" stroke-width="1" stroke-opacity="0.5" />
  <rect x="40" y="40" width="920" height="627" fill="none" stroke="#94a3b8" stroke-width="0.75" stroke-dasharray="6 4" stroke-opacity="0.3" />

  <!-- Corner Filigree Ornaments -->
  <g transform="translate(24, 24)">
    <path d="M0,0 L40,0 C25,10 10,25 0,40 Z" fill="url(#goldGradClassic)" opacity="0.9" />
    <path d="M6,6 L32,6 C20,14 14,20 6,32 Z" fill="#090d16" />
    <circle cx="16" cy="16" r="3" fill="url(#goldGradClassic)" />
  </g>
  <g transform="translate(976, 24) scale(-1, 1)">
    <path d="M0,0 L40,0 C25,10 10,25 0,40 Z" fill="url(#goldGradClassic)" opacity="0.9" />
    <path d="M6,6 L32,6 C20,14 14,20 6,32 Z" fill="#090d16" />
    <circle cx="16" cy="16" r="3" fill="url(#goldGradClassic)" />
  </g>
  <g transform="translate(24, 683) scale(1, -1)">
    <path d="M0,0 L40,0 C25,10 10,25 0,40 Z" fill="url(#goldGradClassic)" opacity="0.9" />
    <path d="M6,6 L32,6 C20,14 14,20 6,32 Z" fill="#090d16" />
    <circle cx="16" cy="16" r="3" fill="url(#goldGradClassic)" />
  </g>
  <g transform="translate(976, 683) scale(-1, -1)">
    <path d="M0,0 L40,0 C25,10 10,25 0,40 Z" fill="url(#goldGradClassic)" opacity="0.9" />
    <path d="M6,6 L32,6 C20,14 14,20 6,32 Z" fill="#090d16" />
    <circle cx="16" cy="16" r="3" fill="url(#goldGradClassic)" />
  </g>

  <!-- Watermark Rosette in Center -->
  <g transform="translate(500, 353)" opacity="0.04">
    <circle r="180" fill="none" stroke="#f59e0b" stroke-width="2" />
    <circle r="140" fill="none" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="8 6" />
    <polygon points="0,-160 40,-40 160,0 40,40 0,160 -40,40 -160,0 -40,-40" fill="none" stroke="#f59e0b" stroke-width="2" />
  </g>
</svg>`,
  },

  modern: {
    id: 'modern',
    name: 'Modern Teal',
    description: 'Dynamic angular corner ribbons with vibrant teal and cyan accents on clean slate.',
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
    <linearGradient id="tealGradModern" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f766e" />
      <stop offset="100%" stop-color="#14b8a6" />
    </linearGradient>
  </defs>
  <rect width="1000" height="707" fill="#f8fafc" />

  <!-- Diagonal Corner Ribbons -->
  <path d="M 0,0 L 220,0 L 0,220 Z" fill="url(#tealGradModern)" opacity="0.18" />
  <path d="M 0,0 L 130,0 L 0,130 Z" fill="url(#tealGradModern)" opacity="0.45" />
  <path d="M 1000,707 L 780,707 L 1000,487 Z" fill="url(#tealGradModern)" opacity="0.18" />
  <path d="M 1000,707 L 870,707 L 1000,577 Z" fill="url(#tealGradModern)" opacity="0.45" />

  <!-- Clean Precision Frame -->
  <rect x="26" y="26" width="948" height="655" fill="none" stroke="#cbd5e1" stroke-width="2" />
  <rect x="34" y="34" width="932" height="639" fill="none" stroke="#0d9488" stroke-width="1.5" />
  <circle cx="500" cy="50" r="2.5" fill="#0d9488" />
</svg>`,
  },

  emerald: {
    id: 'emerald',
    name: 'Emerald',
    description: 'Executive deep emerald green with warm gold geometric framing and crest brackets.',
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
    <linearGradient id="emGradEmerald" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#064e3b" />
      <stop offset="100%" stop-color="#047857" />
    </linearGradient>
    <linearGradient id="emGoldEmerald" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#b45309" />
      <stop offset="50%" stop-color="#f59e0b" />
      <stop offset="100%" stop-color="#b45309" />
    </linearGradient>
  </defs>
  <rect width="1000" height="707" fill="#fbfcf8" />
  
  <!-- Outer Deep Emerald Frame -->
  <rect x="20" y="20" width="960" height="667" fill="none" stroke="url(#emGradEmerald)" stroke-width="6" />
  <rect x="32" y="32" width="936" height="643" fill="none" stroke="url(#emGoldEmerald)" stroke-width="2" />
  <rect x="38" y="38" width="924" height="631" fill="none" stroke="#cbd5e1" stroke-width="1" />

  <!-- Corner Brackets -->
  <path d="M 20,65 L 65,20 M 980,65 L 935,20 M 20,642 L 65,687 M 980,642 L 935,687" stroke="url(#emGoldEmerald)" stroke-width="2" />
  
  <!-- Corner Triangles -->
  <polygon points="20,20 50,20 20,50" fill="url(#emGradEmerald)" />
  <polygon points="980,20 950,20 980,50" fill="url(#emGradEmerald)" />
  <polygon points="20,687 50,687 20,657" fill="url(#emGradEmerald)" />
  <polygon points="980,687 950,687 980,657" fill="url(#emGradEmerald)" />

  <!-- Header Accent Line -->
  <line x1="250" y1="88" x2="750" y2="88" stroke="url(#emGoldEmerald)" stroke-width="1.5" stroke-dasharray="12 4" />
</svg>`,
  },

  minimalist: {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Clean Scandinavian aesthetic with high elegance and generous whitespace.',
    category: 'modern',
    textColor: '#0f172a',
    accentColor: '#1e293b',
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
  <circle cx="500" cy="50" r="2.5" fill="#0f172a" />
</svg>`,
  },

  ruby: {
    id: 'ruby',
    name: 'Prestige Crimson',
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
    name: 'Corporate Blue',
    description: 'Clean contemporary tech and business certification with sapphire accents.',
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

  <polygon points="0,0 260,0 180,90 0,90" fill="url(#blueBanner)" />
  <polygon points="0,90 180,90 140,110 0,110" fill="url(#cyanAccent)" opacity="0.8" />
  
  <polygon points="1000,707 740,707 820,617 1000,617" fill="url(#blueBanner)" />
  <polygon points="1000,617 820,617 860,597 1000,597" fill="url(#cyanAccent)" opacity="0.8" />

  <rect x="25" y="25" width="950" height="657" fill="none" stroke="#e2e8f0" stroke-width="1.5" />
  <rect x="35" y="35" width="930" height="637" fill="none" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="8 6" />
</svg>`,
  },

  vintage: {
    id: 'vintage',
    name: 'Vintage Parchment',
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
  
  <rect x="25" y="25" width="950" height="657" fill="none" stroke="#78350f" stroke-width="4" />
  <rect x="33" y="33" width="934" height="641" fill="none" stroke="#b45309" stroke-width="1.5" />
  <rect x="42" y="42" width="916" height="623" fill="none" stroke="#78350f" stroke-width="1" stroke-dasharray="5 3" />

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

  <g transform="translate(500, 353)" opacity="0.04" stroke="#78350f" fill="none" stroke-width="2">
    <circle r="150" />
    <circle r="130" stroke-dasharray="10 5" />
    <path d="M -80,-80 L 80,80 M 80,-80 L -80,80" />
  </g>
</svg>`,
  },

  obsidian: {
    id: 'obsidian',
    name: 'Luxury Obsidian',
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

  <rect x="28" y="28" width="944" height="651" fill="none" stroke="url(#champagneGold)" stroke-width="3" />
  <rect x="36" y="36" width="928" height="635" fill="none" stroke="#334155" stroke-width="1" />
  <rect x="42" y="42" width="916" height="623" fill="none" stroke="url(#champagneGold)" stroke-width="0.75" stroke-dasharray="8 6" />

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

  'ivory-gold': {
    id: 'ivory-gold',
    name: 'Royal Ivory & Gold',
    description: 'Warm regal ivory parchment with intricate double gold guilloche borders and filigree crests.',
    category: 'luxury',
    textColor: '#1e293b',
    accentColor: '#b45309',
    secondaryTextColor: '#475569',
    badgeColor: '#d97706',
    titleFont: 'Cinzel',
    nameFont: 'Great Vibes',
    bodyFont: 'EB Garamond',
    svg: `<svg width="1000" height="707" viewBox="0 0 1000 707" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="ivoryGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#b45309" />
      <stop offset="35%" stop-color="#f59e0b" />
      <stop offset="70%" stop-color="#fbbf24" />
      <stop offset="100%" stop-color="#92400e" />
    </linearGradient>
    <radialGradient id="ivoryGlow" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="85%" stop-color="#fdfbf7" />
      <stop offset="100%" stop-color="#fef7ea" />
    </radialGradient>
  </defs>
  <rect width="1000" height="707" fill="url(#ivoryGlow)" />
  <rect x="24" y="24" width="952" height="659" fill="none" stroke="url(#ivoryGold)" stroke-width="5" />
  <rect x="34" y="34" width="932" height="639" fill="none" stroke="#b45309" stroke-width="1.5" stroke-dasharray="6 3" />
  <rect x="42" y="42" width="916" height="623" fill="none" stroke="url(#ivoryGold)" stroke-width="0.75" />
  <!-- Corner Ornaments -->
  <g transform="translate(24,24)"><path d="M0,0 L50,0 C30,15 15,30 0,50 Z" fill="url(#ivoryGold)" opacity="0.95"/><circle cx="20" cy="20" r="4" fill="#ffffff"/></g>
  <g transform="translate(976,24) scale(-1,1)"><path d="M0,0 L50,0 C30,15 15,30 0,50 Z" fill="url(#ivoryGold)" opacity="0.95"/><circle cx="20" cy="20" r="4" fill="#ffffff"/></g>
  <g transform="translate(24,683) scale(1,-1)"><path d="M0,0 L50,0 C30,15 15,30 0,50 Z" fill="url(#ivoryGold)" opacity="0.95"/><circle cx="20" cy="20" r="4" fill="#ffffff"/></g>
  <g transform="translate(976,683) scale(-1,-1)"><path d="M0,0 L50,0 C30,15 15,30 0,50 Z" fill="url(#ivoryGold)" opacity="0.95"/><circle cx="20" cy="20" r="4" fill="#ffffff"/></g>
  <g transform="translate(500,353)" opacity="0.04" stroke="#b45309" fill="none" stroke-width="2">
    <circle r="160" /><circle r="140" stroke-dasharray="8 6" /><circle r="120" />
  </g>
</svg>`,
  },

  'cyber-neon': {
    id: 'cyber-neon',
    name: 'Cyberpunk & Tech Neon',
    description: 'Futuristic midnight dark layout with glowing neon cyan circuitry and electric violet badges.',
    category: 'modern',
    textColor: '#e2e8f0',
    accentColor: '#06b6d4',
    secondaryTextColor: '#94a3b8',
    badgeColor: '#06b6d4',
    titleFont: 'Montserrat',
    nameFont: 'Playfair Display',
    bodyFont: 'Inter',
    svg: `<svg width="1000" height="707" viewBox="0 0 1000 707" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="cyberCyan" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#06b6d4" />
      <stop offset="100%" stop-color="#3b82f6" />
    </linearGradient>
    <linearGradient id="cyberViolet" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#a855f7" />
      <stop offset="100%" stop-color="#ec4899" />
    </linearGradient>
  </defs>
  <rect width="1000" height="707" fill="#090d16" />
  <rect x="20" y="20" width="960" height="667" fill="none" stroke="url(#cyberCyan)" stroke-width="2" />
  <rect x="28" y="28" width="944" height="651" fill="none" stroke="#1e293b" stroke-width="1" />
  <!-- Circuit Nodes in Corners -->
  <path d="M20,60 L60,20 L120,20" fill="none" stroke="url(#cyberViolet)" stroke-width="2" />
  <circle cx="120" cy="20" r="4" fill="#a855f7" />
  <path d="M980,60 L940,20 L880,20" fill="none" stroke="url(#cyberViolet)" stroke-width="2" />
  <circle cx="880" cy="20" r="4" fill="#a855f7" />
  <path d="M20,647 L60,687 L120,687" fill="none" stroke="url(#cyberCyan)" stroke-width="2" />
  <circle cx="120" cy="687" r="4" fill="#06b6d4" />
  <path d="M980,647 L940,687 L880,687" fill="none" stroke="url(#cyberCyan)" stroke-width="2" />
  <circle cx="880" cy="687" r="4" fill="#06b6d4" />
  <line x1="20" y1="20" x2="35" y2="20" stroke="#06b6d4" stroke-width="6" />
  <line x1="20" y1="20" x2="20" y2="35" stroke="#06b6d4" stroke-width="6" />
</svg>`,
  },

  'botanical-sage': {
    id: 'botanical-sage',
    name: 'Botanical Sage Green',
    description: 'Soft organic sage green with elegant leaf garland borders and bronze metallic accents.',
    category: 'academic',
    textColor: '#1f2937',
    accentColor: '#166534',
    secondaryTextColor: '#4b5563',
    badgeColor: '#15803d',
    titleFont: 'Playfair Display',
    nameFont: 'Great Vibes',
    bodyFont: 'EB Garamond',
    svg: `<svg width="1000" height="707" viewBox="0 0 1000 707" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="sageGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#14532d" />
      <stop offset="100%" stop-color="#166534" />
    </linearGradient>
    <linearGradient id="bronzeLeaf" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ca8a04" />
      <stop offset="100%" stop-color="#a16207" />
    </linearGradient>
  </defs>
  <rect width="1000" height="707" fill="#f4f7f4" />
  <rect x="22" y="22" width="956" height="663" fill="none" stroke="url(#sageGrad)" stroke-width="4" rx="4" />
  <rect x="30" y="30" width="940" height="647" fill="none" stroke="url(#bronzeLeaf)" stroke-width="1.5" rx="2" />
  <rect x="36" y="36" width="928" height="635" fill="none" stroke="#86efac" stroke-width="0.75" stroke-dasharray="6 4" />
  <!-- Corner Laurel Wreaths -->
  <g transform="translate(45,45)"><circle cx="0" cy="0" r="8" fill="url(#sageGrad)"/><circle cx="0" cy="0" r="4" fill="#f4f7f4"/></g>
  <g transform="translate(955,45)"><circle cx="0" cy="0" r="8" fill="url(#sageGrad)"/><circle cx="0" cy="0" r="4" fill="#f4f7f4"/></g>
  <g transform="translate(45,662)"><circle cx="0" cy="0" r="8" fill="url(#sageGrad)"/><circle cx="0" cy="0" r="4" fill="#f4f7f4"/></g>
  <g transform="translate(955,662)"><circle cx="0" cy="0" r="8" fill="url(#sageGrad)"/><circle cx="0" cy="0" r="4" fill="#f4f7f4"/></g>
</svg>`,
  },

  'burgundy-prestige': {
    id: 'burgundy-prestige',
    name: 'Imperial Burgundy & Gold',
    description: 'Majestic deep wine burgundy with ornamental baroque corner crests and radiant gold foil framing.',
    category: 'luxury',
    textColor: '#f8fafc',
    accentColor: '#fbbf24',
    secondaryTextColor: '#cbd5e1',
    badgeColor: '#fbbf24',
    titleFont: 'Cinzel',
    nameFont: 'Pinyon Script',
    bodyFont: 'EB Garamond',
    svg: `<svg width="1000" height="707" viewBox="0 0 1000 707" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="burgundyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4a0418" />
      <stop offset="50%" stop-color="#2a020d" />
      <stop offset="100%" stop-color="#190108" />
    </linearGradient>
    <linearGradient id="radiantGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fde047" />
      <stop offset="50%" stop-color="#eab308" />
      <stop offset="100%" stop-color="#a16207" />
    </linearGradient>
  </defs>
  <rect width="1000" height="707" fill="url(#burgundyGrad)" />
  <rect x="22" y="22" width="956" height="663" fill="none" stroke="url(#radiantGold)" stroke-width="5" />
  <rect x="32" y="32" width="936" height="643" fill="none" stroke="#eab308" stroke-width="1.5" stroke-opacity="0.6" />
  <rect x="38" y="38" width="924" height="631" fill="none" stroke="url(#radiantGold)" stroke-width="0.75" stroke-dasharray="8 4" />
  <g transform="translate(22,22)"><polygon points="0,0 45,0 0,45" fill="url(#radiantGold)"/></g>
  <g transform="translate(978,22)"><polygon points="0,0 -45,0 0,45" fill="url(#radiantGold)"/></g>
  <g transform="translate(22,685)"><polygon points="0,0 45,0 0,-45" fill="url(#radiantGold)"/></g>
  <g transform="translate(978,685)"><polygon points="0,0 -45,0 0,-45" fill="url(#radiantGold)"/></g>
</svg>`,
  },

  'art-deco': {
    id: 'art-deco',
    name: 'Art Deco 1920s Gatsby',
    description: 'Geometric luxury Art Deco gold lattice patterns, chevron corners, and gilded symmetry.',
    category: 'luxury',
    textColor: '#f1f5f9',
    accentColor: '#eab308',
    secondaryTextColor: '#94a3b8',
    badgeColor: '#eab308',
    titleFont: 'Cinzel',
    nameFont: 'Great Vibes',
    bodyFont: 'Montserrat',
    svg: `<svg width="1000" height="707" viewBox="0 0 1000 707" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="decoGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a" />
      <stop offset="50%" stop-color="#eab308" />
      <stop offset="100%" stop-color="#854d0e" />
    </linearGradient>
  </defs>
  <rect width="1000" height="707" fill="#111827" />
  <rect x="25" y="25" width="950" height="657" fill="none" stroke="url(#decoGold)" stroke-width="3" />
  <rect x="33" y="33" width="934" height="641" fill="none" stroke="#475569" stroke-width="1" />
  <g stroke="url(#decoGold)" stroke-width="2" fill="none">
    <path d="M25,65 L65,25 M25,95 L95,25 M25,125 L125,25" />
    <path d="M975,65 L935,25 M975,95 L905,25 M975,125 L875,25" />
    <path d="M25,642 L65,682 M25,612 L95,682 M25,582 L125,682" />
    <path d="M975,642 L935,682 M975,612 L905,682 M975,582 L875,682" />
  </g>
</svg>`,
  },

  'corporate-slate': {
    id: 'corporate-slate',
    name: 'Executive Platinum & Slate',
    description: 'Crisp modern executive slate with brushed platinum geometric framing and sharp corporate blue pinstripes.',
    category: 'modern',
    textColor: '#1e293b',
    accentColor: '#0284c7',
    secondaryTextColor: '#64748b',
    badgeColor: '#0284c7',
    titleFont: 'Montserrat',
    nameFont: 'Playfair Display',
    bodyFont: 'Inter',
    svg: `<svg width="1000" height="707" viewBox="0 0 1000 707" xmlns="http://www.w3.org/2000/svg">
  <rect width="1000" height="707" fill="#ffffff" />
  <rect x="20" y="20" width="960" height="667" fill="none" stroke="#0284c7" stroke-width="5" />
  <rect x="28" y="28" width="944" height="651" fill="none" stroke="#cbd5e1" stroke-width="2" />
  <rect x="34" y="34" width="932" height="639" fill="none" stroke="#0284c7" stroke-width="1" stroke-dasharray="10 5" />
  <polygon points="20,20 80,20 20,80" fill="#0284c7" />
  <polygon points="980,20 920,20 980,80" fill="#0284c7" />
  <polygon points="20,687 80,687 20,627" fill="#0284c7" />
  <polygon points="980,687 920,687 980,627" fill="#0284c7" />
</svg>`,
  },

  'championship-gold': {
    id: 'championship-gold',
    name: 'Athletic Championship Crimson',
    description: 'Bold crimson and championship gold with dynamic diagonal laurels and athletic starburst rosettes.',
    category: 'classic',
    textColor: '#f8fafc',
    accentColor: '#f59e0b',
    secondaryTextColor: '#cbd5e1',
    badgeColor: '#f59e0b',
    titleFont: 'Montserrat',
    nameFont: 'Great Vibes',
    bodyFont: 'Inter',
    svg: `<svg width="1000" height="707" viewBox="0 0 1000 707" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="champGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fbbf24" />
      <stop offset="100%" stop-color="#d97706" />
    </linearGradient>
  </defs>
  <rect width="1000" height="707" fill="#1c0d12" />
  <rect x="24" y="24" width="952" height="659" fill="none" stroke="url(#champGold)" stroke-width="6" />
  <rect x="34" y="34" width="932" height="639" fill="none" stroke="#ef4444" stroke-width="2" />
  <rect x="40" y="40" width="920" height="627" fill="none" stroke="url(#champGold)" stroke-width="0.75" stroke-dasharray="5 5" />
  <polygon points="24,24 90,24 24,90" fill="url(#champGold)" />
  <polygon points="976,24 910,24 976,90" fill="url(#champGold)" />
  <polygon points="24,683 90,683 24,617" fill="url(#champGold)" />
  <polygon points="976,683 910,683 976,617" fill="url(#champGold)" />
</svg>`,
  },

  'sapphire-cloud': {
    id: 'sapphire-cloud',
    name: 'Midnight Sapphire & Silver',
    description: 'Deep oceanic sapphire gradient with frosted silver filigree corners and starlight watermarks.',
    category: 'academic',
    textColor: '#f1f5f9',
    accentColor: '#38bdf8',
    secondaryTextColor: '#cbd5e1',
    badgeColor: '#38bdf8',
    titleFont: 'Cinzel',
    nameFont: 'Alex Brush',
    bodyFont: 'Inter',
    svg: `<svg width="1000" height="707" viewBox="0 0 1000 707" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="sapphireGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0b192c" />
      <stop offset="100%" stop-color="#1e3a8a" />
    </linearGradient>
  </defs>
  <rect width="1000" height="707" fill="url(#sapphireGrad)" />
  <rect x="24" y="24" width="952" height="659" fill="none" stroke="#e2e8f0" stroke-width="4" />
  <rect x="32" y="32" width="936" height="643" fill="none" stroke="#38bdf8" stroke-width="1.5" />
  <rect x="38" y="38" width="924" height="631" fill="none" stroke="#64748b" stroke-width="0.75" stroke-dasharray="8 4" />
  <g transform="translate(24,24)"><circle cx="15" cy="15" r="5" fill="#38bdf8"/></g>
  <g transform="translate(976,24)"><circle cx="-15" cy="15" r="5" fill="#38bdf8"/></g>
  <g transform="translate(24,683)"><circle cx="15" cy="-15" r="5" fill="#38bdf8"/></g>
  <g transform="translate(976,683)"><circle cx="-15" cy="-15" r="5" fill="#38bdf8"/></g>
</svg>`,
  },

  'kinder-stars': {
    id: 'kinder-stars',
    name: 'Playful Primary & Golden Star',
    description: 'Joyful sunny pastel background with colorful playful confetti borders, ribbon swags, and golden star crests.',
    category: 'academic',
    textColor: '#1e293b',
    accentColor: '#2563eb',
    secondaryTextColor: '#475569',
    badgeColor: '#f59e0b',
    titleFont: 'Montserrat',
    nameFont: 'Playfair Display',
    bodyFont: 'Inter',
    svg: `<svg width="1000" height="707" viewBox="0 0 1000 707" xmlns="http://www.w3.org/2000/svg">
  <rect width="1000" height="707" fill="#fffbeb" />
  <rect x="24" y="24" width="952" height="659" fill="none" stroke="#2563eb" stroke-width="6" rx="16" />
  <rect x="34" y="34" width="932" height="639" fill="none" stroke="#f59e0b" stroke-width="3" rx="12" />
  <rect x="42" y="42" width="916" height="623" fill="none" stroke="#ec4899" stroke-width="2" stroke-dasharray="8 6" rx="8" />
  <!-- Stars in Corners -->
  <polygon points="50,30 55,42 67,42 57,50 61,62 50,54 39,62 43,50 33,42 45,42" fill="#f59e0b" />
  <polygon points="950,30 955,42 967,42 957,50 961,62 950,54 939,62 943,50 933,42 945,42" fill="#f59e0b" />
  <polygon points="50,650 55,662 67,662 57,670 61,682 50,674 39,682 43,670 33,662 45,662" fill="#f59e0b" />
  <polygon points="950,650 955,662 967,662 957,670 961,682 950,674 939,682 943,670 933,662 945,662" fill="#f59e0b" />
</svg>`,
  },

  'swiss-bauhaus': {
    id: 'swiss-bauhaus',
    name: 'Swiss Bauhaus Modernist',
    description: 'Iconic Swiss modernist typography, asymmetric primary color accent bars, and pure editorial precision.',
    category: 'modern',
    textColor: '#18181b',
    accentColor: '#dc2626',
    secondaryTextColor: '#52525b',
    badgeColor: '#dc2626',
    titleFont: 'Montserrat',
    nameFont: 'Playfair Display',
    bodyFont: 'Inter',
    svg: `<svg width="1000" height="707" viewBox="0 0 1000 707" xmlns="http://www.w3.org/2000/svg">
  <rect width="1000" height="707" fill="#fafaf9" />
  <!-- Asymmetric Bauhaus Color Blocks -->
  <rect x="0" y="0" width="16" height="707" fill="#dc2626" />
  <rect x="16" y="0" width="8" height="707" fill="#1d4ed8" />
  <rect x="24" y="0" width="6" height="707" fill="#f59e0b" />
  <line x1="60" y1="50" x2="940" y2="50" stroke="#18181b" stroke-width="4" />
  <line x1="60" y1="58" x2="940" y2="58" stroke="#18181b" stroke-width="1" />
  <line x1="60" y1="657" x2="940" y2="657" stroke="#18181b" stroke-width="2" />
  <circle cx="930" cy="54" r="8" fill="#dc2626" />
</svg>`,
  },
};
