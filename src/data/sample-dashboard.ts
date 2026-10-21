import { categoryInfo } from "@/data/devices";
import type { ActionKind, DeviceCategory } from "@/lib/analysis/types";

/**
 * SAMPLE DASHBOARD DATASET. Entirely synthetic: generated from a fixed seed so
 * the server and every visitor see exactly the same numbers. These are not
 * real users or real devices. Per-device weights and CO2e figures come from
 * the illustrative values in `categoryInfo()`, not a lifecycle assessment.
 */

/** One analysis as the impact dashboard sees it (sample or from this browser). */
export interface DashboardRecord {
  id: string;
  /** YYYY-MM-DD for sample rows, a full ISO timestamp for real history. */
  date: string;
  /** "YYYY-MM" bucket the record falls in. */
  monthKey: string;
  category: DeviceCategory;
  label: string;
  /** The top recommended action. */
  action: ActionKind;
  weightKg: number;
  co2eKg: number;
  /** Components rated high or medium reusability. */
  reusableComponents: number;
}

export interface MonthBucket {
  key: string;
  /** Short label, e.g. "Mar". */
  label: string;
  /** Long label, e.g. "March 2025". */
  longLabel: string;
}

export const SAMPLE_YEAR = 2025;
const SEED = 20250417;

const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTH_LONG = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function monthKey(year: number, monthIndex: number) {
  return `${year}-${String(monthIndex + 1).padStart(2, "0")}`;
}

export function monthBucket(year: number, monthIndex: number): MonthBucket {
  return { key: monthKey(year, monthIndex), label: MONTH_SHORT[monthIndex], longLabel: `${MONTH_LONG[monthIndex]} ${year}` };
}

export const SAMPLE_MONTHS: MonthBucket[] = MONTH_SHORT.map((_, i) => monthBucket(SAMPLE_YEAR, i));

/** mulberry32: tiny seeded PRNG, deterministic across server and client. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickWeighted<T extends string>(rand: () => number, weights: Record<T, number>): T {
  const entries = Object.entries(weights) as [T, number][];
  const total = entries.reduce((s, [, w]) => s + w, 0);
  let r = rand() * total;
  for (const [key, w] of entries) {
    r -= w;
    if (r <= 0) return key;
  }
  return entries[entries.length - 1][0];
}

/** How often each category shows up in the sample. */
const CATEGORY_WEIGHTS: Record<DeviceCategory, number> = {
  smartphone: 30,
  laptop: 18,
  tablet: 9,
  desktop: 5,
  display: 7,
  audio: 10,
  console: 4,
  appliance: 7,
  battery: 7,
  other: 3,
};

/** Top recommendation mix per category (sample assumption, not measured). */
const ACTION_WEIGHTS: Record<DeviceCategory, Record<ActionKind, number>> = {
  smartphone: { repair: 38, reuse: 18, refurbish: 22, donate: 8, recycle: 14 },
  laptop: { repair: 30, reuse: 16, refurbish: 24, donate: 18, recycle: 12 },
  tablet: { repair: 26, reuse: 22, refurbish: 18, donate: 16, recycle: 18 },
  desktop: { repair: 20, reuse: 18, refurbish: 30, donate: 20, recycle: 12 },
  display: { repair: 30, reuse: 20, refurbish: 16, donate: 10, recycle: 24 },
  audio: { repair: 26, reuse: 24, refurbish: 6, donate: 14, recycle: 30 },
  console: { repair: 34, reuse: 22, refurbish: 28, donate: 6, recycle: 10 },
  appliance: { repair: 40, reuse: 14, refurbish: 6, donate: 10, recycle: 30 },
  battery: { repair: 2, reuse: 8, refurbish: 2, donate: 6, recycle: 82 },
  other: { repair: 22, reuse: 18, refurbish: 10, donate: 10, recycle: 40 },
};

function reusableCount(category: DeviceCategory) {
  return categoryInfo(category).components.filter((c) => c.reusability !== "low").length;
}

/** Illustrative CO2e avoided, mirroring the demo provider: recycling earns 10%. */
export function illustrativeCo2e(category: DeviceCategory, action: ActionKind) {
  const base = categoryInfo(category).illustrativeCo2eKg;
  return action === "recycle" ? Math.round(base * 0.1) : base;
}

function generate(): DashboardRecord[] {
  const rand = mulberry32(SEED);
  const rows: DashboardRecord[] = [];
  let serial = 1;
  for (let m = 0; m < 12; m++) {
    // Gentle growth through the year, a summer dip and a post-holiday spike.
    const trend = 24 + m * 2.6 + (m === 0 ? 9 : 0) + (m === 6 || m === 7 ? -6 : 0) + (m === 11 ? 7 : 0);
    const count = Math.round(trend + rand() * 8);
    const daysInMonth = new Date(Date.UTC(SAMPLE_YEAR, m + 1, 0)).getUTCDate();
    for (let i = 0; i < count; i++) {
      const category = pickWeighted(rand, CATEGORY_WEIGHTS);
      const action = pickWeighted(rand, ACTION_WEIGHTS[category]);
      const day = 1 + Math.floor(rand() * daysInMonth);
      const info = categoryInfo(category);
      rows.push({
        id: `sample-${String(serial).padStart(4, "0")}`,
        date: `${monthKey(SAMPLE_YEAR, m)}-${String(day).padStart(2, "0")}`,
        monthKey: monthKey(SAMPLE_YEAR, m),
        category,
        label: `${info.label} · sample #${serial}`,
        action,
        weightKg: info.typicalWeightKg,
        co2eKg: illustrativeCo2e(category, action),
        reusableComponents: reusableCount(category),
      });
      serial++;
    }
  }
  // Newest first; ties broken by serial so ordering is stable.
  return rows.sort((a, b) => (a.date === b.date ? b.id.localeCompare(a.id) : b.date.localeCompare(a.date)));
}

export const SAMPLE_ANALYSES: DashboardRecord[] = generate();
