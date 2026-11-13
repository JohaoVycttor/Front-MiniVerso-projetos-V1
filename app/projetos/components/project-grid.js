'use client';
import {useState} from 'react';
import {ProjectCard} from './project-card';
import {EditorialHeading} from '@/app/components/Editorial';
import styles from '@/app/components/editorial.module.css';
export function ProjectGrid({section,projects,categories,ui}){
 const [active,setActive]=useState('');
 const filtered=projects.filter(project=>!active||project.categoryIds.includes(active));
 return <section id={section.id} className={styles.scope+' '+styles.section}><div className="container">
  <EditorialHeading label={section.eyebrow} title={section.heading.text} highlight={section.heading.accent} description="Explore o contexto, o formato e as entregas de cada experiência."/>
  <div className="editorial-project-toolbar"><div className="category-filters" role="group" aria-label="Filtrar projetos por categoria">{[{id:'',label:ui.allCategories},...categories].map(category=><button type="button" key={category.id} className={'filter-pill'+(active===category.id?' is-active':'')} aria-pressed={active===category.id} onClick={()=>setActive(category.id)}>{category.label}</button>)}</div><p role="status" aria-live="polite">{String(filtered.length).padStart(2,'0')} {filtered.length===1?ui.projectSingular:ui.projectPlural}</p></div>
  <div className={`project-grid columns-${section.columns}`}>{filtered.map((project,index)=><ProjectCard key={project.id} project={project} index={index} ui={ui}/>)}</div>
  {!filtered.length&&<div className="editorial-empty"><h3>{ui.emptyTitle}</h3><p>{ui.emptyDescription}</p><button type="button" onClick={()=>setActive('')}>{ui.resetFilters}</button></div>}
 </div></section>;
}
