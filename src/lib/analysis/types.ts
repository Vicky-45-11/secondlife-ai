/**
 * Shared types for device analysis. A provider takes a photo plus what the
 * visitor told us and returns a structured result. Today only the demo
 * provider exists; a real vision model can implement the same interface.
 */

export type DeviceCategory =
  | "smartphone"
  | "laptop"
  | "tablet"
  | "desktop"
  | "display"
  | "audio"
  | "console"
  | "appliance"
  | "battery"
  | "other";

export type DeviceCondition = "working" | "minor-issues" | "not-powering" | "damaged" | "unknown";

export type ActionKind = "repair" | "reuse" | "refurbish" | "donate" | "recycle";

export type Level = "high" | "medium" | "low";

export interface AnalysisInput {
  file: File;
  /** "auto" asks the provider to identify the category itself. */
  category: DeviceCategory | "auto";
  condition: DeviceCondition;
  description: string;
}

export interface ComponentFinding {
  name: string;
  reusability: Level;
  note: string;
}

export interface ActionRecommendation {
  kind: ActionKind;
  /** 0–100: how well this action fits the device. */
  score: number;
  reason: string;
}

export interface AnalysisResult {
  id: string;
  createdAt: string;
  provider: { id: string; name: string; isDemo: boolean };
  image: { name: string; sizeBytes: number; type: string };
  device: {
    category: DeviceCategory;
    label: string;
    /** 0–1. For the demo this reflects how the category was chosen, not a model score. */
    confidence: number;
    identifiedBy: "visitor" | "file-name" | "fallback" | "model";
  };
  condition: { grade: "A" | "B" | "C" | "D"; summary: string };
  /** 0–10 */
  repairability: number;
  valueBand: Level;
  components: ComponentFinding[];
  actions: ActionRecommendation[];
  destinationIds: string[];
  /** Illustrative per-device figures, not a lifecycle assessment. */
  impact: { weightKg: number; co2eKgAvoided: number };
}

export type AnalysisStage = "upload" | "vision" | "components" | "decision" | "matching";

export interface AnalysisProgress {
  stage: AnalysisStage;
  /** 0–1 across the whole run */
  progress: number;
  message: string;
}

export interface AnalysisProvider {
  id: string;
  name: string;
  isDemo: boolean;
  analyze(input: AnalysisInput, onProgress: (p: AnalysisProgress) => void, signal?: AbortSignal): Promise<AnalysisResult>;
}
