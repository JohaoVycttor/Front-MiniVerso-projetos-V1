import { notFound } from "next/navigation";
import { getHomeContent } from "@/lib/home-content";
import { HomeMedia, safeUrl } from "@/app/components/HomePage";
import Link from "next/link";
export const dynamic="force-dynamic";
export default async function HomeProject({params}) {
  const {id}=await params, content=await getHomeContent();
  const section=content.sections.find(s=>s.key==="projetos"&&s.visible);
  const item=section?.items.find(p=>p.id===id&&p.visible!==false);
  if(!item) notFound();
  return <><section className="page-hero"><div className="shell"><span className="eyebrow">{item.category}</span><h1>{item.name}</h1><p>{item.summary}</p></div></section><section className="editorial-section"><div className="shell">{safeUrl(item.cover)&&<img className="home-card-image" src={item.cover} alt={item.coverAlt||item.name}/>}<p style={{whiteSpace:"pre-line"}}>{item.details}</p>{item.client&&<p>Cliente: {item.client}</p>}{item.technologies&&<p>Tecnologias: {item.technologies}</p>}<HomeMedia fields={item}/><Link className="button primary" href={`/contato?project=${encodeURIComponent(item.name)}`}>Conversar sobre um projeto</Link></div></section></>;
}
