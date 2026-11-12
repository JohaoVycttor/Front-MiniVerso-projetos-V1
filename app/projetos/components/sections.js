import Link from 'next/link';
import {Eyebrow,Heading} from './ui';
import {MediaPreview} from './media';
import {ProjectGrid} from './project-grid';
import {visibleProjects,visibleSections} from '@/lib/portfolio-content';
import {projectVisual} from '@/lib/project-visuals';
import {brief} from '@/lib/display-text';
import {EditorialLink,EditorialCTA} from '@/app/components/Editorial';
import styles from '@/app/components/editorial.module.css';
export function Hero({section}){return <section id={section.id} className="hero-section container"><Eyebrow>{section.eyebrow}</Eyebrow><Heading content={section.heading} as="h1"/><p className="hero-description">{brief(section.description)}</p></section>;}
export function ProjectFacts({facts}){return <dl className="project-facts">{facts.map(fact=><div key={fact.label}><dt className="micro-label">{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl>;}
export function FeaturedProject({section,project,ui}){
 const visual=projectVisual(project);
 return <section id={section.id} className={styles.scope+' '+styles.section}><div className="container"><span className={styles.label}>{section.badge} / {project.tag}</span><article className={styles.featured}><div><h2>{project.title}</h2><p>{project.introduction}</p><EditorialLink href={'/projetos/'+project.slug}>{section.actionLabel}</EditorialLink></div><aside className={styles.featuredFacts} aria-label="Ficha do projeto"><dl className={styles.record}>{project.facts.map(fact=><div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl></aside></article>{(project.presentation.src||!visual.illustrative)&&<div className={styles.featuredMedia}><MediaPreview asset={project.presentation.src?project.presentation:visual.asset} ui={ui} presentation={Boolean(project.presentation.src)}/></div>}</div></section>;
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
