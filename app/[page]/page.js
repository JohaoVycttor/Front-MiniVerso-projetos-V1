import Link from 'next/link';
import {notFound} from 'next/navigation';
import {getContent} from '@/lib/portfolio-content';
import {PageShell} from '@/app/projetos/components/page-shell';
import {ScrollReveal} from '@/app/projetos/components/scroll-reveal';
export const dynamic='force-dynamic';
export async function generateMetadata({params}){const {page}=await params;const content=await getContent();const item=content.pages.find(p=>p.slug===page);return item?{title:item.eyebrow,description:item.description}:{}}
export default async function InformationPage({params}){
 const {page}=await params;const content=await getContent();const info=content.pages.find(p=>p.slug===page);if(!info)notFound();
 return <PageShell content={content}><ScrollReveal><section className="container info-page"><p className="eyebrow">{info.eyebrow}</p><h1 className="display-heading">{info.heading.text} <em>{info.heading.accent}</em></h1><p className="hero-description">{info.description}</p><div className="info-blocks">{info.blocks.map((block,index)=><article className="glass" key={index}><h2>{block.title}</h2><p>{block.text}</p></article>)}</div><Link href="/projetos" className="button">{content.ui.backToProjects}</Link></section></ScrollReveal></PageShell>;
}
