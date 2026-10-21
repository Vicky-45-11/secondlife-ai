"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { DeviceCategory } from "@/lib/analysis/types";
import { cn } from "@/lib/utils";

export interface CategoryDatum {
  id: DeviceCategory;
  label: string;
  count: number;
}

export function summarizeCategories(data: CategoryDatum[]) {
  const nonZero = data.filter((d) => d.count > 0);
  if (nonZero.length === 0) return "Horizontal bar chart of device categories: no analyses in this selection.";
  return `Horizontal bar chart of analyses by device category: ${nonZero.map((d) => `${d.label} ${d.count}`).join(", ")}.`;
}

/** Horizontal bars, sorted largest first. The selected category is highlighted. */
export function CategoryBars({ data, highlight }: { data: CategoryDatum[]; highlight: DeviceCategory | "all" }) {
  const reduce = useReducedMotion();
  const sorted = [...data].sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
  const max = Math.max(1, ...sorted.map((d) => d.count));
  const total = sorted.reduce((s, d) => s + d.count, 0);

  return (
    <div role="img" aria-label={summarizeCategories(sorted)}>
      <ul className="space-y-3" aria-hidden="true">
        {sorted.map((d, i) => {
          const on = highlight === "all" ? i === 0 && d.count > 0 : highlight === d.id;
          const w = (d.count / max) * 100;
          return (
            <li key={d.id} className="grid grid-cols-[minmax(7rem,9.5rem)_1fr_auto] items-center gap-3 text-sm">
              <span className={cn("truncate", on ? "text-ivory-50" : "text-ivory-100/65")}>{d.label}</span>
              <svg className="h-3 w-full" preserveAspectRatio="none" viewBox="0 0 100 12">
                <rect x={0} y={5.5} width={100} height={1} fill="rgba(244,240,229,0.08)" />
                <motion.rect
                  x={0}
                  y={1}
                  height={10}
                  rx={1}
                  fill={on ? "#CCFF00" : "rgba(103,232,249,0.55)"}
                  initial={reduce ? false : { width: 0 }}
                  animate={{ width: w }}
                  transition={{ duration: reduce ? 0 : 0.9, delay: reduce ? 0 : i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                />
              </svg>
              <span className="w-16 text-right font-mono text-xs tabular-nums text-ivory-100/55">
                {d.count}
                <span className="text-ivory-100/30"> · {total ? Math.round((d.count / total) * 100) : 0}%</span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
