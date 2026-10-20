import Link from "next/link";
import {ArrowUpRight} from "lucide-react";
import Logo from "./Logo";
import {defaultSite} from "@/lib/site-content";
export default function Footer({settings=defaultSite}){
 const c=settings.footer;if(!c.enabled)return null;
 return <footer className={`footer cms-footer cms-footer-${c.layout}`} style={{backgroundColor:c.background}}><div className="shell footer-grid"><div><Logo light brand={settings.brand}/><p style={{whiteSpace:"pre-line"}}>{settings.brand.description}</p><div className="cms-socials">{c.socialLinks.map((l,i)=><a key={i} href={l.href}>{l.label}<ArrowUpRight size={12}/></a>)}</div></div>{c.layout!=="minimal"&&<><div><strong>{c.exploreTitle}</strong>{c.links.map(({href,label},i)=><Link key={i} href={href}>{label}</Link>)}</div><div><strong>{c.contactTitle}</strong><a className="footer-email" href={"mailto:"+c.email}>{c.email}<ArrowUpRight size={18}/></a><span>{c.location}</span>{c.button&&<Link href={c.href}>{c.button}<ArrowUpRight size={16}/></Link>}</div></>}</div>{c.showWordmark&&<div className="shell footer-wordmark cms-wordmark" aria-hidden="true">{settings.brand.logo&&<img src={settings.brand.logo} alt=""/>}<span className="cms-wordmark-text">{settings.brand.name}</span></div>}<div className="shell footer-bottom"><span>© {new Date().getFullYear()} {settings.brand.name}.</span><span>{c.note}</span><Link href="/admin">Área administrativa<ArrowUpRight size={13}/></Link></div></footer>;
}
