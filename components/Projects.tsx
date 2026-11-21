"use client";

import { useRef, useState } from "react";
import type {
  FilterId,
  ProjectCategory,
  ProjectFilter,
} from "@/content/data";
import { projects, projectsSection } from "@/content/data";
import { Eyebrow } from "./Eyebrow";
import { SplitText } from "./motion/SplitText";
import { ProjectIndex } from "./projects/ProjectIndex";
import { ProjectPreview } from "./projects/ProjectPreview";
import { ProjectStage } from "./projects/ProjectStage";
import { RuleDraw } from "./RuleDraw";

const listWords = (words: string[]) => {
  if (words.length <= 1) return words[0] ?? "";
  return `${words.slice(0, -1).join(", ")} and ${words[words.length - 1]}`;
};

const lowerFirst = (value: string) =>
  value.charAt(0).toLowerCase() + value.slice(1);

const categories = Array.from(
  new Set(projects.map((project) => project.category)),
) as ProjectCategory[];

const labels = categories.map((category) => {
  const project = projects.find((item) => item.category === category);
  return project?.categoryLabel ?? category;
});

const filters: ProjectFilter[] = [
  { id: "all", label: "All" },
  ...categories.map((category, index) => ({
    id: category,
    label: labels[index],
  })),
];

const summary = `${projects.length} builds in ${listWords(
  labels.map(lowerFirst),
)}.`;

const counts = filters.reduce<Record<FilterId, number>>(
  (result, filter) => {
    result[filter.id] =
      filter.id === "all"
        ? projects.length
        : projects.filter((project) => project.category === filter.id).length;
    return result;
  },
  {} as Record<FilterId, number>,
);

export function Projects() {
  const [active, setActive] = useState<FilterId>("all");
  const [status, setStatus] = useState("");
  const listRef = useRef<HTMLOListElement>(null);

  const changeFilter = (id: FilterId) => {
    setActive(id);
    const count = counts[id];
    setStatus(`Showing ${count} project${count === 1 ? "" : "s"}`);
  };

  return (
    <section className="section" id="projects" aria-labelledby="projects-title">
      <RuleDraw edge="top" />
      <div className="wrap">
        <div className="projects__head">
          <header className="projects__intro">
            <Eyebrow
              number={projectsSection.number}
              label={projectsSection.label}
            />
            <SplitText
              as="h2"
              id="projects-title"
              className="headline headline--lg"
              text={projectsSection.title}
            />
            <div className="projects__aside">
              <p className="projects__sub">{summary}</p>
              <p className="caption">{projectsSection.note}</p>
            </div>
          </header>

          <ProjectStage />
        </div>

        <div
          className="filters"
          id="project-filters"
          role="group"
          aria-label="Filter projects by category"
        >
          {filters.map((filter) => (
            <button
              key={filter.id}
              className="filter"
              type="button"
              aria-pressed={active === filter.id}
              onClick={() => changeFilter(filter.id)}
            >
              {filter.label}{" "}
              <span className="filter__count">{counts[filter.id]}</span>
            </button>
          ))}
        </div>

        <p
          className="visually-hidden"
          id="filter-status"
          aria-live="polite"
        >
          {status}
        </p>

        <ProjectIndex projects={projects} active={active} listRef={listRef} />
        <ProjectPreview projects={projects} listRef={listRef} />
      </div>
    </section>
  );
}
