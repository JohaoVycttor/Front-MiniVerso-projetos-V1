"use client";

import { useState } from "react";
import { Heading, Eyebrow } from "@/components/ui";
import { ProjectCard } from "@/components/project-card";
import type { Category, PageContent, Project, ProjectsSection } from "@/types/content";

export function ProjectGrid({ section, projects, categories, ui }: { section: ProjectsSection; projects: Project[]; categories: Category[]; ui: PageContent["ui"] }) {
  const [active, setActive] = useState("");
  const filtered = projects.filter((project) => !active || project.categoryIds.includes(active));
  const count = `${String(filtered.length).padStart(2, "0")} ${filtered.length === 1 ? ui.projectSingular : ui.projectPlural}`;
  return <section id={section.id} className="projects-section container" aria-labelledby={`${section.id}-heading`}>
    <div className="section-topline"><div><Eyebrow>{section.eyebrow}</Eyebrow><div id={`${section.id}-heading`}><Heading content={section.heading}/></div></div><span className="project-count micro-label" role="status" aria-live="polite">{count}</span></div>
    <div className="category-filters" role="group" aria-label={section.heading.text + " " + section.heading.accent}>
      {[{ id: "", label: ui.allCategories }, ...categories].map((category) => <button key={category.id} className={`filter-pill ${active === category.id ? "is-active" : ""}`} aria-pressed={active === category.id} onClick={() => setActive(category.id)}>{category.label}</button>)}
    </div>
    <div className={`project-grid columns-${section.columns}`} key={active}>
      {filtered.map((project, index) => <ProjectCard key={project.id} project={project} ui={ui} index={index}/>)}
    </div>
    {!filtered.length && <div className="empty-state glass"><h3>{ui.emptyTitle}</h3><p>{ui.emptyDescription}</p><button className="button" onClick={() => setActive("")}>{ui.resetFilters}</button></div>}
  </section>;
}
