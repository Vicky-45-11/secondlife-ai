"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, BatteryCharging, Check, Clock, MapPin, ShieldCheck, Truck, X } from "lucide-react";
import { ACTIONS, CATEGORIES } from "@/data/devices";
import { DESTINATION_TYPES, type Destination } from "@/data/destinations";
import { ButtonLink } from "@/components/ui/Button";
import { DemoBadge } from "@/components/ui/DemoBadge";
import { distanceLabel, whyMatches, type Filters } from "./match";

const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

export function DestinationDrawer({
  destination,
  filters,
  onClose,
}: {
  destination: Destination | null;
  filters: Filters;
  onClose: () => void;
}) {
  const reduce = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnTo = useRef<HTMLElement | null>(null);
  const open = destination !== null;

  useEffect(() => {
    if (!open) return;
    returnTo.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const nodes = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      returnTo.current?.focus({ preventScroll: true });
    };
  }, [open, onClose]);

  const d = destination;
  const accepts = d ? (d.accepts.length === 0 ? ["All electronics"] : d.accepts.map((id) => CATEGORIES.find((c) => c.id === id)?.label ?? id)) : [];

  return (
    <AnimatePresence>
      {d && (
        <div className="fixed inset-0 z-[70]" key="drawer">
          <motion.div
            className="absolute inset-0 bg-forest-950/70 backdrop-blur-sm"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: reduce ? 0 : 0.25 } }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="destination-drawer-title"
            data-lenis-prevent
            className="absolute inset-y-0 right-0 flex w-full max-w-xl flex-col overflow-y-auto border-l border-ivory-100/10 bg-forest-900 shadow-2xl"
            initial={reduce ? false : { x: "100%" }}
            animate={{ x: 0 }}
            exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { x: "100%", transition: { duration: 0.3, ease: [0.4, 0, 1, 1] } }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-ivory-100/10 bg-forest-900/95 px-6 py-4 backdrop-blur sm:px-8">
              <DemoBadge>Illustrative entry</DemoBadge>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Close details"
                className="rounded-full border border-ivory-100/15 p-2 text-ivory-100/80 transition-colors hover:border-ivory-100/50 hover:text-ivory-100"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 px-6 py-8 sm:px-8">
              <p className="eyebrow text-lime-500">{DESTINATION_TYPES[d.type].label}</p>
              <h2 id="destination-drawer-title" className="display mt-4 text-[clamp(2.25rem,5vw,3.25rem)] text-ivory-50">
                {d.name}
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-ivory-100/65">{d.description}</p>

              <dl className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-ivory-100/10 bg-ivory-100/10 sm:grid-cols-2">
                <div className="bg-forest-900 p-4">
                  <dt className="eyebrow flex items-center gap-2 text-ivory-100/45">
                    <MapPin className="h-3.5 w-3.5" aria-hidden="true" /> Area
                  </dt>
                  <dd className="mt-2 text-ivory-100">
                    {d.area} <span className="text-ivory-100/50">· {distanceLabel(d.distanceKm)}</span>
                  </dd>
                </div>
                <div className="bg-forest-900 p-4">
                  <dt className="eyebrow flex items-center gap-2 text-ivory-100/45">
                    <Clock className="h-3.5 w-3.5" aria-hidden="true" /> Hours
                  </dt>
                  <dd className="mt-2 text-ivory-100">{d.hours}</dd>
                </div>
              </dl>

              <section className="mt-8" aria-labelledby="drawer-why">
                <h3 id="drawer-why" className="eyebrow text-ivory-100/45">
                  Why this matches
                </h3>
                <ul className="mt-3 space-y-2">
                  {whyMatches(d, filters).map((r) => (
                    <li key={r} className="flex items-start gap-2.5 text-ivory-100/85">
                      <Check className="mt-1 h-4 w-4 shrink-0 text-lime-500" aria-hidden="true" />
                      {r}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="mt-8" aria-labelledby="drawer-actions">
                <h3 id="drawer-actions" className="eyebrow text-ivory-100/45">
                  Routes offered
                </h3>
                <ul className="mt-3 space-y-3">
                  {d.actions.map((a) => (
                    <li key={a} className="border-l-2 border-cyan-500/50 pl-3">
                      <p className="text-ivory-50">{ACTIONS[a].label}</p>
                      <p className="text-sm text-ivory-100/55">{ACTIONS[a].description}</p>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="mt-8" aria-labelledby="drawer-services">
                <h3 id="drawer-services" className="eyebrow text-ivory-100/45">
                  Services
                </h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {d.services.map((s) => (
                    <li key={s} className="rounded-full border border-ivory-100/15 px-3 py-1 text-sm text-ivory-100/80">
                      {s}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="mt-8" aria-labelledby="drawer-accepts">
                <h3 id="drawer-accepts" className="eyebrow text-ivory-100/45">
                  Accepts
                </h3>
                <p className="mt-3 text-ivory-100/80">{accepts.join(" · ")}</p>
              </section>

              <ul className="mt-8 grid gap-2 text-sm sm:grid-cols-3">
                {[
                  { on: d.takesBatteries, label: "Takes batteries", icon: BatteryCharging },
                  { on: d.dataWipe, label: "Data wipe", icon: ShieldCheck },
                  { on: d.pickup, label: "Pickup", icon: Truck },
                ].map(({ on, label, icon: Icon }) => (
                  <li
                    key={label}
                    className={on ? "flex items-center gap-2 rounded-lg bg-cyan-500/10 px-3 py-2 text-cyan-300" : "flex items-center gap-2 rounded-lg border border-ivory-100/10 px-3 py-2 text-ivory-100/40"}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    <span>
                      {label}
                      <span className="sr-only">: {on ? "yes" : "no"}</span>
                    </span>
                    {!on && <span aria-hidden="true" className="ml-auto text-xs">No</span>}
                  </li>
                ))}
              </ul>

              <p className="mt-10 rounded-xl border border-dashed border-ivory-100/15 p-4 text-sm leading-relaxed text-ivory-100/55">
                This is a sample entry, not a real organisation, so there is no address, phone number or booking link. A verified partner directory
                can be connected later.
              </p>
              <div className="mt-6">
                <ButtonLink href="/analyze" variant="secondary">
                  Analyze a device first <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </ButtonLink>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
