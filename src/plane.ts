export const DEFAULT_PLANE_SVG = `<svg viewBox="0 0 260 110" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <linearGradient id="pn-body" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0%" stop-color="#fefcf6"/>
      <stop offset="100%" stop-color="#ebe0c8"/>
    </linearGradient>
    <linearGradient id="pn-wing-top" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="#f4b860"/>
      <stop offset="100%" stop-color="#c97f30"/>
    </linearGradient>
    <linearGradient id="pn-wing-bot" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0%" stop-color="#e8a75c"/>
      <stop offset="100%" stop-color="#a96719"/>
    </linearGradient>
    <linearGradient id="pn-tail" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0%" stop-color="#e8744f"/>
      <stop offset="100%" stop-color="#a93b29"/>
    </linearGradient>
  </defs>

  <!-- Contrail dots, growing toward plane -->
  <g fill="#fefcf6" opacity="0.55">
    <circle cx="6" cy="60" r="1.5"/>
    <circle cx="20" cy="59" r="2"/>
    <circle cx="36" cy="60" r="2.5"/>
    <circle cx="54" cy="59" r="3"/>
  </g>

  <!-- Tail vertical fin -->
  <path d="M 178 28 L 200 18 L 212 56 L 188 58 Z" fill="url(#pn-tail)"/>
  <path d="M 186 30 L 200 22 L 205 36 L 192 40 Z" fill="#ffd7c7" opacity="0.45"/>

  <!-- Tail horizontal stabilizer -->
  <path d="M 188 58 L 232 52 L 238 64 L 194 68 Z" fill="#9a3525"/>

  <!-- Main fuselage -->
  <path d="M 46 60 Q 86 48, 168 50 L 222 56 Q 240 60, 240 66 Q 240 71, 220 74 L 168 76 Q 86 78, 46 68 Z" fill="url(#pn-body)"/>

  <!-- Fuselage underline shadow -->
  <path d="M 50 72 Q 110 76, 218 71" stroke="#a18a5e" stroke-width="1.4" fill="none" opacity="0.5"/>

  <!-- Passenger windows -->
  <g fill="#1d3552">
    <circle cx="78" cy="63" r="2"/>
    <circle cx="92" cy="62.5" r="2"/>
    <circle cx="106" cy="62" r="2"/>
    <circle cx="120" cy="61.5" r="2"/>
    <circle cx="134" cy="61" r="2"/>
    <circle cx="148" cy="61" r="2"/>
    <circle cx="162" cy="61" r="2"/>
  </g>

  <!-- Cockpit window -->
  <path d="M 198 56 L 218 57 L 224 65 L 198 65 Z" fill="#1d3552"/>
  <path d="M 202 58 L 215 58.5 L 218 63 L 202 63 Z" fill="#a8c5d6" opacity="0.7"/>
  <path d="M 202 58 L 209 58 L 209 60 L 202 60 Z" fill="#fefcf6" opacity="0.55"/>

  <!-- Nose cone -->
  <path d="M 232 60 Q 244 64, 235 72 L 220 70 Z" fill="#1d3552"/>

  <!-- Wing back (upper, behind body) -->
  <path d="M 104 58 L 70 18 L 116 22 L 144 56 Z" fill="url(#pn-wing-top)"/>
  <path d="M 108 56 L 82 24 L 92 24 L 130 52 Z" fill="#7a4815" opacity="0.35"/>

  <!-- Wing front (lower, foreground) -->
  <path d="M 108 70 L 78 102 L 122 100 L 144 72 Z" fill="url(#pn-wing-bot)"/>
  <path d="M 114 72 L 90 96 L 100 96 L 132 72 Z" fill="#6f3f08" opacity="0.4"/>

  <!-- Engine nacelle -->
  <ellipse cx="116" cy="86" rx="8" ry="4" fill="#1d3552"/>
  <ellipse cx="114" cy="85" rx="3" ry="1.5" fill="#e8a75c"/>
  <circle cx="121" cy="86" r="1.2" fill="#a8c5d6"/>

  <!-- Belly accent stripe -->
  <path d="M 56 73 Q 130 71, 220 73" stroke="#c75644" stroke-width="2" fill="none" opacity="0.85"/>

  <!-- Top spine highlight -->
  <path d="M 60 52 Q 130 46, 200 50" stroke="#ffffff" stroke-width="1.2" fill="none" opacity="0.55"/>
</svg>`;
