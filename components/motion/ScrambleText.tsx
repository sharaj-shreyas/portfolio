"use client";

import { useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+/<>";

type ScrambleTextProps = {
  text: string;
  className?: string;
};

export function ScrambleText({ text, className }: ScrambleTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const reduce = useReducedMotion();
  const letters = text.replace(/\s/g, "");
  const [glyphs, setGlyphs] = useState(() => Array.from(letters));

  useEffect(() => {
    const final = Array.from(letters);

    if (!inView || reduce) {
      setGlyphs(final);
      return;
    }

    let alive = true;
    const timers: number[] = [];
    setGlyphs(final.slice());

    final.forEach((char, index) => {
      const flips = 3 + Math.floor(Math.random() * 4);
      let count = 0;

      const tick = () => {
        if (!alive) return;
        if (count >= flips) {
          setGlyphs((current) => {
            const next = current.slice();
            next[index] = char;
            return next;
          });
          return;
        }

        setGlyphs((current) => {
          const next = current.slice();
          next[index] =
            GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          return next;
        });
        count += 1;
        timers.push(window.setTimeout(tick, 55));
      };

      timers.push(window.setTimeout(tick, 60 + index * 18));
    });

    return () => {
      alive = false;
      timers.forEach(clearTimeout);
    };
  }, [inView, letters, reduce]);

  const words = text.split(/\s+/);
  let cursor = 0;

  return (
    <span
      ref={ref}
      className={["scramble", className].filter(Boolean).join(" ")}
      aria-label={text}
    >
      {words.map((word, wordIndex) => (
        <span key={`${word}-${wordIndex}`}>
          <span className="word" aria-hidden="true">
            {Array.from(word).map((_, charIndex) => {
              const index = cursor++;
              return (
                <span className="char" key={`${index}-${charIndex}`}>
                  {glyphs[index] ?? word[charIndex]}
                </span>
              );
            })}
          </span>
          {wordIndex < words.length - 1 ? " " : null}
        </span>
      ))}
    </span>
  );
}
