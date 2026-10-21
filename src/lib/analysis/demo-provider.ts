import { ACTION_ORDER, categoryInfo, CATEGORIES } from "@/data/devices";
import { DESTINATIONS, destinationAccepts } from "@/data/destinations";
import { hashString } from "@/lib/utils";
import type {
  ActionKind,
  ActionRecommendation,
  AnalysisInput,
  AnalysisProgress,
  AnalysisProvider,
  AnalysisResult,
  DeviceCategory,
  DeviceCondition,
  Level,
} from "./types";

/**
 * DEMO PROVIDER. It does not look at the pixels of the photo. It combines what
 * the visitor selected (category, condition, notes) with a stable hash of the
 * file, so the same inputs always give the same sample result. Every result it
 * returns is marked `isDemo: true` and the UI labels it as such.
 */

const STAGES: { stage: AnalysisProgress["stage"]; message: string; ms: number }[] = [
  { stage: "upload", message: "Reading the photo", ms: 500 },
  { stage: "vision", message: "Identifying the device", ms: 900 },
  { stage: "components", message: "Mapping reusable components", ms: 900 },
  { stage: "decision", message: "Weighing repair, reuse and recycling", ms: 800 },
  { stage: "matching", message: "Matching destinations", ms: 600 },
];

function wait(ms: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal?.aborted) return reject(new DOMException("Aborted", "AbortError"));
    const id = setTimeout(resolve, ms);
    signal?.addEventListener(
      "abort",
      () => {
        clearTimeout(id);
        reject(new DOMException("Aborted", "AbortError"));
      },
      { once: true },
    );
  });
}

function guessCategory(fileName: string, description: string): { category: DeviceCategory; by: "file-name" | "fallback" } {
  const text = `${fileName} ${description}`.toLowerCase();
  for (const c of CATEGORIES) {
    if (c.keywords.some((k) => text.includes(k))) return { category: c.id, by: "file-name" };
  }
  return { category: "other", by: "fallback" };
}

const CONDITION_EFFECT: Record<DeviceCondition, { grade: "A" | "B" | "C" | "D"; repairShift: number; summary: string }> = {
  working: { grade: "A", repairShift: 1, summary: "Reported working. Best candidate for direct reuse or donation." },
  "minor-issues": { grade: "B", repairShift: 1, summary: "Minor faults reported. Usually worth repairing before reuse." },
  "not-powering": { grade: "C", repairShift: -1, summary: "No power reported. Needs diagnosis; many causes are cheap to fix." },
  damaged: { grade: "D", repairShift: -3, summary: "Heavy damage reported. Parts recovery and recycling are most likely." },
  unknown: { grade: "C", repairShift: 0, summary: "Condition not checked. A quick test would sharpen these suggestions." },
};

// How suitable each action is for each reported condition (0–100 before adjustments).
const ACTION_FIT: Record<DeviceCondition, Record<ActionKind, number>> = {
  working: { reuse: 92, donate: 86, refurbish: 70, repair: 30, recycle: 12 },
  "minor-issues": { repair: 88, refurbish: 78, reuse: 60, donate: 45, recycle: 18 },
  "not-powering": { repair: 74, refurbish: 62, recycle: 50, donate: 20, reuse: 15 },
  damaged: { recycle: 90, refurbish: 38, repair: 30, donate: 8, reuse: 5 },
  unknown: { repair: 66, refurbish: 64, reuse: 55, donate: 50, recycle: 40 },
};

const ACTION_REASON: Record<ActionKind, (label: string) => string> = {
  repair: (l) => `Common ${l.toLowerCase()} faults are fixable, and repair keeps the most value in use.`,
  reuse: (l) => `A working ${l.toLowerCase()} can go straight to a new owner or a second job at home.`,
  refurbish: () => "A refurbisher can test, wipe data, replace worn parts and resell with a warranty.",
  donate: () => "Donation programmes put working devices in the hands of students and community groups.",
  recycle: () => "Certified recycling recovers metals and handles batteries and hazardous parts safely.",
};

const VALUE_ORDER: Level[] = ["low", "medium", "high"];

export const demoProvider: AnalysisProvider = {
  id: "demo",
  name: "SecondLife demo analyser",
  isDemo: true,

  async analyze(input: AnalysisInput, onProgress, signal): Promise<AnalysisResult> {
    let done = 0;
    const total = STAGES.reduce((s, x) => s + x.ms, 0);
    for (const step of STAGES) {
      onProgress({ stage: step.stage, progress: done / total, message: step.message });
      await wait(step.ms, signal);
      done += step.ms;
    }
    onProgress({ stage: "matching", progress: 1, message: "Done" });

    const seed = hashString(`${input.file.name}|${input.file.size}|${input.file.lastModified}|${input.category}|${input.condition}`);
    const picked =
      input.category === "auto"
        ? guessCategory(input.file.name, input.description)
        : { category: input.category, by: "visitor" as const };
    const info = categoryInfo(picked.category);
    const cond = CONDITION_EFFECT[input.condition];

    const repairability = Math.max(1, Math.min(10, info.baseRepairability + cond.repairShift + ((seed % 3) - 1)));

    const actions: ActionRecommendation[] = ACTION_ORDER.map((kind) => {
      let score = ACTION_FIT[input.condition][kind];
      if (kind === "repair" || kind === "refurbish") score += (repairability - 5) * 3;
      if (picked.category === "battery" && kind !== "recycle") score -= 35;
      score += (seed >> (ACTION_ORDER.indexOf(kind) * 3)) % 5;
      return { kind, score: Math.max(2, Math.min(98, Math.round(score))), reason: ACTION_REASON[kind](info.label) };
    }).sort((a, b) => b.score - a.score);

    const topKinds = actions.slice(0, 3).map((a) => a.kind);
    const destinationIds = DESTINATIONS.filter(
      (d) => destinationAccepts(d, picked.category) && d.actions.some((a) => topKinds.includes(a)),
    )
      .sort((a, b) => {
        const rank = (d: typeof a) => Math.min(...d.actions.map((x) => (topKinds.includes(x) ? topKinds.indexOf(x) : 9)));
        return rank(a) - rank(b) || a.distanceKm - b.distanceKm;
      })
      .slice(0, 4)
      .map((d) => d.id);

    let valueIndex = VALUE_ORDER.indexOf(info.baseValue);
    if (input.condition === "damaged") valueIndex -= 1;
    if (input.condition === "working") valueIndex += 0;
    const valueBand = VALUE_ORDER[Math.max(0, Math.min(2, valueIndex))];

    const label = input.description.trim() ? `${info.label} · ${input.description.trim().slice(0, 48)}` : info.label;

    return {
      id: `an_${seed.toString(36)}_${Date.now().toString(36)}`,
      createdAt: new Date().toISOString(),
      provider: { id: this.id, name: this.name, isDemo: true },
      image: { name: input.file.name, sizeBytes: input.file.size, type: input.file.type },
      device: {
        category: picked.category,
        label,
        confidence: picked.by === "visitor" ? 1 : picked.by === "file-name" ? 0.6 : 0.2,
        identifiedBy: picked.by,
      },
      condition: { grade: cond.grade, summary: cond.summary },
      repairability,
      valueBand,
      components: info.components.map((c) =>
        input.condition === "damaged" && c.reusability === "high" ? { ...c, reusability: "medium" as Level } : c,
      ),
      actions,
      destinationIds,
      impact: {
        weightKg: info.typicalWeightKg,
        co2eKgAvoided: actions[0].kind === "recycle" ? Math.round(info.illustrativeCo2eKg * 0.1) : info.illustrativeCo2eKg,
      },
    };
  },
};
