import { contact, site, ui } from "@/content/data";
import { CopyButton } from "./contact/CopyButton";
import { Eyebrow } from "./Eyebrow";
import { Reveal } from "./motion/Reveal";
import { SplitText } from "./motion/SplitText";

export function Contact() {
  return (
    <section className="section" id="contact" aria-labelledby="contact-title">
      <div className="wrap contact__grid">
        <div className="contact__intro">
          <Eyebrow number={contact.number} label={contact.label} />
          <SplitText
            as="h2"
            id="contact-title"
            className="headline headline--lg"
            text={contact.title}
          />
          <Reveal as="p" className="contact__lede" delay={0.1}>
            {contact.lede}
          </Reveal>
        </div>

        <ul className="contact__list">
          <li>
            <p className="contact__label">{contact.labels.email}</p>
            <a
              className="contact__value"
              id="contact-email"
              href={`mailto:${site.email}`}
            >
              {site.email}
            </a>
            <CopyButton
              value={site.email}
              valueId="contact-email"
              ariaLabel={ui.copyEmail}
            />
          </li>
          <li>
            <p className="contact__label">{contact.labels.phone}</p>
            <a
              className="contact__value"
              id="contact-phone"
              href={site.phoneHref}
            >
              {site.phoneDisplay}
            </a>
            <CopyButton
              value={site.phoneDisplay}
              valueId="contact-phone"
              ariaLabel={ui.copyPhone}
            />
          </li>
          <li>
            <p className="contact__label">{contact.labels.based}</p>
            <p className="contact__value">{contact.basedValue}</p>
          </li>
        </ul>
      </div>
    </section>
  );
}
