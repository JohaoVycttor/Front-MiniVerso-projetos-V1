import Link from "next/link";
import { ArrowIcon, Badge } from "@/components/ui";
import { MediaPreview } from "@/components/media";
import type { PageContent, Project } from "@/types/content";

export function ProjectCard({ project, ui, index }: { project: Project; ui: PageContent["ui"]; index: number }) {
  return <article className="project-card glass" style={{ "--card-delay": `${index * 45}ms` } as React.CSSProperties}>
    <Link href={`/projetos/${project.slug}`} className="card-cover" aria-label={`${ui.detailsLabel}: ${project.title}`} tabIndex={-1}><MediaPreview asset={project.cover} ui={ui}/></Link>
    <div className="card-content"><Badge>{project.tag}</Badge><h3><Link href={`/projetos/${project.slug}`}>{project.title}</Link></h3><p>{project.description}</p><Link href={`/projetos/${project.slug}`} className="text-link">{ui.detailsLabel}<ArrowIcon/></Link></div>
  </article>;
}
