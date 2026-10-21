"use client";

import { useRef } from "react";
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { SplitHeadline } from "@/components/motion/Reveal";

/** Closing call to action with a soft light that follows the pointer. */
export function FinalCta() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const x = useSpring(useMotionValue(50), { stiffness: 60, damping: 20 });
  const y = useSpring(useMotionValue(50), { stiffness: 60, damping: 20 });
  const light = useMotionTemplate`radial-gradient(38rem circle at ${x}% ${y}%, rgba(204,255,0,0.14), transparent 60%)`;

  return (
    <section
      ref={ref}
      aria-labelledby="cta-title"
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set(((e.clientX - r.left) / r.width) * 100);
        y.set(((e.clientY - r.top) / r.height) * 100);
      }}
      className="grain relative overflow-hidden bg-forest-900 py-32 sm:py-44"
    >
      <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: light }} />
      <div className="page-x relative text-center">
        <p className="eyebrow text-lime-500">Your turn</p>
        <SplitHeadline
          id="cta-title"
          lines={["Don't discard it.", <em key="l" className="text-lime-500">Discover its next life.</em>]}
          className="display mx-auto mt-6 max-w-5xl text-[clamp(3rem,8vw,7.5rem)] text-ivory-50"
        />
        <p className="mx-auto mt-8 max-w-xl text-lg text-ivory-100/65">
          Pick a device you no longer use. It takes a photo and a minute to see where it could go next.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/analyze" size="lg" magnetic>
            Analyze a Device
            <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
          </ButtonLink>
          <ButtonLink href="/destinations" size="lg" variant="secondary">
            Browse destinations
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
