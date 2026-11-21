"use client";

import { motion, useReducedMotion } from "motion/react";
import { Fragment } from "react";
import { skills } from "@/content/data";
import { ease } from "@/lib/motion";
import { Eyebrow } from "./Eyebrow";
import { ScrambleText } from "./motion/ScrambleText";
import { Reveal } from "./motion/Reveal";
import { RuleDraw } from "./RuleDraw";

const starPath =
  "M12 0l2.6 8.4L23.4 6l-6.2 6 6.2 6-8.8-2.4L12 24l-2.6-8.4L.6 18l6.2-6L.6 6l8.8 2.4z";

export function Skills() {
  const reduce = useReducedMotion();

  return (
    <section className="section skills" id="skills" aria-labelledby="skills-title">
      <RuleDraw edge="top" tone="bone" />
      <div className="wrap skills__inner">
        <Eyebrow
          as="h2"
          id="skills-title"
          number={skills.number}
          label={skills.label}
        />

        <ul className="skill-list">
          {skills.items.map((skill, index) => (
            <Fragment key={skill}>
              <li>
                <ScrambleText text={skill} />{" "}
                {index < skills.items.length - 1 && (
                  <motion.svg
                    className="icon-star"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    focusable="false"
                    initial={
                      reduce
                        ? false
                        : { rotate: -140, scale: 0, opacity: 0 }
                    }
                    whileInView={
                      reduce
                        ? undefined
                        : { rotate: 0, scale: 1, opacity: 1 }
                    }
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{
                      duration: 0.7,
                      ease: ease.thunk,
                      delay: index * 0.12,
                    }}
                  >
                    <path d={starPath} />
                  </motion.svg>
                )}
              </li>{" "}
            </Fragment>
          ))}
        </ul>

        <Reveal as="p" className="skills__note">
          {skills.note}
        </Reveal>
      </div>
    </section>
  );
}
