import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";

export function ServiceCard({ item, index }) {
  return <details className="service-card"><summary><span className="card-index">/ {String(index + 1).padStart(2, "0")}</span><h3>{item.title}</h3><Plus className="service-toggle" size={25}/></summary><div className="service-description"><p>{item.description}</p><Link className="text-link" href={`/contato?subject=${encodeURIComponent(item.title)}`}>Conversar sobre esta solução <ArrowUpRight size={18}/></Link></div></details>;
}

export function ProjectCard({ item, index = 0 }) {
  const projectHref = `/projetos/${item.slug || item.title.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
  const visuals = { "prj-1": ["/project-science.jpg", "Laboratório de ciências, imagem ilustrativa"], "prj-2": ["/project-culture.jpg", "Arquitetura histórica, imagem ilustrativa"], "prj-3": ["/hero-vr.jpg", "Uso de realidade virtual, imagem ilustrativa"] };
  const [src, alt] = visuals[item.id] || visuals["prj-3"];
  return <article className="project-card"><Link className="project-visual" href={projectHref} aria-label={`Ver detalhes de ${item.title}`}><img src={src} alt={alt} loading="lazy"/><span className="project-category">{item.category}</span><span className="project-image-note">IMAGEM ILUSTRATIVA</span><span className="project-arrow"><ArrowUpRight/></span></Link><div className="project-copy"><div className="project-meta"><span>/ {String(index+1).padStart(2,"0")}</span><span>{item.year}</span></div><h3>{item.title}</h3><p>{item.description}</p><Link href={projectHref}>Ver o projeto <ArrowUpRight size={17}/></Link></div></article>;
}
