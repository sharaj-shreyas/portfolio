"use client";

import { useEffect, type RefObject } from "react";

export function useTilt(
  targetRef: RefObject<HTMLElement | null>,
  maxX = 22,
  maxY = 18,
  surfaceSelector = ".banner",
) {
  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const surface = target.closest<HTMLElement>(surfaceSelector);
    if (!surface) return;

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduce.matches) return;

    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const rect = surface.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      target.style.setProperty("--tilt-x", `${(-y * maxX).toFixed(2)}deg`);
      target.style.setProperty("--tilt-y", `${(x * maxY).toFixed(2)}deg`);
    };

    const reset = () => {
      target.style.setProperty("--tilt-x", "0deg");
      target.style.setProperty("--tilt-y", "0deg");
    };

    surface.addEventListener("pointermove", move);
    surface.addEventListener("pointerleave", reset);

    return () => {
      surface.removeEventListener("pointermove", move);
      surface.removeEventListener("pointerleave", reset);
    };
  }, [targetRef, maxX, maxY, surfaceSelector]);
}
