"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { ENABLE_CURSOR_FOLLOWER } from "@/lib/motion";
import { CursorFollower } from "./motion/CursorFollower";
import { SmoothScroll } from "./SmoothScroll";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll />
      {ENABLE_CURSOR_FOLLOWER && <CursorFollower />}
      {children}
    </MotionConfig>
  );
}
