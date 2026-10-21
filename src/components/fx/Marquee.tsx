"use client";

import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  wrap,
} from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Kinetic type band. It drifts on its own, speeds up and leans with scroll
 * velocity, and flips direction when you scroll back up. Hovering slows it so
 * the words can be read.
 */
export function Marquee({
  words,
  baseVelocity = -2.5,
  tone = "dark",
  className,
}: {
  words: string[];
  baseVelocity?: number;
  tone?: "dark" | "lime" | "light";
  className?: string;
}) {
  const reduce = useReducedMotion();
  const base = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  const factor = useTransform(smooth, [-1000, 0, 1000], [-4, 0, 4], { clamp: false });
  const skew = useTransform(smooth, [-1500, 0, 1500], [8, 0, -8]);
  const x = useTransform(base, (v) => `${wrap(-50, 0, v)}%`);
  const direction = useRef(1);
  const hovering = useRef(false);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    let move = direction.current * baseVelocity * (delta / 1000) * (hovering.current ? 0.25 : 1);
    const f = factor.get();
    if (f < 0) direction.current = -1;
    else if (f > 0) direction.current = 1;
    move += direction.current * move * f;
    base.set(base.get() + move);
  });

  const toneClass =
    tone === "lime"
      ? "bg-lime-500 text-forest-950 [--stroke:#07120d]"
      : tone === "light"
        ? "bg-ivory-100 text-forest-950 [--stroke:#07120d]"
        : "bg-forest-950 text-ivory-50 [--stroke:#ccff00]";

  const row = (
    <span className="flex shrink-0 items-center">
      {words.map((w, i) => (
        <span key={i} className="flex items-center">
          <span className={cn("px-6 sm:px-10", i % 2 === 1 && "text-outline")}>{w}</span>
          <span className="text-[0.5em] opacity-60" aria-hidden="true">
            ✺
          </span>
        </span>
      ))}
    </span>
  );

  return (
    <div
      className={cn("relative overflow-hidden border-y border-ivory-100/10 py-5 sm:py-7", toneClass, className)}
      onMouseEnter={() => (hovering.current = true)}
      onMouseLeave={() => (hovering.current = false)}
      aria-label={words.join(", ")}
      role="img"
    >
      <motion.div
        className="flex w-max whitespace-nowrap font-grotesk text-[clamp(2.4rem,7vw,6rem)] font-bold uppercase leading-none tracking-[-0.03em] [font-stretch:75%]"
        style={{ x, skewX: reduce ? 0 : skew }}
        aria-hidden="true"
      >
        {row}
        {row}
        {row}
        {row}
      </motion.div>
    </div>
  );
}
