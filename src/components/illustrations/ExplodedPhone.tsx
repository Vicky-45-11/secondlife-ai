"use client";

import { motion, useReducedMotion, useTransform, type MotionValue } from "framer-motion";

/**
 * A phone coming apart into its next lives: housing, display, logic board,
 * battery and camera separate as `spread` goes from 0 to 1. Pure SVG, so it is
 * sharp at any size and needs no image downloads.
 */

const LAYERS = [
  { id: "housing", dy: 150, dx: -30 },
  { id: "battery", dy: 80, dx: 40 },
  { id: "board", dy: 0, dx: -10 },
  { id: "display", dy: -90, dx: 24 },
  { id: "glass", dy: -170, dx: -20 },
] as const;

function Layer({
  spread,
  dx,
  dy,
  children,
}: {
  spread: MotionValue<number>;
  dx: number;
  dy: number;
  children: React.ReactNode;
}) {
  const x = useTransform(spread, [0, 1], [0, dx]);
  const y = useTransform(spread, [0, 1], [0, dy]);
  return <motion.g style={{ x, y }}>{children}</motion.g>;
}

// The phone is drawn as a slanted (isometric-ish) slab so stacked layers read as depth.
const SLAB = "M200 150 L380 110 Q396 107 398 122 L404 470 Q405 486 390 489 L210 528 Q194 531 192 516 L186 166 Q185 153 200 150 Z";

