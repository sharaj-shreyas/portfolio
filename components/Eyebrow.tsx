"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { createElement, useRef } from "react";
import { duration, ease } from "@/lib/motion";

type EyebrowProps = {
  number: string;
  label: string;
  as?: "p" | "h2" | "h3";
  id?: string;
  className?: string;
};

/**
 * "01 About" — the number sits in a hairline tag that draws itself in from the
 * left when the section arrives.
 */
export function Eyebrow({
  number,
  label,
  as = "p",
  id,
  className,
}: EyebrowProps) {
  const reduce = useReducedMotion();
  const numberRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(numberRef, { once: true, amount: 0.2 });
  const shown = Boolean(reduce) || inView;

  return createElement(
    as,
    {
      id,
      className: ["eyebrow", className].filter(Boolean).join(" "),
    },
    <motion.span
      key="number"
      ref={numberRef}
      initial={reduce ? false : { scaleX: 0, opacity: 0 }}
      animate={
        shown
          ? { scaleX: 1, opacity: 1 }
          : { scaleX: 0, opacity: 0 }
      }
      transition={{ duration: duration.base, ease: ease.out }}
      style={{ transformOrigin: "left" }}
    >
      {number}
    </motion.span>,
    label,
  );
}
