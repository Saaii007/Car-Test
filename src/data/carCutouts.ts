// Studio Cutout Generator & Asset Map for Indian Car Models
// Provides background-less, high-detail studio renderings of cars

export interface CarColorOption {
  name: string;
  hex: string;
  secondaryHex: string;
}

export const POPULAR_CAR_COLORS: CarColorOption[] = [
  { name: 'Fire Red', hex: '#dc2626', secondaryHex: '#991b1b' },
  { name: 'Pearl White', hex: '#f8fafc', secondaryHex: '#cbd5e1' },
  { name: 'Midnight Black', hex: '#1e293b', secondaryHex: '#0f172a' },
  { name: 'Nexa / Royal Blue', hex: '#1d4ed8', secondaryHex: '#1e3a8a' },
  { name: 'Daytona Grey', hex: '#64748b', secondaryHex: '#334155' },
  { name: 'Deep Forest', hex: '#15803d', secondaryHex: '#14532d' },
];

export interface CarStudioCutout {
  make: string;
  model: string;
  defaultColor: CarColorOption;
  renderSvg: (primaryColor: string, secondaryColor: string, isLightBg?: boolean) => string;
}

// Helper to generate a realistic background-less Swift cutout
function renderSwiftSvg(c1: string, c2: string): string {
  return `<svg viewBox="0 0 540 260" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-auto drop-shadow-xl">
    <defs>
      <linearGradient id="swiftPaint" x1="80" y1="70" x2="460" y2="200" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="${c1}" />
        <stop offset="60%" stop-color="${c2}" />
        <stop offset="100%" stop-color="${c2}" stop-opacity="0.9" />
      </linearGradient>
      <linearGradient id="swiftGloss" x1="120" y1="80" x2="380" y2="120" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.45" />
        <stop offset="40%" stop-color="#ffffff" stop-opacity="0.1" />
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
      </linearGradient>
      <linearGradient id="glassGrad" x1="180" y1="70" x2="360" y2="140" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.35" />
        <stop offset="70%" stop-color="#0f172a" stop-opacity="0.85" />
        <stop offset="100%" stop-color="#020617" stop-opacity="0.95" />
      </linearGradient>
      <linearGradient id="wheelTire" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#1e293b" />
        <stop offset="100%" stop-color="#090d16" />
      </linearGradient>
      <radialGradient id="alloyRim" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#f8fafc" />
        <stop offset="60%" stop-color="#94a3b8" />
        <stop offset="100%" stop-color="#334155" />
      </radialGradient>
      <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="4" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    <!-- Studio Floor Reflection / Contact Shadow (Transparent Background) -->
    <ellipse cx="270" cy="228" rx="210" ry="14" fill="#000000" fill-opacity="0.28" filter="blur(7px)" />
    <ellipse cx="145" cy="228" rx="48" ry="8" fill="#000000" fill-opacity="0.42" filter="blur(3px)" />
    <ellipse cx="395" cy="228" rx="48" ry="8" fill="#000000" fill-opacity="0.42" filter="blur(3px)" />

    <!-- Swift Main Body Silhouette -->
    <path d="M72 178 C70 156 82 142 108 138 L148 134 L204 84 C218 72 242 68 285 68 L360 68 C382 68 398 76 414 98 L438 132 C456 136 468 148 468 172 L464 186 C460 196 446 200 428 200 L372 200 C364 180 344 166 322 166 C298 166 278 180 272 200 L212 200 C206 180 186 166 162 166 C138 166 118 180 112 200 L84 200 C74 196 72 188 72 178 Z" fill="url(#swiftPaint)" stroke="#0f172a" stroke-width="1.5" />

    <!-- Gloss highlight sweep -->
    <path d="M152 134 L206 88 C218 78 238 72 280 72 L356 72 C376 72 388 80 404 100 L426 132 L152 134 Z" fill="url(#swiftGloss)" />

    <!-- Floating Roof A/B/C Pillars & Windshields -->
    <path d="M208 86 L156 132 H265 V80 H220 Z" fill="url(#glassGrad)" stroke="#1e293b" stroke-width="1.5" />
    <path d="M275 80 V132 H358 V80 Z" fill="url(#glassGrad)" stroke="#1e293b" stroke-width="1.5" />
    <path d="M368 80 V132 H426 L404 98 C394 86 384 80 368 80 Z" fill="url(#glassGrad)" stroke="#1e293b" stroke-width="1.5" />

    <!-- A-pillar black out & floating roof accent -->
    <path d="M200 86 L154 132 L146 132 L194 84 Z" fill="#090d16" />
    <path d="M266 80 H274 V132 H266 Z" fill="#090d16" />
    <path d="M359 80 H367 V132 H359 Z" fill="#090d16" />

    <!-- Swift Headlight: Swept-back LED projector -->
    <path d="M434 134 L464 148 C468 154 466 164 456 168 L432 152 Z" fill="#e0f2fe" stroke="#38bdf8" stroke-width="1.5" />
    <circle cx="448" cy="154" r="5" fill="#38bdf8" filter="url(#softGlow)" />
    <circle cx="448" cy="154" r="2.5" fill="#ffffff" />

    <!-- Honeycomb Front Grille & Fog Housing -->
    <path d="M446 168 L464 172 C464 182 458 190 448 192 L436 188 Z" fill="#0f172a" />
    <circle cx="446" cy="184" r="3.5" fill="#f8fafc" />

    <!-- Swift Character Crease Line -->
    <path d="M106 142 Q 270 148 432 144" stroke="#ffffff" stroke-opacity="0.4" stroke-width="2" fill="none" />
    <path d="M112 184 Q 270 188 428 184" stroke="#000000" stroke-opacity="0.3" stroke-width="2" fill="none" />

    <!-- Chrome Door Handles -->
    <rect x="230" y="140" width="16" height="4" rx="2" fill="#e2e8f0" stroke="#475569" stroke-width="0.8" />
    <!-- Rear C-Pillar Integrated Door Handle (Swift signature design) -->
    <path d="M374 94 H390 V106 H374 Z" fill="#090d16" rx="2" />

    <!-- Side Wing Mirror -->
    <path d="M246 116 C236 116 232 124 240 128 L254 128 C260 126 260 118 254 116 Z" fill="url(#swiftPaint)" stroke="#090d16" stroke-width="1" />

    <!-- Front Wheel Assembly -->
    <g transform="translate(395, 198)">
      <circle cx="0" cy="0" r="34" fill="url(#wheelTire)" stroke="#020617" stroke-width="2" />
      <circle cx="0" cy="0" r="22" fill="url(#alloyRim)" />
      <!-- Precision Dual-tone Alloy Spokes -->
      <line x1="-18" y1="0" x2="18" y2="0" stroke="#0f172a" stroke-width="4" stroke-linecap="round" />
      <line x1="0" y1="-18" x2="0" y2="18" stroke="#0f172a" stroke-width="4" stroke-linecap="round" />
      <line x1="-13" y1="-13" x2="13" y2="13" stroke="#0f172a" stroke-width="4" stroke-linecap="round" />
      <line x1="-13" y1="13" x2="13" y2="-13" stroke="#0f172a" stroke-width="4" stroke-linecap="round" />
      <circle cx="0" cy="0" r="7" fill="#f8fafc" stroke="#334155" stroke-width="1" />
      <circle cx="0" cy="0" r="3" fill="#dc2626" />
      <!-- Disc Brake Caliper -->
      <path d="M-10 -14 A 18 18 0 0 1 10 -14" stroke="#e11d48" stroke-width="5" fill="none" />
    </g>

    <!-- Rear Wheel Assembly -->
    <g transform="translate(145, 198)">
      <circle cx="0" cy="0" r="34" fill="url(#wheelTire)" stroke="#020617" stroke-width="2" />
      <circle cx="0" cy="0" r="22" fill="url(#alloyRim)" />
      <line x1="-18" y1="0" x2="18" y2="0" stroke="#0f172a" stroke-width="4" stroke-linecap="round" />
      <line x1="0" y1="-18" x2="0" y2="18" stroke="#0f172a" stroke-width="4" stroke-linecap="round" />
      <line x1="-13" y1="-13" x2="13" y2="13" stroke="#0f172a" stroke-width="4" stroke-linecap="round" />
      <line x1="-13" y1="13" x2="13" y2="-13" stroke="#0f172a" stroke-width="4" stroke-linecap="round" />
      <circle cx="0" cy="0" r="7" fill="#f8fafc" stroke="#334155" stroke-width="1" />
      <circle cx="0" cy="0" r="3" fill="#dc2626" />
      <path d="M-10 -14 A 18 18 0 0 1 10 -14" stroke="#e11d48" stroke-width="5" fill="none" />
    </g>

    <!-- Rear Tail Lamp -->
    <path d="M72 152 C72 144 76 138 84 138 L92 146 L82 168 C76 166 72 160 72 152 Z" fill="#ef4444" stroke="#991b1b" stroke-width="1.2" />
  </svg>`;
}

