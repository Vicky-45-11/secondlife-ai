"use client";

import { useState } from "react";
import { AlertCircle, Check, Loader2, LocateFixed, MapPinOff } from "lucide-react";
import { cn } from "@/lib/utils";

type GeoState = "idle" | "requesting" | "unsupported" | "denied" | "unavailable" | "success";

const MESSAGES: Record<Exclude<GeoState, "idle" | "requesting">, string> = {
  unsupported: "This browser doesn't offer location access. Distances below are from a demo city centre.",
  denied: "Location permission was declined, which is fine. Distances below are from a demo city centre.",
  unavailable: "Your location couldn't be determined right now. Distances below are from a demo city centre.",
  success:
    "Got your approximate location. Distances shown are from a demo city centre because these entries are not real places; with a real directory results would sort by distance from you.",
};

/**
 * Asks for the visitor's location but never pretends to use it: the directory
 * is illustrative, so distances stay relative to the demo centre. The
 * coordinates are not stored or sent anywhere.
 */
export function LocationPanel() {
  const [state, setState] = useState<GeoState>("idle");

  const request = () => {
    if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
      setState("unsupported");
      return;
    }
    setState("requesting");
    navigator.geolocation.getCurrentPosition(
      () => setState("success"),
      (err) => setState(err.code === err.PERMISSION_DENIED ? "denied" : "unavailable"),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 },
    );
  };

  const Icon = state === "success" ? Check : state === "denied" || state === "unsupported" ? MapPinOff : AlertCircle;

  return (
    <div className="rounded-2xl border border-ivory-100/10 p-5">
      <p className="eyebrow text-ivory-100/45">Location-aware</p>
      <p className="mt-2 text-sm leading-relaxed text-ivory-100/65">
        With a verified directory, results would sort by distance from you. Try the flow now; your location stays in this browser.
      </p>
      <button
        type="button"
        onClick={request}
        disabled={state === "requesting"}
        className="mt-4 inline-flex h-10 items-center gap-2 rounded-full border border-ivory-100/25 px-4 text-sm text-ivory-100 transition-colors hover:border-lime-500/70 hover:text-lime-500 disabled:opacity-60"
      >
        {state === "requesting" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <LocateFixed className="h-4 w-4" aria-hidden="true" />}
        {state === "requesting" ? "Asking your browser…" : state === "success" ? "Update my location" : "Use my location"}
      </button>
      <div aria-live="polite" className="min-h-0">
        {state !== "idle" && state !== "requesting" && (
          <p
            className={cn(
              "mt-4 flex gap-2.5 rounded-xl p-3 text-sm leading-relaxed",
              state === "success" ? "bg-cyan-500/10 text-cyan-300" : "bg-clay/10 text-ivory-200",
            )}
          >
            <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {MESSAGES[state]}
          </p>
        )}
      </div>
    </div>
  );
}