export function ExplodedPhone({ spread, className }: { spread: MotionValue<number>; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <svg viewBox="0 0 600 680" className={className} role="img" aria-label="A smartphone separating into housing, battery, logic board, display and glass">
      <defs>
        <radialGradient id="ep-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#CCFF00" stopOpacity="0.18" />
          <stop offset="60%" stopColor="#00E5FF" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#07120D" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ep-glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F4F0E5" stopOpacity="0.22" />
          <stop offset="55%" stopColor="#F4F0E5" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#00E5FF" stopOpacity="0.12" />
        </linearGradient>
        <linearGradient id="ep-screen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#173527" />
          <stop offset="100%" stopColor="#0B1A13" />
        </linearGradient>
        <linearGradient id="ep-board" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#214A37" />
          <stop offset="100%" stopColor="#10261C" />
        </linearGradient>
        <clipPath id="ep-slab">
          <path d={SLAB} />
        </clipPath>
      </defs>

      <ellipse cx="300" cy="340" rx="290" ry="300" fill="url(#ep-glow)" />

      {/* Housing: aluminium frame */}
      <Layer spread={spread} dx={LAYERS[0].dx} dy={LAYERS[0].dy}>
        <path d={SLAB} fill="#1A1D1A" stroke="#9A9C8F" strokeOpacity="0.5" strokeWidth="1.5" />
        <path d={SLAB} fill="none" stroke="#F4F0E5" strokeOpacity="0.12" strokeWidth="10" transform="translate(0 6)" />
        <circle cx="356" cy="160" r="16" fill="none" stroke="#9A9C8F" strokeOpacity="0.6" />
        <circle cx="356" cy="198" r="16" fill="none" stroke="#9A9C8F" strokeOpacity="0.6" />
      </Layer>

      {/* Battery */}
      <Layer spread={spread} dx={LAYERS[1].dx} dy={LAYERS[1].dy}>
        <path d="M222 236 L364 205 L368 420 L226 451 Z" fill="#262A26" stroke="#B48A5E" strokeWidth="1.5" />
        <path d="M222 236 L364 205 L366 228 L224 259 Z" fill="#B48A5E" fillOpacity="0.25" />
        <text x="292" y="340" fill="#B48A5E" fontFamily="monospace" fontSize="13" textAnchor="middle" transform="rotate(-12 292 340)">
          Li-ion · 3.85V
        </text>
        <path d="M286 306 h16 M294 298 v16" stroke="#B48A5E" strokeWidth="2" />
      </Layer>

      {/* Logic board with chips and traces */}
      <Layer spread={spread} dx={LAYERS[2].dx} dy={LAYERS[2].dy}>
        <path d="M206 168 L384 128 L390 250 L212 290 Z" fill="url(#ep-board)" stroke="#CCFF00" strokeOpacity="0.55" strokeWidth="1.2" />
        <path d="M206 420 L388 380 L392 470 L210 510 Z" fill="url(#ep-board)" stroke="#CCFF00" strokeOpacity="0.4" strokeWidth="1.2" />
        <g stroke="#CCFF00" strokeOpacity="0.55" strokeWidth="1.1" fill="none">
          <path d="M226 200 h40 l12 -10 h50" />
          <path d="M232 236 h30 l16 -14 h60" />
          <path d="M240 262 h70 l20 -12 h40" />
          <path d="M226 450 h56 l14 -12 h70" />
          <path d="M236 480 h40 l18 -10 h52" />
        </g>
        <g fill="#0A0B0A" stroke="#F4F0E5" strokeOpacity="0.4">
          <rect x="300" y="168" width="44" height="40" rx="4" transform="skewY(-12) translate(0 64)" />
          <rect x="246" y="192" width="30" height="26" rx="3" transform="skewY(-12) translate(0 52)" />
          <rect x="300" y="440" width="34" height="22" rx="3" transform="skewY(-12) translate(0 68)" />
        </g>
        <g fill="#CCFF00">
          <circle cx="226" cy="200" r="2.5" />
          <circle cx="232" cy="236" r="2.5" />
          <circle cx="226" cy="450" r="2.5" />
        </g>
        {/* Camera module */}
        <g transform="translate(330 134)">
          <rect x="0" y="0" width="40" height="70" rx="10" fill="#111311" stroke="#00E5FF" strokeOpacity="0.6" />
          <circle cx="20" cy="20" r="11" fill="#07120D" stroke="#00E5FF" strokeOpacity="0.8" />
          <circle cx="20" cy="50" r="11" fill="#07120D" stroke="#00E5FF" strokeOpacity="0.8" />
          <circle cx="16" cy="16" r="3" fill="#00E5FF" fillOpacity="0.6" />
        </g>
      </Layer>

      {/* Display panel */}
      <Layer spread={spread} dx={LAYERS[3].dx} dy={LAYERS[3].dy}>
        <path d={SLAB} fill="url(#ep-screen)" stroke="#F4F0E5" strokeOpacity="0.3" />
        <g clipPath="url(#ep-slab)" opacity="0.9">
          <path d="M210 210 L380 172" stroke="#F4F0E5" strokeOpacity="0.12" strokeWidth="18" strokeLinecap="round" />
          <path d="M214 250 L330 225" stroke="#F4F0E5" strokeOpacity="0.08" strokeWidth="10" strokeLinecap="round" />
          <path d="M218 300 L380 265" stroke="#CCFF00" strokeOpacity="0.45" strokeWidth="2" />
          <path d="M218 330 L340 304" stroke="#F4F0E5" strokeOpacity="0.15" strokeWidth="2" />
          <path d="M218 356 L360 325" stroke="#F4F0E5" strokeOpacity="0.15" strokeWidth="2" />
        </g>
      </Layer>

      {/* Cover glass */}
      <Layer spread={spread} dx={LAYERS[4].dx} dy={LAYERS[4].dy}>
        <path d={SLAB} fill="url(#ep-glass)" stroke="#F4F0E5" strokeOpacity="0.55" />
        <path d="M270 140 L320 129" stroke="#F4F0E5" strokeOpacity="0.5" strokeWidth="4" strokeLinecap="round" />
      </Layer>

      {/* Scan line passing over the assembly */}
      {!reduce && (
        <motion.rect
          x="150"
          width="300"
          height="3"
          rx="1.5"
          fill="#00E5FF"
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: [90, 560, 90], opacity: [0, 0.9, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
          style={{ filter: "drop-shadow(0 0 8px #00E5FF)" }}
        />
      )}
    </svg>
  );
}
