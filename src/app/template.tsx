"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

// The first page load already has the hero intro, so the wipe only plays on navigation.
let navigated = false;

/**
 * Page transition: a forest-and-lime curtain sweeps up and away as each new
 * route mounts, while the content rises into place.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const [afterNav] = useState(() => navigated);
  useEffect(() => {
    navigated = true;
  }, []);
  const play = afterNav && !reduce;

  return (
    <>
      {play && (
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[65]">
          <motion.div
            className="absolute inset-0 bg-lime-500"
            initial={{ y: "0%" }}
            animate={{ y: "-100%" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.08 }}
          />
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-forest-900"
            initial={{ y: "0%" }}
            animate={{ y: "-100%" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <span className="font-grotesk text-[clamp(2rem,6vw,4rem)] font-bold uppercase tracking-[-0.03em] text-lime-500 [font-stretch:75%]">
              Second life
            </span>
          </motion.div>
        </div>
      )}
      <motion.div
        initial={play ? { opacity: 0, y: 40 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: play ? 0.35 : 0 }}
      >
        {children}
      </motion.div>
    </>
  );
}
