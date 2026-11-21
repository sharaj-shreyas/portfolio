"use client";

import type Lenis from "lenis";

/**
 * One Lenis instance is shared with every component that needs to scroll.
 * The menu locks it; anchor links ask it to travel.
 */

let lenis: Lenis | null = null;
let locked = false;

export function registerLenis(instance: Lenis | null) {
  lenis = instance;
  if (instance && locked) instance.stop();
}

export function stopScroll() {
  locked = true;
  lenis?.stop();
}

export function startScroll() {
  locked = false;
  lenis?.start();
}

export function headerOffset() {
  if (typeof document === "undefined") return 58;
  const masthead = document.querySelector<HTMLElement>(".masthead");
  return masthead?.offsetHeight ?? 58;
}

/** Smooth-scroll to an in-page anchor, offset by the sticky masthead. */
export function scrollToHash(hash: string) {
  if (typeof window === "undefined") return;

  const target = document.getElementById(hash.replace(/^#/, ""));
  if (!target) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const offset = -headerOffset();

  if (lenis && !reduce) {
    lenis.scrollTo(target, { offset, duration: 1.1 });
    return;
  }

  const top = target.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({
    top: Math.max(0, top),
    behavior: reduce ? "auto" : "smooth",
  });
}
