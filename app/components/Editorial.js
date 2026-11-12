import Link from 'next/link';
import Image from 'next/image';
import {ArrowUpRight} from 'lucide-react';
import styles from './editorial.module.css';

export function EditorialHeading({label,title,highlight,description,action}) {
 return <header className={styles.sectionHeading} data-site-reveal><div className={styles.heading}><span className={styles.label}>{label}</span><h2>{title}{highlight&&<> <span>{highlight}</span></>}</h2></div>{(description||action)&&<div className={styles.headingAside}>{description&&<p>{description}</p>}{action}</div>}</header>;
}
export function EditorialLink({href,children}) {
 return <Link href={href} className={styles.textLink}>{children}<ArrowUpRight size={17} aria-hidden="true"/></Link>;
}
export function EditorialPhoto({src,alt,caption,portrait=false}) {
 return <figure className={`${styles.photograph} ${portrait?styles.portrait:''}`} data-site-reveal="media"><div><Image src={src} alt={alt} fill sizes="(max-width:760px) 90vw, 40vw" unoptimized={!src.startsWith('/')}/></div>{caption&&<figcaption>{caption}</figcaption>}</figure>;
}
export function EditorialCTA({label,title,highlight,description,href='/contato',button='Converse com a equipe'}) {
 return <section className={styles.cta}><div className={`shell ${styles.scope}`} data-site-reveal><span className={styles.label}>{label}</span><div className={styles.ctaBody}><h2>{title} {highlight}</h2><div>{description&&<p>{description}</p>}<EditorialLink href={href}>{button}</EditorialLink></div></div></div></section>;
}
export function EditorialPrinciples({items}) {
 return <dl className={styles.principles}>{items.map((item,index)=><div data-site-reveal key={item.id||item.title}><dt><span>{String(index+1).padStart(2,'0')}</span>{item.title}</dt><dd>{item.description}</dd></div>)}</dl>;
}
export function EditorialProcess({items}) {
 return <ol className={styles.process}>{items.map((item,index)=><li data-site-reveal key={item.id||item.title}><span className={styles.stepNumber}>{String(index+1).padStart(2,'0')}</span><div><h3>{item.title}</h3><p>{item.description}</p></div><ArrowUpRight size={18} aria-hidden="true"/></li>)}</ol>;
}
const stockCovers = new Set(['/project-science.jpg','/project-culture.jpg','/hero-vr.jpg','/home-campus-v1.webp','/home-immersive-v1.webp','/home-workstation-v1.webp','/studio-ar-experience-v1.webp']);
export function EditorialProject({project,index=0}) {
 const title=project.title||project.name, category=project.tag||project.category;
 const href=project.link||(project.slug?'/projetos/'+project.slug:'/home-projects/'+encodeURIComponent(project.id));
 const cover=typeof project.cover==='string'?project.cover:project.cover?.src;
 const realCover=cover&&!stockCovers.has(cover)&&((cover.startsWith('/')&&!cover.startsWith('//')&&!cover.includes('\\'))||/^https?:\/\//i.test(cover));
 const facts=project.facts?.slice(0,2)||[{label:'Formato',value:project.technologies},{label:'Público',value:project.client}].filter(fact=>fact.value);
 return <article className={styles.projectEntry} data-site-reveal>
  <div className={styles.projectTopline}><span>{String(index+1).padStart(2,'0')} / {category}</span><ArrowUpRight size={18} aria-hidden="true"/></div>
  {realCover&&<Link href={href} tabIndex={-1}><EditorialPhoto src={cover} alt={project.coverAlt||project.cover?.alt||title}/></Link>}
  <h3><Link href={href}>{title}</Link></h3><p>{project.summary||project.introduction||project.description}</p>
  {facts.length>0&&<dl className={styles.record}>{facts.map(fact=><div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl>}
  <EditorialLink href={href}>{project.buttonLabel||'Conheça o projeto'}</EditorialLink>
 </article>;
}
