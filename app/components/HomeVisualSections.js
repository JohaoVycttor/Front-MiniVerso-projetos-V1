import SolutionsExplorer from './SolutionsExplorer';
import SiteShowcase, {HomePhones} from './HomeDevices';
import {isExperienceFormat} from '@/lib/solution-formats';
import {EditorialHeading,EditorialLink,EditorialPhoto,EditorialPrinciples,EditorialProcess,EditorialProject} from './Editorial';
import styles from './editorial.module.css';

const text=value=>typeof value==='string'?value:'';
const cleanLabel=value=>text(value).replaceAll('[','').replaceAll(']','').split('—').pop().trim();
const safeUrl=value=>typeof value==='string'&&((value.startsWith('/')&&!value.startsWith('//')&&!value.includes(String.fromCharCode(92)))||value.startsWith('https://')||value.startsWith('http://'))?value:'';
function Action({fields,fallback}){return <EditorialLink href={safeUrl(fields.buttonUrl)||fallback}>{text(fields.buttonLabel)||'Saiba mais'}</EditorialLink>}
function History({fields}){
 return <><div className={styles.story}><div className={styles.storyCopy} data-site-reveal>
  <EditorialHeading label={cleanLabel(fields.eyebrow)} title={fields.title} highlight={fields.highlight}/>
  <p>{text(fields.text)}</p><dl className={styles.origin}><div><dt>De onde criamos</dt><dd>São Luís, Maranhão</dd></div><div><dt>O que nos aproxima</dt><dd>Educação, criatividade e tecnologia</dd></div></dl>
  <Action fields={fields} fallback="/sobre"/>
 </div><EditorialPhoto portrait src="/home-team-v2.webp" alt="Equipe da Miniverso no Casarão da Indústria, SESI-MA" caption="Do nosso arquivo: visita ao Casarão da Indústria, SESI-MA."/></div><SiteShowcase bare/></>;
}
function Solutions({fields,items}){
 const formats=items.filter(item=>isExperienceFormat(item.title)),services=items.filter(item=>!isExperienceFormat(item.title));
 return <><EditorialHeading label={cleanLabel(fields.eyebrow)} title={fields.title} highlight={fields.highlight} description={fields.subtitle} action={<Action fields={fields} fallback="/servicos"/>}/><HomePhones devicesOnly/><SolutionsExplorer items={formats}/>{services.map(item=><div className={styles.serviceNote} data-site-reveal key={item.id}><h3>{item.title}</h3><p>{item.description}</p><EditorialLink href={safeUrl(item.link)||'/contato?subject='+encodeURIComponent(item.title)}>{item.buttonLabel||'Converse com a equipe'}</EditorialLink></div>)}</>;
}
function Projects({fields,items}){
 const projects=[...items].sort((a,b)=>Number(b.id===fields.featured)-Number(a.id===fields.featured));
 return <><EditorialHeading label={cleanLabel(fields.eyebrow)} title={fields.title} highlight={fields.highlight} description={fields.subtitle} action={<Action fields={fields} fallback="/projetos"/>}/><div className={styles.projectList}>{projects.map((project,index)=><EditorialProject key={project.id} project={project} index={index}/>)}</div></>;
}
function Values({fields,items}){
 return <><EditorialHeading label={cleanLabel(fields.eyebrow)} title={fields.title} highlight={fields.highlight} description={fields.statement||fields.subtitle}/><EditorialPrinciples items={items}/></>;
}
function Process({fields,items}){
 return <div className={styles.split}><div className={styles.heading}><EditorialHeading label={cleanLabel(fields.eyebrow)} title={fields.title} highlight={fields.highlight}/><p>{fields.subtitle}</p><EditorialLink href="/contato">Vamos dar o primeiro passo</EditorialLink></div><EditorialProcess items={items}/></div>;
}
const sections={sobre:History,servicos:Solutions,projetos:Projects,diferenciais:Values,processo:Process};
export const visualSectionKeys=Object.keys(sections);
export default function HomeVisualSection({section}){
 const Component=sections[section.key];
 return <section id={section.key} className={styles.scope+' '+styles.section} data-editorial-section={section.key}><div className="shell"><Component fields={section.fields} items={section.items.filter(item=>item.visible!==false)}/></div></section>;
}
