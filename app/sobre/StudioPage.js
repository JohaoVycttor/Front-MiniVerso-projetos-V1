"use client";

import Link from 'next/link';
import {ArrowDown,ArrowUpRight} from 'lucide-react';
import HomeScene from '@/app/components/HomeScene';
import HomeMarquee from '@/app/components/HomeMarquee';
import StudioFormats from './StudioFormats';
import MobileCarousel from '@/app/components/MobileCarousel';
import MobileDisclosure from '@/app/components/MobileDisclosure';
import './studio-core.css';

function Heading({s}){return <h2>{s.title} <em>{s.highlight}</em></h2>}
function PixelEdge(){return <div className="studio-core-pixels" aria-hidden="true">{Array.from({length:48},(_,i)=><span key={i} style={{height:`${[14,32,8,24,40,12,28,5,20][i%9]}px`}}/>)}</div>}
function SelectedProjects({projects,section}){
 if(!projects.length)return null;
 return <section className="studio-core-projects studio-container" aria-labelledby="studio-projects-heading"><div className="studio-section-heading"><div><span className="studio-label">[ {section.label} ]</span><h2 id="studio-projects-heading">{section.title}<br/><em>{section.highlight}</em></h2></div><Link className="studio-text-link" href="/projetos">{section.actionLabel} <ArrowUpRight size={16}/></Link></div><MobileCarousel className="studio-core-project-list" label={section.label}>{projects.slice(0,3).map((project,i)=><Link key={project.id} className="studio-core-project" href={`/projetos/${project.slug}`}><span>/ {String(i+1).padStart(2,'0')}</span><div><small>{project.tag}</small><h3>{project.title}</h3></div><ArrowUpRight size={22}/></Link>)}</MobileCarousel></section>;
}

export default function StudioPage({content,projects=[]}){
 const sections=content.sections.filter(s=>s.enabled);
 const intro=sections.find(s=>s.type==='intro');
 const contact=sections.find(s=>s.type==='cta');
 const projectSection=content.projectSection;
 const hasFormats=sections.some(s=>s.id==='formats');
 return <div className="studio-page studio-core" style={{'--studio-bg':content.background,'--studio-accent':content.accent,'--core-background':content.background,'--core-accent':content.accent,'--studio-image':intro?.image?`url(${JSON.stringify(intro.image)})`:'none','--studio-image-position':intro?.imagePosition||'center 42%','--studio-overlay':intro?.overlay??.48}}>
  {sections.map(s=>{
   if(s.type==='intro')return <section key={s.id} className="studio-intro"><div className="studio-container studio-intro-inner">
    <div className="studio-core-masthead"><span aria-hidden="true">+</span>{s.id===intro.id?<h1>{content.pageTitle}<span className="studio-core-sr"> — Miniverso, experiências em realidade virtual</span></h1>:<h2>{content.pageTitle}</h2>}<span aria-hidden="true">+</span></div>
    <div className="studio-core-stage">
     <HomeScene image={s.image} video={s.video} poster={s.poster} alt={s.imageAlt}/>
     <div className="studio-hero-meta"><span><small>{content.heroMeta.studioLabel}</small>{content.heroMeta.studioValue}</span><span><small>{content.heroMeta.originLabel}</small>{content.heroMeta.originValue}</span><span><small>{content.heroMeta.experiencesLabel}</small>{content.heroMeta.experiencesValue}</span></div>
     <div className="studio-hero-copy"><span className="studio-label">[ {s.heroEyebrow} ]</span><Heading s={s}/><div className="studio-hero-actions"><Link className="studio-button" href={contact?.href||'/contato'}>{contact?.button||'Vamos conversar'}<ArrowUpRight size={16}/></Link><a className="studio-text-link" href={hasFormats?'#studio-formats':'#studio-story'}>{s.exploreLabel} <ArrowDown size={15}/></a></div><p className="studio-core-stage-note">{s.description}</p></div>
     <a className="studio-core-scroll" href="#studio-story"><ArrowDown size={16}/><span>{s.scrollLabel}</span></a><PixelEdge/>
    </div>
    {s.tags.length>0&&<HomeMarquee text={s.tags.join('\n')}/>}
    <div id={s.id===intro.id?'studio-story':`${s.id}-story`} className={`studio-story ${s.layout}`}><div><span className="studio-label">[ {s.label} ]</span><h2>{s.storyTitle} <em>{s.storyHighlight}</em></h2></div><div>{s.paragraphs[0]&&<p>{s.paragraphs[0]}</p>}{s.paragraphs.length>1&&<MobileDisclosure summary={s.continueLabel}>{s.paragraphs.slice(1).map((p,i)=><p key={i}>{p}</p>)}</MobileDisclosure>}<aside><strong>{s.noteTitle}</strong><p>{s.note}</p></aside></div></div>
   </div></section>;
   if(s.id==='formats'&&s.type==='cards')return <div id="studio-formats" key={s.id} className="studio-format-region"><StudioFormats section={s}/></div>;
   if(s.type==='cta')return <div key={s.id}>{s.id===contact.id&&<SelectedProjects projects={projects} section={projectSection}/>}<section className="studio-cta"><div className="studio-container"><span className="studio-label">[ {s.label} ]</span><div className="studio-core-cta-layout"><Heading s={s}/><div><Link className="studio-button" href={s.href}>{s.button}<ArrowUpRight size={20}/></Link><p>{s.buttonNote}</p></div></div></div></section></div>;
   return <section key={s.id} className="studio-section studio-container"><div className="studio-section-heading"><div><span className="studio-label">[ {s.label} ]</span><Heading s={s}/></div>{s.description&&<p>{s.description}</p>}</div><MobileCarousel className={`studio-cards ${s.layout}`} style={{'--columns':s.columns}} label={`${s.title} ${s.highlight}`}>{s.cards.map((card,i)=><article key={i}><span className="studio-card-index">/ {String(i+1).padStart(2,'0')}</span><h3>{card.title}</h3><p>{card.description}</p></article>)}</MobileCarousel></section>;
  })}
  {!contact&&<SelectedProjects projects={projects} section={projectSection}/>}
 </div>;
}