// Helper to generate a realistic background-less Creta cutout
function renderCretaSvg(c1: string, c2: string): string {
  return `<svg viewBox="0 0 540 260" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-auto drop-shadow-xl">
    <defs>
      <linearGradient id="cretaPaint" x1="80" y1="60" x2="470" y2="200" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="${c1}" />
        <stop offset="60%" stop-color="${c2}" />
        <stop offset="100%" stop-color="${c2}" stop-opacity="0.95" />
      </linearGradient>
      <linearGradient id="cretaGloss" x1="100" y1="70" x2="420" y2="110" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.5" />
        <stop offset="40%" stop-color="#ffffff" stop-opacity="0.12" />
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
      </linearGradient>
      <linearGradient id="cretaGlass" x1="170" y1="60" x2="380" y2="130" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.3" />
        <stop offset="80%" stop-color="#020617" stop-opacity="0.9" />
      </linearGradient>
      <linearGradient id="cretaTire" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#1e293b" />
        <stop offset="100%" stop-color="#020617" />
      </linearGradient>
      <radialGradient id="cretaRim" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#f8fafc" />
        <stop offset="65%" stop-color="#94a3b8" />
        <stop offset="100%" stop-color="#1e293b" />
      </radialGradient>
      <filter id="cretaGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3.5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    <!-- Studio Floor Reflection (Transparent Background) -->
    <ellipse cx="270" cy="232" rx="225" ry="15" fill="#000000" fill-opacity="0.3" filter="blur(8px)" />
    <ellipse cx="145" cy="232" rx="52" ry="9" fill="#000000" fill-opacity="0.45" filter="blur(3.5px)" />
    <ellipse cx="400" cy="232" rx="52" ry="9" fill="#000000" fill-opacity="0.45" filter="blur(3.5px)" />

    <!-- Functional Roof Rails (Creta SUV styling) -->
    <path d="M185 54 L360 54" stroke="#94a3b8" stroke-width="4.5" stroke-linecap="round" />
    <path d="M195 56 V62 M350 56 V62 M275 56 V62" stroke="#475569" stroke-width="3" />

    <!-- Creta SUV Body Frame -->
    <path d="M68 184 C66 160 76 142 102 136 L144 132 L198 72 C212 60 236 58 280 58 L374 58 C398 58 416 66 430 90 L452 130 C472 134 484 146 484 172 L480 188 C476 198 460 202 440 202 L380 202 C370 176 348 160 322 160 C296 160 274 176 264 202 L206 202 C196 176 174 160 148 160 C122 160 100 176 90 202 L76 202 C68 198 66 192 68 184 Z" fill="url(#cretaPaint)" stroke="#090d16" stroke-width="1.8" />

    <!-- Gloss highlight sweep -->
    <path d="M148 132 L200 76 C214 62 234 60 278 60 L370 60 C392 60 408 68 422 92 L442 130 L148 132 Z" fill="url(#cretaGloss)" />

    <!-- Dark SUV Cladding Around Wheel Arches & Sills -->
    <path d="M72 188 L92 188 C100 170 120 156 148 156 C176 156 196 170 204 188 L266 188 C274 170 294 156 322 156 C350 156 370 170 378 188 L442 188 L446 196 H70 Z" fill="#090d16" opacity="0.8" />

    <!-- Silver Faux Skid Plate (SUV Characteristic) -->
    <path d="M438 188 L468 188 L464 196 L434 196 Z" fill="#cbd5e1" stroke="#475569" stroke-width="1" />

    <!-- Windows Greenhouse -->
    <path d="M204 74 L154 130 H268 V68 H222 Z" fill="url(#cretaGlass)" stroke="#1e293b" stroke-width="1.5" />
    <path d="M278 68 V130 H368 V68 Z" fill="url(#cretaGlass)" stroke="#1e293b" stroke-width="1.5" />
    <path d="M378 68 V130 H442 L422 90 C412 76 398 68 378 68 Z" fill="url(#cretaGlass)" stroke="#1e293b" stroke-width="1.5" />

    <!-- Creta Parametric Jewel DRL & Quad LED Split Headlamps -->
    <path d="M446 130 L478 136 C482 142 480 150 472 152 L448 144 Z" fill="#e0f2fe" stroke="#38bdf8" stroke-width="1.5" />
    <!-- Lower Split Headlamp Cluster -->
    <rect x="456" y="156" width="16" height="20" rx="3" fill="#0f172a" stroke="#38bdf8" stroke-width="1" />
    <circle cx="464" cy="166" r="4.5" fill="#38bdf8" filter="url(#cretaGlow)" />
    <circle cx="464" cy="166" r="2" fill="#ffffff" />

    <!-- Creta Parametric Cascading Grille -->
    <path d="M466 150 L484 154 C484 172 478 184 466 186 L454 180 Z" fill="#1e293b" />

    <!-- Creta Prominent Shoulder Line -->
    <path d="M102 138 Q 280 142 444 140" stroke="#ffffff" stroke-opacity="0.45" stroke-width="2.5" fill="none" />

    <!-- Wheels (Diamond-cut Alloys, High Profile SUV Stance) -->
    <g transform="translate(400, 200)">
      <circle cx="0" cy="0" r="37" fill="url(#cretaTire)" stroke="#020617" stroke-width="2" />
      <circle cx="0" cy="0" r="25" fill="url(#cretaRim)" />
      <!-- Creta 5-spoke geometric alloy design -->
      <polygon points="0,-22 5,-8 19,-14 9,0 22,5 8,8 14,20 0,10 -14,20 -8,8 -22,5 -9,0 -19,-14 -5,-8" fill="#0f172a" />
      <circle cx="0" cy="0" r="8" fill="#f8fafc" stroke="#334155" stroke-width="1" />
      <path d="M-12 -16 A 21 21 0 0 1 12 -16" stroke="#ef4444" stroke-width="5" fill="none" />
    </g>

    <g transform="translate(145, 200)">
      <circle cx="0" cy="0" r="37" fill="url(#cretaTire)" stroke="#020617" stroke-width="2" />
      <circle cx="0" cy="0" r="25" fill="url(#cretaRim)" />
      <polygon points="0,-22 5,-8 19,-14 9,0 22,5 8,8 14,20 0,10 -14,20 -8,8 -22,5 -9,0 -19,-14 -5,-8" fill="#0f172a" />
      <circle cx="0" cy="0" r="8" fill="#f8fafc" stroke="#334155" stroke-width="1" />
      <path d="M-12 -16 A 21 21 0 0 1 12 -16" stroke="#ef4444" stroke-width="5" fill="none" />
    </g>

    <!-- Connected LED Tail Lamp (Creta rear light bar) -->
    <path d="M68 152 C68 142 74 136 84 136 L94 144 L82 170 C74 168 68 160 68 152 Z" fill="#ef4444" stroke="#991b1b" stroke-width="1.5" />
    <path d="M84 138 L114 138" stroke="#ef4444" stroke-width="2" />
  </svg>`;
}

