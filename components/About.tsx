import { about } from "@/content/data";
import { Education } from "./about/Education";
import { Facts } from "./about/Facts";
import { Portrait } from "./about/Portrait";
import { Stamp } from "./about/Stamp";
import { Eyebrow } from "./Eyebrow";
import { Reveal } from "./motion/Reveal";
import { SplitText } from "./motion/SplitText";
import { SmoothLink } from "./SmoothLink";

export function About() {
  return (
    <section className="section" id="about" aria-labelledby="about-title">
      <div className="wrap about__grid">
        <Portrait />

        <div className="about__story">
          <Eyebrow number={about.number} label={about.label} />
          <SplitText
            as="h2"
            id="about-title"
            className="headline headline--xl"
            text={about.title}
          />
          <Reveal as="p" className="lede dropcap" delay={0.15}>
            {about.lede}
          </Reveal>
          <Facts items={about.facts} />
          <p className="about__links">
            {about.links.map((link) => (
              <SmoothLink
                key={link.href}
                className="text-link"
                href={link.href}
              >
                {link.label} <span aria-hidden="true">↓</span>
              </SmoothLink>
            ))}
          </p>
        </div>

        <aside className="about__side" aria-labelledby="education-title">
          <Stamp />
          <Education title={about.educationTitle} items={about.education} />
        </aside>
      </div>
    </section>
  );
}
