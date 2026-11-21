"use client";

import { motion, useReducedMotion } from "motion/react";
import { listItem, listStagger } from "@/lib/motion";

type LongFormProps = {
  paragraphs: string[];
  highlights: { title: string; text: string }[];
};

export function LongForm({ paragraphs, highlights }: LongFormProps) {
  const reduce = useReducedMotion();

  return (
    <div className="longform">
      <div className="longform__text">
        {paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 32)}>{paragraph}</p>
        ))}
      </div>
      <motion.ul
        className="highlights"
        initial={reduce ? false : "hidden"}
        whileInView={reduce ? undefined : "show"}
        viewport={{ once: true, amount: 0.2 }}
        variants={listStagger}
      >
        {highlights.map((highlight) => (
          <motion.li key={highlight.title} variants={listItem}>
            <strong>{highlight.title}</strong>
            <span>{highlight.text}</span>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}
