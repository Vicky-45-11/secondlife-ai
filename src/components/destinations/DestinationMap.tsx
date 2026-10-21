"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Destination } from "@/data/destinations";
import { hashString } from "@/lib/utils";

const SIZE = 400;
const C = SIZE / 2;
const MAX_KM = 12;
const RINGS = [2, 5, 10];

function radius(km: number) {
  return 34 + (Math.min(km, MAX_KM) / MAX_KM) * 150;
}

function position(d: Destination) {
  if (d.distanceKm === 0) {
    // Online entries sit in their own pod, not on the map.
    const slot = hashString(d.id) % 3;
    return { x: 40 + slot * 12, y: 40 };
  }
  const angle = ((hashString(d.id) % 360) * Math.PI) / 180;
  const r = radius(d.distanceKm);
  return { x: C + Math.cos(angle) * r, y: C + Math.sin(angle) * r };
}

/**
 * Schematic map: the demo city centre in the middle, each entry placed at its
 * distance on a stable angle derived from its id. Not geography.
 */
export function DestinationMap({
  all,
  matched,
  activeId,
  onHover,
  onSelect,
}: {
  all: Destination[];
  matched: Destination[];
  activeId: string | null;
  onHover: (id: string | null) => void;
  onSelect: (d: Destination) => void;
}) {
  const reduce = useReducedMotion();
  const matchedIds = new Set(matched.map((d) => d.id));
  const nearest = matched.find((d) => d.distanceKm > 0);
  const label = `Schematic map of ${matched.length} matching entries around the demo city centre${
    nearest ? `; nearest physical one is ${nearest.name} at ${nearest.distanceKm.toFixed(1)} km` : ""
  }. Positions are illustrative.`;
  const active = all.find((d) => d.id === activeId);
  const activePos = active ? position(active) : null;

  return (
    <div className="relative">
      <svg role="img" aria-label={label} viewBox={`0 0 ${SIZE} ${SIZE}`} className="h-auto w-full">
        <defs>
          <radialGradient id="dest-map-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#00E5FF" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx={C} cy={C} r={190} fill="url(#dest-map-glow)" />
        {/* Faint street grid for texture */}
        {Array.from({ length: 9 }, (_, i) => (
          <g key={i} stroke="rgba(244,240,229,0.035)">
            <line x1={i * 50} x2={i * 50} y1={0} y2={SIZE} />
            <line y1={i * 50} y2={i * 50} x1={0} x2={SIZE} />
          </g>
        ))}
        <path d="M0 290 C 90 260, 150 330, 240 300 S 360 250, 400 270" fill="none" stroke="rgba(0,229,255,0.12)" strokeWidth={10} />
        {RINGS.map((km) => (
          <g key={km}>
            <circle cx={C} cy={C} r={radius(km)} fill="none" stroke="rgba(244,240,229,0.12)" strokeDasharray="2 5" />
            <text x={C + 4} y={C - radius(km) - 4} className="fill-ivory-100/35 font-mono text-[9px]">
              {km} km
            </text>
          </g>
        ))}
        <circle cx={C} cy={C} r={4} fill="#F4F0E5" />
        <circle cx={C} cy={C} r={10} fill="none" stroke="rgba(244,240,229,0.4)" />
        <text x={C} y={C + 24} textAnchor="middle" className="fill-ivory-100/50 font-mono text-[9px] uppercase tracking-[0.16em]">
          Demo centre
        </text>

        {/* Online pod */}
        <rect x={24} y={22} width={84} height={36} rx={18} fill="rgba(7,18,13,0.8)" stroke="rgba(244,240,229,0.15)" />
        <text x={90} y={43} textAnchor="middle" className="fill-ivory-100/45 font-mono text-[8px] uppercase tracking-[0.14em]">
          Online
        </text>

        {all.map((d) => {
          const { x, y } = position(d);
          const on = matchedIds.has(d.id);
          const isActive = d.id === activeId;
          return (
            <motion.g
              key={d.id}
              initial={false}
              animate={{ opacity: on ? 1 : 0.22 }}
              transition={{ duration: reduce ? 0 : 0.35 }}
              onPointerEnter={() => on && onHover(d.id)}
              onPointerLeave={() => onHover(null)}
              onClick={() => on && onSelect(d)}
              style={{ cursor: on ? "pointer" : "default" }}
            >
              <circle cx={x} cy={y} r={14} fill="transparent" />
              {isActive && !reduce && (
                <motion.circle
                  cx={x}
                  cy={y}
                  fill="none"
                  stroke="#CCFF00"
                  initial={{ r: 6, opacity: 0.9 }}
                  animate={{ r: 18, opacity: 0 }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
                />
              )}
              <circle
                cx={x}
                cy={y}
                r={isActive ? 7 : on ? 5 : 3.5}
                fill={isActive ? "#CCFF00" : on ? "#00E5FF" : "#F4F0E5"}
                stroke="#07120D"
                strokeWidth={2}
              />
            </motion.g>
          );
        })}

        {active && activePos && (
          <g pointerEvents="none">
            <rect
              x={Math.max(6, Math.min(SIZE - 186, activePos.x - 90))}
              y={activePos.y > 60 ? activePos.y - 40 : activePos.y + 16}
              width={180}
              height={24}
              rx={12}
              fill="rgba(7,18,13,0.92)"
              stroke="rgba(204,255,0,0.5)"
            />
            <text
              x={Math.max(6, Math.min(SIZE - 186, activePos.x - 90)) + 90}
              y={(activePos.y > 60 ? activePos.y - 40 : activePos.y + 16) + 15.5}
              textAnchor="middle"
              className="fill-ivory-50 text-[10.5px]"
            >
              {active.name.length > 28 ? `${active.name.slice(0, 27)}…` : active.name}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}
