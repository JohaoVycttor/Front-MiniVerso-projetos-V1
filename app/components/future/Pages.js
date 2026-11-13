
import Link from 'next/link';
import {ArrowUpRight,ArrowLeft,Mail,MessageCircle,Instagram} from 'lucide-react';
import HomePresence from './HomePresence';
import FutureHero from './Hero';
import HomeMarquee from '../HomeMarquee';
import './legacy-marquee.css';
import InquiryForm from './InquiryForm';
import {FormatExplorer,ProjectCatalog,ProjectTile,VideoPanel,MediaGallery} from './Interactive';
import ImmersiveParticles from '@/app/components/ImmersiveParticles';
import {visibleSiteProjects} from '@/lib/site-content';
export function SectionHeading({section}){return <div className="future-section-heading" data-reveal><span className="future-eyebrow">{section.eyebrow}</span><div><h2>{section.title}</h2>{section.description&&<p>{section.description}</p>}</div></div>;}
function Photo({section}){return section.image?<figure className="future-photo" data-reveal><div><img src={section.image} alt={section.imageAlt} loading="lazy"/></div>{section.caption&&<figcaption>{section.caption}</figcaption>}</figure>:section.caption?<p className="future-media-caption">{section.caption}</p>:null;}
function Action({section}){return section.buttonLabel?<Link className="future-text-link" href={section.buttonHref||'/contato'}>{section.buttonLabel}<ArrowUpRight size={18}/></Link>:null;}
export function FuturePage({site,page,initialSubject=''}){
 const projects=visibleSiteProjects(site),ui=site.ui;
 return <div className={'future-page page-'+page.id}>
  <FutureHero hero={page.hero} settings={site.settings} ui={ui}/>
  <div id="explorar" className="legacy-ribbon">{page.ribbon.visible&&<HomeMarquee text={page.ribbon.text}/>}</div>
  {page.sections.filter(section=>section.visible).map(section=>{
   const selection=section.projectIds.length?projects.filter(project=>section.projectIds.includes(project.id)):projects;
   const featured=projects.find(project=>project.id===section.projectId)||projects[0];
   if(section.type==='digital')return <HomePresence key={section.id} section={section} settings={site.settings} digital={site.digital}/>;
   return <section key={section.id} id={section.id} className={'future-section future-shell'+(section.type==='cta'?' future-cta':'')}>
    {section.type==='experience'?<div className="future-experience"><div data-reveal><SectionHeading section={section}/><Photo section={section}/><Action section={section}/></div><div className="future-particles"><ImmersiveParticles/></div></div>:<>
     <SectionHeading section={section}/>
     {section.type==='intro'?<div className="future-intro-grid"><div className="intro-statement" data-reveal><span>{section.supportTitle}</span><p>{section.supportText}</p><Action section={section}/></div><Photo section={section}/></div>:<>
      <Photo section={section}/>
      {section.type==='formats'&&<div className="future-format-grid">{section.items.map((item,index)=><article key={item.id} data-reveal><Link href={item.href||'/servicos'}><div className={'future-project-cover'+(item.image?'':' no-image')}>{item.image?<img src={item.image} alt={item.imageAlt} loading="lazy"/>:<span className="project-cover-number">{String(index+1).padStart(2,'0')}<span>{site.settings.brand} / {item.tag}</span></span>}<span className="project-open"><ArrowUpRight size={23}/></span></div><h3>{item.title}</h3><p>{item.description}</p>{item.caption&&<small>{item.caption}</small>}</Link></article>)}</div>}
      {section.type==='solutions'&&<FormatExplorer items={section.items} ui={ui} brand={site.settings.brand}/>}
      {(section.type==='projects'||section.type==='catalog')&&(section.type==='catalog'?<ProjectCatalog projects={selection} ui={ui} brand={site.settings.brand}/>:<div className="future-project-grid">{selection.slice(0,section.limit).map((project,index)=><ProjectTile key={project.id} project={project} index={index} brand={site.settings.brand}/>)}</div>)}
      {section.type==='featured'&&featured&&<div className="future-featured" data-reveal><VideoPanel asset={featured.presentation} poster={featured.cover.src} title={featured.title} ui={ui}/><div className="future-featured-copy"><span className="future-eyebrow">{featured.tag}</span><h3>{featured.title}</h3><p>{featured.introduction}</p><dl>{featured.facts.slice(0,3).map(fact=><div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl><Link className="future-text-link" href={'/projetos/'+featured.slug}>{ui.projectDetails}<ArrowUpRight size={17}/></Link></div></div>}
      {section.type==='values'&&<div className="future-values">{section.items.map((item,index)=><article key={item.id} data-reveal><span>{String(index+1).padStart(2,'0')}{item.tag?' / '+item.tag:''}</span><h3>{item.title}</h3><p>{item.description}</p>{item.image&&<img src={item.image} alt={item.imageAlt} loading="lazy"/>}{item.caption&&<small>{item.caption}</small>}{item.href&&<Link className="future-text-link" href={item.href}>{item.title}<ArrowUpRight size={16}/></Link>}</article>)}</div>}
      {section.type==='contact'&&<div className="future-contact-grid"><aside data-reveal><span className="future-eyebrow">{ui.contactChannels}</span><a href={'mailto:'+site.settings.email}><Mail size={17}/><span>{ui.formEmail}<strong>{site.settings.email}</strong></span><ArrowUpRight size={16}/></a><a href={'https://wa.me/'+site.settings.whatsapp} target="_blank" rel="noopener noreferrer"><MessageCircle size={18}/><span>WhatsApp<strong>{ui.contactWhatsapp}</strong></span><ArrowUpRight size={16}/></a><a href={'https://www.instagram.com/'+site.settings.instagram+'/'} target="_blank" rel="noopener noreferrer"><Instagram size={18}/><span>Instagram<strong>@{site.settings.instagram}</strong></span><ArrowUpRight size={16}/></a><small>{site.settings.location}</small></aside><InquiryForm config={site.contact} ui={ui} initialSubject={initialSubject}/></div>}
      <Action section={section}/>
     </>}
    </>}
   </section>;
  })}
 </div>;
}
export function FutureProject({site,project}){
 const projects=visibleSiteProjects(site),ui=site.ui,index=projects.findIndex(entry=>entry.id===project.id),previous=projects[index-1],next=projects[index+1];
 return <div className="future-page future-project-detail"><div className="future-shell">
  <Link className="future-back" href="/projetos"><ArrowLeft size={18}/>{ui.projectBack}</Link>
  <header className="future-project-header" data-reveal><span className="future-eyebrow">{project.tag} / {ui.projectOverline}</span><h1>{project.title}</h1><p>{project.introduction}</p></header>
  {project.presentation.type==='video'?<VideoPanel asset={project.presentation} poster={project.cover.src} title={project.title} ui={ui}/>:project.presentation.src||project.cover.src?<figure className="future-project-main-image"><img src={project.presentation.src||project.cover.src} alt={project.presentation.alt||project.cover.alt}/>{(project.presentation.caption||project.cover.caption)&&<figcaption>{project.presentation.caption||project.cover.caption}</figcaption>}</figure>:<div className="future-project-no-media"><span>{String(index+1).padStart(2,'0')}</span><small>{project.tag}</small></div>}
  <div className="future-project-story"><dl data-reveal>{project.facts.map((fact,i)=><div key={i}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl><div>{project.story.map((block,i)=><section key={i} data-reveal><h2>{block.title}</h2><p>{block.text}</p></section>)}</div></div>
  <MediaGallery assets={project.gallery.filter(asset=>asset.src)} ui={ui}/>
  <nav className="future-project-next" aria-label="Navegar entre projetos"><Link href={previous?'/projetos/'+previous.slug:'/projetos'} rel={previous?'prev':undefined}><span>← {previous?ui.projectPrevious:ui.projectExplore}</span><strong>{previous?.title||ui.projectAll}</strong></Link><Link href={next?'/projetos/'+next.slug:'/projetos'} rel={next?'next':undefined}><span>{next?ui.projectNext:ui.projectExplore} →</span><strong>{next?.title||ui.projectAll}</strong></Link></nav>
 </div></div>;
}
