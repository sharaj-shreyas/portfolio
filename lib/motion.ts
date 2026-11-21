import type { Variants } from "motion/react";

/**
 * The animation control room.
 *
 * Change an easing, duration or stagger here and every component that uses the
 * shared variants picks it up. Component-specific timings are props so they can
 * still be tuned locally.
 */

/** Set to true for the ember cursor follower on desktop. */
export const ENABLE_CURSOR_FOLLOWER = false;

type Bezier = [number, number, number, number];

export const ease: Record<"out" | "inOut" | "soft" | "thunk", Bezier> = {
  /** Fast start, long settle. The default for entrances. */
  out: [0.16, 1, 0.3, 1],
  /** Symmetric, for wipes and rules. */
  inOut: [0.83, 0, 0.17, 1],
  /** Gentle, for parallax and fades. */
  soft: [0.25, 0.46, 0.45, 0.94],
  /** A little overshoot, for the stamp. */
  thunk: [0.2, 0.9, 0.3, 1.25],
};

export const duration = {
  fast: 0.3,
  base: 0.65,
  slow: 1,
  banner: 1.1,
  wipe: 0.8,
} as const;

export const stagger = {
  char: 0.04,
  word: 0.05,
  line: 0.08,
  item: 0.08,
} as const;

export const viewportOnce = { once: true, amount: 0.2 } as const;
export const viewportLoose = {
  once: true,
  margin: "0px 0px -10% 0px",
} as const;

/* ------------------------------------------------------------------ */
/* Shared variants                                                     */
/* ------------------------------------------------------------------ */

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.base, ease: ease.out },
  },
};

/** A line of display type sliding out of its mask. */
export const maskLine: Variants = {
  hidden: { y: "140%" },
  show: {
    y: "0%",
    transition: { duration: duration.slow, ease: ease.out },
  },
};

/** A single banner character, with a hint of ink opacity. */
export const maskChar: Variants = {
  hidden: { y: "160%", opacity: 0 },
  show: {
    y: "0%",
    opacity: 1,
    transition: { duration: duration.banner, ease: ease.out },
  },
};

/** Parent for staggered lists. */
export const listStagger: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: stagger.item,
      delayChildren: 0.06,
    },
  },
};

export const listItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.base, ease: ease.out },
  },
};

export const starPop: Variants = {
  hidden: { rotate: -140, scale: 0, opacity: 0 },
  show: {
    rotate: 0,
    scale: 1,
    opacity: 1,
    transition: { duration: 0.7, ease: ease.thunk },
  },
};

/* ------------------------------------------------------------------ */
/* Menu overlay                                                        */
/* ------------------------------------------------------------------ */

export const menuPanel: Variants = {
  closed: { clipPath: "inset(0 0 100% 0)" },
  open: {
    clipPath: "inset(0 0 0% 0)",
    transition: { duration: duration.wipe, ease: ease.inOut },
  },
  exit: {
    clipPath: "inset(0 0 100% 0)",
    transition: { duration: duration.wipe, ease: ease.inOut },
  },
};

export const menuList: Variants = {
  closed: {},
  open: {
    transition: { staggerChildren: 0.06, delayChildren: 0.24 },
  },
  exit: {
    transition: { staggerChildren: 0.03, staggerDirection: -1 },
  },
};

export const menuLink: Variants = {
  closed: { y: "60%", opacity: 0 },
  open: {
    y: "0%",
    opacity: 1,
    transition: { duration: duration.base, ease: ease.out },
  },
  exit: {
    y: "40%",
    opacity: 0,
    transition: { duration: duration.fast, ease: ease.inOut },
  },
};

export const menuNumber: Variants = {
  closed: { opacity: 0, y: 8 },
  open: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.base, ease: ease.out },
  },
  exit: {
    opacity: 0,
    transition: { duration: duration.fast, ease: ease.inOut },
  },
};
