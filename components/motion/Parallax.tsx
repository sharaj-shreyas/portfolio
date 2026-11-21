"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import type { ReactNode } from "react";
import { useRef } from "react";

type ParallaxProps = {
  children: ReactNode;
  className?: string;
  /** Pixels of travel at the edges of the viewport. */
  speed?: number;
  axis?: "y" | "x";
};

/** Moves its child gently against the scroll, centred at zero when in view. */
export function Parallax({
  children,
  className,
  speed = 24,
  axis = "y",
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const raw = useTransform(scrollYProgress, [0, 0.5, 1], [speed, 0, -speed]);
  const spring = useSpring(raw, { stiffness: 130, damping: 24, mass: 0.4 });

  return (
    <motion.div
      ref={ref}
      className={className}
      style={reduce ? undefined : axis === "y" ? { y: spring } : { x: spring }}
    >
      {children}
    </motion.div>
  );
}
