"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { useMemo } from "react";
import { duration, ease, viewportOnce } from "@/lib/motion";

type RevealTag =
  | "div"
  | "section"
  | "article"
  | "aside"
  | "figure"
  | "header"
  | "p"
  | "li";

type RevealProps = {
  children: ReactNode;
  as?: RevealTag;
  className?: string;
  id?: string;
  ariaLabelledby?: string;
  delay?: number;
  y?: number;
  once?: boolean;
  amount?: number;
};

/**
 * The everyday entrance: a short fade and rise, once, when the element enters
 * the viewport. Returns the content untouched when reduced motion is requested.
 */
export function Reveal({
  children,
  as = "div",
  className,
  id,
  ariaLabelledby,
  delay = 0,
  y = 24,
  once = true,
  amount = 0.2,
}: RevealProps) {
  const reduce = useReducedMotion();
  const MotionTag = useMemo(() => motion.create(as), [as]);

  return (
    <MotionTag
      id={id}
      className={className}
      aria-labelledby={ariaLabelledby}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration: duration.base, ease: ease.out, delay }}
    >
      {children}
    </MotionTag>
  );
}
