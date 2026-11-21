"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { useEffect, useState } from "react";

/**
 * Optional desktop-only ember dot. Enable it with
 * ENABLE_CURSOR_FOLLOWER in lib/motion.ts.
 */
export function CursorFollower() {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 500, damping: 40, mass: 0.3 });
  const springY = useSpring(y, { stiffness: 500, damping: 40, mass: 0.3 });

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setEnabled(finePointer.matches);
    update();
    finePointer.addEventListener("change", update);
    return () => finePointer.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!enabled || reduce) return;
    const move = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [enabled, reduce, x, y]);

  if (!enabled || reduce) return null;

  return (
    <motion.div
      className="cursor-follower"
      aria-hidden="true"
      style={{ x: springX, y: springY }}
    />
  );
}
