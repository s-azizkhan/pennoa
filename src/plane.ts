export interface PlanePreset {
  id: string;
  name: string;
  svg: string;
}

const PANAM = `<svg viewBox="0 0 280 130" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <linearGradient id="pn-body" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#fefcf6"/>
      <stop offset="55%" stop-color="#efe3c7"/>
      <stop offset="100%" stop-color="#d4bf90"/>
    </linearGradient>
    <linearGradient id="pn-wing-top" x1="0" y1="0" x2="0.4" y2="1">
      <stop offset="0%" stop-color="#f6c374"/>
      <stop offset="60%" stop-color="#d68a30"/>
      <stop offset="100%" stop-color="#a55f15"/>
    </linearGradient>
    <linearGradient id="pn-wing-bot" x1="0" y1="0" x2="0.5" y2="1">
      <stop offset="0%" stop-color="#e8a75c"/>
      <stop offset="100%" stop-color="#8c4f0e"/>
    </linearGradient>
    <linearGradient id="pn-tail" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#e8744f"/>
      <stop offset="100%" stop-color="#922b1d"/>
    </linearGradient>
    <linearGradient id="pn-nose" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#2a4a72"/>
      <stop offset="100%" stop-color="#0e1a2b"/>
    </linearGradient>
    <radialGradient id="pn-window" cx="0.35" cy="0.3" r="0.85">
      <stop offset="0%" stop-color="#c6dcec"/>
      <stop offset="60%" stop-color="#4d7a9c"/>
      <stop offset="100%" stop-color="#1d3552"/>
    </radialGradient>
  </defs>
  <g fill="#ffffff" opacity="0.55">
    <circle cx="6" cy="72" r="1.4"/>
    <circle cx="18" cy="71" r="1.8"/>
    <circle cx="32" cy="72" r="2.3"/>
    <circle cx="48" cy="71" r="2.8"/>
    <circle cx="66" cy="72" r="3.4"/>
  </g>
  <path d="M 178 24 Q 198 8, 214 22 L 220 64 L 188 60 Z" fill="url(#pn-tail)"/>
  <path d="M 188 30 Q 200 16, 210 26 L 212 38 L 192 36 Z" fill="#ffd2b8" opacity="0.4"/>
  <path d="M 195 34 L 207 30" stroke="#fefcf6" stroke-width="1.5" opacity="0.7"/>
  <path d="M 188 62 Q 220 58, 248 60 L 252 72 Q 218 74, 192 74 Z" fill="#7a2415"/>
  <path d="M 200 64 Q 220 62, 240 64" stroke="#c75644" stroke-width="1.2" opacity="0.7" fill="none"/>
  <path d="M 50 66 Q 92 52, 170 54 L 232 62 Q 254 66, 254 74 Q 254 80, 232 83 L 170 84 Q 92 86, 50 76 Z" fill="url(#pn-body)"/>
  <path d="M 54 76 Q 130 80, 230 76" stroke="#9a8460" stroke-width="1.6" fill="none" opacity="0.45"/>
  <g>
    <ellipse cx="80" cy="69" rx="3" ry="3.5" fill="url(#pn-window)"/>
    <ellipse cx="96" cy="68" rx="3" ry="3.5" fill="url(#pn-window)"/>
    <ellipse cx="112" cy="67.5" rx="3" ry="3.5" fill="url(#pn-window)"/>
    <ellipse cx="128" cy="67" rx="3" ry="3.5" fill="url(#pn-window)"/>
    <ellipse cx="144" cy="66.5" rx="3" ry="3.5" fill="url(#pn-window)"/>
    <ellipse cx="160" cy="66.5" rx="3" ry="3.5" fill="url(#pn-window)"/>
    <ellipse cx="176" cy="66.5" rx="3" ry="3.5" fill="url(#pn-window)"/>
  </g>
  <path d="M 208 58 L 232 60 Q 240 66, 230 71 L 208 70 Z" fill="#0e1a2b"/>
  <path d="M 212 60 L 228 62 Q 234 65, 226 68 L 212 67 Z" fill="#a8c5d6" opacity="0.85"/>
  <path d="M 213 60 L 223 60 L 223 62 L 213 62 Z" fill="#fefcf6" opacity="0.7"/>
  <path d="M 244 64 Q 260 70, 248 78 L 230 74 Z" fill="url(#pn-nose)"/>
  <circle cx="251" cy="72" r="1.6" fill="#e8a75c"/>
  <path d="M 108 60 L 72 14 L 122 18 L 152 58 Z" fill="url(#pn-wing-top)"/>
  <path d="M 114 58 L 84 22 L 96 22 L 138 54 Z" fill="#5e3608" opacity="0.45"/>
  <path d="M 100 38 L 132 42" stroke="#fefcf6" stroke-width="1.6" opacity="0.6"/>
  <path d="M 114 78 L 78 118 L 130 116 L 152 80 Z" fill="url(#pn-wing-bot)"/>
  <path d="M 120 80 L 92 110 L 102 110 L 140 80 Z" fill="#5a3208" opacity="0.4"/>
  <ellipse cx="118" cy="100" rx="11" ry="5" fill="#0e1a2b"/>
  <ellipse cx="113" cy="99" rx="4" ry="2.2" fill="#e8a75c"/>
  <circle cx="123" cy="100" r="2" fill="#a8c5d6"/>
  <path d="M 60 79 Q 130 75, 230 80" stroke="#c75644" stroke-width="2.4" fill="none" opacity="0.9"/>
  <path d="M 64 56 Q 130 50, 210 56" stroke="#ffffff" stroke-width="1.3" fill="none" opacity="0.65"/>
</svg>`;

