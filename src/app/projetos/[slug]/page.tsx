import Link from "next/link";
import { notFound } from "next/navigation";
import { getContent, visibleProjects } from "@/lib/content";
import { PageShell } from "@/components/page-shell";
import { Badge, ChevronLeftIcon, Heading } from "@/components/ui";
import { Gallery, PresentationPlayer } from "@/components/media";
import { ProjectFacts } from "@/components/sections";
import { NextProject, ProjectContact, ProjectHighlights, ProjectStory } from "@/components/project-detail";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const content = await getContent();
  const project = content.projects.find((project) => project.visible && project.slug === slug);
  return project ? { title: project.title, description: project.description } : {};
}

export default async function ProjectDetail({ params }: Props) {
  const { slug } = await params;
  const content = await getContent();
  const projects = visibleProjects(content.projects);
  const index = projects.findIndex((project) => project.slug === slug);
  const project = projects[index];
  if (!project) notFound();
  const next = projects.length > 1 ? projects[(index + 1) % projects.length] : undefined;
  return <PageShell content={content} background={project.background}>
    <div className="container detail-page">
      <nav className="breadcrumb" aria-label="Navegação estrutural"><Link href="/projetos"><ChevronLeftIcon/>{content.ui.projectsLabel}</Link><span aria-hidden="true">/</span><span aria-current="page">{project.title}</span></nav>
      <div className="badge-row"><Badge>{project.tag}</Badge>{project.year && <Badge>{project.year}</Badge>}</div>
      {project.heading ? <Heading content={project.heading} as="h1" className="detail-heading"/> : <h1 className="detail-title">{project.title}</h1>}
      <p className="detail-intro">{project.introduction}</p>
      <PresentationPlayer asset={project.presentation} ui={content.ui}/>
      <ProjectFacts facts={project.facts} className="detail-facts"/>
      <ProjectStory story={project.story}/>
      {project.highlights && <ProjectHighlights highlights={project.highlights} label={content.ui.highlightsLabel}/>}
      <Gallery assets={project.gallery} ui={content.ui}/>
      {next && <NextProject project={next} label={content.ui.nextProject}/>}
    </div>
    <ProjectContact ui={content.ui} email={content.contact.email}/>
  </PageShell>;
}
