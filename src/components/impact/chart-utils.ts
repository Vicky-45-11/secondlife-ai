import { useEffect, useRef, useState } from "react";
import type { ActionKind } from "@/lib/analysis/types";
import { formatNumber } from "@/lib/utils";

/** Categorical colours for recommendations. Every chart also labels them in text. */
export const ACTION_COLORS: Record<ActionKind, string> = {
  repair: "#00E5FF",
  reuse: "#CCFF00",
  refurbish: "#D6CDB6",
  donate: "#B48A5E",
  recycle: "#7C8B5E",
};

export const DIVERTED_COLOR = "#00E5FF";
export const RECYCLED_COLOR = "#7C8B5E";

export function formatCo2e(kg: number): { value: number; unit: "kg" | "t"; digits: number } {
  if (kg >= 1000) return { value: kg / 1000, unit: "t", digits: kg >= 100000 ? 0 : 1 };
  return { value: kg, unit: "kg", digits: 0 };
}

export function co2eText(kg: number) {
  const f = formatCo2e(kg);
  return `${formatNumber(f.value, f.digits)} ${f.unit}`;
}

export function pct(part: number, total: number) {
  return total === 0 ? 0 : Math.round((part / total) * 100);
}

/** Tracks an element's content width so SVG text stays at a real pixel size. */
export function useElementWidth<T extends HTMLElement>(fallback: number) {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(fallback);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const update = () => setWidth(Math.max(240, Math.round(el.clientWidth)));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return { ref, width };
}
