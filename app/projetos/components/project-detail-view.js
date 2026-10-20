import Link from 'next/link';
import {ShieldCheck, Glasses, ChartNoAxesColumnIncreasing, ArrowUpRight} from 'lucide-react';
import {PageShell} from './page-shell';
import {MediaPreview,PresentationPlayer} from './media';
import {ScrollReveal} from './scroll-reveal';
import {projectDetail} from '@/lib/project-detail';
import {visibleProjects} from '@/lib/portfolio-content';
import './project-detail.css';
const icons={shield:ShieldCheck,headset:Glasses,chart:ChartNoAxesColumnIncreasing};
function DetailBlock({section:s, project, content}){
 const heading=<>{s.label&&<p className="case-label">[ {s.label} ]</p>}{s.title&&<h2>{s.title}{s.accent&&<em>{s.accent}</em>}</h2>}{s.description&&<p className="case-description">{s.description}</p>}</>;
 if(s.type==='hero')return <><Link href="/projetos" className="case-back">← {content.ui.backToProjects}</Link>{s.label&&<p className="case-label">[ {s.label} ]</p>}<h1>{s.title}{s.accent&&<em>{s.accent}</em>}</h1>{s.description&&<p className="case-description">{s.description}</p>}</>;
 if(s.type==='media')return <>{s.label&&<p className="case-label">{s.label}</p>}{s.asset.type==='video'?<PresentationPlayer asset={s.asset} ui={content.ui}/>:<div className="case-presentation glass"><MediaPreview asset={s.asset} ui={content.ui} presentation/></div>}{s.description&&<p className="case-caption">{s.description}</p>}</>;
 if(s.type==='facts')return <>{heading}<dl className="case-facts">{s.items.map((item,i)=><div key={i}><dt>{item.title}</dt><dd>{item.description}</dd></div>)}</dl></>;
 if(s.type==='story'||s.type==='benefits')return <>{heading}<div className="case-items">{s.items.map((item,i)=>{const Icon=icons[item.icon]||ShieldCheck;return <article className={s.type==='benefits'?'case-benefit glass':'case-story'} key={i}>{s.type==='benefits'&&<span className="case-icon"><Icon size={19}/></span>}{item.label&&<p className="case-label">[ {item.label} ]</p>}<h3>{item.title}</h3><p>{item.description}</p></article>})}</div></>;
 if(s.type==='gallery')return <>{heading}<div className="case-gallery">{s.items.map((asset,i)=><figure key={asset.id}><div className="case-gallery-media glass"><MediaPreview asset={asset} ui={content.ui} presentation/></div><figcaption>{asset.caption||asset.alt}</figcaption></figure>)}</div></>;
 if(s.type==='next'){
  const list=visibleProjects(content.projects).filter(p=>p.id!==project.id);
  const ordered=visibleProjects(content.projects);const current=ordered.findIndex(p=>p.id===project.id);const next=list.find(p=>p.id===s.projectId)||ordered[(current+1)%ordered.length];
  return next?<Link className="case-next glass" href={'/projetos/'+next.slug}><span><span className="case-label">{s.label}</span><strong>{s.title||next.title}</strong><small>{next.tag}</small></span><span className="case-next-arrow"><span aria-hidden="true">→</span></span></Link>:null;
 }
 return <>{heading}{s.button&&<Link href={s.href} className="button">{s.button}<ArrowUpRight size={16}/></Link>}</>;
}
export function ProjectDetailView({project,content}){
 const detail=projectDetail(project);
 const blocks=<div className="case-study container" style={{'--case-overlay':detail.overlay,'--case-position':detail.position}}>{detail.sections.filter(s=>s.visible).map(s=><section id={s.id} key={s.id} className={'case-block case-section-'+s.type+' case-layout-'+s.layout} data-case-reveal><DetailBlock section={s} project={project} content={content}/></section>)}</div>;
 return <PageShell content={content} background={detail.background||content.brand.background} scenePosition={detail.position}><div className="case-scene" style={{'--case-overlay':detail.overlay,'--case-position':detail.position}}>{detail.animations?<ScrollReveal>{blocks}</ScrollReveal>:blocks}</div></PageShell>;
}
