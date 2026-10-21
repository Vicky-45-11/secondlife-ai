/**
 * Published figures, with their source. Keep every number here traceable.
 * Source: The Global E-waste Monitor 2024 (ITU and UNITAR), https://ewastemonitor.info
 */
export const EWASTE_SOURCE = {
  name: "Global E-waste Monitor 2024 (ITU & UNITAR)",
  url: "https://ewastemonitor.info",
};

export const EWASTE_FACTS = [
  { value: 62, unit: "million tonnes", label: "of e-waste generated worldwide in 2022" },
  { value: 22.3, unit: "%", label: "documented as formally collected and recycled", digits: 1 },
  { value: 82, unit: "million tonnes", label: "projected for 2030 if trends continue" },
] as const;
