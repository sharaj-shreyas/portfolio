"use client";

import { useLayoutEffect, useRef } from "react";

/**
 * Fits a word to the width of its parent, the way the original inline script
 * did. Runs in a layout effect so the final size is applied before first paint,
 * and refits on resize and once the web fonts are ready.
 */
export function useFitText(ref: React.RefObject<HTMLElement | null>) {
  const width = useRef(0);

  useLayoutEffect(() => {
    const fit = ref.current;
    const box = fit?.parentElement;
    if (!fit || !box) return;

    let frame = 0;

    const fitNow = () => {
      fit.style.fontSize = "";
      const styles = getComputedStyle(box);
      const available =
        box.clientWidth -
        parseFloat(styles.paddingLeft || "0") -
        parseFloat(styles.paddingRight || "0");
      // offsetWidth ignores the 3D tilt transform, unlike a bounding rect.
      const natural = fit.offsetWidth;
      const size = parseFloat(getComputedStyle(fit).fontSize);

      if (natural > 0 && available > 0) {
        fit.style.fontSize = `${((size * available) / natural).toFixed(2)}px`;
      }
      width.current = box.clientWidth;
    };

    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(fitNow);
    };

    // Before paint.
    fitNow();

    // After the real typeface swaps in.
    document.fonts?.ready.then(schedule);

    window.addEventListener("resize", schedule);

    const observer = new ResizeObserver((entries) => {
      const nextWidth = entries[0]?.contentRect.width ?? box.clientWidth;
      if (Math.abs(nextWidth - width.current) < 0.5) return;
      schedule();
    });
    observer.observe(box);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", schedule);
      observer.disconnect();
    };
  }, [ref]);
}
