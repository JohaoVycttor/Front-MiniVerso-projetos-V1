'use client';
import {useEffect,useId,useRef,useState} from 'react';
import Link from 'next/link';
import ImmersiveParticles from './ImmersiveParticles';
import {ArrowUpRight,ArrowRight} from 'lucide-react';
import {formatProfile} from '@/lib/solution-formats';
import styles from './solutions-explorer.module.css';
import NeonFormat from './NeonFormat';

function FormatStudy({profile}) {
 const titleId=useId();
 return <figure className={styles.study} data-format-part>
  <div className={styles.studyHeader}><span>MINIVERSO / FORMATOS</span><span>{profile.code}</span></div>
  {profile.key==='vr'?<div className={styles.particles}><ImmersiveParticles/></div>:<NeonFormat format={profile.key} titleId={titleId} label={profile.context}/>}
  <figcaption><span>{profile.key==='vr'?'Experiência em movimento':'Esquema de interação'}</span><span>{profile.device}</span></figcaption>
 </figure>;
}
export default function SolutionsExplorer({items=[],buttonLabel='Conversar sobre este formato',compact=false}) {
 const [active,setActive]=useState(0), tabs=useRef([]), panels=useRef([]), previous=useRef(0), prefix=useId();
 const cards=items.filter(item=>item.visible!==false);
 const selected=Math.min(active,Math.max(cards.length-1,0));
 useEffect(()=>{
  if(previous.current===selected)return;
  previous.current=selected;
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const parts=panels.current[selected]?.querySelectorAll('[data-format-part]')||[];
  const animations=[...parts].map((element,index)=>element.animate([
   {opacity:0,translate:'0 18px'},
   {opacity:1,translate:'0 0'}
  ],{duration:700,delay:index*70,easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'}));
  return()=>animations.forEach(animation=>animation.cancel());
 },[selected]);
 if(!cards.length)return null;
 function navigate(event,index){
  let next;
  if(event.key==='ArrowRight')next=(index+1)%cards.length;
  else if(event.key==='ArrowLeft')next=(index-1+cards.length)%cards.length;
  else if(event.key==='Home')next=0;
  else if(event.key==='End')next=cards.length-1;
  else return;
  event.preventDefault();setActive(next);tabs.current[next]?.focus();
 }
 return <div className={`${styles.explorer} ${compact?styles.compact:''}`} data-site-reveal>
  <div className={styles.tabs} role="tablist" aria-label="Explorar formatos de experiências" aria-orientation="horizontal">
   {cards.map((item,index)=>{const profile=formatProfile(item.title);return <button type="button" key={item.id||item.title} role="tab" id={`${prefix}-tab-${index}`} aria-controls={`${prefix}-panel-${index}`} aria-selected={index===selected} tabIndex={index===selected?0:-1} ref={node=>{tabs.current[index]=node}} onClick={()=>setActive(index)} onKeyDown={event=>navigate(event,index)}><span>{profile.code}</span>{profile.name}<ArrowRight size={16} aria-hidden="true"/></button>})}
  </div>
  {cards.map((item,index)=>{
   const profile=formatProfile(item.title), candidate=item.href||item.link;
   const href=typeof candidate==='string'&&((candidate.startsWith('/')&&!candidate.startsWith('//')&&!candidate.includes('\\'))||/^https?:\/\//i.test(candidate))?candidate:'/contato?subject='+encodeURIComponent(profile.name);
   return <div key={item.id||item.title} className={styles.panel} ref={node=>{panels.current[index]=node}} id={`${prefix}-panel-${index}`} role="tabpanel" aria-labelledby={`${prefix}-tab-${index}`} hidden={index!==selected} tabIndex={0}>
    <FormatStudy profile={profile}/>
    <div className={styles.copy} data-format-part><span className={styles.context}>{profile.context}</span><h3>{item.title}</h3><p>{item.description}</p>
     {!compact&&<dl className={styles.facts}><div><dt>Como se participa</dt><dd>{profile.interaction}</dd></div><div><dt>Aplicações</dt><dd>{profile.application}</dd></div></dl>}
     {item.benefits?.length>0&&<ul className={styles.benefits}>{item.benefits.map(benefit=><li key={benefit}>{benefit}</li>)}</ul>}
     <Link href={href} className={styles.action}>{item.buttonLabel||buttonLabel}<ArrowUpRight size={18} aria-hidden="true"/></Link>
    </div>
   </div>;
  })}
 </div>;
}
