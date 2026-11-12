import Link from 'next/link';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import HomeScene from '@/app/components/HomeScene';
import HomeMarquee from '@/app/components/HomeMarquee';
import SiteMedia from '@/app/components/SiteMedia';
import { brief } from '@/lib/display-text';
import { projectVisual } from '@/lib/project-visuals';
import StudioFormats from './StudioFormats';
import {EditorialHeading,EditorialPhoto,EditorialLink,EditorialPrinciples,EditorialCTA,EditorialProject} from '@/app/components/Editorial';
import ed from '@/app/components/editorial.module.css';
import styles from '@/app/components/visual-content.module.css';
import './studio-page.css';
import './studio-core.css';

function Heading({s}) { return <h2>{s.title} <em>{s.highlight}</em></h2>; }
function PixelEdge() { return <div className="studio-core-pixels" aria-hidden="true">{Array.from({length:48},(_,i)=><span key={i} style={{height:[14,32,8,24,40,12,28,5,20][i%9]+'px'}}/>)}</div>; }
function SelectedProjects({projects}){
 if(!projects.length)return null;
 return <section className={ed.scope+' '+ed.section}><div className="studio-container"><EditorialHeading label="Do nosso portfólio" title="Projetos que dão forma às ideias." action={<EditorialLink href="/projetos">Ver portfólio</EditorialLink>}/><div className={ed.projectList}>{projects.slice(0,2).map((project,index)=><EditorialProject key={project.id} project={project} index={index}/>)}</div></div></section>;
}

export default function StudioPage({content,projects=[]}) {
 const sections=content.sections.filter(s=>s.enabled);
 const intro=sections.find(s=>s.type==='intro');
 const contact=sections.find(s=>s.type==='cta');
 const hasFormats=sections.some(s=>s.id==='formats');
 return <div className="studio-page studio-core" style={{'--studio-bg':content.background,'--studio-accent':content.accent,'--studio-image':intro?.image?'url('+JSON.stringify(intro.image)+')':'none','--studio-image-position':intro?.imagePosition||'center 42%','--studio-overlay':intro?.overlay??.48}}>
  {sections.map(s=>{
   if(s.type==='intro')return <section key={s.id} className="studio-intro"><div className="studio-container studio-intro-inner">
    <div className="studio-core-masthead"><span aria-hidden="true">+</span>{s.id===intro.id?<h1>o estúdio<span className="studio-core-sr"> — Miniverso, experiências em realidade virtual</span></h1>:<h2>miniverso</h2>}<span aria-hidden="true">+</span></div>
    <div className="studio-core-stage"><HomeScene image={s.image} alt="Pessoa explorando uma experiência com óculos de realidade virtual"/><div className="studio-hero-meta"><span><small>MINIVERSO / ESTÚDIO</small>Criatividade e tecnologia</span><span><small>ORIGEM</small>São Luís, Brasil</span><span><small>EXPERIÊNCIAS</small>VR / AR / MR / 360°</span></div><div className="studio-hero-copy"><span className="studio-label">[ Criar junto. Ir além. ]</span><Heading s={s}/><div className="studio-hero-actions"><Link className="studio-button" href={contact?.href||'/contato'}>{contact?.button||'Vamos conversar'}<ArrowUpRight size={16}/></Link><a className="studio-text-link" href={hasFormats?'#studio-formats':'#studio-story'}>Explore nosso universo<ArrowDown size={15}/></a></div><p className="studio-core-stage-note">{brief(s.description)}</p></div><a className="studio-core-scroll" href="#studio-story"><ArrowDown size={16}/><span>Conheça a Miniverso</span></a><PixelEdge/></div>
    {s.tags.length>0&&<HomeMarquee text={s.tags.join('\n')}/>}
    <section id={s.id===intro.id?'studio-story':s.id+'-story'} className={ed.scope+' '+ed.section} style={{paddingBottom:0}}><div className={ed.story}><div className={ed.storyCopy}><EditorialHeading label={s.label} title={s.storyTitle} highlight={s.storyHighlight}/>{s.paragraphs.map(paragraph=><p key={paragraph}>{paragraph}</p>)}<dl className={ed.origin}><div><dt>Origem</dt><dd>São Luís, Maranhão</dd></div><div><dt>Nosso ponto de partida</dt><dd>Pessoas, conteúdo e contexto</dd></div></dl><EditorialLink href="/projetos">Conheça nossas experiências</EditorialLink></div><EditorialPhoto portrait src="/home-team-v2.webp" alt="Equipe da Miniverso em visita ao Casarão da Indústria, SESI-MA" caption="Registro da nossa visita ao Casarão da Indústria, SESI-MA."/></div></section>
   </div></section>;
   if(s.id==='formats'&&s.type==='cards')return <div id="studio-formats" key={s.id}><StudioFormats section={s}/></div>;
   if(s.type==='cta')return <div key={s.id}>{s.id===contact.id&&<SelectedProjects projects={projects}/>}<EditorialCTA label={s.label} title={s.title} highlight={s.highlight} href={s.href} button={s.button} description="Conte o que você quer trabalhar. O primeiro passo é entender o contexto."/></div>;
   if(s.id==='audiences')return <section key={s.id} className={ed.scope+' '+ed.section}><div className="studio-container"><EditorialHeading label={s.label} title={s.title} highlight={s.highlight} description={s.description}/><div className={ed.support}><EditorialPhoto portrait src="/home-vr-people-v2.webp" alt="Público usando os equipamentos de realidade virtual da Miniverso" caption="Pessoas experimentando as possibilidades da realidade virtual."/><EditorialPrinciples items={s.cards}/></div></div></section>;
   return <section key={s.id} className={ed.scope+' '+ed.section}><div className="studio-container"><EditorialHeading label={s.label} title={s.title} highlight={s.highlight} description={s.description}/><EditorialPrinciples items={s.cards}/></div></section>;
  })}
  {!contact&&<SelectedProjects projects={projects}/>}
 </div>;
}