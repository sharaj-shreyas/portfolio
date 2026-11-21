"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ExperienceEntry } from "@/content/data";
import { listItem, listStagger } from "@/lib/motion";
import { Reveal } from "../motion/Reveal";
import { SplitText } from "../motion/SplitText";
import { PlateArt } from "../PlateArt";
import { LongForm } from "./LongForm";

export function Story({ entry }: { entry: ExperienceEntry }) {
  const reduce = useReducedMotion();
  const classes = [
    "story",
    entry.layout === "side" ? "story--side" : "",
    entry.layout === "long" ? "story--long" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Reveal
      as="article"
      className={classes}
      ariaLabelledby={entry.id}
      amount={0.08}
    >
      <div className="story__top">
        <SplitText
          as="h3"
          className="story__org"
          id={entry.id}
          text={entry.org}
        />
        {entry.badge ? (
          <span className="badge">{entry.badge}</span>
        ) : entry.dates ? (
          <p className="story__dates">{entry.dates}</p>
        ) : null}
      </div>

      {entry.roles.length > 0 && (
        <ul className="roles">
          {entry.roles.map((role) => (
            <li key={role.title}>
              <span className="roles__title">{role.title}</span>
              <span className="roles__when">{role.dates}</span>
            </li>
          ))}
        </ul>
      )}

      {entry.intro && <p>{entry.intro}</p>}

      {entry.bullets && (
        <motion.ul
          className="points"
          initial={reduce ? false : "hidden"}
          whileInView={reduce ? undefined : "show"}
          viewport={{ once: true, amount: 0.2 }}
          variants={listStagger}
        >
          {entry.bullets.map((bullet) => (
            <motion.li key={bullet} variants={listItem}>
              {bullet}
            </motion.li>
          ))}
        </motion.ul>
      )}

      {entry.pull && (
        <div className="pull">
          <p className="pull__name">{entry.pull.name}</p>
          <p className="pull__years">{entry.pull.years}</p>
          <p className="pull__note">{entry.pull.note}</p>
        </div>
      )}

      {entry.plate && <PlateArt plate={entry.plate} />}

      {entry.longform && (
        <LongForm
          paragraphs={entry.longform.paragraphs}
          highlights={entry.longform.highlights}
        />
      )}
    </Reveal>
  );
}
