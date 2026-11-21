"use client";

import type Lenis from "lenis";
import { useEffect } from "react";
import { registerLenis } from "@/lib/smooth-scroll";

const intentEvents = [
  "wheel",
  "touchstart",
  "pointerdown",
  "keydown",
  "scroll",
] as const;

/**
 * Lenis drives native scroll; ScrollTrigger listens to Lenis and the shared
 * GSAP ticker drives both. The libraries are code-split and only loaded once
 * the visitor interacts or scrolls, so they never block first paint.
 */
export function SmoothScroll() {
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    let disposed = false;
    let initializing = false;
    let lenis: Lenis | null = null;
    let removeTicker: (() => void) | null = null;
    let listening = true;

    const removeIntent = () => {
      if (!listening) return;
      listening = false;
      for (const event of intentEvents) {
        window.removeEventListener(event, onIntent);
      }
    };

    const teardown = () => {
      removeTicker?.();
      removeTicker = null;
      lenis?.destroy();
      lenis = null;
      registerLenis(null);
    };

    const setup = async () => {
      if (disposed || initializing || lenis || query.matches) return;
      initializing = true;
      try {
        const [{ default: LenisCtor }, { gsap, ScrollTrigger }] =
          await Promise.all([import("lenis"), import("@/lib/gsap")]);

        if (disposed || query.matches) return;

        const instance = new LenisCtor({
          duration: 1.05,
          smoothWheel: true,
          touchMultiplier: 1.4,
        });
        lenis = instance;
        registerLenis(instance);
        instance.on("scroll", ScrollTrigger.update);

        const tick = (time: number) => instance.raf(time * 1000);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);
        removeTicker = () => gsap.ticker.remove(tick);

        ScrollTrigger.refresh();
        void document.fonts?.ready.then(() => ScrollTrigger.refresh());
      } finally {
        initializing = false;
      }
    };

    function onIntent() {
      removeIntent();
      void setup();
    }

    for (const event of intentEvents) {
      window.addEventListener(event, onIntent, { passive: true });
    }

    const onChange = () => {
      if (query.matches) {
        removeIntent();
        teardown();
      } else {
        void setup();
      }
    };
    query.addEventListener("change", onChange);

    return () => {
      disposed = true;
      query.removeEventListener("change", onChange);
      removeIntent();
      teardown();
    };
  }, []);

  return null;
}
