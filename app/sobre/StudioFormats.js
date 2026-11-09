"use client";
import {useId,useRef,useState} from 'react';
import Link from 'next/link';
import {ArrowUpRight,ArrowRight} from 'lucide-react';
import {brief} from '@/lib/display-text';
import StudioDevice from './StudioDevice';

const photos=['/home-vr-person-v2.webp','/studio-ar-experience-v1.webp','/home-immersive-v1.webp','/home-campus-v1.webp'];

export default function StudioFormats({section}) {
 const [active,setActive]=useState(0);
 const tabs=useRef([]);
 const prefix=useId();
 const cards=section.cards;
 if(!cards.length)return null;
 const selected=Math.min(active,cards.length-1);
 function navigate(event,index){
  let next;
  if(event.key==='ArrowRight')next=(index+1)%cards.length;
  else if(event.key==='ArrowLeft')next=(index-1+cards.length)%cards.length;
  else if(event.key==='Home')next=0;
  else if(event.key==='End')next=cards.length-1;
  else return;
  event.preventDefault();setActive(next);tabs.current[next]?.focus();
 }
 return <section className="studio-formats studio-container" aria-labelledby={prefix+'-heading'}>
  <div className="studio-section-heading"><div><span className="studio-label">[ {section.label} ]</span><h2 id={prefix+'-heading'}>{section.title} <em>{section.highlight}</em></h2></div></div>
  <div className="studio-format-console"><div className="studio-format-tabs" role="tablist" aria-label="Formatos de experiências" aria-orientation="horizontal">{cards.map((item,index)=><button type="button" role="tab" key={index} ref={el=>{tabs.current[index]=el}} id={prefix+'-tab-'+index} aria-controls={prefix+'-panel-'+index} aria-selected={selected===index} tabIndex={selected===index?0:-1} onClick={()=>setActive(index)} onKeyDown={event=>navigate(event,index)}><span>/ {String(index+1).padStart(2,'0')}</span>{item.title}<ArrowUpRight size={18} aria-hidden="true"/></button>)}</div>
  {cards.map((item,index)=><div key={index} id={prefix+'-panel-'+index} role="tabpanel" aria-labelledby={prefix+'-tab-'+index} tabIndex={0} hidden={selected!==index} className="studio-format-panel"><StudioDevice title={item.title} format={['VR','AR','MR','360°'][index]||'XR'} image={photos[index%photos.length]}/><div className="studio-format-copy"><span className="studio-label">[ Explore o formato ]</span><h3>{item.title}</h3><p>{brief(item.description)}</p><Link href={'/contato?subject='+encodeURIComponent(item.title)}>Tenho uma ideia para este formato<ArrowRight size={17}/></Link></div></div>)}</div>
  <div className="studio-format-footer"><span>Seu objetivo define a tecnologia.</span><Link href="/servicos">Conheça as soluções<ArrowUpRight size={15}/></Link></div>
 </section>;
}