export const publicNavigation = [
  { href: '/', label: 'Início' },
  { href: '/sobre', label: 'O estúdio' },
  { href: '/servicos', label: 'Soluções' },
  { href: '/projetos', label: 'Projetos' },
  { href: '/contato', label: 'Contato' },
];
export function isActiveRoute(pathname, href) {
  return href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);
}