// Helper to generate a realistic background-less Scorpio-N cutout
function renderScorpioNSvg(c1: string, c2: string): string {
  return `<svg viewBox="0 0 540 260" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-auto drop-shadow-xl">
    <defs>
      <linearGradient id="scorpioPaint" x1="80" y1="50" x2="470" y2="200" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="${c1}" />
        <stop offset="60%" stop-color="${c2}" />
        <stop offset="100%" stop-color="${c2}" stop-opacity="0.95" />
      </linearGradient>
      <linearGradient id="scorpioTire" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#1e293b" />
        <stop offset="100%" stop-color="#020617" />
      </linearGradient>
      <radialGradient id="scorpioRim" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#f8fafc" />
        <stop offset="70%" stop-color="#64748b" />
        <stop offset="100%" stop-color="#1e293b" />
      </radialGradient>
    </defs>

    <!-- Studio Floor Reflection (Transparent Background) -->
    <ellipse cx="270" cy="236" rx="230" ry="16" fill="#000000" fill-opacity="0.32" filter="blur(8px)" />
    <ellipse cx="145" cy="236" rx="55" ry="10" fill="#000000" fill-opacity="0.48" filter="blur(4px)" />
    <ellipse cx="405" cy="236" rx="55" ry="10" fill="#000000" fill-opacity="0.48" filter="blur(4px)" />

    <!-- High Roof Rails (Tall D-Segment Frame) -->
    <path d="M175 44 L375 44" stroke="#e2e8f0" stroke-width="5" stroke-linecap="round" />
    <path d="M185 46 V54 M365 46 V54 M275 46 V54" stroke="#475569" stroke-width="3.5" />

    <!-- Muscular Tall Body-on-Frame Silhouette -->
    <path d="M64 186 C62 154 74 134 102 128 L142 124 L190 58 C202 48 228 46 270 46 L384 46 C410 46 428 56 442 82 L460 122 C480 126 492 140 492 168 L488 188 C484 200 468 206 444 206 L384 206 C374 174 350 154 322 154 C294 154 270 174 260 206 L202 206 C192 174 168 154 140 154 C112 154 88 174 78 206 L68 206 C64 200 62 194 64 186 Z" fill="url(#scorpioPaint)" stroke="#020617" stroke-width="2" />

    <!-- Scorpio-N Muscular Boxy Windows -->
    <path d="M196 62 L150 122 H268 V56 H216 Z" fill="#020617" opacity="0.88" stroke="#334155" stroke-width="1.5" />
    <path d="M278 56 V122 H378 V56 Z" fill="#020617" opacity="0.88" stroke="#334155" stroke-width="1.5" />
    <path d="M388 56 V122 H450 L432 80 C422 66 408 56 388 56 Z" fill="#020617" opacity="0.88" stroke="#334155" stroke-width="1.5" />

    <!-- Signature Vertical Chrome Grille Slats (Scorpio-N Hallmark) -->
    <path d="M470 144 L490 148 C490 166 484 178 472 180 L460 174 Z" fill="#090d16" />
    <line x1="472" y1="148" x2="472" y2="174" stroke="#e2e8f0" stroke-width="2" />
    <line x1="477" y1="150" x2="477" y2="176" stroke="#e2e8f0" stroke-width="2" />
    <line x1="482" y1="152" x2="482" y2="176" stroke="#e2e8f0" stroke-width="2" />

    <!-- Projector Headlamps & Sting-like LED DRL -->
    <path d="M452 124 L484 130 C488 136 486 144 476 146 L452 138 Z" fill="#e0f2fe" stroke="#38bdf8" stroke-width="1.5" />
    <circle cx="468" cy="136" r="4.5" fill="#38bdf8" />

    <!-- Heavy All-Terrain Wheels & High Wheel Arches -->
    <g transform="translate(405, 202)">
      <circle cx="0" cy="0" r="40" fill="url(#scorpioTire)" stroke="#020617" stroke-width="2.5" />
      <circle cx="0" cy="0" r="26" fill="url(#scorpioRim)" />
      <circle cx="0" cy="0" r="9" fill="#0f172a" stroke="#cbd5e1" stroke-width="1.5" />
      <line x1="-22" y1="0" x2="22" y2="0" stroke="#090d16" stroke-width="4.5" />
      <line x1="0" y1="-22" x2="0" y2="22" stroke="#090d16" stroke-width="4.5" />
      <line x1="-15" y1="-15" x2="15" y2="15" stroke="#090d16" stroke-width="4.5" />
      <line x1="-15" y1="15" x2="15" y2="-15" stroke="#090d16" stroke-width="4.5" />
    </g>

    <g transform="translate(140, 202)">
      <circle cx="0" cy="0" r="40" fill="url(#scorpioTire)" stroke="#020617" stroke-width="2.5" />
      <circle cx="0" cy="0" r="26" fill="url(#scorpioRim)" />
      <circle cx="0" cy="0" r="9" fill="#0f172a" stroke="#cbd5e1" stroke-width="1.5" />
      <line x1="-22" y1="0" x2="22" y2="0" stroke="#090d16" stroke-width="4.5" />
      <line x1="0" y1="-22" x2="0" y2="22" stroke="#090d16" stroke-width="4.5" />
      <line x1="-15" y1="-15" x2="15" y2="15" stroke="#090d16" stroke-width="4.5" />
      <line x1="-15" y1="15" x2="15" y2="-15" stroke="#090d16" stroke-width="4.5" />
    </g>
  </svg>`;
}

