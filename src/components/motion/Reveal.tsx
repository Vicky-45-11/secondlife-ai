"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";

/** Fades and lifts content in once when it scrolls into view. */
export function Reveal({
  delay = 0,
  y = 28,
  children,
  ...rest
}: { delay?: number; y?: number } & HTMLMotionProps<"div">) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Masked line-by-line headline reveal. Each line slides up from behind a mask. */
export function SplitHeadline({
  lines,
  className,
  as: Tag = "h2",
  delay = 0,
  id,
}: {
  lines: React.ReactNode[];
  className?: string;
  as?: "h1" | "h2" | "h3";
  delay?: number;
  id?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <Tag id={id} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="-mb-[0.06em] block overflow-hidden pb-[0.14em]">
          <motion.span
            className="block"
            initial={reduce ? false : { y: "105%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 1, delay: delay + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
