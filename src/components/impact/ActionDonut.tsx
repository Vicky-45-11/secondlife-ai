"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ACTIONS, ACTION_ORDER } from "@/data/devices";
import type { ActionKind } from "@/lib/analysis/types";
import { cn } from "@/lib/utils";
import { ACTION_COLORS, pct } from "./chart-utils";

export type ActionCounts = Record<ActionKind, number>;

export function summarizeActions(counts: ActionCounts) {
  const total = ACTION_ORDER.reduce((s, k) => s + counts[k], 0);
  if (total === 0) return "Donut chart of recommendations: no analyses in this selection.";
  const parts = ACTION_ORDER.map((k) => `${ACTIONS[k].label} ${counts[k]} (${pct(counts[k], total)}%)`).join(", ");
  return `Donut chart of top recommendations across ${total} analyses: ${parts}.`;
}

const SIZE = 220;
const R = 84;
const STROKE = 26;
const C = 2 * Math.PI * R;

export function ActionDonut({ counts }: { counts: ActionCounts }) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<ActionKind | null>(null);
  const total = ACTION_ORDER.reduce((s, k) => s + counts[k], 0);

  let offset = 0;
  const segments = ACTION_ORDER.map((kind) => {
    const len = total ? (counts[kind] / total) * C : 0;
    const seg = { kind, len, offset };
    offset += len;
    return seg;
  });

  const focus = active ?? null;
  const centreValue = focus ? counts[focus] : total;
  const centreLabel = focus ? ACTIONS[focus].label : "analyses";

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center lg:flex-col">
      <svg role="img" aria-label={summarizeActions(counts)} viewBox={`0 0 ${SIZE} ${SIZE}`} className="h-52 w-52 shrink-0">
        <circle cx={SIZE / 2} cy={SIZE / 2} r={R} fill="none" stroke="rgba(244,240,229,0.06)" strokeWidth={STROKE} />
        <g transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}>
          {segments.map((s) =>
            s.len > 0 ? (
              <motion.circle
                key={s.kind}
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={R}
                fill="none"
                stroke={ACTION_COLORS[s.kind]}
                strokeWidth={focus === s.kind ? STROKE + 6 : STROKE}
                strokeDashoffset={-s.offset}
                initial={reduce ? false : { strokeDasharray: `0 ${C}` }}
                animate={{ strokeDasharray: `${Math.max(0, s.len - 2)} ${C}`, opacity: focus && focus !== s.kind ? 0.3 : 1 }}
                transition={{ duration: reduce ? 0 : 0.9, ease: [0.16, 1, 0.3, 1] }}
                onPointerEnter={() => setActive(s.kind)}
                onPointerLeave={() => setActive(null)}
                style={{ cursor: "default" }}
              />
            ) : null,
          )}
        </g>
        <text x={SIZE / 2} y={SIZE / 2 - 4} textAnchor="middle" className="fill-ivory-50 font-display text-[40px]">
          {centreValue}
        </text>
        <text x={SIZE / 2} y={SIZE / 2 + 22} textAnchor="middle" className="fill-ivory-100/55 font-mono text-[10px] uppercase tracking-[0.18em]">
          {focus ? `${centreLabel} · ${pct(counts[focus], total)}%` : centreLabel}
        </text>
      </svg>

      <ul className="w-full space-y-1.5" aria-label="Recommendation legend">
        {ACTION_ORDER.map((kind) => (
          <li key={kind}>
            <button
              type="button"
              onMouseEnter={() => setActive(kind)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(kind)}
              onBlur={() => setActive(null)}
              aria-label={`${ACTIONS[kind].label}: ${counts[kind]} analyses, ${pct(counts[kind], total)} percent`}
              className={cn(
                "flex w-full items-center justify-between gap-3 rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors",
                focus === kind ? "bg-ivory-100/[0.07] text-ivory-50" : "text-ivory-100/75 hover:bg-ivory-100/[0.04]",
              )}
            >
              <span className="flex items-center gap-2.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: ACTION_COLORS[kind] }} aria-hidden="true" />
                {ACTIONS[kind].label}
              </span>
              <span className="font-mono text-xs tabular-nums text-ivory-100/55">
                {counts[kind]} · {pct(counts[kind], total)}%
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
