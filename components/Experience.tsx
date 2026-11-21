import { experience } from "@/content/data";
import { Story } from "./experience/Story";
import { Eyebrow } from "./Eyebrow";
import { SplitText } from "./motion/SplitText";
import { RuleDraw } from "./RuleDraw";

export function Experience() {
  return (
    <section
      className="section"
      id="experience"
      aria-labelledby="experience-title"
    >
      <RuleDraw edge="top" />
      <div className="wrap">
        <header className="section__head">
          <Eyebrow number={experience.number} label={experience.label} />
          <div className="section__head-row">
            <SplitText
              as="h2"
              id="experience-title"
              className="headline headline--lg"
              text={experience.title}
            />
            <p className="section__note">{experience.note}</p>
          </div>
        </header>

        <div className="exp-grid">
          {experience.entries.map((entry) => (
            <Story key={entry.id} entry={entry} />
          ))}
        </div>
      </div>
    </section>
  );
}
