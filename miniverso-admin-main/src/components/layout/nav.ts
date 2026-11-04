import type { IconType } from "react-icons";
import { LuHouse, LuInbox } from "react-icons/lu";

export type NavItem = {
  href: string;
  label: string;
  icon: IconType;
  /** Só fica ativo na rota exata. */
  exact?: boolean;
};

/**
 * Módulos do painel: editor da página inicial (RF15, RF18) e leads (RF16, RF17).
 * Não há "visão geral" com métricas: o DRDA não prevê (ver docs/PROPOSTAS.md).
 */
export const NAV_ITEMS: NavItem[] = [
  { href: "/admin/pagina-inicial", label: "Página inicial", icon: LuHouse },
  { href: "/admin/leads", label: "Leads", icon: LuInbox },
];

export const HOME_EDITOR_PATH = "/admin/pagina-inicial";

export function isNavItemActive(item: NavItem, pathname: string): boolean {
  if (item.exact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

/** Título mostrado no cabeçalho de cada página. */
export function pageTitleFor(pathname: string): string {
  if (/^\/admin\/leads\/[^/]+$/.test(pathname)) return "Detalhe do lead";
  return NAV_ITEMS.find((item) => isNavItemActive(item, pathname))?.label ?? "Painel";
}