// Helper to generate a realistic background-less Sedan cutout (Honda City / Verna / Virtus / Ciaz)
function renderSedanSvg(c1: string, c2: string): string {
  return `<svg viewBox="0 0 540 260" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-auto drop-shadow-xl">
    <defs>
      <linearGradient id="sedanPaint" x1="60" y1="80" x2="480" y2="200" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="${c1}" />
        <stop offset="60%" stop-color="${c2}" />
        <stop offset="100%" stop-color="${c2}" stop-opacity="0.95" />
      </linearGradient>
      <linearGradient id="sedanGlass" x1="160" y1="70" x2="380" y2="130" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.3" />
        <stop offset="80%" stop-color="#020617" stop-opacity="0.9" />
      </linearGradient>
    </defs>
    <ellipse cx="270" cy="228" rx="225" ry="14" fill="#000000" fill-opacity="0.28" filter="blur(7px)" />
    <ellipse cx="140" cy="228" rx="46" ry="8" fill="#000000" fill-opacity="0.42" filter="blur(3px)" />
    <ellipse cx="400" cy="228" rx="46" ry="8" fill="#000000" fill-opacity="0.42" filter="blur(3px)" />

    <!-- Sleek Executive 3-Box Sedan Silhouette -->
    <path d="M54 180 C52 164 64 148 94 142 L138 138 L200 86 C216 72 242 70 286 70 L358 70 C382 70 398 78 418 102 L448 136 C470 140 486 150 486 172 L482 186 C478 196 462 200 440 200 L380 200 C372 178 350 164 324 164 C298 164 276 178 268 200 L204 200 C196 178 174 164 148 164 C122 164 100 178 92 200 L68 200 C60 196 56 188 54 180 Z" fill="url(#sedanPaint)" stroke="#0f172a" stroke-width="1.5" />

    <!-- Aerodynamic Greenhouse -->
    <path d="M204 86 L150 134 H265 V82 H220 Z" fill="url(#sedanGlass)" stroke="#1e293b" stroke-width="1.5" />
    <path d="M275 82 V134 H364 V82 Z" fill="url(#sedanGlass)" stroke="#1e293b" stroke-width="1.5" />
    <path d="M374 82 V134 H436 L410 100 C400 88 388 82 374 82 Z" fill="url(#sedanGlass)" stroke="#1e293b" stroke-width="1.5" />

    <!-- Solid Wing Chrome Grille Line -->
    <path d="M442 136 L482 142 C486 148 484 156 476 160 L448 152 Z" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="1.5" />
    <path d="M106 142 Q 280 146 448 142" stroke="#ffffff" stroke-opacity="0.5" stroke-width="2" fill="none" />

    <!-- Front Wheel -->
    <g transform="translate(400, 198)">
      <circle cx="0" cy="0" r="34" fill="#0f172a" stroke="#020617" stroke-width="2" />
      <circle cx="0" cy="0" r="23" fill="#cbd5e1" />
      <circle cx="0" cy="0" r="8" fill="#1e293b" />
      <line x1="-18" y1="0" x2="18" y2="0" stroke="#1e293b" stroke-width="3.5" />
      <line x1="0" y1="-18" x2="0" y2="18" stroke="#1e293b" stroke-width="3.5" />
      <line x1="-13" y1="-13" x2="13" y2="13" stroke="#1e293b" stroke-width="3.5" />
      <line x1="-13" y1="13" x2="13" y2="-13" stroke="#1e293b" stroke-width="3.5" />
    </g>

    <!-- Rear Wheel -->
    <g transform="translate(148, 198)">
      <circle cx="0" cy="0" r="34" fill="#0f172a" stroke="#020617" stroke-width="2" />
      <circle cx="0" cy="0" r="23" fill="#cbd5e1" />
      <circle cx="0" cy="0" r="8" fill="#1e293b" />
      <line x1="-18" y1="0" x2="18" y2="0" stroke="#1e293b" stroke-width="3.5" />
      <line x1="0" y1="-18" x2="0" y2="18" stroke="#1e293b" stroke-width="3.5" />
      <line x1="-13" y1="-13" x2="13" y2="13" stroke="#1e293b" stroke-width="3.5" />
      <line x1="-13" y1="13" x2="13" y2="-13" stroke="#1e293b" stroke-width="3.5" />
    </g>
  </svg>`;
}

