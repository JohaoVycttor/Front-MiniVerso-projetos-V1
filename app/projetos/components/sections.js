import Link from 'next/link';
import { ArrowIcon, Badge, Eyebrow, Heading } from './ui';
import { MediaPreview } from './media';
import { ProjectGrid } from './project-grid';
import { visibleProjects, visibleSections } from '@/lib/portfolio-content';
import { projectVisual } from '@/lib/project-visuals';
import { brief } from '@/lib/display-text';

export function Hero({ section }) {
  return <section id={section.id} className="hero-section container"><Eyebrow>{section.eyebrow}</Eyebrow><Heading content={section.heading} as="h1"/><p className="hero-description">{brief(section.description)}</p></section>;
}
export function ProjectFacts({ facts }) {
  return <dl className="project-facts">{facts.map(fact=><div key={fact.label}><dt className="micro-label">{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl>;
}
export function FeaturedProject({ section, project, ui }) {
  const visual=projectVisual(project);
  return <section id={section.id} className="featured-section container" aria-label={section.badge}>
    <article className="featured-project glass">
      <div className="featured-media">{project.presentation.src?<MediaPreview asset={project.presentation} ui={ui} presentation/>:<><MediaPreview asset={visual.asset} ui={ui}/>{visual.illustrative&&<span className="media-caption">Visual ilustrativo</span>}</>}</div>
      <div className="featured-content"><div className="badge-row"><Badge>{section.badge}</Badge><Badge>{project.tag}</Badge></div><h2>{project.title}</h2><p>{brief(project.introduction)}</p><div className="featured-facts"><ProjectFacts facts={project.facts.slice(0,2)}/></div><Link className="button" href={'/projetos/'+project.slug}>{section.actionLabel}<ArrowIcon/></Link></div>
    </article>
  </section>;
}
export function Contact({ section }) {
  return <section id={section.id} className="contact-section"><div className="container contact-inner"><div><Heading content={section.heading}/><p>{brief(section.description)}</p></div><Link className="button contact-cta" href="/contato">{section.actionLabel}<ArrowIcon/></Link></div></section>;
}
export function SectionRenderer({ content }) {
  const projects=visibleProjects(content.projects);
  return <>{visibleSections(content.sections).map(section=>{
    if(section.type==='hero')return <Hero section={section} key={section.id}/>;
    if(section.type==='featured'){const project=projects.find(project=>project.id===section.projectId);return project?<FeaturedProject section={section} project={project} ui={content.ui} key={section.id}/>:null;}
    if(section.type==='projects')return <ProjectGrid section={section} projects={projects} categories={content.categories} ui={content.ui} key={section.id}/>;
    if(section.type==='contact')return <Contact section={section} key={section.id}/>;
    return null;
  })}</>;
}
