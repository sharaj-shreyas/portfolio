"use client";

import { useInView, useReducedMotion } from "motion/react";
import {
  Fragment,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { useFitText } from "@/lib/fit-text";
import { useTilt } from "@/lib/use-tilt";

type FitWordProps = {
  text: string;
  descender?: boolean;
  /** "load" plays on mount; "scroll" waits until the banner is in view. */
  animation?: "load" | "scroll" | "none";
  ariaHidden?: boolean;
  className?: string;
};

export function FitWord({
  text,
  descender = false,
  animation = "scroll",
  ariaHidden = false,
  className,
}: FitWordProps) {
  const fitRef = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(fitRef, { once: true, amount: 0.2 });
  const [shown, setShown] = useState(false);

  useFitText(fitRef);
  useTilt(fitRef, 22, 18, ".banner");

  useEffect(() => {
    if (reduce || animation === "none") {
      setShown(true);
      return;
    }

    if (animation === "load") {
      const frame = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(frame);
    }
  }, [animation, reduce]);

  useEffect(() => {
    if (animation === "scroll" && inView) setShown(true);
  }, [animation, inView]);

  const animated = !reduce && animation !== "none";
  const classes = [
    "fit",
    descender ? "fit--descender" : "",
    animated ? "split" : "",
    animated ? (shown ? "is-in" : "is-pending") : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const words = text.split(/\s+/).filter(Boolean);
  let index = 0;

  return (
    <span
      ref={fitRef}
      className={classes}
      aria-hidden={ariaHidden || undefined}
    >
      {!ariaHidden && animated && (
        <span className="visually-hidden">{text}</span>
      )}
      {animated ? (
        <span aria-hidden="true">
          {words.map((word, wordIndex) => {
            const chars = Array.from(word).map((char) => {
              const current = index++;
              return (
                <span
                  className="char"
                  style={{ "--i": current } as CSSProperties}
                  key={`${char}-${current}`}
                >
                  {char}
                </span>
              );
            });

            return (
              <Fragment key={`${word}-${wordIndex}`}>
                <span className="word">{chars}</span>
                {wordIndex < words.length - 1 ? " " : null}
              </Fragment>
            );
          })}
        </span>
      ) : (
        text
      )}
    </span>
  );
}
