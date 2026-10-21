import {
  BatteryCharging,
  CircuitBoard,
  Cpu,
  Gamepad2,
  Hammer,
  Headphones,
  HeartHandshake,
  Laptop,
  Microwave,
  Monitor,
  Recycle,
  Repeat,
  ScanSearch,
  Smartphone,
  Tablet,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { ActionKind, AnalysisStage, DeviceCategory, Level } from "@/lib/analysis";

export const CATEGORY_ICONS: Record<DeviceCategory | "auto", LucideIcon> = {
  auto: ScanSearch,
  smartphone: Smartphone,
  laptop: Laptop,
  tablet: Tablet,
  desktop: Cpu,
  display: Monitor,
  audio: Headphones,
  console: Gamepad2,
  appliance: Microwave,
  battery: BatteryCharging,
  other: CircuitBoard,
};

export const ACTION_ICONS: Record<ActionKind, LucideIcon> = {
  repair: Wrench,
  reuse: Repeat,
  refurbish: Hammer,
  donate: HeartHandshake,
  recycle: Recycle,
};

export const STAGE_LABELS: { stage: AnalysisStage; label: string; detail: string }[] = [
  { stage: "upload", label: "Upload", detail: "Reading the photo" },
  { stage: "vision", label: "Identify", detail: "Working out what the device is" },
  { stage: "components", label: "Components", detail: "Mapping reusable parts" },
  { stage: "decision", label: "Decision", detail: "Weighing repair, reuse and recycling" },
  { stage: "matching", label: "Matching", detail: "Finding places that can take it" },
];

export const LEVEL_LABEL: Record<Level, string> = { high: "High", medium: "Medium", low: "Low" };

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export const EASE = [0.16, 1, 0.3, 1] as const;

/** Four corner brackets framing a scanned image. */
export function CornerBrackets({ className = "border-cyan-300/80" }: { className?: string }) {
  const base = `pointer-events-none absolute h-6 w-6 ${className}`;
  return (
    <>
      <span aria-hidden="true" className={`${base} left-3 top-3 border-l-2 border-t-2`} />
      <span aria-hidden="true" className={`${base} right-3 top-3 border-r-2 border-t-2`} />
      <span aria-hidden="true" className={`${base} bottom-3 left-3 border-b-2 border-l-2`} />
      <span aria-hidden="true" className={`${base} bottom-3 right-3 border-b-2 border-r-2`} />
    </>
  );
}
