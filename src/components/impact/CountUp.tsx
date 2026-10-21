"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";
import { formatNumber } from "@/lib/utils";

/**
 * Counts up to `value` the first time it scrolls into view, then eases between
 * values when filters change. Screen readers get the final value only.
 */
export function CountUp({ value, digits = 0, className }: { value: number; digits?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(0);
  const current = useRef(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      current.current = value;
      setShown(value);
      return;
    }
    const controls = animate(current.current, value, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        current.current = v;
        setShown(v);
      },
    });
    return () => controls.stop();
  }, [inView, reduce, value]);

  return (
    <span ref={ref} className={className}>
      <span aria-hidden="true">{formatNumber(shown, digits)}</span>
      <span className="sr-only">{formatNumber(value, digits)}</span>
    </span>
  );
}
