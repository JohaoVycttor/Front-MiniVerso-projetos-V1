"use client";
import {useEffect,useRef} from 'react';
import Link from 'next/link';
import {Lightbulb,Users,Heart,Globe2,GraduationCap,Monitor,Building2,Accessibility,BookOpen,Target,ArrowUpRight} from 'lucide-react';
const icons={light:Lightbulb,users:Users,heart:Heart,globe:Globe2,school:GraduationCap,screen:Monitor,building:Building2,access:Accessibility,book:BookOpen,target:Target};
function Heading({s,hero=false}){const Tag=hero?'h1':'h2';return <Tag>{s.title} <em>{s.highlight}</em></Tag>}
function Backdrop({s}){return <>{s.image&&<img className="studio-backdrop" src={s.image} alt="" style={{objectPosition:s.imagePosition}}/>}<div className="studio-shade" style={{opacity:s.overlay}}/></>}
export default function StudioPage({content}){
const root=useRef(null);
useEffect(()=>{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('studio-visible');observer.unobserve(e.target)}}),{threshold:0.08});root.current.querySelectorAll('[data-reveal]').forEach(el=>{if(el.getBoundingClientRect().top>innerHeight){el.classList.add('studio-pending');observer.observe(el)}});return ()=>observer.disconnect()},[content]);
return <div ref={root} className="studio-page" style={{'--studio-bg':content.background,'--studio-accent':content.accent}}>{content.sections.filter(s=>s.enabled).map(s=>{
if(s.type==='intro')return <section key={s.id} className="studio-intro"><Backdrop s={s}/><div className="studio-container studio-intro-inner"><div className="studio-hero-copy"><Heading s={s} hero/><p>{s.description}</p><div className="studio-tags">{s.tags.map((tag,i)=><span key={i}>{tag}</span>)}</div></div><div data-reveal className={`studio-story ${s.layout}`}><div><span className="studio-label">[ {s.label} ]</span><h2>{s.storyTitle} <em>{s.storyHighlight}</em></h2></div><div>{s.paragraphs.map((p,i)=><p key={i}>{p}</p>)}<aside><strong>{s.noteTitle}</strong><p>{s.note}</p></aside></div></div></div></section>;
if(s.type==='cta')return <section key={s.id} className="studio-cta" data-reveal><Backdrop s={s}/><div className="studio-container"><span className="studio-label">[ {s.label} ]</span><Heading s={s}/><Link className="studio-button" href={s.href}>{s.button}<ArrowUpRight size={19}/></Link></div></section>;
return <section key={s.id} className="studio-section studio-container" data-reveal><div className="studio-section-heading"><div><span className="studio-label">[ {s.label} ]</span><Heading s={s}/></div>{s.description&&<p>{s.description}</p>}</div><div className={`studio-cards ${s.layout}`} style={{'--columns':s.columns}}>{s.cards.map((c,i)=>{const Icon=icons[c.icon]||Lightbulb;return <article key={i}><span className="studio-icon"><Icon size={20} strokeWidth={1.4}/></span><h3>{c.title}</h3><p>{c.description}</p></article>})}</div></section>
})}</div>
}
