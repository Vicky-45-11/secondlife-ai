import { ACTIONS, ACTION_ORDER, CATEGORIES } from "@/data/devices";
import { DESTINATION_TYPES, destinationAccepts, type Destination, type DestinationType } from "@/data/destinations";
import type { ActionKind, DeviceCategory } from "@/lib/analysis/types";

export type SortKey = "distance" | "name";

export interface Filters {
  q: string;
  types: DestinationType[];
  category: DeviceCategory | "";
  action: ActionKind | "";
  batteries: boolean;
  wipe: boolean;
  pickup: boolean;
  sort: SortKey;
}

export const EMPTY_FILTERS: Filters = {
  q: "",
  types: [],
  category: "",
  action: "",
  batteries: false,
  wipe: false,
  pickup: false,
  sort: "distance",
};

export const TYPE_ORDER = Object.keys(DESTINATION_TYPES) as DestinationType[];

/** Plural, lower-case phrasing for "Accepts …" explanations. */
export const CATEGORY_PLURAL: Record<DeviceCategory, string> = {
  smartphone: "smartphones",
  laptop: "laptops",
  tablet: "tablets",
  desktop: "desktop computers",
  display: "monitors and TVs",
  audio: "headphones and speakers",
  console: "gaming consoles",
  appliance: "small appliances",
  battery: "batteries and chargers",
  other: "other electronics",
};

interface ParamReader {
  get(name: string): string | null;
}

function isCategory(v: string | null): v is DeviceCategory {
  return v !== null && CATEGORIES.some((c) => c.id === v);
}
function isAction(v: string | null): v is ActionKind {
  return v !== null && (ACTION_ORDER as string[]).includes(v);
}
function isType(v: string): v is DestinationType {
  return (TYPE_ORDER as string[]).includes(v);
}

export function filtersFromParams(p: ParamReader): Filters {
  const category = p.get("category");
  const action = p.get("action");
  const sort = p.get("sort");
  return {
    q: (p.get("q") ?? "").slice(0, 80),
    types: (p.get("type") ?? "").split(",").filter(isType),
    category: isCategory(category) ? category : "",
    action: isAction(action) ? action : "",
    batteries: p.get("batteries") === "1",
    wipe: p.get("wipe") === "1",
    pickup: p.get("pickup") === "1",
    sort: sort === "name" ? "name" : "distance",
  };
}

export function filtersToQuery(f: Filters): string {
  const p = new URLSearchParams();
  if (f.q.trim()) p.set("q", f.q.trim());
  if (f.types.length) p.set("type", TYPE_ORDER.filter((t) => f.types.includes(t)).join(","));
  if (f.category) p.set("category", f.category);
  if (f.action) p.set("action", f.action);
  if (f.batteries) p.set("batteries", "1");
  if (f.wipe) p.set("wipe", "1");
  if (f.pickup) p.set("pickup", "1");
  if (f.sort !== "distance") p.set("sort", f.sort);
  return p.toString();
}

export function activeFilterCount(f: Filters) {
  return (
    (f.q.trim() ? 1 : 0) +
    f.types.length +
    (f.category ? 1 : 0) +
    (f.action ? 1 : 0) +
    (f.batteries ? 1 : 0) +
    (f.wipe ? 1 : 0) +
    (f.pickup ? 1 : 0)
  );
}

function textMatches(d: Destination, q: string) {
  const needle = q.trim().toLowerCase();
  if (!needle) return true;
  const hay = [d.name, d.area, d.description, DESTINATION_TYPES[d.type].label, ...d.services, ...d.actions.map((a) => ACTIONS[a].label)]
    .join(" ")
    .toLowerCase();
  return needle.split(/\s+/).every((w) => hay.includes(w));
}

export function applyFilters(list: Destination[], f: Filters): Destination[] {
  return list
    .filter(
      (d) =>
        textMatches(d, f.q) &&
        (f.types.length === 0 || f.types.includes(d.type)) &&
        (!f.category || destinationAccepts(d, f.category)) &&
        (!f.action || d.actions.includes(f.action)) &&
        (!f.batteries || d.takesBatteries) &&
        (!f.wipe || d.dataWipe) &&
        (!f.pickup || d.pickup),
    )
    .sort((a, b) => (f.sort === "name" ? a.name.localeCompare(b.name) : a.distanceKm - b.distanceKm || a.name.localeCompare(b.name)));
}

/** Plain-language reasons this entry fits the active filters. */
export function whyMatches(d: Destination, f: Filters): string[] {
  const out: string[] = [];
  if (f.category) {
    out.push(d.accepts.length === 0 ? `Accepts all electronics, including ${CATEGORY_PLURAL[f.category]}` : `Accepts ${CATEGORY_PLURAL[f.category]}`);
  }
  if (f.action) out.push(`Offers ${ACTIONS[f.action].label.toLowerCase()}`);
  if (f.types.length) out.push(`Is a ${DESTINATION_TYPES[d.type].label.toLowerCase()}`);
  if (f.batteries) out.push("Takes batteries");
  if (f.wipe) out.push(d.type === "donation" ? "Data wipe on intake" : "Offers a data wipe");
  if (f.pickup) out.push("Pickup available");
  if (f.q.trim()) out.push(`Matches “${f.q.trim()}”`);
  if (out.length === 0) {
    // No filters: describe what it is good for instead.
    out.push(`Offers ${d.actions.map((a) => ACTIONS[a].label.toLowerCase()).join(", ")}`);
    out.push(d.accepts.length === 0 ? "Accepts all electronics" : `Accepts ${d.accepts.slice(0, 2).map((c) => CATEGORY_PLURAL[c]).join(", ")}${d.accepts.length > 2 ? " and more" : ""}`);
  }
  return out;
}

export function distanceLabel(km: number) {
  return km === 0 ? "Online" : `${km.toFixed(1)} km`;
}
