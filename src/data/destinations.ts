import type { ActionKind, DeviceCategory } from "@/lib/analysis/types";

/**
 * ILLUSTRATIVE DEMO DIRECTORY. None of these are real organisations or
 * addresses. They exist so the matching interface can be explored until a
 * verified partner directory is connected.
 */

export type DestinationType = "repair" | "refurbisher" | "donation" | "recycler" | "marketplace";

export interface Destination {
  id: string;
  name: string;
  type: DestinationType;
  actions: ActionKind[];
  /** Device categories accepted; empty means all. */
  accepts: DeviceCategory[];
  area: string;
  /** Distance from the demo city centre, in km. */
  distanceKm: number;
  hours: string;
  services: string[];
  description: string;
  takesBatteries: boolean;
  dataWipe: boolean;
  pickup: boolean;
}

export const DESTINATION_TYPES: Record<DestinationType, { label: string; plural: string }> = {
  repair: { label: "Repair shop", plural: "Repair shops" },
  refurbisher: { label: "Refurbisher", plural: "Refurbishers" },
  donation: { label: "Donation programme", plural: "Donation programmes" },
  recycler: { label: "Authorised recycler", plural: "Authorised recyclers" },
  marketplace: { label: "Reuse marketplace", plural: "Reuse marketplaces" },
};

export const DESTINATIONS: Destination[] = [
  {
    id: "d-fixlab",
    name: "FixLab Repair Studio",
    type: "repair",
    actions: ["repair"],
    accepts: ["smartphone", "tablet", "laptop", "audio"],
    area: "Old Market (demo)",
    distanceKm: 1.2,
    hours: "Mon–Sat · 10:00–19:00",
    services: ["Screen replacement", "Battery swap", "Charging port repair"],
    description: "Walk-in repairs for phones, tablets and laptops, with same-day screen and battery work.",
    takesBatteries: false,
    dataWipe: false,
    pickup: false,
  },
  {
    id: "d-boardworks",
    name: "BoardWorks Micro-soldering",
    type: "repair",
    actions: ["repair"],
    accepts: ["smartphone", "laptop", "console", "tablet"],
    area: "Tech Park (demo)",
    distanceKm: 4.8,
    hours: "Mon–Fri · 09:00–18:00",
    services: ["Board-level repair", "Water damage recovery", "Data recovery"],
    description: "Specialist board repairs for devices other shops write off.",
    takesBatteries: false,
    dataWipe: true,
    pickup: true,
  },
  {
    id: "d-renew",
    name: "Renew Electronics Refurbishing",
    type: "refurbisher",
    actions: ["refurbish", "reuse"],
    accepts: ["smartphone", "laptop", "tablet", "desktop", "display", "console"],
    area: "Riverside Industrial (demo)",
    distanceKm: 7.5,
    hours: "Mon–Sat · 09:00–17:00",
    services: ["Grading and testing", "Certified data wipe", "Resale with warranty"],
    description: "Tests, restores and resells devices, wiping data to a documented standard.",
    takesBatteries: false,
    dataWipe: true,
    pickup: true,
  },
  {
    id: "d-secondbyte",
    name: "SecondByte Marketplace",
    type: "marketplace",
    actions: ["reuse"],
    accepts: [],
    area: "Online (demo)",
    distanceKm: 0,
    hours: "Online · any time",
    services: ["Peer-to-peer listings", "Parts listings", "Local pickup"],
    description: "List working devices and spare parts for people nearby who can use them.",
    takesBatteries: false,
    dataWipe: false,
    pickup: false,
  },
  {
    id: "d-classroom",
    name: "Classroom Connect Device Drive",
    type: "donation",
    actions: ["donate", "reuse"],
    accepts: ["laptop", "tablet", "desktop", "display"],
    area: "City Centre (demo)",
    distanceKm: 2.1,
    hours: "Drop-off · Sat 10:00–14:00",
    services: ["Accepts working laptops and tablets", "Data wipe on intake", "Donation receipt"],
    description: "Collects working computers and passes them to students who need them.",
    takesBatteries: false,
    dataWipe: true,
    pickup: false,
  },
  {
    id: "d-community",
    name: "Community Tech Library",
    type: "donation",
    actions: ["donate", "reuse", "repair"],
    accepts: ["smartphone", "tablet", "audio", "appliance", "console"],
    area: "Lakeside (demo)",
    distanceKm: 5.6,
    hours: "Tue–Sun · 11:00–18:00",
    services: ["Repair café evenings", "Lending library", "Donations of small electronics"],
    description: "A volunteer space that repairs and lends small electronics.",
    takesBatteries: false,
    dataWipe: false,
    pickup: false,
  },
  {
    id: "d-greencycle",
    name: "GreenCycle Materials Recovery",
    type: "recycler",
    actions: ["recycle"],
    accepts: [],
    area: "Eastern Bypass (demo)",
    distanceKm: 11.3,
    hours: "Mon–Sat · 08:00–16:00",
    services: ["All electronics accepted", "Battery handling", "Recycling certificate"],
    description: "Separates metals, plastics and glass and handles hazardous parts safely.",
    takesBatteries: true,
    dataWipe: true,
    pickup: true,
  },
  {
    id: "d-cellsafe",
    name: "CellSafe Battery Collection",
    type: "recycler",
    actions: ["recycle"],
    accepts: ["battery", "smartphone", "audio", "laptop", "tablet"],
    area: "North Station (demo)",
    distanceKm: 3.4,
    hours: "Daily · 08:00–20:00",
    services: ["Battery drop-off", "Power banks and chargers", "Swollen battery handling"],
    description: "Drop-off point for batteries, chargers and devices with built-in cells.",
    takesBatteries: true,
    dataWipe: false,
    pickup: false,
  },
  {
    id: "d-appliance",
    name: "Appliance Revival Workshop",
    type: "repair",
    actions: ["repair", "refurbish"],
    accepts: ["appliance", "display", "audio"],
    area: "Garden Road (demo)",
    distanceKm: 6.2,
    hours: "Mon–Fri · 10:00–18:00",
    services: ["Small appliance repair", "TV power board repair", "Spare parts"],
    description: "Repairs household electronics and keeps a stock of salvaged parts.",
    takesBatteries: false,
    dataWipe: false,
    pickup: true,
  },
  {
    id: "d-gamegrid",
    name: "GameGrid Console Clinic",
    type: "refurbisher",
    actions: ["repair", "refurbish", "reuse"],
    accepts: ["console", "display", "audio"],
    area: "Mall Quarter (demo)",
    distanceKm: 3.9,
    hours: "Daily · 12:00–21:00",
    services: ["HDMI port repair", "Fan and thermal service", "Trade-in"],
    description: "Repairs and refurbishes consoles and controllers, and buys them back.",
    takesBatteries: false,
    dataWipe: true,
    pickup: false,
  },
];

export function destinationById(id: string) {
  return DESTINATIONS.find((d) => d.id === id);
}

export function destinationAccepts(d: Destination, category: DeviceCategory) {
  return d.accepts.length === 0 || d.accepts.includes(category);
}
