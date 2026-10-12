"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowIcon, Brand } from "@/components/ui";
import type { PageContent } from "@/types/content";

export function Header({ content }: { content: PageContent }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    function close(event: KeyboardEvent) { if (event.key === "Escape") setOpen(false); }
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);
  return <>
    <a className="skip-link" href="#main">{content.ui.skipToContent}</a>
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand-link" aria-label={content.brand.name}><Brand brand={content.brand}/></Link>
        <nav className={`main-nav ${open ? "is-open" : ""}`} id="main-navigation" aria-label="Navegação principal">
          {content.navigation.map((link) => {
            const active = link.href === "/projetos" ? pathname === "/" || pathname.startsWith("/projetos") : pathname === link.href;
            return <Link key={link.href} href={link.href} className={active ? "nav-active" : ""} aria-current={active ? "page" : undefined} onClick={() => setOpen(false)}>{link.label}</Link>;
          })}
        </nav>
        <Link className="button header-cta" href="/#contato">{content.contact.actionLabel}<ArrowIcon/></Link>
        <button className={`menu-button ${open ? "is-open" : ""}`} aria-label={open ? content.ui.close : content.ui.menuLabel} aria-expanded={open} aria-controls="main-navigation" onClick={() => setOpen(!open)}><span/><span/></button>
      </div>
    </header>
  </>;
}
