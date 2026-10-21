"use client";

import Link from "next/link";
import { useRef, type ComponentProps, type ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "dark";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-lime-500 text-forest-950 shadow-[0_0_0_1px_rgba(204,255,0,0.4),0_10px_30px_-12px_rgba(204,255,0,0.6)]",
  secondary: "border border-ivory-100/25 text-ivory-100 hover:border-lime-500 hover:text-forest-950",
  ghost: "text-ivory-100/80 hover:text-ivory-100",
  dark: "bg-forest-950 text-ivory-100 hover:text-forest-950",
};

// The colour that floods up from the bottom of the button on hover.
const FILL: Record<Variant, string | null> = {
  primary: "bg-ivory-50",
  secondary: "bg-lime-500",
  ghost: null,
  dark: "bg-lime-500",
};

function Fill({ variant }: { variant: Variant }) {
  const fill = FILL[variant];
  if (!fill) return null;
  return (
    <span
      aria-hidden="true"
      className={cn(
        "absolute inset-0 -z-10 translate-y-[101%] rounded-[inherit] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-focus-visible:translate-y-0",
        fill,
      )}
    />
  );
}

interface BaseProps {
  children: ReactNode;
  variant?: Variant;
  size?: "md" | "lg";
  className?: string;
  /** A slight pull toward the cursor on fine pointers. The click target never moves far. */
  magnetic?: boolean;
}

function useMagnet(enabled: boolean) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 20 });
  const sy = useSpring(y, { stiffness: 300, damping: 20 });
  const ref = useRef<HTMLSpanElement>(null);
  const on = enabled && !reduce;
  const handlers = on
    ? {
        onPointerMove: (e: React.PointerEvent) => {
          if (e.pointerType !== "mouse" || !ref.current) return;
          const r = ref.current.getBoundingClientRect();
          x.set(((e.clientX - r.left) / r.width - 0.5) * 10);
          y.set(((e.clientY - r.top) / r.height - 0.5) * 8);
        },
        onPointerLeave: () => {
          x.set(0);
          y.set(0);
        },
      }
    : {};
  return { ref, style: { x: sx, y: sy }, handlers };
}

const base =
  "group relative isolate inline-flex overflow-hidden select-none items-center justify-center gap-2 rounded-full font-medium transition-[background-color,border-color,color,box-shadow] duration-300 disabled:pointer-events-none disabled:opacity-40";
const sizes = { md: "h-11 px-5 text-[0.95rem]", lg: "h-14 px-7 text-base" };

export function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "md",
  className,
  magnetic = false,
  ...rest
}: BaseProps & Omit<ComponentProps<typeof Link>, "className" | "children">) {
  const m = useMagnet(magnetic);
  return (
    <motion.span ref={m.ref} style={m.style} {...m.handlers} className="inline-flex">
      <Link href={href} className={cn(base, sizes[size], VARIANTS[variant], className)} {...rest}>
        <Fill variant={variant} />
        {children}
      </Link>
    </motion.span>
  );
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  magnetic = false,
  ...rest
}: BaseProps & Omit<ComponentProps<"button">, "className" | "children">) {
  const m = useMagnet(magnetic);
  return (
    <motion.span ref={m.ref} style={m.style} {...m.handlers} className="inline-flex">
      <button type="button" className={cn(base, sizes[size], VARIANTS[variant], className)} {...rest}>
        <Fill variant={variant} />
        {children}
      </button>
    </motion.span>
  );
}
