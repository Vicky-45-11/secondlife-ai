import { cn } from "@/lib/utils";

/** SecondLife mark: a chip whose trace loops back on itself, like a second life. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={cn("h-8 w-8", className)}>
      <rect x="1" y="1" width="30" height="30" rx="9" fill="#10261C" stroke="rgba(244,240,229,0.18)" />
      <path d="M22.5 11.5a7.5 7.5 0 1 0 1.2 6.7" stroke="#CCFF00" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M24.6 7.6v4.6H20" stroke="#CCFF00" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="12.6" y="12.6" width="6.8" height="6.8" rx="1.6" fill="#F4F0E5" />
      <path d="M16 10v2.6M16 19.4V22M10 16h2.6M19.4 16H22" stroke="#00E5FF" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className="font-display text-[1.45rem] leading-none tracking-tight text-ivory-100">
        SecondLife<span className="ml-1 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-lime-500 align-middle">AI</span>
      </span>
    </span>
  );
}
