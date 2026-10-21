/**
 * The six stages of the SecondLife flow. `status` says honestly what exists in
 * this prototype: "live" runs in the browser today, "demo" is simulated by the
 * demo analyser, "planned" is not built yet.
 */
export type StageStatus = "live" | "demo" | "planned";

export const STAGES = [
  {
    id: "upload",
    title: "Upload",
    short: "A photo and a few details",
    body: "Drop in a photo of the device. Add its category, its condition and anything you know about it. The photo stays in your browser.",
    detail: ["JPG, PNG, WebP or HEIC up to 10 MB", "Category and condition you choose", "Optional notes, like model or fault"],
    status: "live" as StageStatus,
  },
  {
    id: "analysis",
    title: "AI Analysis",
    short: "Read the device",
    body: "A vision model would identify the device and estimate its condition. In this prototype a clearly labelled demo analyser stands in for it.",
    detail: ["Device type and likely model", "Visible damage and wear", "A confidence level, always shown"],
    status: "demo" as StageStatus,
  },
  {
    id: "components",
    title: "Component Identification",
    short: "Map what's inside",
    body: "Each device is broken down into its main parts, with a note on which ones are usually reusable, repairable or best recovered.",
    detail: ["Reusable modules", "Repair-relevant parts", "Batteries and hazardous parts flagged"],
    status: "demo" as StageStatus,
  },
  {
    id: "decision",
    title: "Sustainability Decision",
    short: "Weigh every route",
    body: "Repair, reuse, refurbish, donate and recycle are scored against the condition and repairability, so the longest useful life comes first.",
    detail: ["Five routes ranked", "A plain reason for each", "Recycling as the responsible last step"],
    status: "demo" as StageStatus,
  },
  {
    id: "matching",
    title: "Destination Matching",
    short: "Find where it goes",
    body: "Routes are matched to the kinds of places that accept that device. Today this uses an illustrative directory, not real partners or your location.",
    detail: ["Repair shops and refurbishers", "Donation programmes", "Certified recyclers"],
    status: "demo" as StageStatus,
  },
  {
    id: "impact",
    title: "Impact Tracking",
    short: "See what changed",
    body: "Every analysis you run is saved in your own browser, so you can look back at the devices you kept in use. Totals use illustrative estimates.",
    detail: ["History stored on this device only", "Illustrative CO₂e estimates", "Clear or remove entries any time"],
    status: "live" as StageStatus,
  },
] as const;

export const STATUS_LABEL: Record<StageStatus, string> = {
  live: "Works today",
  demo: "Demo simulation",
  planned: "Planned",
};
