"use client";

import Image from "next/image";
import { useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { about } from "@/content/data";
import { useTilt } from "@/lib/use-tilt";

export function Portrait() {
  const { portrait } = about;
  const figureRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const inView = useInView(figureRef, { once: true, amount: 0.2 });
  const reduce = useReducedMotion();

  useTilt(mediaRef, 10, 10, ".portrait");

  const revealed = Boolean(reduce) || inView;
  const classes = ["portrait", revealed ? "is-revealed" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <figure ref={figureRef} className={classes}>
      <div className="portrait__media" data-tilt="10" ref={mediaRef}>
        <Image
          className="portrait__img"
          src={portrait.src}
          alt={portrait.alt}
          width={portrait.width}
          height={portrait.height}
          sizes="(max-width: 760px) 100vw, (max-width: 1100px) 45vw, 28vw"
          priority
          loading="eager"
          fetchPriority="high"
        />
        <span className="portrait__veil" aria-hidden="true" />
      </div>
      <figcaption className="caption">{portrait.caption}</figcaption>
    </figure>
  );
}
