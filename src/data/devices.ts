import type { ActionKind, DeviceCategory, DeviceCondition, Level } from "@/lib/analysis/types";

export interface CategoryInfo {
  id: DeviceCategory;
  label: string;
  /** Words that hint at this category in a file name (demo identification only). */
  keywords: string[];
  /** Typical weight, used for illustrative impact figures. */
  typicalWeightKg: number;
  /** Illustrative kg CO2e avoided by extending the device's life instead of replacing it. */
  illustrativeCo2eKg: number;
  baseRepairability: number;
  baseValue: Level;
  components: { name: string; reusability: Level; note: string }[];
}

export const CATEGORIES: CategoryInfo[] = [
  {
    id: "smartphone",
    label: "Smartphone",
    keywords: ["phone", "iphone", "android", "pixel", "galaxy", "mobile"],
    typicalWeightKg: 0.19,
    illustrativeCo2eKg: 55,
    baseRepairability: 5,
    baseValue: "high",
    components: [
      { name: "Display assembly", reusability: "medium", note: "Often reusable if the glass and touch layer are intact." },
      { name: "Camera modules", reusability: "high", note: "Common donor part for repairs of the same model." },
      { name: "Logic board", reusability: "medium", note: "Contains gold, copper and rare elements; reuse depends on fault." },
      { name: "Lithium-ion battery", reusability: "low", note: "Must be removed and handled by a battery-certified recycler." },
      { name: "Housing and frame", reusability: "medium", note: "Aluminium frames are highly recyclable." },
    ],
  },
  {
    id: "laptop",
    label: "Laptop",
    keywords: ["laptop", "notebook", "macbook", "thinkpad", "chromebook"],
    typicalWeightKg: 1.9,
    illustrativeCo2eKg: 250,
    baseRepairability: 6,
    baseValue: "high",
    components: [
      { name: "RAM modules", reusability: "high", note: "Socketed memory can be tested and reused directly." },
      { name: "SSD / storage", reusability: "high", note: "Reusable after a certified data wipe." },
      { name: "Display panel", reusability: "medium", note: "Panels are a frequent replacement part." },
      { name: "Keyboard and trackpad", reusability: "medium", note: "Reusable when keys and connectors are undamaged." },
      { name: "Battery pack", reusability: "low", note: "Check swelling; route to battery recycling if degraded." },
      { name: "Motherboard", reusability: "medium", note: "Repairable at board level by specialist shops." },
    ],
  },
  {
    id: "tablet",
    label: "Tablet",
    keywords: ["tablet", "ipad", "tab"],
    typicalWeightKg: 0.5,
    illustrativeCo2eKg: 90,
    baseRepairability: 4,
    baseValue: "medium",
    components: [
      { name: "Display and digitiser", reusability: "medium", note: "Bonded screens are harder to separate but reusable whole." },
      { name: "Logic board", reusability: "medium", note: "Valuable for same-model repairs." },
      { name: "Battery", reusability: "low", note: "Glued cells need specialist removal." },
      { name: "Speakers and cameras", reusability: "high", note: "Small modules that are easy to reuse." },
    ],
  },
  {
    id: "desktop",
    label: "Desktop computer",
    keywords: ["desktop", "pc", "tower", "imac", "computer"],
    typicalWeightKg: 8,
    illustrativeCo2eKg: 350,
    baseRepairability: 8,
    baseValue: "medium",
    components: [
      { name: "Power supply", reusability: "high", note: "Standard units are easy to test and reuse." },
      { name: "RAM and storage", reusability: "high", note: "Reusable after testing and a certified data wipe." },
      { name: "Graphics card", reusability: "high", note: "Strong reuse and resale demand." },
      { name: "Case and fans", reusability: "high", note: "Mechanical parts with long lifespans." },
      { name: "Motherboard and CPU", reusability: "medium", note: "Reusable for refurbished builds." },
    ],
  },
  {
    id: "display",
    label: "Monitor or TV",
    keywords: ["monitor", "display", "screen", "tv", "television"],
    typicalWeightKg: 5,
    illustrativeCo2eKg: 200,
    baseRepairability: 6,
    baseValue: "medium",
    components: [
      { name: "Panel", reusability: "medium", note: "Reusable if free of dead pixels and cracks." },
      { name: "Power board", reusability: "high", note: "Common failure point that is cheap to replace." },
      { name: "Backlight strips", reusability: "medium", note: "LED strips can often be replaced individually." },
      { name: "Stand and housing", reusability: "high", note: "Plastics and metals are separable for recycling." },
    ],
  },
  {
    id: "audio",
    label: "Headphones or speaker",
    keywords: ["headphone", "earbud", "speaker", "airpods", "headset", "audio"],
    typicalWeightKg: 0.3,
    illustrativeCo2eKg: 12,
    baseRepairability: 4,
    baseValue: "low",
    components: [
      { name: "Drivers", reusability: "medium", note: "Speaker drivers are reusable in DIY and repair projects." },
      { name: "Cables and connectors", reusability: "medium", note: "Frequently the only failed part." },
      { name: "Battery", reusability: "low", note: "Small cells must go to battery collection points." },
      { name: "Ear cushions and housing", reusability: "low", note: "Replaceable wear parts." },
    ],
  },
  {
    id: "console",
    label: "Gaming console",
    keywords: ["console", "playstation", "ps4", "ps5", "xbox", "switch", "nintendo"],
    typicalWeightKg: 3.5,
    illustrativeCo2eKg: 120,
    baseRepairability: 6,
    baseValue: "high",
    components: [
      { name: "Optical drive", reusability: "medium", note: "Lasers wear out, mechanisms are often reusable." },
      { name: "Storage", reusability: "high", note: "Reusable after wiping." },
      { name: "Cooling assembly", reusability: "high", note: "Fans and heatsinks are long-lived." },
      { name: "Mainboard", reusability: "medium", note: "HDMI ports and power circuits are common repairs." },
    ],
  },
  {
    id: "appliance",
    label: "Small appliance",
    keywords: ["kettle", "toaster", "blender", "fan", "iron", "appliance", "router", "printer"],
    typicalWeightKg: 2.5,
    illustrativeCo2eKg: 30,
    baseRepairability: 6,
    baseValue: "low",
    components: [
      { name: "Motor or heating element", reusability: "medium", note: "Core part; test before reuse." },
      { name: "Switches and controls", reusability: "medium", note: "Cheap, frequent point of failure." },
      { name: "Power cord", reusability: "high", note: "Often reusable as-is." },
      { name: "Housing", reusability: "low", note: "Mixed plastics; recycle where accepted." },
    ],
  },
  {
    id: "battery",
    label: "Battery or charger",
    keywords: ["battery", "charger", "powerbank", "power-bank", "adapter", "cable"],
    typicalWeightKg: 0.25,
    illustrativeCo2eKg: 4,
    baseRepairability: 2,
    baseValue: "low",
    components: [
      { name: "Cells", reusability: "low", note: "Never bin: lithium cells are a fire risk in general waste." },
      { name: "Charging circuit", reusability: "low", note: "Recover via certified e-waste recycling." },
      { name: "Cable and plug", reusability: "high", note: "Working chargers and cables are worth donating." },
    ],
  },
  {
    id: "other",
    label: "Other electronic device",
    keywords: [],
    typicalWeightKg: 1,
    illustrativeCo2eKg: 20,
    baseRepairability: 5,
    baseValue: "low",
    components: [
      { name: "Circuit boards", reusability: "medium", note: "Contain recoverable metals." },
      { name: "Cables and connectors", reusability: "high", note: "Often reusable." },
      { name: "Housing", reusability: "low", note: "Recycle according to material." },
    ],
  },
];