const PAPER = `<svg viewBox="0 0 220 120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="pp-top" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#fefcf6"/>
      <stop offset="100%" stop-color="#d4c89e"/>
    </linearGradient>
    <linearGradient id="pp-bot" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#d4c89e"/>
      <stop offset="100%" stop-color="#9a8a60"/>
    </linearGradient>
  </defs>
  <path d="M 10 70 L 200 30 L 200 50 L 80 80 Z" fill="url(#pp-top)" stroke="#5e4f25" stroke-width="0.8"/>
  <path d="M 80 80 L 200 50 L 200 75 L 130 100 Z" fill="url(#pp-bot)" stroke="#5e4f25" stroke-width="0.8"/>
  <line x1="10" y1="70" x2="130" y2="100" stroke="#5e4f25" stroke-width="0.8" opacity="0.6"/>
  <line x1="200" y1="30" x2="80" y2="80" stroke="#5e4f25" stroke-width="0.6" opacity="0.5"/>
</svg>`;

const JET = `<svg viewBox="0 0 260 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="j-body" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#eef3f7"/>
      <stop offset="100%" stop-color="#8aa3bf"/>
    </linearGradient>
    <linearGradient id="j-wing" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#5e7c9a"/>
      <stop offset="100%" stop-color="#2a4a6e"/>
    </linearGradient>
  </defs>
  <path d="M 16 52 Q 80 42, 200 46 L 230 52 Q 240 56, 230 60 L 200 64 Q 80 68, 16 58 Z" fill="url(#j-body)"/>
  <path d="M 188 28 L 216 18 L 224 50 L 196 50 Z" fill="#2a4a6e"/>
  <path d="M 86 50 L 56 78 L 140 76 L 154 56 Z" fill="url(#j-wing)"/>
  <path d="M 42 53 Q 130 50, 200 52" stroke="#0e1a2b" stroke-width="2" opacity="0.6" fill="none"/>
  <ellipse cx="110" cy="76" rx="14" ry="5" fill="#0e1a2b"/>
  <ellipse cx="106" cy="76" rx="5" ry="2" fill="#e8a75c"/>
  <path d="M 210 50 Q 234 55, 220 60 L 200 58 Z" fill="#0e1a2b"/>
  <path d="M 216 52 L 226 54 Q 230 56, 226 58 L 216 57 Z" fill="#a8c5d6" opacity="0.8"/>
  <path d="M 50 60 Q 140 56, 220 60" stroke="#c75644" stroke-width="1.5" fill="none" opacity="0.9"/>
</svg>`;

