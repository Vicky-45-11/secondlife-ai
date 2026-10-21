"use client";

import { useId } from "react";
import { Check } from "lucide-react";
import { CATEGORIES, CONDITIONS } from "@/data/devices";
import type { DeviceCategory, DeviceCondition } from "@/lib/analysis";
import { cn } from "@/lib/utils";
import { CATEGORY_ICONS } from "./shared";

const OPTION_BASE =
  "relative flex cursor-pointer rounded-xl border transition-colors duration-200 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-lime-500";

function Legend({ step, title, hint }: { step: string; title: string; hint?: string }) {
  return (
    <legend className="mb-4 flex w-full flex-wrap items-baseline gap-x-3 gap-y-1">
      <span className="eyebrow text-ivory-100/45">{step}</span>
      <span className="text-lg text-ivory-50">{title}</span>
      {hint && <span className="text-sm text-ivory-100/45">{hint}</span>}
    </legend>
  );
}

export function CategoryPicker({
  value,
  onChange,
  disabled,
}: {
  value: DeviceCategory | "auto";
  onChange: (v: DeviceCategory | "auto") => void;
  disabled?: boolean;
}) {
  const name = useId();
  const options: { id: DeviceCategory | "auto"; label: string }[] = [
    { id: "auto", label: "Identify for me" },
    ...CATEGORIES.map((c) => ({ id: c.id, label: c.label })),
  ];

  return (
    <fieldset disabled={disabled}>
      <Legend step="02" title="What is it?" hint="Pick one, or let us guess" />
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
        {options.map((opt) => {
          const Icon = CATEGORY_ICONS[opt.id];
          const checked = value === opt.id;
          const isAuto = opt.id === "auto";
          return (
            <label
              key={opt.id}
              className={cn(
                OPTION_BASE,
                "min-h-[4.25rem] items-center gap-3 px-3.5 py-3",
                isAuto && "col-span-2 sm:col-span-3 lg:col-span-2 xl:col-span-3",
                checked
                  ? "border-lime-500/70 bg-lime-500/[0.08] text-ivory-50"
                  : "border-ivory-100/10 bg-forest-900/50 text-ivory-100/75 hover:border-ivory-100/30 hover:text-ivory-100",
              )}
            >
              <input
                type="radio"
                name={name}
                value={opt.id}
                checked={checked}
                onChange={() => onChange(opt.id)}
                className="sr-only"
              />
              <Icon
                className={cn("h-5 w-5 shrink-0", checked ? "text-lime-500" : "text-ivory-100/50")}
                aria-hidden="true"
                strokeWidth={1.6}
              />
              <span className="min-w-0 text-sm leading-tight">
                {opt.label}
                {isAuto && (
                  <span className="mt-0.5 block text-xs text-ivory-100/45">
                    Auto: uses the file name and your notes in this demo
                  </span>
                )}
              </span>
              {checked && <Check className="ml-auto h-4 w-4 shrink-0 text-lime-500" aria-hidden="true" />}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export function ConditionPicker({
  value,
  onChange,
  disabled,
}: {
  value: DeviceCondition;
  onChange: (v: DeviceCondition) => void;
  disabled?: boolean;
}) {
  const name = useId();
  return (
    <fieldset disabled={disabled}>
      <Legend step="03" title="What condition is it in?" />
      <div className="grid gap-2 sm:grid-cols-2">
        {CONDITIONS.map((c, i) => {
          const checked = value === c.id;
          return (
            <label
              key={c.id}
              className={cn(
                OPTION_BASE,
                "flex-col gap-1 px-4 py-3",
                i === CONDITIONS.length - 1 && CONDITIONS.length % 2 === 1 && "sm:col-span-2",
                checked
                  ? "border-lime-500/70 bg-lime-500/[0.08]"
                  : "border-ivory-100/10 bg-forest-900/50 hover:border-ivory-100/30",
              )}
            >
              <input
                type="radio"
                name={name}
                value={c.id}
                checked={checked}
                onChange={() => onChange(c.id)}
                className="sr-only"
              />
              <span className="flex items-center justify-between gap-2">
                <span className={cn("text-sm", checked ? "text-ivory-50" : "text-ivory-100/85")}>{c.label}</span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "flex h-4 w-4 items-center justify-center rounded-full border",
                    checked ? "border-lime-500 bg-lime-500" : "border-ivory-100/30",
                  )}
                >
                  {checked && <span className="h-1.5 w-1.5 rounded-full bg-forest-950" />}
                </span>
              </span>
              <span className="text-xs text-ivory-100/45">{c.hint}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
