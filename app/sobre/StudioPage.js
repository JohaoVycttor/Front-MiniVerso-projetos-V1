import Link from 'next/link';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import HomeScene from '@/app/components/HomeScene';
import HomeMarquee from '@/app/components/HomeMarquee';
import SiteMedia from '@/app/components/SiteMedia';
import { brief } from '@/lib/display-text';
import { projectVisual } from '@/lib/project-visuals';
import StudioFormats from './StudioFormats';
import MobileCarousel from '@/app/components/MobileCarousel';
import styles from '@/app/components/visual-content.module.css';
import './studio-page.css';
import './studio-core.css';

function Heading({s}) { return <h2>{s.title} <em>{s.highlight}</em></h2>; }
function PixelEdge() { return <div className="studio-core-pixels" aria-hidden="true">{Array.from({length:48},(_,i)=><span key={i} style={{height:[14,32,8,24,40,12,28,5,20][i%9]+'px'}}/>)}</div>; }
function SelectedProjects({projects}) {
 if(!projects.length)return null;
 return <section className="studio-core-projects studio-container"><div className="studio-section-heading"><div><span className="studio-label">[ Do nosso portfólio ]</span><h2>Veja o que uma ideia<br/><em>pode se tornar.</em></h2></div><Link className="studio-text-link" href="/projetos">Explore os projetos<ArrowUpRight size={16}/></Link></div><div className={styles.projectGrid}>{projects.slice(0,3).map(project=>{const visual=projectVisual(project);return <Link key={project.id} className={styles.project} href={'/projetos/'+project.slug}><SiteMedia src={visual.asset.src} alt={visual.asset.alt} caption={visual.illustrative?'Visual ilustrativo':undefined} sizes="(max-width: 760px) 90vw, 30vw"/><div className={styles.projectMeta}><small>{project.tag}</small><ArrowUpRight size={20} aria-hidden="true"/></div><h3>{project.title}</h3></Link>})}</div></section>;
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
    <div id={s.id===intro.id?'studio-story':s.id+'-story'} className={'studio-story '+s.layout+' '+styles.story}><div><span className="studio-label">[ {s.label} ]</span><h2>{s.storyTitle} <em>{s.storyHighlight}</em></h2><p>{brief(s.paragraphs[0])}</p><Link className="studio-text-link" href="/projetos">Conheça nossas experiências<ArrowUpRight size={16}/></Link></div><SiteMedia src="/home-team-v2.webp" alt="Equipe da Miniverso em visita ao Casarão da Indústria SESI-MA" caption="Um encontro que faz parte da nossa história."/></div>
   </div></section>;
   if(s.id==='formats'&&s.type==='cards')return <div id="studio-formats" key={s.id} className="studio-format-region"><StudioFormats section={s}/></div>;
   if(s.type==='cta')return <div key={s.id}>{s.id===contact.id&&<SelectedProjects projects={projects}/>}<section className="studio-cta"><div className="studio-container"><span className="studio-label">[ {s.label} ]</span><div className="studio-core-cta-layout"><Heading s={s}/><div><Link className="studio-button" href={s.href}>{s.button}<ArrowUpRight size={20}/></Link><p>Vamos encontrar o formato da sua ideia.</p></div></div></div></section></div>;
   if(s.id==='audiences')return <section key={s.id} className="studio-section studio-container"><div className="studio-section-heading"><div><span className="studio-label">[ {s.label} ]</span><Heading s={s}/></div></div><div className={styles.support}><SiteMedia src="/home-vr-people-v2.webp" alt="Participantes explorando experiências da Miniverso"/><div className={styles.supportCopy}>{s.cards.map((card,i)=><article key={i}><h3>{card.title}</h3><p>{brief(card.description)}</p></article>)}</div></div></section>;
   return <section key={s.id} className="studio-section studio-container"><div className="studio-section-heading"><div><span className="studio-label">[ {s.label} ]</span><Heading s={s}/></div></div><MobileCarousel className={'studio-cards '+s.layout} style={{'--columns':s.columns}} label={s.title+' '+s.highlight}>{s.cards.map((card,i)=><article key={i}><span className="studio-card-index">/ {String(i+1).padStart(2,'0')}</span><h3>{card.title}</h3><p>{brief(card.description)}</p></article>)}</MobileCarousel></section>;
  })}
  {!contact&&<SelectedProjects projects={projects}/>}
 </div>;
}