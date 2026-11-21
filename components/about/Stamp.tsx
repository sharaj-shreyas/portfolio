"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import type { PointerEvent } from "react";
import { about } from "@/content/data";
import { duration, ease } from "@/lib/motion";

export function Stamp() {
  const reduce = useReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateX = useSpring(rawX, { stiffness: 170, damping: 18 });
  const rotateY = useSpring(rawY, { stiffness: 170, damping: 18 });
  const { stamp } = about;

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reduce || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(x * 18);
    rotateX.set(-y * 18);
  };

  const reset = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <div
      className="stamp-tilt"
      aria-hidden="true"
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
    >
      <motion.div
        className="stamp-wrap"
        style={{ rotateX, rotateY, transformPerspective: 900 }}
        initial={reduce ? false : { rotate: -16, scale: 1.35, opacity: 0 }}
        whileInView={
          reduce ? undefined : { rotate: -4, scale: 1, opacity: 1 }
        }
        animate={reduce ? { rotate: -4, scale: 1, opacity: 1 } : undefined}
        viewport={{ once: true, amount: 0.5 }}
        transition={{
          duration: duration.base,
          ease: ease.thunk,
          delay: 0.25,
        }}
      >
        <div className="stamp">
          <div className="stamp__inner">
            <div className="stamp__sun">
              <span className="stamp__rays" />
              <span className="stamp__disc">{stamp.initial}</span>
            </div>
            <p className="stamp__sign">{stamp.name}</p>
            <dl className="stamp__rows">
              {stamp.rows.map((row) => (
                <div key={row.label}>
                  <dt>{row.label}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
