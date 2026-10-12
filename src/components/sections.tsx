import Link from "next/link";
import { ArrowIcon, Badge, Eyebrow, Heading } from "@/components/ui";
import { MediaPreview } from "@/components/media";
import { ProjectGrid } from "@/components/project-grid";
import { visibleProjects, visibleSections } from "@/lib/content";
import type { ContactSection, FeaturedSection, HeroSection, PageContent, Project } from "@/types/content";

export function Hero({ section }: { section: HeroSection }) {
  return <section id={section.id} className="hero-section container"><Eyebrow>{section.eyebrow}</Eyebrow><Heading content={section.heading} as="h1"/><p className="hero-description">{section.description}</p></section>;
}

export function ProjectFacts({ facts }: { facts: Project["facts"] }) {
  return <dl className="project-facts">{facts.map((fact) => <div key={fact.label}><dt className="micro-label">{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl>;
}

export function FeaturedProject({ section, project, ui }: { section: FeaturedSection; project: Project; ui: PageContent["ui"] }) {
  return <section id={section.id} className="featured-section container" aria-label={section.badge}><article className="featured-project glass">
    <div className="featured-media"><MediaPreview asset={project.presentation} ui={ui} presentation/></div>
    <div className="featured-content"><div className="badge-row"><Badge>{section.badge}</Badge><Badge>{project.tag}</Badge></div><h2>{project.title}</h2><p>{project.introduction}</p><ProjectFacts facts={project.facts}/><Link className="button" href={`/projetos/${project.slug}`}>{section.actionLabel}<ArrowIcon/></Link></div>
  </article></section>;
}

export function Contact({ section, email }: { section: ContactSection; email: string }) {
  return <section id={section.id} className="contact-section"><div className="container contact-inner"><div><Heading content={section.heading}/><p>{section.description}</p></div><a className="button contact-cta" href={`mailto:${email}`}>{section.actionLabel}<ArrowIcon/></a></div></section>;
}

export function SectionRenderer({ content }: { content: PageContent }) {
  const projects = visibleProjects(content.projects);
  return <>{visibleSections(content.sections).map((section) => {
    switch (section.type) {
      case "hero": return <Hero key={section.id} section={section}/>;
      case "featured": {
        const project = projects.find((project) => project.id === section.projectId);
        return project ? <FeaturedProject key={section.id} section={section} project={project} ui={content.ui}/> : null;
      }
      case "projects": return <ProjectGrid key={section.id} section={section} projects={projects} categories={content.categories} ui={content.ui}/>;
      case "contact": return <Contact key={section.id} section={section} email={content.contact.email}/>;
    }
  })}</>;
}
