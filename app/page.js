import Link from "next/link";
import CommercialSection from "./components/CommercialSection";
import { ArrowDown, ArrowUpRight, Asterisk } from "lucide-react";
import { getContent } from "@/lib/db";
import { ServiceCard, ProjectCard } from "./components/Cards";

export const dynamic = "force-dynamic";
export default async function Home() {
  const data = await getContent();
  return <>
    <section className="immersive-hero">
      <img className="hero-photo" src="https://res.cloudinary.com/dsokg03zb/image/upload/v1790081978/man-with-vr-glasses-technology-_1__vxnpl0.webp" alt="Experiência de realidade virtual com a Miniverso" />
      <div className="hero-shade" />
      <div className="shell hero-content">
        <div className="hero-topline"><span className="micro">ESTÚDIO DE EXPERIÊNCIAS IMERSIVAS</span><span className="micro hero-location">SÃO LUÍS, BRASIL<br/>IDEIAS SEM FRONTEIRAS</span></div>
        <h1>MINIVERSO<span>OUTRAS<br/><em>REALIDADES.</em></span></h1>
        <div className="hero-bottom"><p>Expandimos a forma de aprender,<br/>conectar e experimentar o mundo.</p><Link className="button primary" href="/contato">Vamos criar juntos <ArrowUpRight size={21}/></Link></div>
        <a className="hero-scroll" href="#universo"><ArrowDown size={18}/> ENTRE NO NOSSO UNIVERSO <span>01 / 05</span></a>
      </div>
    </section>
    <div className="discipline-strip"><span>REALIDADE VIRTUAL</span><Asterisk/><span>REALIDADE AUMENTADA</span><Asterisk/><span>VÍDEOS 360°</span><Asterisk/><span>EDUCAÇÃO IMERSIVA</span><Asterisk/></div>
    <CommercialSection />
    <section className="editorial-section services-section" id="solucoes"><div className="shell"><div className="section-heading"><div><span className="eyebrow">[ 02 — O QUE CRIAMOS ]</span><h2>Novas formas<br/>de <em>experimentar.</em></h2></div><div><p>Cada desafio pede um novo olhar.<br/>Encontre a dimensão da sua ideia.</p><Link className="section-link" href="/servicos">Conheça todas as soluções <ArrowUpRight size={20}/></Link></div></div><div className="service-list">{data.services.map((s,i)=><ServiceCard key={s.id} item={s} index={i}/>)}</div></div></section>
    <section className="editorial-section work-section" id="projetos"><div className="shell"><div className="section-heading"><div><span className="eyebrow">[ 03 — POSSIBILIDADES EM PRÁTICA ]</span><h2>Ideias fora<br/>do <em>comum.</em></h2></div><Link className="section-link" href="/projetos">Explorar portfólio <ArrowUpRight size={20}/></Link></div><div className="projects-grid">{data.projects.slice(0,2).map((p,i)=><ProjectCard key={p.id} item={p} index={i}/>)}</div></div></section>
    <section className="editorial-section process-section" id="processo"><div className="shell"><div className="section-heading"><div><span className="eyebrow">[ 04 — COMO ACONTECE ]</span><h2>Da conversa<br/>à <em>experiência.</em></h2></div><p>Você faz parte de cada etapa.<br/>A gente constrói junto.</p></div><div className="process-grid">{[["Descobrir", "Ouvimos sua ideia, entendemos seu público e definimos os objetivos da experiência."],["Criar", "Transformamos o conceito em design e tecnologia, com protótipos e testes ao longo do caminho."],["Conectar", "Preparamos a entrega e orientamos sua equipe para levar a experiência ao público."]].map(([title,text],i)=><article key={title}><span className="process-number">0{i+1}<ArrowUpRight/></span><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>
    <section className="contact-band"><div className="shell"><span className="eyebrow">[ 05 — PRÓXIMA DIMENSÃO ]</span><Link href="/contato" className="contact-call"><h2>Sua ideia.<br/><em>Nosso próximo universo.</em></h2><span className="round-link"><ArrowUpRight/></span></Link><div className="contact-band-bottom"><p>Vamos transformar possibilidades em experiências?</p><Link href="/contato">Conte seu projeto <ArrowUpRight size={18}/></Link></div></div></section>
  </>;
}
