"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";
import { ArrowUp } from "lucide-react";

/** Floating button with a ring that fills as you read; appears after the first screen. */
export function BackToTop() {
  const { scrollY, scrollYProgress } = useScroll();
  const [show, setShow] = useState(false);
  useMotionValueEvent(scrollY, "change", (v) => setShow(v > 900));

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          aria-label="Back to top"
          data-cursor="Top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className="group fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-forest-900/90 text-ivory-50 shadow-lg backdrop-blur-md sm:bottom-8 sm:right-8"
        >
          <svg viewBox="0 0 56 56" className="absolute inset-0 -rotate-90" aria-hidden="true">
            <circle cx="28" cy="28" r="26" fill="none" stroke="rgba(244,240,229,0.12)" strokeWidth="2" />
            <motion.circle cx="28" cy="28" r="26" fill="none" stroke="#CCFF00" strokeWidth="2" strokeLinecap="round" style={{ pathLength: scrollYProgress }} />
          </svg>
          <ArrowUp className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-1" aria-hidden="true" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
