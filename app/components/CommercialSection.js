import Link from "next/link";
import ImmersiveParticles from "./ImmersiveParticles";
import { ArrowUpRight } from "lucide-react";

function ParticleOrbit() {
  return <div className="commercial-art">
    <div className="commercial-art-label"><span className="orbit-status" /> IDEIAS EM OUTRA DIMENSÃO</div>
    <div className="commercial-orbit">
      <ImmersiveParticles />
    </div>
    <div className="commercial-art-footer"><span>ESTRATÉGIA + CRIATIVIDADE + TECNOLOGIA</span><span>MV / 01</span></div>
  </div>;
}

export default function CommercialSection() {
  return <section className="editorial-section commercial-section" id="universo" aria-labelledby="commercial-title">
    <div className="shell commercial-layout">
      <div className="commercial-copy">
        <span className="eyebrow">[ 01 — SUA MARCA, ALÉM DO ÓBVIO ]</span>
        <h2 id="commercial-title">Transforme<br />atenção em<br /><em>conexão real.</em></h2>
        <p className="commercial-lead">Sua marca pode ser mais do que vista. Pode ser vivida. Criamos experiências em realidade virtual, aumentada e vídeos 360° para apresentar produtos, ativar marcas e aproximar sua empresa do público.</p>
        <div className="commercial-benefits">
          <article><span className="eyebrow">01 / PRESENÇA DE MARCA</span><h3>Um encontro que <em>fica na memória.</em></h3><p>Transforme eventos, feiras e campanhas em experiências que convidam o público a participar e descobrir o que sua marca oferece.</p></article>
          <article><span className="eyebrow">02 / VALOR NA PRÁTICA</span><h3>Seu produto, <em>em outra dimensão.</em></h3><p>Demonstre soluções, explore possibilidades e torne o valor da sua oferta mais fácil de entender com apresentações imersivas.</p></article>
          <article><span className="eyebrow">03 / PROJETO SOB MEDIDA</span><h3>Do briefing <em>à experiência.</em></h3><p>Alinhamos objetivo, público, escopo e prazo com sua equipe para desenvolver uma solução que faça sentido para o seu negócio.</p></article>
        </div>
        <div className="commercial-actions"><Link href="/contato" className="button primary">Quero uma experiência para minha marca <ArrowUpRight size={20} /></Link><span>Conte seu desafio. Vamos desenhar as possibilidades.</span><Link className="section-link" href="/sobre">Conheça o estúdio <ArrowUpRight size={18}/></Link></div>
      </div>
      <ParticleOrbit />
    </div>
  </section>;
}
