"use client";
import { useState } from "react";
import { ProjectCard } from "./Cards";

export default function ProjectGallery({ projects }) {
  const [category, setCategory] = useState("Todos");
  const categories = ["Todos", ...new Set(projects.map(project => project.category))];
  const filtered = category === "Todos" ? projects : projects.filter(project => project.category === category);
  return <><div className="project-filters" role="group" aria-label="Filtrar projetos por categoria">{categories.map(label=><button type="button" key={label} aria-pressed={category === label} onClick={()=>setCategory(label)}>{label}<span>{label === "Todos" ? projects.length : projects.filter(p=>p.category === label).length}</span></button>)}</div><p className="result-count" role="status">{filtered.length} {filtered.length === 1 ? "experiência" : "experiências"}</p><div className="projects-grid all">{filtered.map((p,i)=><ProjectCard key={p.id} item={p} index={i}/>)}</div></>;
}