// Helper to generate a realistic background-less MPV cutout (Carens / Innova / Ertiga / Carnival)
function renderMpvSvg(c1: string, c2: string): string {
  return `<svg viewBox="0 0 540 260" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-auto drop-shadow-xl">
    <defs>
      <linearGradient id="mpvPaint" x1="70" y1="60" x2="470" y2="200" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="${c1}" />
        <stop offset="60%" stop-color="${c2}" />
        <stop offset="100%" stop-color="${c2}" stop-opacity="0.95" />
      </linearGradient>
    </defs>
    <ellipse cx="270" cy="232" rx="225" ry="15" fill="#000000" fill-opacity="0.3" filter="blur(8px)" />
    <ellipse cx="145" cy="232" rx="50" ry="9" fill="#000000" fill-opacity="0.45" filter="blur(3.5px)" />
    <ellipse cx="400" cy="232" rx="50" ry="9" fill="#000000" fill-opacity="0.45" filter="blur(3.5px)" />

    <!-- Elongated 6/7 Seater MPV Body -->
    <path d="M66 182 C64 156 76 138 104 132 L146 128 L194 66 C208 56 230 54 274 54 L386 54 C408 54 424 64 438 88 L456 128 C476 132 488 144 488 170 L484 186 C480 196 464 200 442 200 L382 200 C372 176 350 162 324 162 C298 162 276 176 266 200 L204 200 C194 176 172 162 146 162 C120 162 98 176 88 200 L76 200 C68 196 66 190 66 182 Z" fill="url(#mpvPaint)" stroke="#090d16" stroke-width="1.8" />

    <!-- Expansive 3-Row Windows -->
    <path d="M198 70 L152 126 H245 V64 H212 Z" fill="#020617" opacity="0.85" stroke="#334155" stroke-width="1.5" />
    <path d="M255 64 V126 H345 V64 Z" fill="#020617" opacity="0.85" stroke="#334155" stroke-width="1.5" />
    <path d="M355 64 V126 H444 L426 86 C416 72 402 64 382 64 Z" fill="#020617" opacity="0.85" stroke="#334155" stroke-width="1.5" />

    <!-- Tiger-Nose Piano Black Grille & Crown Jewel Headlamps -->
    <path d="M450 126 L482 132 C486 138 484 146 476 148 L452 140 Z" fill="#e0f2fe" stroke="#38bdf8" stroke-width="1.5" />
    <circle cx="468" cy="138" r="4" fill="#38bdf8" />

    <!-- Front & Rear Wheels -->
    <g transform="translate(400, 200)">
      <circle cx="0" cy="0" r="36" fill="#0f172a" stroke="#020617" stroke-width="2" />
      <circle cx="0" cy="0" r="24" fill="#cbd5e1" />
      <circle cx="0" cy="0" r="8" fill="#1e293b" />
      <line x1="-18" y1="0" x2="18" y2="0" stroke="#1e293b" stroke-width="4" stroke-linecap="round" />
      <line x1="0" y1="-18" x2="0" y2="18" stroke="#1e293b" stroke-width="4" stroke-linecap="round" />
      <line x1="-13" y1="-13" x2="13" y2="13" stroke="#1e293b" stroke-width="4" stroke-linecap="round" />
      <line x1="-13" y1="13" x2="13" y2="-13" stroke="#1e293b" stroke-width="4" stroke-linecap="round" />
    </g>

    <g transform="translate(146, 200)">
      <circle cx="0" cy="0" r="36" fill="#0f172a" stroke="#020617" stroke-width="2" />
      <circle cx="0" cy="0" r="24" fill="#cbd5e1" />
      <circle cx="0" cy="0" r="8" fill="#1e293b" />
      <line x1="-18" y1="0" x2="18" y2="0" stroke="#1e293b" stroke-width="4" stroke-linecap="round" />
      <line x1="0" y1="-18" x2="0" y2="18" stroke="#1e293b" stroke-width="4" stroke-linecap="round" />
      <line x1="-13" y1="-13" x2="13" y2="13" stroke="#1e293b" stroke-width="4" stroke-linecap="round" />
      <line x1="-13" y1="13" x2="13" y2="-13" stroke="#1e293b" stroke-width="4" stroke-linecap="round" />
    </g>
  </svg>`;
}

