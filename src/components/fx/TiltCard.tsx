"use client";

import { useRef } from "react";
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * A surface that tilts toward the pointer in 3D and carries a spotlight that
 * follows it. Mouse only; touch and reduced motion get a flat card.
 */
export function TiltCard({
  children,
  className,
  max = 7,
  glow = "rgba(204,255,0,0.14)",
  ...rest
}: { max?: number; glow?: string; children?: React.ReactNode } & Omit<HTMLMotionProps<"div">, "children">) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const rx = useSpring(0, { stiffness: 220, damping: 20 });
  const ry = useSpring(0, { stiffness: 220, damping: 20 });
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const light = useMotionTemplate`radial-gradient(22rem circle at ${mx}% ${my}%, ${glow}, transparent 65%)`;
  const lightOpacity = useSpring(0, { stiffness: 200, damping: 30 });

  return (
    <motion.div
      ref={ref}
      className={cn("relative [transform-style:preserve-3d]", className)}
      style={reduce ? undefined : { rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        ry.set((px - 0.5) * max * 2);
        rx.set(-(py - 0.5) * max * 2);
        mx.set(px * 100);
        my.set(py * 100);
        lightOpacity.set(1);
      }}
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
        lightOpacity.set(0);
      }}
      {...rest}
    >
      {children}
      {!reduce && (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{ background: light, opacity: lightOpacity }}
        />
      )}
    </motion.div>
  );
}
