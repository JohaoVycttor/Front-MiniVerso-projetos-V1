import Link from 'next/link';
import {ArrowUpRight} from 'lucide-react';
import CorePageHero from '@/app/components/CorePageHero';
import MobileCarousel from '@/app/components/MobileCarousel';
import SiteMedia from '@/app/components/SiteMedia';
import {brief} from '@/lib/display-text';
import styles from '@/app/components/visual-content.module.css';
import './solutions.css';
import './solutions-core.css';

const photos=[
 {src:'/home-vr-person-v2.webp',alt:'Participante explorando realidade virtual'},
 {src:'/studio-ar-experience-v1.webp',alt:'Visual ilustrativo de realidade aumentada pelo celular'},
 {src:'/home-immersive-v1.webp',alt:'Visual ilustrativo de uma experiência imersiva'},
 {src:'/home-campus-v1.webp',alt:'Visual ilustrativo de um ambiente para visita virtual'},
 {src:'/home-vr-people-v2.webp',alt:'Pessoas experimentando realidade virtual com a Miniverso'}
];
function Heading({s,hero=false}){const Tag=hero?'h1':'h2';return <><span className="solutions-label">[ {s.label} ]</span><Tag>{s.title} <em>{s.highlight}</em></Tag></>}

export default function SolutionsPage({content}) {
 const sections=content.sections.filter(s=>s.enabled);
 const catalog=sections.find(s=>s.type==='catalog');
 const first=sections[0];
 const contact=sections.find(s=>s.type==='banner');
 const catalogId=catalog?'solutions-catalog-'+catalog.id:'conteudo';
 return <div className="solutions-page core-page solutions-core" style={{'--solutions-bg':content.background,'--solutions-accent':content.accent,'--core-image':catalog?.image?'url('+JSON.stringify(catalog.image)+')':'none'}}>
  {catalog&&<CorePageHero title="soluções" heading={catalog.title} highlight={catalog.highlight} description={brief(catalog.description)} image={catalog.image} imagePosition={catalog.imagePosition} imageAlt="Pessoa explorando uma experiência de realidade virtual" eyebrow="Formatos diferentes. Uma ideia em comum." actionHref={'#'+catalogId} actionLabel="Explore os formatos" scrollHref={contact?.href||'/contato'} scrollLabel="Vamos criar juntos" specialties={catalog.cards.filter(c=>!c.wide).map(c=>c.title)}/>}
  {sections.map(s=>{
   if(s.type==='catalog')return <section id={'solutions-catalog-'+s.id} className="solutions-catalog" key={s.id}><div className="solutions-container"><header className="solutions-intro"><div><span className="solutions-label">[ {s.label} / Explore ]</span><h2>Escolha como <em>ir além.</em></h2></div><p>Um formato para cada público. Um propósito em cada experiência.</p></header><div className={'solutions-grid '+styles.catalog}>{s.cards.map((card,i)=>{const photo=photos[i%photos.length];return <article key={i} className={'solution-tile '+styles.tile+(card.wide?' wide '+styles.wideTile:'')}><SiteMedia src={photo.src} alt={photo.alt}/><div className={styles.tileCopy}><span className="solution-card-index">/ {String(i+1).padStart(2,'0')}</span><h3>{card.title}</h3><p>{brief(card.description)}</p><div className="solution-tags">{card.tags.map((tag,j)=><span key={j}>{tag}</span>)}</div>{card.benefits.length>0&&<details className={styles.details}><summary>{s.benefitsLabel}</summary><ul>{card.benefits.map((benefit,j)=><li key={j}>{benefit}</li>)}</ul></details>}<Link className={styles.tileAction} href={card.href}>{s.button}<ArrowUpRight size={16}/></Link></div></article>})}</div></div></section>;
   if(s.type==='comparison')return <section key={s.id} className="solutions-section solutions-container"><div className={styles.comparison}><SiteMedia src="/home-workstation-v1.webp" alt="Visual ilustrativo de uma estação de criação digital"/><div><div className="solutions-section-heading"><div><Heading s={s} hero={!catalog&&s.id===first.id}/></div></div><div className={styles.formatList}>{s.rows.map((row,i)=><Link href={'/contato?subject='+encodeURIComponent(row.format)} className={styles.formatLink} key={i}><span>{row.format}</span><ArrowUpRight size={17}/></Link>)}</div><p style={{color:'#9aabc0',fontSize:13,lineHeight:1.8}}>{brief(s.description)}</p></div></div></section>;
   if(s.type==='process')return <section key={s.id} className="solutions-section solutions-container"><div className="solutions-section-heading"><div><Heading s={s} hero={!catalog&&s.id===first.id}/></div></div><MobileCarousel className="solutions-process" style={{'--solution-columns':s.columns}} label="O que orienta cada experiência">{s.steps.map((step,i)=><article key={i}><span>/ {String(i+1).padStart(2,'0')}</span><h3>{step.title}</h3><p>{brief(step.description)}</p></article>)}</MobileCarousel></section>;
   return <section className="solutions-banner" key={s.id}>{s.image&&<img className="solutions-backdrop" src={s.image} alt="" style={{objectPosition:s.imagePosition}} loading="lazy"/>}<div className="solutions-container"><div className="solutions-core-cta"><div><Heading s={s} hero={!catalog&&s.id===first.id}/></div><div><p>{brief(s.description)}</p><Link className="solutions-button" href={s.href}>{s.button}<ArrowUpRight size={17}/></Link></div></div></div></section>;
  })}
 </div>;
}