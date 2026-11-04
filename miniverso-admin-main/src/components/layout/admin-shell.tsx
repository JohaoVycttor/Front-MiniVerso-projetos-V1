"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { LuExternalLink, LuMenu, LuX } from "react-icons/lu";
import { requestLogout } from "@/features/auth/api";
import { useIdleLogout } from "@/features/auth/use-idle-logout";
import { publicConfig } from "@/lib/public-config";
import { loginRedirectFor } from "@/lib/routes";
import type { User } from "@/types/models";
import { NAV_ITEMS, isNavItemActive, pageTitleFor } from "./nav";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";
import styles from "./admin-shell.module.css";

type AdminShellProps = {
  user: User;
  siteUrl: string;
  idleTimeoutMinutes: number;
  children: ReactNode;
};

/**
 * Estrutura fixa do painel: menu lateral, cabeçalho com título, "Ver site", modo claro ou escuro e menu do usuário.
 * Desktop: menu completo. Tablet: menu recolhido em ícones. Celular: menu em gaveta.
 */
export function AdminShell({ user, siteUrl, idleTimeoutMinutes, children }: AdminShellProps) {
  const pathname = usePathname();
  const [navOpen, setNavOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeNavRef = useRef<HTMLButtonElement>(null);
  const navWasOpen = useRef(false);

  useIdleLogout(idleTimeoutMinutes, () => {
    const here = window.location.pathname + window.location.search;
    void requestLogout().finally(() => window.location.assign(loginRedirectFor(here, "inatividade")));
  });

  // Menu em gaveta no celular: o foco entra no menu ao abrir e volta ao botão ao fechar.
  // Esc fecha; se a tela crescer até o layout com menu fixo, a gaveta fecha sozinha.
  useEffect(() => {
    if (!navOpen) {
      if (navWasOpen.current) {
        navWasOpen.current = false;
        menuButtonRef.current?.focus();
      }
      return;
    }
    navWasOpen.current = true;
    closeNavRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setNavOpen(false);
    };
    const wide = window.matchMedia("(min-width: 768px)");
    const onResize = () => {
      if (wide.matches) setNavOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    wide.addEventListener("change", onResize);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      wide.removeEventListener("change", onResize);
    };
  }, [navOpen]);

  return (
    <div className={styles.shell} data-nav-open={navOpen ? "" : undefined}>
      <a href="#conteudo" className={styles.skipLink}>
        Pular para o conteúdo
      </a>

      <nav id="menu-principal" className={styles.sidebar} aria-label="Menu principal">
        <div className={styles.sidebarTop}>
          <div className={styles.brand}>
            {/* Logo oficial exportado do Figma (versão branca, para fundo escuro) */}
            {/* eslint-disable-next-line @next/next/no-img-element -- SVG estático, sem otimização */}
            <img src="/brand/logo-branca-horizontal.svg" alt="Miniverso" className={styles.brandLogo} width={160} height={27} />
            <span className={styles.brandSub}>Painel administrativo</span>
          </div>
          <button ref={closeNavRef} type="button" className={styles.closeNav} aria-label="Fechar menu" onClick={() => setNavOpen(false)}>
            <LuX aria-hidden="true" />
          </button>
        </div>

        <ul className={styles.navList}>
          {NAV_ITEMS.map((item) => {
            const active = isNavItemActive(item, pathname);
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={styles.navLink}
                  aria-current={active ? "page" : undefined}
                  title={item.label}
                  onClick={() => setNavOpen(false)}
                >
                  <Icon aria-hidden="true" />
                  <span className={styles.navLabel}>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <p className={styles.sidebarFooter}>Versão {publicConfig.appVersion}</p>
      </nav>

      {navOpen && <div className={styles.scrim} aria-hidden="true" onClick={() => setNavOpen(false)} />}

      {/* Com o menu aberto no celular, o resto da tela fica inativo: o teclado não alcança o que está atrás da gaveta */}
      <div className={styles.main} inert={navOpen || undefined}>
        <header className={styles.header}>
          <button
            ref={menuButtonRef}
            type="button"
            className={styles.menuButton}
            aria-label="Abrir menu"
            aria-expanded={navOpen}
            aria-controls="menu-principal"
            onClick={() => setNavOpen(true)}
          >
            <LuMenu aria-hidden="true" />
          </button>
          <h1 className={styles.title}>{pageTitleFor(pathname)}</h1>
          <div className={styles.headerActions}>
            <a href={siteUrl} target="_blank" rel="noreferrer" className={styles.siteLink}>
              <LuExternalLink aria-hidden="true" />
              <span className={styles.siteLinkLabel}>Ver site</span>
              <span className="sr-only"> (abre em nova aba)</span>
            </a>
            <ThemeToggle />
            <UserMenu user={user} />
          </div>
        </header>

        <main id="conteudo" className={styles.content} tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  );
}
