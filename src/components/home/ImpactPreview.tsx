"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DemoBadge } from "@/components/ui/DemoBadge";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { SAMPLE_ANALYSES } from "@/data/sample-dashboard";
import { formatNumber } from "@/lib/utils";

const LoopScene = dynamic(() => import("./LoopScene"), { ssr: false });

// Totals from the synthetic sample dataset, the same one the dashboard uses.
const devices = SAMPLE_ANALYSES.length;
const kept = SAMPLE_ANALYSES.filter((r) => r.action !== "recycle").length;
const kg = Math.round(SAMPLE_ANALYSES.reduce((s, r) => s + r.weightKg, 0));
const co2 = Math.round(SAMPLE_ANALYSES.reduce((s, r) => s + r.co2eKg, 0));

const METRICS = [
  { value: devices, suffix: "", label: "devices analysed" },
  { value: Math.round((kept / devices) * 100), suffix: "%", label: "kept in use rather than recycled" },
  { value: kg, suffix: " kg", label: "of electronics routed" },
  { value: co2, suffix: " kg", label: "CO₂e avoided (illustrative)" },
];

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduce = useReducedMotion();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setN(to);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 1600);
      setN(Math.round(to * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, to]);
  return (
    <span ref={ref} aria-label={`${formatNumber(to)}${suffix}`}>
      <span aria-hidden="true">
        {formatNumber(n)}
        {suffix}
      </span>
    </span>
  );
}

function LoopFallback() {
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="loop-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#CCFF00" />
          <stop offset="100%" stopColor="#00E5FF" />
        </linearGradient>
      </defs>
      <ellipse cx="100" cy="100" rx="78" ry="34" fill="none" stroke="url(#loop-g)" strokeWidth="1.2" strokeDasharray="2 5" opacity="0.8" />
      <ellipse cx="100" cy="100" rx="66" ry="26" fill="none" stroke="#F4F0E5" strokeOpacity="0.15" />
    </svg>
  );
}

export function ImpactPreview() {
  const reduce = useReducedMotion();
  const box = useRef<HTMLDivElement>(null);
  const near = useInView(box, { once: true, margin: "400px 0px" });
  const [state, setState] = useState<"idle" | "ready" | "failed">("idle");
  const onReady = useCallback(() => setState("ready"), []);
  const onFail = useCallback(() => setState("failed"), []);

  return (
    <section aria-labelledby="impact-title" className="relative overflow-hidden bg-forest-950 py-28 sm:py-36">
      <div className="page-x grid items-center gap-16 lg:grid-cols-[1fr_1fr]">
        <div>
          <SectionHeading
            id="impact-title"
            index="05"
            eyebrow="Impact"
            lines={["Small decisions,", <span key="l"><em className="text-lime-500">counted</em> together.</span>]}
            intro="This is how impact will read once real people use SecondLife. For now the dashboard runs on a synthetic sample, and it says so everywhere."
          />
          <Reveal delay={0.1} className="mt-8 flex flex-wrap items-center gap-4">
            <DemoBadge>Sample data · not real users</DemoBadge>
            <ButtonLink href="/impact" variant="secondary">
              Open the impact dashboard
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
          </Reveal>
        </div>

        <div ref={box} className="relative aspect-square w-full">
          <div className="absolute inset-0">
            {state !== "ready" && <LoopFallback />}
          </div>
          {near && !reduce && state !== "failed" && (
            <div className="absolute inset-0">
              <LoopScene onReady={onReady} onFail={onFail} />
            </div>
          )}
          <dl className="absolute inset-0 grid grid-cols-2 content-center gap-x-6 gap-y-10 p-6 sm:p-12">
            {METRICS.map((m) => (
              <div key={m.label} className="flex flex-col rounded-2xl bg-forest-950/50 p-3 backdrop-blur-[2px]">
                <dt className="order-2 mt-2 text-sm text-ivory-100/60">{m.label}</dt>
                <dd className="display text-[clamp(2.2rem,5vw,4rem)] text-ivory-50">
                  <Counter to={m.value} suffix={m.suffix} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
