"use client";
import Link from 'next/link';
import {ArrowUpRight,Check} from 'lucide-react';
import CorePageHero from '@/app/components/CorePageHero';
import MobileCarousel from '@/app/components/MobileCarousel';
import MobileDisclosure from '@/app/components/MobileDisclosure';
import './solutions-core.css';

function Heading({s,hero=false}){const Tag=hero?'h1':'h2';return <><span className="solutions-label">[ {s.label} ]</span><Tag>{s.title} <em>{s.highlight}</em></Tag></>}

export default function SolutionsPage({content}){
 const sections=content.sections.filter(s=>s.enabled);
 const catalog=sections.find(s=>s.type==='catalog');
 const first=sections[0];
 const contact=sections.find(s=>s.type==='banner');
 const catalogId=catalog?`solutions-catalog-${catalog.id}`:'conteudo';
 return <div className="solutions-page core-page solutions-core" style={{'--solutions-bg':content.background,'--solutions-accent':content.accent,'--core-image':catalog?.image?`url(${JSON.stringify(catalog.image)})`:'none'}}>
  {catalog&&<CorePageHero title="soluções" heading={catalog.title} highlight={catalog.highlight} description={catalog.description} image={catalog.image} imagePosition={catalog.imagePosition} imageAlt="Pessoa explorando uma experiência de realidade virtual" eyebrow="Educação, criatividade e novas realidades" actionHref={contact?.href||'/contato'} actionLabel="Vamos criar uma experiência" scrollHref={`#${catalogId}`} scrollLabel="Conheça os formatos" specialties={catalog.cards.filter(c=>!c.wide).map(c=>c.title)}/>}
  {sections.map(s=>{
   if(s.type==='catalog')return <section id={`solutions-catalog-${s.id}`} className="solutions-catalog" key={s.id}><div className="solutions-container"><header className="solutions-intro"><div><span className="solutions-label">[ {s.label} / Formatos e possibilidades ]</span><h2>Uma ideia. <em>Muitas formas de explorar.</em></h2></div><p>Encontre o formato que faz sentido para o seu público, seu conteúdo e seu objetivo.</p></header><MobileCarousel className="solutions-grid" style={{'--solution-columns':s.columns}} label="Formatos e possibilidades">{s.cards.map((card,i)=><article key={i} className={`solution-tile ${card.wide?'wide':''}`}><div className="solution-main"><span className="solution-card-index">/ {String(i+1).padStart(2,'0')}</span><h3>{card.title}</h3><p>{card.description}</p><div className="solution-tags">{card.tags.map((tag,j)=><span key={j}>{tag}</span>)}</div></div><div className="solution-details"><MobileDisclosure summary={s.benefitsLabel}><span className="solutions-label">{s.benefitsLabel}</span><ul>{card.benefits.map((benefit,j)=><li key={j}><Check size={13}/>{benefit}</li>)}</ul></MobileDisclosure><Link href={card.href}>{s.button}<ArrowUpRight size={15}/></Link></div></article>)}</MobileCarousel></div></section>;
   if(s.type==='comparison')return <section key={s.id} className="solutions-section solutions-container"><div className="solutions-section-heading"><div><Heading s={s} hero={!catalog&&s.id===first.id}/></div><p>{s.description}</p></div><div className="solutions-table-wrap" role="region" aria-label={s.title} tabIndex={0}><table><caption className="solutions-sr-only">{s.title}</caption><thead><tr>{s.headers.map((header,i)=><th key={i} scope="col">{header}</th>)}</tr></thead><tbody>{s.rows.map((row,i)=><tr key={i}><th scope="row">{row.objective}</th><td>{row.format}</td><td>{row.delivery}</td></tr>)}</tbody></table></div></section>;
   if(s.type==='process')return <section key={s.id} className="solutions-section solutions-container"><div className="solutions-section-heading"><div><Heading s={s} hero={!catalog&&s.id===first.id}/></div></div><MobileCarousel className="solutions-process" style={{'--solution-columns':s.columns}} label="Como criamos sua experiência">{s.steps.map((step,i)=><article key={i}><span>/ {String(i+1).padStart(2,'0')}</span><h3>{step.title}</h3><p>{step.description}</p></article>)}</MobileCarousel></section>;
   return <section className="solutions-banner" key={s.id}>{s.image&&<img className="solutions-backdrop" src={s.image} alt="" style={{objectPosition:s.imagePosition}} loading="lazy"/>}<div className="solutions-container"><div className="solutions-core-cta"><div><Heading s={s} hero={!catalog&&s.id===first.id}/></div><div><p>{s.description}</p><Link className="solutions-button" href={s.href}>{s.button}<ArrowUpRight size={17}/></Link></div></div></div></section>;
  })}
 </div>;
}
