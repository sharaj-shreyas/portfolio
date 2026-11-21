"use client";

import Image from "next/image";
import {
  Fragment,
  useState,
  type CSSProperties,
  type RefObject,
} from "react";
import type { FilterId, Project } from "@/content/data";

type ProjectIndexProps = {
  projects: Project[];
  active: FilterId;
  listRef: RefObject<HTMLOListElement | null>;
};

function EntryTitle({ text }: { text: string }) {
  const words = text.split(/\s+/);
  let index = 0;

  return (
    <span className="entry__title split">
      <span className="visually-hidden">{text}</span>
      <span aria-hidden="true">
        {words.map((word, wordIndex) => (
          <Fragment key={`${word}-${wordIndex}`}>
            <span className="word">
              {Array.from(word).map((char) => {
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
              })}
            </span>
            {wordIndex < words.length - 1 ? " " : null}
          </Fragment>
        ))}
      </span>
    </span>
  );
}

export function ProjectIndex({
  projects,
  active,
  listRef,
}: ProjectIndexProps) {
  const [open, setOpen] = useState<Record<string, boolean>>({});

  return (
    <ol className="project-index" id="project-index" ref={listRef}>
      {projects.map((project, index) => {
        const no = String(index + 1).padStart(2, "0");
        const bodyId = `project-${no}-details`;
        const visible = active === "all" || project.category === active;
        const hasDetails = Boolean(
          project.note ||
            project.description ||
            project.image ||
            project.link,
        );
        const expanded = Boolean(open[bodyId]);
        const meta = project.year
          ? `${project.categoryLabel} · ${project.year}`
          : project.categoryLabel;

        const rowContents = (
          <>
            <span className="entry__no">{no}</span>
            <EntryTitle text={project.title} />
            <span className="entry__cat">{meta}</span>
            <span className="entry__icon" aria-hidden="true" />
          </>
        );

        return (
          <li
            className={`entry${hasDetails ? "" : " entry--static"}`}
            data-cat={project.category}
            data-index={index}
            hidden={!visible}
            key={`${project.title}-${index}`}
          >
            <h3 className="entry__heading">
              {hasDetails ? (
                <button
                  className="entry__row"
                  type="button"
                  aria-expanded={expanded}
                  aria-controls={bodyId}
                  onClick={() =>
                    setOpen((current) => ({
                      ...current,
                      [bodyId]: !current[bodyId],
                    }))
                  }
                >
                  {rowContents}
                </button>
              ) : (
                <div className="entry__row">{rowContents}</div>
              )}
            </h3>

            {hasDetails && (
              <div
                className={`entry__body${project.image ? " has-image" : ""}`}
                id={bodyId}
                hidden={!expanded}
              >
                {project.image && (
                  <Image
                    className="entry__image"
                    src={project.image.src}
                    alt={project.image.alt}
                    width={project.image.width}
                    height={project.image.height}
                    sizes="(max-width: 760px) 90vw, 320px"
                  />
                )}
                <div className="entry__text">
                  {project.note && <p className="entry__note">{project.note}</p>}
                  {project.description && (
                    <p className="entry__note">{project.description}</p>
                  )}
                  {project.link && (
                    <a
                      className="text-link"
                      href={project.link.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {project.link.label ?? "View project"} ↗
                    </a>
                  )}
                </div>
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
