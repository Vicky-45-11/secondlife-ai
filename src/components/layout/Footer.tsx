import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { NAV_LINKS } from "@/data/nav";
import { EWASTE_SOURCE } from "@/data/facts";
import { HoverLetters } from "@/components/fx/HoverLetters";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-ivory-100/10 bg-forest-950">
      <div className="page-x grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr] md:py-20">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-5 text-ivory-100/60">
            Don&apos;t discard it. Discover its next life. SecondLife AI helps people find the repair, reuse or recycling route
            that keeps electronics in use for longer.
          </p>
        </div>
        <div>
          <p className="eyebrow text-ivory-100/40">Explore</p>
          <ul className="mt-4 space-y-2.5">
            {[{ href: "/", label: "Home" }, ...NAV_LINKS].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-ivory-100/75 transition-colors hover:text-lime-500">
                  <HoverLetters text={l.label} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow text-ivory-100/40">About this build</p>
          <ul className="mt-4 space-y-2.5 text-ivory-100/75">
            <li>
              <Link href="/privacy" className="transition-colors hover:text-lime-500">
                Privacy &amp; data
              </Link>
            </li>
            <li>
              <a
                href={EWASTE_SOURCE.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 transition-colors hover:text-lime-500"
              >
                E-waste figures source
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </li>
          </ul>
          <p className="mt-6 text-sm leading-relaxed text-ivory-100/45">
            Prototype: device analysis uses a demo engine, and destinations and dashboard samples are illustrative.
          </p>
        </div>
      </div>
      <div aria-hidden="true" className="page-x select-none">
        <p className="-mb-[0.12em] whitespace-nowrap font-grotesk text-[clamp(4rem,26vw,25rem)] font-extrabold uppercase leading-[0.85] tracking-[-0.05em] text-[#13261b] [font-stretch:75%]">
          <HoverLetters text="second life" />
        </p>
      </div>
      <div className="border-t border-ivory-100/10">
        <div className="page-x flex flex-col justify-between gap-2 py-6 text-sm text-ivory-100/40 sm:flex-row">
          <p>© {new Date().getFullYear()} SecondLife AI</p>
          <p>Built for a circular future.</p>
        </div>
      </div>
    </footer>
  );
}
