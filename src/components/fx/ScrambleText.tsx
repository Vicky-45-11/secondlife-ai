"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

const GLYPHS = "▚▞▖▗▘▝01<>/#%&*+=";

/**
 * Text that decodes from random glyphs into the real words: once when it
 * scrolls into view, and again on hover. Screen readers always get the real
 * text; the scramble is visual only.
 */
export function ScrambleText({
  text,
  className,
  onHover = true,
  as: Tag = "span",
}: {
  text: string;
  className?: string;
  onHover?: boolean;
  as?: "span" | "p";
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  const [out, setOut] = useState(text);
  const frame = useRef(0);

  const run = useCallback(() => {
    if (reduce) return;
    cancelAnimationFrame(frame.current);
    const start = performance.now();
    const duration = 380 + text.length * 22;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const revealed = Math.floor(t * text.length);
      setOut(
        text
          .split("")
          .map((ch, i) => (i < revealed || ch === " " ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
          .join(""),
      );
      if (t < 1) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
  }, [reduce, text]);

  useEffect(() => {
    if (inView) run();
  }, [inView, run]);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  return (
    <Tag className={className} onMouseEnter={onHover ? run : undefined}>
      <span className="sr-only">{text}</span>
      <span ref={ref} aria-hidden="true">
        {out}
      </span>
    </Tag>
  );
}
