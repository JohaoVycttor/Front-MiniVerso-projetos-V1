import Link from 'next/link';
import {Eyebrow,Heading} from './ui';
import {MediaPreview} from './media';
import {ProjectGrid} from './project-grid';
import {visibleProjects,visibleSections} from '@/lib/portfolio-content';
import {projectVisual} from '@/lib/project-visuals';
import {brief} from '@/lib/display-text';
import {EditorialCTA} from '@/app/components/Editorial';
import styles from '@/app/components/editorial.module.css';
export function Hero({section}){return <section id={section.id} className="hero-section container"><Eyebrow>{section.eyebrow}</Eyebrow><Heading content={section.heading} as="h1"/><p className="hero-description">{brief(section.description)}</p></section>;}
export function ProjectFacts({facts}){return <dl className="project-facts">{facts.map(fact=><div key={fact.label}><dt className="micro-label">{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl>;}
export function FeaturedProject({section,project,ui}){
 return <section id={section.id} className="container portfolio-featured-section" aria-label={section.badge}>
  <article className="featured-project glass" data-site-reveal>
   <div className="featured-media"><MediaPreview asset={project.presentation} ui={ui} presentation/></div>
   <div className="featured-content"><div className="badge-row"><span className="badge">{section.badge}</span><span className="badge">{project.tag}</span></div><h2>{project.title}</h2><p>{project.introduction}</p><ProjectFacts facts={project.facts}/><Link href={'/projetos/'+project.slug} className="button primary">{section.actionLabel} ↗</Link></div>
  </article>
 </section>;
}
export function Contact({section}){return <div id={section.id}><EditorialCTA label="Seu próximo projeto" title={section.heading.text} highlight={section.heading.accent} description={section.description} button={section.actionLabel}/></div>;}
export function SectionRenderer({content}){
 const projects=visibleProjects(content.projects);
 return <>{visibleSections(content.sections).map(section=>{
  if(section.type==='hero')return <Hero section={section} key={section.id}/>;
  if(section.type==='featured'){const project=projects.find(project=>project.id===section.projectId);return project?<FeaturedProject section={section} project={project} ui={content.ui} key={section.id}/>:null;}
  if(section.type==='projects')return <ProjectGrid section={section} projects={projects} categories={content.categories} ui={content.ui} key={section.id}/>;
  if(section.type==='contact')return <Contact section={section} key={section.id}/>;
  return null;
 })}</>;
}