// Registry matching vehicle make/model to specific cutouts
export function getCarCutout(make: string, model: string, segment?: string): {
  renderSvg: (c1: string, c2: string) => string;
  defaultColor: CarColorOption;
  modelBadge: string;
} {
  const normModel = (model || '').toLowerCase().trim();
  const normMake = (make || '').toLowerCase().trim();

  // 1. Maruti Suzuki Swift
  if (normModel.includes('swift')) {
    return {
      renderSvg: renderSwiftSvg,
      defaultColor: POPULAR_CAR_COLORS[0], // Solid Red
      modelBadge: 'Urban Sport Hatchback',
    };
  }

  // 2. Hyundai Creta
  if (normModel.includes('creta') || normModel.includes('seltos') || normModel.includes('grand vitara') || normModel.includes('hyryder') || normModel.includes('kushaq') || normModel.includes('taigun')) {
    return {
      renderSvg: renderCretaSvg,
      defaultColor: POPULAR_CAR_COLORS[1], // Polar White
      modelBadge: 'Premium Mid-size SUV',
    };
  }

  // 3. Mahindra Scorpio-N / Thar / XUV700 / Safari / Harrier
  if (normModel.includes('scorpio') || normModel.includes('thar') || normModel.includes('xuv700') || normModel.includes('safari') || normModel.includes('harrier') || normModel.includes('fortuner')) {
    return {
      renderSvg: renderScorpioNSvg,
      defaultColor: POPULAR_CAR_COLORS[2], // Midnight Black / Deep Forest
      modelBadge: 'Rugged D-Segment SUV',
    };
  }

  // 4. MPVs: Kia Carens, Toyota Innova, Maruti Ertiga, Kia Carnival, XL6
  if (normModel.includes('carens') || normModel.includes('innova') || normModel.includes('ertiga') || normModel.includes('carnival') || normModel.includes('xl6')) {
    return {
      renderSvg: renderMpvSvg,
      defaultColor: POPULAR_CAR_COLORS[3], // Imperial Blue
      modelBadge: 'Executive 6/7-Seater MPV',
    };
  }

  // 5. Sedans: Honda City, Hyundai Verna, VW Virtus, Skoda Slavia, Maruti Ciaz, Dzire, Amaze
  if (normModel.includes('city') || normModel.includes('verna') || normModel.includes('virtus') || normModel.includes('slavia') || normModel.includes('ciaz') || normModel.includes('dzire') || normModel.includes('amaze')) {
    return {
      renderSvg: renderSedanSvg,
      defaultColor: POPULAR_CAR_COLORS[4], // Daytona Grey
      modelBadge: 'Executive Aerodynamic Sedan',
    };
  }

  // Segment Fallbacks
  const normSeg = (segment || '').toLowerCase();
  if (normSeg.includes('sedan')) {
    return {
      renderSvg: renderSedanSvg,
      defaultColor: POPULAR_CAR_COLORS[4],
      modelBadge: 'Premium Sedan',
    };
  }

  if (normSeg.includes('mpv')) {
    return {
      renderSvg: renderMpvSvg,
      defaultColor: POPULAR_CAR_COLORS[3],
      modelBadge: 'Multi-Purpose Vehicle',
    };
  }

  if (normSeg.includes('suv') || normSeg.includes('off-roader')) {
    return {
      renderSvg: renderCretaSvg,
      defaultColor: POPULAR_CAR_COLORS[1],
      modelBadge: 'Dynamic SUV',
    };
  }

  // Default: Sporty Hatchback
  return {
    renderSvg: renderSwiftSvg,
    defaultColor: POPULAR_CAR_COLORS[0],
    modelBadge: 'Pre-Owned Hatchback',
  };
}
