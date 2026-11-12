import Link from 'next/link';
import {ArrowUpRight} from 'lucide-react';
import CorePageHero from '@/app/components/CorePageHero';
import SolutionsExplorer from '@/app/components/SolutionsExplorer';
import {EditorialHeading,EditorialPhoto,EditorialPrinciples,EditorialCTA} from '@/app/components/Editorial';
import {brief} from '@/lib/display-text';
import ed from '@/app/components/editorial.module.css';
import './solutions.css';
import './solutions-core.css';

export default function SolutionsPage({content}){
 const sections=content.sections.filter(s=>s.enabled),catalog=sections.find(s=>s.type==='catalog'),contact=sections.find(s=>s.type==='banner');
 const catalogId=catalog?'solutions-catalog-'+catalog.id:'conteudo';
 return <div className="solutions-page core-page solutions-core" style={{'--solutions-bg':content.background,'--solutions-accent':content.accent,'--core-image':catalog?.image?'url('+JSON.stringify(catalog.image)+')':'none'}}>
  {catalog&&<CorePageHero title="soluções" heading={catalog.title} highlight={catalog.highlight} description={brief(catalog.description)} image={catalog.image} imagePosition={catalog.imagePosition} imageAlt="Pessoa explorando uma experiência de realidade virtual" eyebrow="Formatos diferentes. Uma ideia em comum." actionHref={'#'+catalogId} actionLabel="Explore os formatos" scrollHref={contact?.href||'/contato'} scrollLabel="Vamos criar juntos" specialties={catalog.cards.filter(c=>!c.wide).map(c=>c.title)}/>}
  {sections.map(s=>{
   if(s.type==='catalog')return <div key={s.id}>
    <section id={'solutions-catalog-'+s.id} className={ed.scope+' '+ed.section}><div className="solutions-container"><EditorialHeading label={s.label} title="O que você quer que seu público experimente?" description="Compare os formatos, entenda como se participa e encontre uma aplicação para a sua ideia."/><SolutionsExplorer items={s.cards.filter(card=>!card.wide)} buttonLabel={s.button}/></div></section>
    {s.cards.filter(card=>card.wide).map(card=><section key={card.title} className={ed.scope+' '+ed.section}><div className="solutions-container"><div className={ed.support}><EditorialPhoto portrait src="/home-vr-people-v2.webp" alt="Participantes usando os óculos de realidade virtual da Miniverso" caption="Do nosso arquivo: a experiência encontrando seu público."/><div><EditorialHeading label="Construção em conjunto" title={card.title}/><p className="editorial-paragraph">{card.description}</p><ul className={ed.benefitList}>{card.benefits.map(benefit=><li key={benefit}>{benefit}</li>)}</ul><Link className={ed.textLink} href={card.href}>{s.button}<ArrowUpRight size={17}/></Link></div></div></div></section>)}
   </div>;
   if(s.type==='comparison')return <section key={s.id} className={ed.scope+' '+ed.section}><div className="solutions-container"><EditorialHeading label={s.label} title={s.title} highlight={s.highlight} description={s.description}/><table className={ed.comparison}><thead><tr><th>O que você quer trabalhar</th><th>Formato</th><th>O que a experiência permite</th></tr></thead><tbody>{s.rows.map(row=><tr key={row.format}><td>{row.objective}</td><td><Link href={'/contato?subject='+encodeURIComponent(row.format)}>{row.format}<ArrowUpRight size={15}/></Link></td><td>{row.delivery}</td></tr>)}</tbody></table></div></section>;
   if(s.type==='process')return <section key={s.id} className={ed.scope+' '+ed.section}><div className="solutions-container"><EditorialHeading label={s.label} title={s.title} highlight={s.highlight}/><EditorialPrinciples items={s.steps}/></div></section>;
   return <EditorialCTA key={s.id} label={s.label} title={s.title} highlight={s.highlight} description={s.description} href={s.href} button={s.button}/>;
  })}
 </div>;
}
