"use client";

import { useState, type KeyboardEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { DIVERTED_COLOR, RECYCLED_COLOR, useElementWidth } from "./chart-utils";

export interface MonthDatum {
  key: string;
  label: string;
  longLabel: string;
  total: number;
  diverted: number;
}

const HEIGHT = 260;
const M = { top: 12, right: 8, bottom: 30, left: 34 };

function niceScale(max: number) {
  if (max <= 0) return { top: 4, step: 1 };
  const rough = max / 4;
  const mag = 10 ** Math.floor(Math.log10(rough));
  const step = [1, 2, 5, 10].map((n) => n * mag).find((s) => s >= rough) ?? 10 * mag;
  return { top: Math.ceil(max / step) * step, step };
}

export function summarizeMonths(data: MonthDatum[]) {
  if (data.length === 0) return "No analyses in this range.";
  const total = data.reduce((s, d) => s + d.total, 0);
  const peak = data.reduce((a, b) => (b.total > a.total ? b : a), data[0]);
  return `Bar chart of analyses per month from ${data[0].longLabel} to ${data[data.length - 1].longLabel}: ${total} in total, peaking at ${peak.total} in ${peak.longLabel}. Each bar splits estimated diverted devices from those recommended for recycling.`;
}

export function MonthlyChart({ data }: { data: MonthDatum[] }) {
  const { ref, width } = useElementWidth<HTMLDivElement>(720);
  const reduce = useReducedMotion();
  const [active, setActive] = useState<number | null>(null);

  const max = Math.max(0, ...data.map((d) => d.total));
  const { top, step } = niceScale(max);
  const innerW = width - M.left - M.right;
  const innerH = HEIGHT - M.top - M.bottom;
  const slot = data.length ? innerW / data.length : innerW;
  const barW = Math.max(6, Math.min(44, slot * 0.58));
  const y = (v: number) => M.top + innerH - (v / top) * innerH;
  const ticks: number[] = [];
  for (let t = 0; t <= top; t += step) ticks.push(t);
  // Thin out x labels on narrow screens.
  const labelEvery = slot < 30 ? 2 : 1;

  const onKey = (e: KeyboardEvent<SVGSVGElement>) => {
    if (!data.length) return;
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const dir = e.key === "ArrowRight" ? 1 : -1;
      setActive((a) => (a === null ? (dir > 0 ? 0 : data.length - 1) : Math.max(0, Math.min(data.length - 1, a + dir))));
    } else if (e.key === "Home") {
      e.preventDefault();
      setActive(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActive(data.length - 1);
    } else if (e.key === "Escape") {
      setActive(null);
    }
  };

  const activeDatum = active !== null ? data[active] : undefined;
  const tipX = active !== null ? M.left + slot * active + slot / 2 : 0;

  return (
    <div ref={ref} className="relative w-full">
      <svg
        role="img"
        aria-label={summarizeMonths(data)}
        width={width}
        height={HEIGHT}
        viewBox={`0 0 ${width} ${HEIGHT}`}
        tabIndex={0}
        onKeyDown={onKey}
        onFocus={() => setActive((a) => a ?? data.length - 1)}
        onBlur={() => setActive(null)}
        onPointerLeave={() => setActive(null)}
        className="block max-w-full overflow-visible rounded-md focus-visible:outline-offset-4"
      >
        {ticks.map((t) => (
          <g key={t}>
            <line x1={M.left} x2={width - M.right} y1={y(t)} y2={y(t)} stroke="rgba(244,240,229,0.08)" strokeDasharray={t === 0 ? undefined : "2 4"} />
            <text x={M.left - 8} y={y(t)} dy="0.32em" textAnchor="end" className="fill-ivory-100/45 font-mono text-[10px]">
              {t}
            </text>
          </g>
        ))}
        {data.map((d, i) => {
          const cx = M.left + slot * i + slot / 2;
          const x = cx - barW / 2;
          const recycled = d.total - d.diverted;
          const isActive = active === i;
          const dim = active !== null && !isActive;
          return (
            <g key={d.key} onPointerEnter={() => setActive(i)} style={{ opacity: dim ? 0.45 : 1, transition: "opacity 200ms" }}>
              {/* Full-height hit area so thin bars are easy to hover. */}
              <rect x={M.left + slot * i} y={M.top} width={slot} height={innerH} fill="transparent" />
              <motion.rect
                x={x}
                width={barW}
                rx={2}
                fill={DIVERTED_COLOR}
                initial={reduce ? false : { y: y(0), height: 0 }}
                animate={{ y: y(d.diverted), height: Math.max(0, y(0) - y(d.diverted)) }}
                transition={{ duration: reduce ? 0 : 0.8, delay: reduce ? 0 : i * 0.03, ease: [0.16, 1, 0.3, 1] }}
              />
              <motion.rect
                x={x}
                width={barW}
                rx={2}
                fill={RECYCLED_COLOR}
                initial={reduce ? false : { y: y(0), height: 0 }}
                animate={{ y: y(d.total), height: Math.max(0, y(d.diverted) - y(d.total) - (recycled > 0 && d.diverted > 0 ? 1.5 : 0)) }}
                transition={{ duration: reduce ? 0 : 0.8, delay: reduce ? 0 : i * 0.03, ease: [0.16, 1, 0.3, 1] }}
              />
              {isActive && <rect x={x - 3} y={y(d.total) - 3} width={barW + 6} height={y(0) - y(d.total) + 3} fill="none" stroke="#CCFF00" strokeWidth={1} rx={3} />}
              {i % labelEvery === 0 && (
                <text x={cx} y={HEIGHT - 10} textAnchor="middle" className={cn("font-mono text-[10px]", isActive ? "fill-lime-500" : "fill-ivory-100/50")}>
                  {d.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {activeDatum && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute z-10 w-48 -translate-x-1/2 rounded-lg border border-ivory-100/15 bg-forest-950/95 p-3 text-xs shadow-xl backdrop-blur"
          style={{ left: Math.max(96, Math.min(width - 96, tipX)), top: Math.max(0, y(activeDatum.total) - 96) }}
        >
          <p className="font-mono uppercase tracking-[0.14em] text-ivory-100/50">{activeDatum.longLabel}</p>
          <p className="mt-1 text-base text-ivory-50">{activeDatum.total} analyses</p>
          <p className="mt-1 flex items-center gap-2 text-ivory-100/70">
            <span className="h-2 w-2 rounded-sm" style={{ background: DIVERTED_COLOR }} /> {activeDatum.diverted} est. diverted
          </p>
          <p className="flex items-center gap-2 text-ivory-100/70">
            <span className="h-2 w-2 rounded-sm" style={{ background: RECYCLED_COLOR }} /> {activeDatum.total - activeDatum.diverted} to recycling
          </p>
        </div>
      )}
      <p className="sr-only" aria-live="polite">
        {activeDatum ? `${activeDatum.longLabel}: ${activeDatum.total} analyses, ${activeDatum.diverted} estimated diverted.` : ""}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-ivory-100/60">
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ background: DIVERTED_COLOR }} aria-hidden="true" /> Estimated diverted (repair, reuse, refurbish, donate)
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ background: RECYCLED_COLOR }} aria-hidden="true" /> Recommended for recycling
        </span>
        <span className="hidden text-ivory-100/40 sm:inline">Focus the chart and use ← → to step through months</span>
      </div>
    </div>
  );
}