const BIPLANE = `<svg viewBox="0 0 220 150" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bp-body" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#f4b860"/>
      <stop offset="100%" stop-color="#a55f15"/>
    </linearGradient>
  </defs>
  <path d="M 16 88 L 200 86 L 195 100 L 22 100 Z" fill="#c75644"/>
  <path d="M 20 92 L 198 90" stroke="#7a2415" stroke-width="1" opacity="0.6"/>
  <path d="M 24 76 Q 100 66, 180 70 L 200 78 L 200 88 L 180 90 Q 100 96, 24 88 Z" fill="url(#bp-body)"/>
  <path d="M 18 36 L 188 34 L 184 48 L 24 48 Z" fill="#c75644"/>
  <path d="M 22 40 L 186 38" stroke="#7a2415" stroke-width="1" opacity="0.6"/>
  <line x1="50" y1="50" x2="50" y2="76" stroke="#5e3608" stroke-width="2"/>
  <line x1="100" y1="50" x2="100" y2="74" stroke="#5e3608" stroke-width="2"/>
  <line x1="150" y1="50" x2="150" y2="78" stroke="#5e3608" stroke-width="2"/>
  <line x1="60" y1="48" x2="100" y2="78" stroke="#5e3608" stroke-width="1" opacity="0.5"/>
  <line x1="100" y1="48" x2="60" y2="78" stroke="#5e3608" stroke-width="1" opacity="0.5"/>
  <line x1="198" y1="60" x2="198" y2="98" stroke="#0e1a2b" stroke-width="3"/>
  <circle cx="198" cy="80" r="4" fill="#0e1a2b"/>
  <path d="M 20 72 L 0 60 L 0 96 L 22 88 Z" fill="#c75644"/>
  <ellipse cx="120" cy="80" rx="8" ry="5" fill="#0e1a2b"/>
  <ellipse cx="118" cy="78" rx="3" ry="2" fill="#a8c5d6" opacity="0.8"/>
</svg>`;

const FIGHTER = `<svg viewBox="0 0 260 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="ft-body" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#5a6a7a"/>
      <stop offset="100%" stop-color="#1f2832"/>
    </linearGradient>
  </defs>
  <path d="M 14 50 L 220 44 L 240 52 L 220 60 L 14 54 Z" fill="url(#ft-body)"/>
  <path d="M 70 52 L 100 88 L 168 80 L 142 58 Z" fill="#2a3540"/>
  <path d="M 70 52 L 100 14 L 168 22 L 142 50 Z" fill="#2a3540"/>
  <path d="M 80 54 L 110 80 L 158 75 L 138 56 Z" fill="#3a4856" opacity="0.6"/>
  <path d="M 44 50 L 16 26 L 50 42 Z" fill="#1f2832"/>
  <path d="M 44 54 L 16 78 L 50 62 Z" fill="#1f2832"/>
  <path d="M 178 47 L 215 48 L 220 52 L 178 52 Z" fill="#0a0f15"/>
  <path d="M 184 49 L 210 50 L 213 52 L 184 51 Z" fill="#a8c5d6" opacity="0.7"/>
  <path d="M 220 50 L 238 52 L 220 55 Z" fill="#0a0f15"/>
  <path d="M 30 50 L 20 38 L 30 46 Z" fill="#c75644"/>
</svg>`;

const CONCORDE = `<svg viewBox="0 0 280 90" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="co-body" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#fefcf6"/>
      <stop offset="100%" stop-color="#c8c0a8"/>
    </linearGradient>
    <linearGradient id="co-wing" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#a8c5d6"/>
      <stop offset="100%" stop-color="#4d7a9c"/>
    </linearGradient>
  </defs>
  <path d="M 18 46 Q 110 38, 230 38 L 256 44 Q 262 46, 256 48 L 230 52 Q 110 52, 18 48 Z" fill="url(#co-body)"/>
  <path d="M 60 46 L 92 76 L 184 70 L 200 50 Z" fill="url(#co-wing)"/>
  <path d="M 70 48 L 100 72 L 178 68 L 192 50 Z" fill="#2a4a6e" opacity="0.5"/>
  <path d="M 256 44 Q 270 50, 256 54 L 246 50 Z" fill="#1d3552"/>
  <path d="M 32 38 L 22 16 L 50 38 Z" fill="#1d3552"/>
  <ellipse cx="120" cy="62" rx="26" ry="3.5" fill="#1d3552"/>
  <ellipse cx="160" cy="62" rx="26" ry="3.5" fill="#1d3552"/>
  <path d="M 80 44 L 220 42" stroke="#1d3552" stroke-width="1.5" opacity="0.7"/>
  <path d="M 28 50 Q 130 48, 240 50" stroke="#c75644" stroke-width="1.5" fill="none" opacity="0.85"/>
</svg>`;

