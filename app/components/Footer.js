import { publicNavigation } from "@/lib/navigation";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Logo from "./Logo";
export default function Footer() {
  return <footer className="footer"><div className="shell footer-grid"><div><Logo light/><p>Pequeno no nome.<br/>Infinito em possibilidades.</p></div><div><strong>Explore</strong>{publicNavigation.map(({href,label})=><Link key={href} href={href}>{label}</Link>)}</div><div><strong>Vamos criar algo novo?</strong><a className="footer-email" href="mailto:contato@miniverso.com.br">contato@miniverso.com.br <ArrowUpRight size={18}/></a><span>São Luís, Maranhão · Brasil</span><Link href="/contato">Iniciar uma conversa <ArrowUpRight size={16}/></Link></div></div><div className="shell footer-wordmark" aria-hidden="true">miniverso<span>®</span></div><div className="shell footer-bottom"><span>© {new Date().getFullYear()} Miniverso.</span><span>Realidades que conectam.</span><Link href="/admin">Área administrativa <ArrowUpRight size={13}/></Link></div></footer>;
}
