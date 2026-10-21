"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";

/**
 * A soft ring that trails the pointer, swells over anything clickable and can
 * show a short label (set `data-cursor="View"` on an element). Clicks send out
 * a small lime ripple. Only runs for a mouse with motion allowed; the native
 * cursor always stays visible so nothing about usability changes.
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [hover, setHover] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [down, setDown] = useState(false);
  const [bursts, setBursts] = useState<{ id: number; x: number; y: number }[]>([]);
  const visible = useRef(false);
  const [shown, setShown] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 420, damping: 36, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 420, damping: 36, mass: 0.6 });

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)");
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    let burstId = 0;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
      if (!visible.current) {
        visible.current = true;
        setShown(true);
      }
      const t = e.target instanceof Element ? e.target : null;
      const labelled = t?.closest<HTMLElement>("[data-cursor]");
      setLabel(labelled?.dataset.cursor || null);
      setHover(!!t?.closest("a, button, [role=tab], [role=button], label, select, input, textarea, summary"));
    };
    const onLeave = () => {
      visible.current = false;
      setShown(false);
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      setDown(true);
      const id = ++burstId;
      setBursts((b) => [...b.slice(-4), { id, x: e.clientX, y: e.clientY }]);
      window.setTimeout(() => setBursts((b) => b.filter((p) => p.id !== id)), 700);
    };
    const onUp = () => setDown(false);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const size = label ? 84 : hover ? 54 : 30;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[70]">
      <motion.div
        className="absolute left-0 top-0"
        style={{ x: sx, y: sy }}
        animate={{ opacity: shown ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-lime-500/70 font-grotesk text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-forest-950"
          animate={{
            width: size,
            height: size,
            scale: down ? 0.82 : 1,
            backgroundColor: label ? "rgba(204,255,0,0.95)" : hover ? "rgba(204,255,0,0.12)" : "rgba(204,255,0,0)",
          }}
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
        >
          <AnimatePresence>
            {label && (
              <motion.span initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }}>
                {label}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {bursts.map((b) => (
        <motion.span
          key={b.id}
          className="absolute h-10 w-10 rounded-full border-2 border-lime-500"
          style={{ left: b.x - 20, top: b.y - 20 }}
          initial={{ scale: 0.2, opacity: 0.9 }}
          animate={{ scale: 2.2, opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />
      ))}
    </div>
  );
}
