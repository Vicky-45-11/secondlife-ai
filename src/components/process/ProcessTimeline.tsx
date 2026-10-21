"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { Check } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { STAGES, STATUS_LABEL } from "@/data/process";
import { cn } from "@/lib/utils";
import { TiltCard } from "@/components/fx/TiltCard";

/** The six stages, with a connector line that draws itself as you scroll. */
export function ProcessTimeline() {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const draw = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <ol ref={ref} className="relative mt-20">
      <span aria-hidden="true" className="absolute bottom-0 left-[1.4rem] top-0 w-px bg-ivory-100/10 md:left-1/2" />
      <motion.span
        aria-hidden="true"
        className="absolute left-[1.4rem] top-0 h-full w-px origin-top bg-lime-500 md:left-1/2"
        style={{ scaleY: reduce ? 1 : draw }}
      />
      {STAGES.map((s, i) => {
        const right = i % 2 === 1;
        return (
          <li key={s.id} id={s.id} className="relative grid gap-6 pb-20 pl-16 last:pb-0 md:grid-cols-2 md:gap-16 md:pl-0">
            <span
              aria-hidden="true"
              className="absolute left-0 top-0 flex h-11 w-11 items-center justify-center rounded-full border border-lime-500/50 bg-forest-950 font-mono text-sm text-lime-500 md:left-1/2 md:-translate-x-1/2"
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <Reveal className={cn("md:pt-1", right ? "md:order-2 md:pl-14" : "md:pr-14 md:text-right")}>
              <span
                className={cn(
                  "inline-block rounded-full border px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-[0.16em]",
                  s.status === "live" ? "border-lime-500/40 text-lime-500" : "border-cyan-500/40 text-cyan-300",
                )}
              >
                {STATUS_LABEL[s.status]}
              </span>
              <h2 className="display mt-4 text-[clamp(2.4rem,5vw,4.2rem)] text-ivory-50">{s.title}</h2>
              <p className="mt-2 font-mono text-xs uppercase tracking-[0.16em] text-ivory-100/45">{s.short}</p>
            </Reveal>
            <Reveal delay={0.1} className={cn(right ? "md:order-1 md:pr-14" : "md:pl-14")}>
              <TiltCard className="panel p-7" max={4}>
                <p className="text-lg leading-relaxed text-ivory-100/75">{s.body}</p>
                <ul className="mt-6 space-y-3">
                  {s.detail.map((d) => (
                    <li key={d} className="flex items-start gap-3 text-ivory-100/65">
                      <Check className="mt-1 h-4 w-4 shrink-0 text-lime-500" aria-hidden="true" />
                      {d}
                    </li>
                  ))}
                </ul>
              </TiltCard>
            </Reveal>
          </li>
        );
      })}
    </ol>
  );
}