export function categoryInfo(id: DeviceCategory): CategoryInfo {
  return CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[CATEGORIES.length - 1];
}

export const CONDITIONS: { id: DeviceCondition; label: string; hint: string }[] = [
  { id: "working", label: "Works fine", hint: "Powers on and does its job" },
  { id: "minor-issues", label: "Minor issues", hint: "Cracked glass, weak battery, slow" },
  { id: "not-powering", label: "Won't turn on", hint: "No power or no display" },
  { id: "damaged", label: "Badly damaged", hint: "Water, fire or heavy physical damage" },
  { id: "unknown", label: "Not sure", hint: "Haven't checked" },
];

export const ACTIONS: Record<ActionKind, { label: string; verb: string; description: string }> = {
  repair: { label: "Repair", verb: "Get it repaired", description: "Fix the fault and keep using the device." },
  reuse: { label: "Reuse", verb: "Reuse or pass it on", description: "Give the working device a new owner or a new job." },
  refurbish: { label: "Refurbish", verb: "Send for refurbishment", description: "Professionally restored and resold with a warranty." },
  donate: { label: "Donate", verb: "Donate it", description: "Schools, charities and community programmes put it to work." },
  recycle: { label: "Recycle", verb: "Recycle responsibly", description: "Certified recovery of metals and safe handling of hazards." },
};

export const ACTION_ORDER: ActionKind[] = ["repair", "reuse", "refurbish", "donate", "recycle"];
