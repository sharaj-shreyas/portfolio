"use client";

import { motion, useReducedMotion } from "motion/react";
import { duration, ease, viewportOnce } from "@/lib/motion";

type RuleDrawProps = {
  edge?: "top" | "bottom";
  /** Match the paper behind the rule. */
  tone?: "parchment" | "bone";
};

/**
 * Sits on top of an existing section border and redraws it left-to-right.
 * Absolutely positioned, so it adds no layout and leaves the resting page
 * pixel-identical once the line has finished drawing.
 */
export function RuleDraw({ edge = "top", tone = "parchment" }: RuleDrawProps) {
  const reduce = useReducedMotion();

  return (
    <span
      className={`rule-draw rule-draw--${edge} rule-draw--${tone}`}
      aria-hidden="true"
    >
      <motion.span
        className="rule-draw__line"
        initial={reduce ? false : { scaleX: 0 }}
        whileInView={reduce ? undefined : { scaleX: 1 }}
        viewport={viewportOnce}
        transition={{ duration: duration.slow, ease: ease.inOut }}
      />
    </span>
  );
}