const GLIDER = `<svg viewBox="0 0 300 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gl-wing" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#fefcf6"/>
      <stop offset="100%" stop-color="#a8c5d6"/>
    </linearGradient>
  </defs>
  <path d="M 30 38 L 290 36 L 290 44 L 30 46 Z" fill="url(#gl-wing)" stroke="#4d7a9c" stroke-width="0.6"/>
  <path d="M 110 36 L 280 38" stroke="#a8c5d6" stroke-width="0.5" opacity="0.6"/>
  <ellipse cx="160" cy="42" rx="80" ry="7" fill="#fefcf6" stroke="#4d7a9c" stroke-width="0.6"/>
  <path d="M 84 42 L 60 26 L 70 50 Z" fill="#4d7a9c"/>
  <path d="M 84 42 L 60 58 L 70 50 Z" fill="#5e7c9a" opacity="0.7"/>
  <ellipse cx="220" cy="40" rx="14" ry="4" fill="#1d3552"/>
  <ellipse cx="218" cy="38" rx="6" ry="2" fill="#a8c5d6" opacity="0.8"/>
  <path d="M 232 42 Q 240 44, 232 46 L 228 44 Z" fill="#1d3552"/>
</svg>`;

const CESSNA = `<svg viewBox="0 0 220 130" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="cs-body" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#fefcf6"/>
      <stop offset="100%" stop-color="#d4c89e"/>
    </linearGradient>
  </defs>
  <path d="M 28 44 L 184 42 L 184 56 L 28 58 Z" fill="#e8a75c" stroke="#7a4818" stroke-width="0.6"/>
  <line x1="55" y1="56" x2="55" y2="82" stroke="#5e3608" stroke-width="2"/>
  <line x1="150" y1="56" x2="150" y2="82" stroke="#5e3608" stroke-width="2"/>
  <path d="M 46 68 Q 110 62, 170 66 L 184 78 L 170 90 Q 110 94, 46 86 Z" fill="url(#cs-body)" stroke="#7a4818" stroke-width="0.6"/>
  <path d="M 102 72 L 168 74 L 166 84 L 102 84 Z" fill="#1d3552"/>
  <path d="M 108 74 L 162 76 L 160 80 L 108 80 Z" fill="#a8c5d6" opacity="0.85"/>
  <line x1="190" y1="62" x2="190" y2="94" stroke="#0e1a2b" stroke-width="2.5"/>
  <circle cx="190" cy="78" r="4" fill="#0e1a2b"/>
  <path d="M 46 76 L 16 64 L 16 92 L 46 86 Z" fill="#e8a75c" stroke="#7a4818" stroke-width="0.6"/>
  <path d="M 30 64 L 30 80" stroke="#c75644" stroke-width="2"/>
  <line x1="85" y1="88" x2="85" y2="104" stroke="#0e1a2b" stroke-width="2"/>
  <line x1="135" y1="88" x2="135" y2="104" stroke="#0e1a2b" stroke-width="2"/>
  <circle cx="85" cy="108" r="5" fill="#0e1a2b"/>
  <circle cx="135" cy="108" r="5" fill="#0e1a2b"/>
  <path d="M 50 78 Q 110 75, 168 78" stroke="#c75644" stroke-width="1.5" fill="none" opacity="0.85"/>
</svg>`;

const STEALTH = `<svg viewBox="0 0 280 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="st-body" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#3a4250"/>
      <stop offset="100%" stop-color="#0e1218"/>
    </linearGradient>
  </defs>
  <path d="M 16 60 L 80 32 L 140 24 L 200 32 L 254 58 Q 246 64, 228 62 L 200 56 Q 170 50, 140 46 Q 110 50, 80 56 L 60 60 Q 36 64, 16 60 Z" fill="url(#st-body)"/>
  <path d="M 80 36 L 140 28 L 200 36" stroke="#1a1f28" stroke-width="0.8" opacity="0.7"/>
  <ellipse cx="140" cy="30" rx="18" ry="3.5" fill="#06090c"/>
  <ellipse cx="138" cy="29" rx="6" ry="1.5" fill="#a8c5d6" opacity="0.6"/>
  <ellipse cx="106" cy="40" rx="8" ry="2" fill="#06090c"/>
  <ellipse cx="174" cy="40" rx="8" ry="2" fill="#06090c"/>
  <path d="M 60 56 Q 140 50, 220 56" stroke="#5a6a7a" stroke-width="0.8" fill="none" opacity="0.5"/>
</svg>`;

