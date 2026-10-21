"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Check, X } from "lucide-react";
import type { AnalysisProgress } from "@/lib/analysis";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { DemoBadge } from "@/components/ui/DemoBadge";
import { PreviewImage } from "./PreviewImage";
import { CornerBrackets, STAGE_LABELS } from "./shared";

export function ScanningView({
  file,
  previewUrl,
  progress,
  onCancel,
}: {
  file: File;
  previewUrl: string | null;
  progress: AnalysisProgress | null;
  onCancel: () => void;
}) {
  const reduce = useReducedMotion();
  const value = progress?.progress ?? 0;
  const pct = Math.round(value * 100);
  const activeIndex = progress ? STAGE_LABELS.findIndex((s) => s.stage === progress.stage) : 0;
  const finished = value >= 1;

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
      {/* Scanned image */}
      <div className="lg:col-span-7">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-cyan-500/30 bg-forest-900 sm:aspect-[5/4]">
          <PreviewImage key={previewUrl ?? "none"} src={previewUrl} name={file.name} className="opacity-80 saturate-[0.85]" />
          {/* Grid + tint overlay */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-cyan-500/[0.06] [background-image:linear-gradient(rgba(0,229,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.08)_1px,transparent_1px)] [background-size:40px_40px]"
          />
          {/* Scan line */}
          {reduce ? (
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-cyan-300/70" />
          ) : (
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-full"
              initial={{ y: "-12%" }}
              animate={{ y: "100%" }}
              transition={{ duration: 2.2, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
            >
              <div className="scanline h-16 w-full -translate-y-1/2" />
              <div className="h-px w-full -translate-y-8 bg-cyan-300 shadow-glow-cyan" />
            </motion.div>
          )}
          <CornerBrackets />
          <div className="absolute left-4 right-4 top-4 flex items-center justify-between gap-3 pl-6 pr-6">
            <span className="eyebrow rounded-full bg-forest-950/70 px-2.5 py-1 text-cyan-300 backdrop-blur-sm">
              Scanning
            </span>
            <span className="rounded-full bg-forest-950/70 px-2.5 py-1 font-mono text-xs tabular-nums text-ivory-50 backdrop-blur-sm">
              {pct}%
            </span>
          </div>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-forest-950/90 to-transparent px-6 pb-5 pt-12">
            <p className="truncate font-mono text-xs text-ivory-100/60">{file.name}</p>
          </div>
        </div>
      </div>

      {/* Stages */}
      <div className="flex flex-col lg:col-span-5">
        <p className="eyebrow text-cyan-300">Analysing</p>
        <h2 className="display mt-4 text-[clamp(2.25rem,4.5vw,3.75rem)] text-ivory-50">Reading the device.</h2>
        <p className="mt-4 text-ivory-100/60" aria-live="polite">
          {progress?.message ?? "Starting"}…
        </p>

        <div className="mt-8">
          <div
            role="progressbar"
            aria-label="Analysis progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={pct}
            className="h-1 w-full overflow-hidden rounded-full bg-ivory-100/10"
          >
            <div
              className="h-full w-full origin-left rounded-full bg-cyan-500 transition-transform duration-500 ease-out"
              style={{ transform: `scaleX(${value})` }}
            />
          </div>
        </div>

        <ol className="mt-8 space-y-1">
          {STAGE_LABELS.map((s, i) => {
            const state = finished || i < activeIndex ? "done" : i === activeIndex ? "active" : "pending";
            return (
              <li
                key={s.stage}
                className={cn(
                  "flex items-start gap-4 rounded-xl px-3 py-3 transition-colors duration-300",
                  state === "active" && "bg-cyan-500/[0.07]",
                )}
                aria-current={state === "active" ? "step" : undefined}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border font-mono text-[0.65rem]",
                    state === "done" && "border-cyan-500 bg-cyan-500 text-forest-950",
                    state === "active" && "border-cyan-300 text-cyan-300",
                    state === "pending" && "border-ivory-100/20 text-ivory-100/45",
                  )}
                >
                  {state === "done" ? (
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  ) : state === "active" ? (
                    <span className={cn("h-2 w-2 rounded-full bg-cyan-300", !reduce && "animate-pulse")} />
                  ) : (
                    i + 1
                  )}
                </span>
                <span className="min-w-0">
                  <span
                    className={cn(
                      "block text-sm",
                      state === "pending" ? "text-ivory-100/45" : "text-ivory-50",
                    )}
                  >
                    {s.label}
                    <span className="sr-only">
                      {state === "done" ? " (done)" : state === "active" ? " (in progress)" : " (pending)"}
                    </span>
                  </span>
                  <span className="block text-xs text-ivory-100/45">{s.detail}</span>
                </span>
              </li>
            );
          })}
        </ol>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Button variant="secondary" onClick={onCancel}>
            <X className="h-4 w-4" aria-hidden="true" />
            Cancel
          </Button>
          <DemoBadge>Demo analysis</DemoBadge>
        </div>
      </div>
    </div>
  );
}
