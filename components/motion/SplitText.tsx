"use client";

import { useInView, useReducedMotion } from "motion/react";
import {
  Fragment,
  createElement,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";

type SplitTextProps = {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  className?: string;
  id?: string;
  /** Delay between characters, in seconds. */
  stagger?: number;
  /** Duration of one character flip, in seconds. */
  duration?: number;
};

export function SplitText({
  text,
  as = "h2",
  className,
  id,
  stagger = 0.028,
  duration = 0.8,
}: SplitTextProps) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, {
    once: true,
    amount: 0.2,
    margin: "0px 0px -12% 0px",
  });
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (reduce) setShown(true);
  }, [reduce]);

  useEffect(() => {
    if (!inView) return;
    setShown(true);
  }, [inView]);

  if (reduce) {
    return createElement(
      as,
      { ref, id, className },
      text,
    );
  }

  const words = text.split(/\s+/).filter(Boolean);
  let index = 0;
  const style = {
    "--stagger": `${Math.round(stagger * 1000)}ms`,
    "--flip-duration": `${duration}s`,
  } as CSSProperties;

  return createElement(
    as,
    {
      ref,
      id,
      className: [className, "split", shown ? "is-in" : "is-pending"]
        .filter(Boolean)
        .join(" "),
      "aria-label": text,
      style,
    },
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
    </span>,
  );
}
