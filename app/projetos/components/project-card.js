import Link from 'next/link';
import {ArrowIcon} from './ui';
import {MediaPlaceholder} from './media';

export function ProjectCard({project,index=0,ui}){

 return <article className="project-card glass" data-site-reveal>
  <Link href={'/projetos/'+project.slug} className="card-cover" tabIndex={-1} aria-hidden="true"><MediaPlaceholder label={ui.coverPlaceholder}/></Link>
  <div className="card-content"><span className="badge">{project.tag}</span><h3><Link href={'/projetos/'+project.slug}>{project.title}</Link></h3><p>{project.description}</p><Link href={'/projetos/'+project.slug} className="text-link">Ver projeto <ArrowIcon/></Link></div>
 </article>;
}