const ROCKET = `<svg viewBox="0 0 280 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="rk-body" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#fefcf6"/>
      <stop offset="100%" stop-color="#9a8a60"/>
    </linearGradient>
    <linearGradient id="rk-fire" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#c75644"/>
      <stop offset="50%" stop-color="#e8a75c"/>
      <stop offset="100%" stop-color="#fbd99a"/>
    </linearGradient>
  </defs>
  <path d="M 0 50 Q 30 22, 70 44 Q 40 50, 0 50 Q 40 50, 70 56 Q 30 78, 0 50 Z" fill="url(#rk-fire)"/>
  <path d="M 14 50 Q 38 32, 64 46 Q 40 50, 14 50 Q 40 50, 64 54 Q 38 68, 14 50 Z" fill="#fefcf6" opacity="0.7"/>
  <rect x="64" y="36" width="22" height="28" fill="#1d3552"/>
  <rect x="68" y="42" width="14" height="16" fill="#3a5a7d"/>
  <path d="M 86 30 L 210 30 Q 240 30, 256 50 Q 240 70, 210 70 L 86 70 Z" fill="url(#rk-body)"/>
  <rect x="92" y="46" width="120" height="8" fill="#c75644"/>
  <circle cx="140" cy="50" r="11" fill="#1d3552" stroke="#a8c5d6" stroke-width="2"/>
  <circle cx="137" cy="47" r="3.5" fill="#a8c5d6" opacity="0.8"/>
  <path d="M 86 30 L 70 14 L 100 30 Z" fill="#c75644"/>
  <path d="M 86 70 L 70 86 L 100 70 Z" fill="#c75644"/>
  <path d="M 256 50 L 270 50 L 256 54 Z" fill="#c75644"/>
  <circle cx="262" cy="50" r="2.4" fill="#fefcf6"/>
  <circle cx="180" cy="40" r="2" fill="#1d3552"/>
  <circle cx="200" cy="40" r="2" fill="#1d3552"/>
</svg>`;

