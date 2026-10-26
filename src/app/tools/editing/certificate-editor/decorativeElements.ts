export interface BadgeElement {
  id: string;
  name: string;
  category: 'seal' | 'ribbon' | 'medal' | 'divider';
  svg: string;
  defaultWidth: number;
  defaultHeight: number;
}

export const DECORATIVE_ELEMENTS: BadgeElement[] = [
  {
    id: 'gold-seal-rosette',
    name: 'Official Gold Rosette Seal',
    category: 'seal',
    defaultWidth: 120,
    defaultHeight: 120,
    svg: `<svg viewBox="0 0 200 200" width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="goldSeal" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f59e0b" />
      <stop offset="30%" stop-color="#fef08a" />
      <stop offset="70%" stop-color="#d97706" />
      <stop offset="100%" stop-color="#b45309" />
    </linearGradient>
  </defs>
  <path d="M 100 10 L 117 32 L 145 23 L 152 51 L 180 55 L 173 82 L 195 99 L 175 119 L 186 146 L 159 155 L 156 183 L 129 178 L 114 201 L 91 184 L 71 199 L 60 174 L 33 176 L 33 148 L 9 136 L 23 111 L 5 90 L 29 76 L 25 48 L 53 47 L 63 21 L 89 33 Z" fill="url(#goldSeal)" stroke="#92400e" stroke-width="2" />
  <circle cx="100" cy="100" r="65" fill="#fef3c7" stroke="#b45309" stroke-width="3" />
  <circle cx="100" cy="100" r="58" fill="none" stroke="#b45309" stroke-width="1.5" stroke-dasharray="4 3" />
  <polygon points="100,68 109,87 130,90 114,104 118,125 100,115 82,125 86,104 70,90 91,87" fill="url(#goldSeal)" stroke="#92400e" stroke-width="1" />
</svg>`,
  },
  {
    id: 'seal-with-ribbon',
    name: 'Award Seal with Hanging Ribbon',
    category: 'ribbon',
    defaultWidth: 120,
    defaultHeight: 160,
    svg: `<svg viewBox="0 0 200 270" width="200" height="270" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="ribbonRed" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#991b1b" />
      <stop offset="50%" stop-color="#dc2626" />
      <stop offset="100%" stop-color="#7f1d1d" />
    </linearGradient>
    <linearGradient id="sealGold2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f59e0b" />
      <stop offset="50%" stop-color="#fef08a" />
      <stop offset="100%" stop-color="#d97706" />
    </linearGradient>
  </defs>
  <polygon points="65,140 40,260 75,235 95,260 85,140" fill="url(#ribbonRed)" stroke="#7f1d1d" stroke-width="1.5" />
  <polygon points="115,140 105,260 125,235 160,260 135,140" fill="url(#ribbonRed)" stroke="#7f1d1d" stroke-width="1.5" />
  <circle cx="100" cy="100" r="75" fill="url(#sealGold2)" stroke="#92400e" stroke-width="3" />
  <circle cx="100" cy="100" r="62" fill="#7f1d1d" stroke="#fef08a" stroke-width="2" />
  <circle cx="100" cy="100" r="54" fill="none" stroke="#fef08a" stroke-width="1" stroke-dasharray="3 3" />
  <polygon points="100,75 107,90 123,92 111,104 114,120 100,112 86,120 89,104 77,92 93,90" fill="url(#sealGold2)" />
</svg>`,
  },
  {
    id: 'laurel-wreath',
    name: 'Excellence Laurel Wreath',
    category: 'medal',
    defaultWidth: 140,
    defaultHeight: 140,
    svg: `<svg viewBox="0 0 200 200" width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="laurelGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#d97706" />
      <stop offset="50%" stop-color="#fbbf24" />
      <stop offset="100%" stop-color="#b45309" />
    </linearGradient>
  </defs>
  <g fill="url(#laurelGold)" stroke="#92400e" stroke-width="0.75">
    <path d="M40,150 C30,120 40,70 90,40 C80,60 70,100 80,140 Z" fill="none" stroke="url(#laurelGold)" stroke-width="3" />
    <ellipse cx="45" cy="135" rx="14" ry="7" transform="rotate(-30, 45, 135)" />
    <ellipse cx="40" cy="110" rx="14" ry="7" transform="rotate(-15, 40, 110)" />
    <ellipse cx="44" cy="85" rx="14" ry="7" transform="rotate(5, 44, 85)" />
    <ellipse cx="58" cy="63" rx="14" ry="7" transform="rotate(25, 58, 63)" />
    <ellipse cx="78" cy="48" rx="14" ry="7" transform="rotate(45, 78, 48)" />

    <path d="M160,150 C170,120 160,70 110,40 C120,60 130,100 120,140 Z" fill="none" stroke="url(#laurelGold)" stroke-width="3" />
    <ellipse cx="155" cy="135" rx="14" ry="7" transform="rotate(30, 155, 135)" />
    <ellipse cx="160" cy="110" rx="14" ry="7" transform="rotate(15, 160, 110)" />
    <ellipse cx="156" cy="85" rx="14" ry="7" transform="rotate(-5, 156, 85)" />
    <ellipse cx="142" cy="63" rx="14" ry="7" transform="rotate(-25, 142, 63)" />
    <ellipse cx="122" cy="48" rx="14" ry="7" transform="rotate(-45, 122, 48)" />

    <circle cx="100" cy="155" r="7" />
    <path d="M93,155 L75,185 L90,180 L100,195 L110,180 L125,185 L107,155 Z" />
  </g>
</svg>`,
  },
  {
    id: 'verified-stamp',
    name: 'Authentic Verified Stamp',
    category: 'seal',
    defaultWidth: 120,
    defaultHeight: 120,
    svg: `<svg viewBox="0 0 200 200" width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="verifiedGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0284c7" />
      <stop offset="100%" stop-color="#0369a1" />
    </linearGradient>
  </defs>
  <circle cx="100" cy="100" r="85" fill="none" stroke="#0284c7" stroke-width="4" stroke-dasharray="10 4" />
  <circle cx="100" cy="100" r="75" fill="#f0f9ff" stroke="#0284c7" stroke-width="2" />
  <circle cx="100" cy="100" r="68" fill="none" stroke="#0284c7" stroke-width="1" />
  <path d="M70,102 L90,122 L132,78" fill="none" stroke="#0284c7" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" />
  <text x="100" y="152" font-family="Montserrat, sans-serif" font-size="11" font-weight="bold" fill="#0369a1" text-anchor="middle" letter-spacing="3">VERIFIED</text>
</svg>`,
  },
  {
    id: 'wax-crest',
    name: 'Crimson Wax Seal',
    category: 'seal',
    defaultWidth: 110,
    defaultHeight: 110,
    svg: `<svg viewBox="0 0 200 200" width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="waxRed" cx="45%" cy="45%" r="55%">
      <stop offset="0%" stop-color="#dc2626" />
      <stop offset="70%" stop-color="#991b1b" />
      <stop offset="100%" stop-color="#7f1d1d" />
    </radialGradient>
  </defs>
  <path d="M 100 15 C 120 12 140 28 155 35 C 172 45 185 65 188 85 C 190 108 178 132 168 150 C 152 172 130 188 105 186 C 80 184 62 170 45 155 C 28 138 12 118 15 95 C 18 72 32 50 48 35 C 65 20 80 17 100 15 Z" fill="url(#waxRed)" />
  <circle cx="100" cy="100" r="55" fill="#7f1d1d" stroke="#fca5a5" stroke-width="2" opacity="0.8" />
  <polygon points="100,72 108,88 126,90 112,102 116,120 100,110 84,120 88,102 74,90 92,88" fill="#fca5a5" opacity="0.9" />
</svg>`,
  },
  {
    id: 'ornate-divider',
    name: 'Ornate Flourish Divider',
    category: 'divider',
    defaultWidth: 400,
    defaultHeight: 30,
    svg: `<svg viewBox="0 0 400 30" width="400" height="30" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="divGold" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#b45309" stop-opacity="0" />
      <stop offset="25%" stop-color="#f59e0b" stop-opacity="0.8" />
      <stop offset="50%" stop-color="#fbbf24" stop-opacity="1" />
      <stop offset="75%" stop-color="#f59e0b" stop-opacity="0.8" />
      <stop offset="100%" stop-color="#b45309" stop-opacity="0" />
    </linearGradient>
  </defs>
  <line x1="20" y1="15" x2="180" y2="15" stroke="url(#divGold)" stroke-width="2" />
  <line x1="220" y1="15" x2="380" y2="15" stroke="url(#divGold)" stroke-width="2" />
  <polygon points="200,6 208,15 200,24 192,15" fill="#f59e0b" stroke="#b45309" stroke-width="1" />
  <circle cx="186" cy="15" r="3" fill="#f59e0b" />
  <circle cx="214" cy="15" r="3" fill="#f59e0b" />
</svg>`,
  },
];
