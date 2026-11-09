import Link from 'next/link';
import { ArrowIcon, Badge } from './ui';
import { MediaPreview } from './media';
import { projectVisual } from '@/lib/project-visuals';

export function ProjectCard({ project, ui }) {
  const visual=projectVisual(project);
  return <article className="project-card glass">
    <Link href={'/projetos/'+project.slug} className="card-cover" aria-label={ui.detailsLabel+': '+project.title} tabIndex={-1}>
      <MediaPreview asset={visual.asset} ui={ui}/>{visual.illustrative&&<span className="media-caption">Visual ilustrativo</span>}
    </Link>
    <div className="card-content"><Badge>{project.tag}</Badge><h3><Link href={'/projetos/'+project.slug}>{project.title}</Link></h3><Link href={'/projetos/'+project.slug} className="text-link">{ui.detailsLabel}<ArrowIcon/></Link></div>
  </article>;
}