const HELICOPTER = `<svg viewBox="0 0 280 180" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="hc-body" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#f6c374"/>
      <stop offset="100%" stop-color="#a55f15"/>
    </linearGradient>
    <linearGradient id="hc-bubble" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#c6dcec"/>
      <stop offset="100%" stop-color="#4d7a9c"/>
    </linearGradient>
  </defs>

  <!-- landing skids -->
  <line x1="58" y1="148" x2="190" y2="148" stroke="#1d3552" stroke-width="4" stroke-linecap="round"/>
  <line x1="82" y1="134" x2="82" y2="148" stroke="#1d3552" stroke-width="2.5"/>
  <line x1="168" y1="134" x2="168" y2="148" stroke="#1d3552" stroke-width="2.5"/>

  <!-- tail boom -->
  <path d="M 70 102 L 10 96 L 10 112 L 70 116 Z" fill="url(#hc-body)"/>
  <path d="M 20 100 L 60 102 L 60 110 L 20 108 Z" fill="#5e3608" opacity="0.4"/>

  <!-- tail rotor hub -->
  <circle cx="14" cy="104" r="3.5" fill="#1d3552"/>

  <!-- tail rotor blades (animated) -->
  <line x1="-2" y1="104" x2="30" y2="104" stroke="#1d3552" stroke-width="2.5" stroke-linecap="round" opacity="0.85">
    <animateTransform attributeName="transform" type="rotate" from="0 14 104" to="360 14 104" dur="0.16s" repeatCount="indefinite"/>
  </line>
  <line x1="-2" y1="104" x2="30" y2="104" stroke="#1d3552" stroke-width="2.5" stroke-linecap="round" opacity="0.5">
    <animateTransform attributeName="transform" type="rotate" from="90 14 104" to="450 14 104" dur="0.16s" repeatCount="indefinite"/>
  </line>
  <circle cx="14" cy="104" r="14" fill="none" stroke="#1d3552" stroke-width="0.4" opacity="0.25"/>

  <!-- main body shell -->
  <ellipse cx="138" cy="110" rx="70" ry="34" fill="url(#hc-body)"/>
  <ellipse cx="138" cy="100" rx="68" ry="22" fill="#7a4818" opacity="0.25"/>

  <!-- belly stripe -->
  <path d="M 75 130 Q 138 138, 200 128" stroke="#c75644" stroke-width="3" fill="none" opacity="0.9"/>

  <!-- bubble cockpit (front) -->
  <path d="M 96 108 Q 96 74, 138 72 Q 188 74, 196 108 L 196 122 L 96 122 Z" fill="url(#hc-bubble)" opacity="0.92"/>
  <path d="M 108 100 Q 108 84, 138 82 Q 178 84, 184 100" fill="none" stroke="#fefcf6" stroke-width="1.5" opacity="0.55"/>

  <!-- pilot torso -->
  <ellipse cx="155" cy="108" rx="11" ry="9" fill="#c75644"/>
  <path d="M 145 108 Q 148 100, 155 99 Q 162 100, 165 108" fill="#8a2a18" opacity="0.6"/>
  <!-- pilot head -->
  <circle cx="158" cy="92" r="9" fill="#f1c79a"/>
  <!-- helmet -->
  <path d="M 149 90 Q 149 80, 158 78 Q 167 80, 167 90 Z" fill="#1d3552"/>
  <path d="M 152 91 Q 158 87, 164 91" fill="none" stroke="#a8c5d6" stroke-width="2" opacity="0.85"/>
  <!-- helmet visor reflection -->
  <ellipse cx="156" cy="89" rx="2" ry="1" fill="#fefcf6" opacity="0.7"/>
  <!-- pilot arm to controls -->
  <line x1="148" y1="110" x2="135" y2="118" stroke="#7a2415" stroke-width="3" stroke-linecap="round"/>

  <!-- main rotor mast -->
  <rect x="136" y="60" width="4" height="14" fill="#1d3552"/>
  <circle cx="138" cy="60" r="5" fill="#1d3552"/>

  <!-- main rotor disc shadow under blades -->
  <ellipse cx="138" cy="60" rx="100" ry="3" fill="#a8c5d6" opacity="0.18"/>

  <!-- main rotor blades (animated) -->
  <ellipse cx="138" cy="60" rx="100" ry="3" fill="#1d3552" opacity="0.85">
    <animateTransform attributeName="transform" type="rotate" from="0 138 60" to="360 138 60" dur="0.18s" repeatCount="indefinite"/>
  </ellipse>
  <ellipse cx="138" cy="60" rx="100" ry="3" fill="#1d3552" opacity="0.5">
    <animateTransform attributeName="transform" type="rotate" from="60 138 60" to="420 138 60" dur="0.18s" repeatCount="indefinite"/>
  </ellipse>
  <ellipse cx="138" cy="60" rx="100" ry="3" fill="#1d3552" opacity="0.35">
    <animateTransform attributeName="transform" type="rotate" from="120 138 60" to="480 138 60" dur="0.18s" repeatCount="indefinite"/>
  </ellipse>

  <!-- nose number/decal -->
  <text x="178" y="120" font-family="Georgia, serif" font-size="11" font-weight="700" fill="#fefcf6" opacity="0.85">P-7</text>
</svg>`;

export const PLANE_PRESETS: PlanePreset[] = [
  { id: "panam", name: "Pan Am", svg: PANAM },
  { id: "paper", name: "Paper", svg: PAPER },
  { id: "jet", name: "Jet", svg: JET },
  { id: "biplane", name: "Biplane", svg: BIPLANE },
  { id: "fighter", name: "Fighter", svg: FIGHTER },
  { id: "concorde", name: "Concorde", svg: CONCORDE },
  { id: "glider", name: "Glider", svg: GLIDER },
  { id: "cessna", name: "Cessna", svg: CESSNA },
  { id: "stealth", name: "Stealth", svg: STEALTH },
  { id: "rocket", name: "Rocket", svg: ROCKET },
  { id: "helicopter", name: "Heli", svg: HELICOPTER },
];

export const DEFAULT_PLANE_SVG = PLANE_PRESETS[0].svg;
