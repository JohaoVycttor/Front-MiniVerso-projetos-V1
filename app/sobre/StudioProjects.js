"use client";

import {useId,useState} from 'react';
import Link from 'next/link';
import {ArrowLeft,ArrowRight,ArrowUpRight} from 'lucide-react';

function ProjectVisual({project}){
 const image=project.cover?.src||project.presentation?.poster;
 const format=project.tag?.includes('360')?'360°':project.tag?.includes('AR')?'AR':'VR';
 return <div className={`studio-project-visual${image?' has-image':''}`}>
  {image?<img src={image} alt={project.cover?.alt||project.title} loading="lazy"/>:<div className="studio-project-orbit" aria-hidden="true"><i/><i/><span>{format}</span></div>}
  <span className="studio-project-visual-label">{project.tag}</span>
 </div>;
}

export default function StudioProjects({projects}){
 const [active,setActive]=useState(0);
 const headingId=useId();
 if(!projects.length)return null;
 const index=Math.min(active,projects.length-1);
 const current=projects[index];
 const previous=projects[(index-1+projects.length)%projects.length];
 const next=projects[(index+1)%projects.length];
 const move=direction=>setActive(value=>(Math.min(value,projects.length-1)+direction+projects.length)%projects.length);
 return <section className="studio-projects" aria-labelledby={headingId}>
  <div className="studio-container studio-projects-frame">
   <div className="studio-projects-top"><span className="studio-label">[ Projetos em perspectiva ]</span><div className="studio-project-controls"><button type="button" aria-label="Projeto anterior" disabled={projects.length<2} onClick={()=>move(-1)}><ArrowLeft size={16}/></button><button type="button" aria-label="Próximo projeto" disabled={projects.length<2} onClick={()=>move(1)}><ArrowRight size={16}/></button></div></div>
   <div className="studio-projects-layout">
    <div className="studio-projects-copy"><div className="studio-project-count" role="status" aria-live="polite" aria-atomic="true"><span>{String(index+1).padStart(2,'0')}</span><small>/ {String(projects.length).padStart(2,'0')}</small><span className="studio-project-status">{current.title}</span></div><h2 id={headingId}>Onde as ideias<br/><em>ganham forma.</em></h2><p>Conheça as experiências do nosso portfólio e descubra outras formas de conectar pessoas, conteúdos e possibilidades.</p><Link className="studio-text-link" href="/projetos">Explorar o portfólio <ArrowUpRight size={15}/></Link></div>
    <div className="studio-project-deck">
     {projects.length>1&&<><div className="studio-project-preview studio-project-preview-back" aria-hidden="true"><ProjectVisual project={previous}/></div><div className="studio-project-preview studio-project-preview-middle" aria-hidden="true"><ProjectVisual project={next}/></div></>}
     <Link key={current.id} className="studio-project-feature" href={`/projetos/${current.slug}`}><ProjectVisual project={current}/><div className="studio-project-caption"><span>{current.tag}</span><h3>{current.title}</h3><p>{current.introduction}</p><span className="studio-project-open">Ver a experiência <ArrowUpRight size={17}/></span></div></Link>
    </div>
   </div>
  </div>
 </section>;
}
