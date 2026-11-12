'use client';
import {useEffect,useId,useRef,useState} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {ArrowUpRight,ArrowRight} from 'lucide-react';
import {formatProfile} from '@/lib/solution-formats';
import styles from './solutions-explorer.module.css';

function FormatStudy({profile}) {
 const titleId=useId();
 return <figure className={styles.study} data-format-part>
  <div className={styles.studyHeader}><span>MINIVERSO / FORMATOS</span><span>{profile.code}</span></div>
  {profile.key==='vr'?<div className={styles.headset}><Image src="/vr-headset-side-v2.png" alt="Vista lateral de um headset de realidade virtual" fill sizes="(max-width:760px) 88vw, 40vw"/></div>:<svg className={styles.diagram} viewBox="0 0 600 390" role="img" aria-labelledby={titleId}>
   <title id={titleId}>{profile.context} — esquema de interação</title>
   {profile.key==='ar'?<>
    <path d="M110 275 293 180 496 272 310 368Z" fill="#14171e" stroke="#606a80"/>
    <path d="m150 277 144-74 157 70-143 72Z" fill="none" stroke="#323b4d"/>
    <path d="m300 98 82 46v95l-82 48-82-48v-95Z" fill="#1d293b" stroke="#a7cbe6" strokeWidth="1.3"/>
    <path d="m218 144 82 48 82-48m-82 48v95" fill="none" stroke="#a7cbe6" strokeWidth="1.3"/>
    <path d="M300 287v35M212 122l-42-45M390 122l43-45" stroke="#76839c" strokeDasharray="4 5"/>
    <text x="110" y="55">CONTEÚDO DIGITAL</text><text x="365" y="350">MATERIAL FÍSICO</text>
    <path d="M93 105V77h27M480 77h27v28M93 290v28h27M507 290v28h-27" fill="none" stroke="#b3d9ef" strokeWidth="2"/>
   </>:profile.key==='mr'?<>
    <path d="M60 295 300 175l240 120M90 330l210-105 210 105M180 370V220M300 370V175M420 370V220" fill="none" stroke="#303a4b"/>
    <path d="M126 175 224 120l98 55v115l-98 57-98-57Z" fill="#171c26" stroke="#6d7a91" strokeWidth="1.3"/>
    <path d="m126 175 98 56 98-56m-98 56v116" fill="none" stroke="#6d7a91"/>
    <path d="m310 80 94 53v110l-94 55-94-55V133Z" fill="#233147" fillOpacity=".68" stroke="#abcfe8" strokeWidth="1.5"/>
    <path d="m216 133 94 54 94-54m-94 54v111" fill="none" stroke="#abcfe8"/>
    <text x="65" y="80">ESPAÇO REAL</text><text x="373" y="305">ELEMENTO VIRTUAL</text>
    <path d="m166 89-25 48m273 153-44-20" fill="none" stroke="#8d9bb4"/>
   </>:<>
    <ellipse cx="300" cy="190" rx="172" ry="140" fill="#151b26" stroke="#a1bed6" strokeWidth="1.3"/>
    <ellipse cx="300" cy="190" rx="86" ry="140" fill="none" stroke="#4c627c"/>
    <ellipse cx="300" cy="190" rx="172" ry="53" fill="none" stroke="#4c627c"/>
    <path d="M128 190h344M300 50v280" stroke="#4c627c"/>
    <path d="M98 190c0 105 90 175 202 175 65 0 126-25 167-66m-25 3 25-3-3 25" fill="none" stroke="#b2d9f0" strokeWidth="1.5"/>
    <text x="275" y="200" className={styles.degree}>360°</text><text x="226" y="25">ESCOLHA O PONTO DE VISTA</text>
    <circle cx="408" cy="139" r="7" fill="#a9d7ef"/><circle cx="408" cy="139" r="17" fill="none" stroke="#a9d7ef"/>
   </>}
  </svg>}
  <figcaption><span>{profile.key==='vr'?'Equipamento de referência':'Esquema de interação'}</span><span>{profile.device}</span></figcaption>
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
