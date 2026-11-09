import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import ImmersiveParticles from "./ImmersiveParticles";
import Logo from "./Logo";
import HomeMarquee from "./HomeMarquee";
import HomeScene from "./HomeScene";
import MobileCarousel from "./MobileCarousel";
import HomeVisualSection, { visualSectionKeys } from "./HomeVisualSections";
import visualStyles from "./home-visual.module.css";
import { adminLoginUrl } from "@/lib/admin-url";
import "./home-content.css";
import "./home-layout.css";
import "./home-continuity.css";
import "./home-reference.css";
export const safeUrl = value => typeof value === "string" && ((value.startsWith("/") && !value.startsWith("//") && !value.includes("\\")) || /^https?:\/\//i.test(value)) ? value : "";
const text = value => typeof value === "string" ? value : "";
const shownItems = section => section.items.filter(item=>item.visible !== false);
export function HomeMedia({fields}) {
  const video = safeUrl(fields.video || fields.videoUrl), image = safeUrl(fields.mediaImage), poster = safeUrl(fields.poster);
  if (!video && !image) return null;
  return <figure className="home-media">{video ? <video src={video} poster={poster || image || undefined} controls playsInline preload="metadata" aria-label={text(fields.mediaAlt) || "Vídeo"}/> : <img src={image} alt={text(fields.mediaAlt)} loading="lazy"/>}{fields.caption && <figcaption>{text(fields.caption)}</figcaption>}</figure>;
}
function Heading({fields}) {return <><span className="eyebrow">{text(fields.eyebrow)}</span><h2>{text(fields.title)}{fields.highlight && <><br/><em>{text(fields.highlight)}</em></>}</h2></>}
function Action({fields, className="section-link"}) {const href=safeUrl(fields.buttonUrl);return href && fields.buttonLabel ? <Link className={className} href={href}>{text(fields.buttonLabel)} <ArrowUpRight size={18}/></Link> : null}
function background(fields) {const url=safeUrl(fields.background);return url ? {backgroundImage:`linear-gradient(#030712b8,#030712d9),url(${JSON.stringify(url)})`,backgroundSize:"cover",backgroundPosition:"center"} : undefined}
function columns(fields, fallback=3) {return {"--home-columns":["1","2","3"].includes(fields.columns)?fields.columns:String(fallback)}}
function PixelEdge(){return <div className="vr-pixel-edge" aria-hidden="true">{Array.from({length:64},(_,i)=><span key={i} style={{'--pixel-height':`${[18,44,9,32,56,23,38,8,48,29,15][i%11]}px`,'--pixel-shift':`${[0,2,-1,1,-2,0,1][i%7]}px`}}/>)}</div>}
function Card({item}) {return <article><span className="eyebrow">{text(item.eyebrow)}</span><h3>{text(item.title || item.name)}</h3>{item.description&&<p>{text(item.description)}</p>}{safeUrl(item.link)&&<Link className="section-link" href={item.link}>{text(item.buttonLabel)||text(item.title)||"Saiba mais"} <ArrowUpRight size={17}/></Link>}</article>}
export function HomeFooter({section,content}) {
  const f=section.fields, contact=content.sections.find(s=>s.key==="contato")?.fields || {};
  return <footer id="rodape" className="footer home-managed-footer"><div className="shell footer-grid"><div><Logo light/><p>{text(f.tagline)}</p></div><div><strong>{text(f.navigationLabel)}</strong>{content.sections.filter(s=>s.visible&&s.key!=="rodape").map(s=><a key={s.key} href={`#${s.key}`}>{text(s.fields.title)}</a>)}</div><div><strong>{text(f.contactTitle)}</strong>{f.useContactChannels&&<>{contact.email&&<a className="footer-email" href={`mailto:${encodeURIComponent(text(contact.email))}`}>{text(contact.email)} <ArrowUpRight size={18}/></a>}{contact.whatsapp&&<a href={`https://wa.me/${text(contact.whatsapp).replace(/\D/g,"")}`}>{text(contact.whatsapp)}</a>}{contact.instagram&&<a href={`https://instagram.com/${encodeURIComponent(text(contact.instagram).replace(/^@/,""))}`}>{text(contact.instagram)}</a>}</>}<span>{text(f.location)}</span><Action fields={f}/>{shownItems(section).map(item=><a key={item.id} href={safeUrl(item.url)||undefined}>{text(item.name)}</a>)}</div></div><div className="shell footer-wordmark" aria-hidden="true">miniverso<span>®</span></div><div className="shell footer-bottom"><span>{text(f.copyright)}</span><span>{text(f.bottomText)}</span>{safeUrl(f.privacyUrl)&&<a href={f.privacyUrl}>Política de privacidade</a>}<a href={adminLoginUrl}>Área administrativa <ArrowUpRight size={13}/></a></div></footer>;
}
export default function HomePage({content,preview=false}) {
  const visible=content.sections.filter(s=>s.visible);
  const target = key => visible.some(s=>s.key===key) ? `#${key}` : "/contato";
  const hero=visible.find(s=>s.key==="hero")?.fields || {};
  return <div className={`managed-home reference-home ${visualStyles.page}${preview?" home-preview":""}`}>{visible.map(section=>{
    const f=section.fields, items=shownItems(section);
    if(section.key==="rodape") return <HomeFooter key={section.key} section={section} content={content}/>;
    if(section.key==="hero") return <div key={section.key} className="vr-opening"><section className="vr-hero" id="hero"><div className="shell"><div className="vr-masthead"><span className="vr-corner vr-corner-tl" aria-hidden="true">+</span><span className="vr-corner vr-corner-tr" aria-hidden="true">+</span><span className="vr-corner vr-corner-bl" aria-hidden="true">+</span><span className="vr-corner vr-corner-br" aria-hidden="true">+</span><h1>{text(f.brandTitle)||'Miniverso'}<span className="vr-sr-only"> — experiências em realidade virtual</span></h1></div><div className="vr-hero-stage"><HomeScene/><div className="vr-hero-meta"><span><small>Estúdio independente</small>São Luís, Brasil</span><span><small>Tecnologia / propósito</small>Realidades que conectam</span><span><small>Explore</small>VR · AR · 360°</span></div><div className="vr-hero-copy"><span className="vr-kicker">{text(f.eyebrow)}</span><h2>{text(f.title)}<br/><em>{text(f.highlight)}</em></h2><div className="home-actions"><Link className="button primary" href={target(f.primaryTarget)}>{text(f.primaryLabel)} <ArrowUpRight size={18}/></Link>{f.secondaryLabel&&<Link className="section-link" href={target(f.secondaryTarget)}>{text(f.secondaryLabel)} <ArrowUpRight size={15}/></Link>}</div></div><p className="vr-hero-note">{text(f.subtitle)}</p><a className="vr-scroll-cue" href={target(f.scrollTarget)}><ArrowDown size={18}/><span>{text(f.scrollLabel)||'Explore nosso universo'}</span></a><PixelEdge/></div></div></section>{f.strip&&<HomeMarquee text={text(f.strip)}/>}</div>;
    if(visualSectionKeys.includes(section.key)) return <HomeVisualSection key={section.key} section={section}/>;
    if(section.key==="contato") return <section key={section.key} id="contato" className="contact-band" style={background(f)}><div className="shell"><span className="eyebrow">{text(f.eyebrow)}</span><Link href={safeUrl(f.buttonUrl)||"/contato"} className="contact-call"><h2>{text(f.title)}<br/><em>{text(f.highlight)}</em></h2><span className="round-link"><ArrowUpRight/></span></Link><HomeMedia fields={f}/><div className="contact-band-bottom"><p>{text(f.support)}</p><Action fields={f}/></div></div></section>;
    return <section key={section.key} id={section.key} className="editorial-section" style={background(f)}><div className="shell"><div className="section-heading"><div><Heading fields={f}/></div><div><p>{text(f.subtitle || f.text)}</p><Action fields={f}/></div></div><HomeMedia fields={f}/>
      {section.key==="clientes"?<MobileCarousel className="home-grid home-clients" style={columns(f)} label="Clientes">{items.filter(i=>i.authorized).map(item=><article key={item.id}>{safeUrl(item.logo)&&<img src={item.logo} alt={text(item.name)} loading="lazy"/>}{safeUrl(item.link)?<a href={item.link}>{text(item.name)}</a>:<p>{text(item.name)}</p>}</article>)}</MobileCarousel>:
      section.key==="experiencia"&&!hasMedia(f)?<div className="home-experience"><ImmersiveParticles/></div>:<MobileCarousel className="home-grid" style={columns(f)} label="O que nos move">{items.map(item=><Card key={item.id} item={item}/>)}</MobileCarousel>}
    </div></section>;
  })}</div>;
}
