"use client";
import {useId,useState} from "react";
import Link from "next/link";
import {ArrowUpRight,Plus,Minus,Glasses,Scan,Globe2,GraduationCap,PanelsTopLeft} from "lucide-react";
const icons={glasses:Glasses,scan:Scan,globe:Globe2,school:GraduationCap,screen:PanelsTopLeft};
export default function HomeServices({services,layout="accordion",button="Explorar projetos",href="/projetos"}){
 const [active,setActive]=useState(0);const prefix=useId();
 return <div className={`home-services home-services-${layout}`}>{services.map((item,i)=>{
 const Icon=icons[item.icon]||Glasses;const open=layout==="cards"||active===i;
 const id=prefix+"-service-"+item.id;
 return <article className={`home-service ${open?"is-open":""}`} key={item.id}>
 <h3><button type="button" aria-expanded={open} aria-controls={id} id={id+"-trigger"} onClick={()=>setActive(active===i?null:i)} disabled={layout==="cards"}><span className="home-index">/ {String(i+1).padStart(2,"0")}</span><span className="home-service-icon"><Icon size={21}/></span><span className="home-service-label">{item.title}{!open&&<small>{item.description}</small>}</span>{layout!=="cards"&&<span className="home-service-toggle">{open?<Minus size={15}/>:<Plus size={15}/>}</span>}</button></h3>
 <div className="home-service-panel" id={id} role="region" aria-labelledby={id+"-trigger"} inert={!open}><div><div className="home-service-body"><div><p>{item.description}</p><div className="home-tags">{(item.tags||[]).map((tag,j)=><span key={j}>{tag}</span>)}</div>{button&&<Link href={href}>{button}<ArrowUpRight size={14}/></Link>}</div><div className="home-service-preview" aria-hidden="true"><Icon size={68} strokeWidth={.7}/><span>{item.title}</span></div></div></div></div>
 </article>})}</div>;
}
