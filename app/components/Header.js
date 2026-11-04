"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, LogIn, Menu, X } from "lucide-react";
import Logo from "./Logo";
import { adminLoginUrl } from "@/lib/admin-url";

import { publicNavigation, isActiveRoute } from "@/lib/navigation";
export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuButton = useRef(null);
  useEffect(() => { const close = event => { if (event.key === "Escape" && menuButton.current?.getAttribute("aria-expanded") === "true") { setOpen(false); menuButton.current?.focus(); } }; document.addEventListener("keydown", close); return () => document.removeEventListener("keydown", close); }, []);
  useEffect(() => { setOpen(false); }, [pathname]);
  if (pathname.startsWith("/admin")) return null;
  return <header className="site-header"><div className="shell header-inner"><Link className="home-link" href="/" aria-label="Miniverso - início" onClick={()=>setOpen(false)}><Logo light/></Link><button ref={menuButton} className="menu-button" type="button" onClick={()=>setOpen(!open)} aria-expanded={open} aria-controls="main-navigation" aria-label={open ? "Fechar menu" : "Abrir menu"}>{open ? <X/> : <Menu/>}</button><nav id="main-navigation" className={open ? "nav open" : "nav"} aria-label="Navegação principal">{publicNavigation.map(({href,label})=><Link key={href} href={href} aria-current={isActiveRoute(pathname,href) ? "page" : undefined} className={isActiveRoute(pathname,href) ? "active" : ""} onClick={()=>setOpen(false)}>{label}</Link>)}<a className="nav-login" href={adminLoginUrl} onClick={()=>setOpen(false)}><LogIn size={17} aria-hidden="true"/>Login</a><Link className="nav-cta" href="/contato" onClick={()=>setOpen(false)}>Vamos conversar <ArrowUpRight size={17}/></Link></nav></div></header>;
}

