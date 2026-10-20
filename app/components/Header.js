"use client";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {useEffect,useRef,useState} from "react";
import {ArrowUpRight,Menu,X} from "lucide-react";
import Logo from "./Logo";
import {isActiveRoute} from "@/lib/navigation";
import {defaultSite} from "@/lib/site-content";
export default function Header({settings=defaultSite,preview=false}){
 const pathname=usePathname();const [open,setOpen]=useState(false);const menuButton=useRef(null);
 useEffect(()=>{const close=e=>{if(e.key==="Escape"&&menuButton.current?.getAttribute("aria-expanded")==="true"){setOpen(false);menuButton.current?.focus()}};document.addEventListener("keydown",close);return()=>document.removeEventListener("keydown",close)},[]);
 useEffect(()=>{setOpen(false)},[pathname]);
 const c=settings.header;
 if(!c.enabled||(!preview&&pathname.startsWith("/admin")))return null;
 return <header className={`site-header cms-header cms-header-${c.layout} ${preview?"cms-preview-header":""}`} data-scroll-threshold={c.scrollThreshold??24} style={{'--header-top-bg':c.transparentTop===false?c.background:'transparent','--header-scrolled-bg':c.scrolledBackground||'#000000',backgroundColor:preview?c.background:undefined,position:preview?"relative":c.sticky?"fixed":"absolute"}}><div className="shell header-inner"><Link className="home-link" href="/" aria-label={settings.brand.name+" - início"} onClick={()=>setOpen(false)}><Logo light brand={settings.brand}/></Link><button ref={menuButton} className="menu-button" type="button" onClick={()=>setOpen(!open)} aria-expanded={open} aria-controls={preview?"preview-navigation":"main-navigation"} aria-label={open?"Fechar menu":"Abrir menu"}>{open?<X/>:<Menu/>}</button><nav id={preview?"preview-navigation":"main-navigation"} className={open?"nav open":"nav"} aria-label="Navegação principal">{c.links.map(({href,label},i)=><Link key={i} href={href} aria-current={isActiveRoute(pathname,href)?"page":undefined} className={isActiveRoute(pathname,href)?"active":""} onClick={()=>setOpen(false)}>{label}</Link>)}{c.button&&<Link className="nav-cta" href={c.href} onClick={()=>setOpen(false)}>{c.button}<ArrowUpRight size={17}/></Link>}</nav></div></header>;
}
