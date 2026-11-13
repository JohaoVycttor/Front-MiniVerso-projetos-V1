"use client";
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {ArrowUpRight} from 'lucide-react';
const routes=[{href:'/sobre',label:'Conheça o estúdio'},{href:'/servicos',label:'Explore as soluções'},{href:'/projetos',label:'Veja os projetos'},{href:'/contato',label:'Converse com a equipe'}];
export default function SiteJourney(){const pathname=usePathname();if(pathname==='/'||pathname.startsWith('/admin')||pathname.startsWith('/preview'))return null;return <nav className="route-journey" aria-label="Continue explorando"><div className="shell"><span>CONTINUE EXPLORANDO</span>{routes.filter(route=>!pathname.startsWith(route.href)).slice(0,3).map(route=><Link key={route.href} href={route.href}>{route.label}<ArrowUpRight size={15}/></Link>)}</div></nav>}