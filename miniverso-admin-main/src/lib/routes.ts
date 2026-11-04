export const ADMIN_HOME = "/admin";
export const LOGIN_PATH = "/admin/login";

/** Motivos exibidos na tela de login depois de um redirecionamento. */
export type LoginReason = "expirada" | "inatividade" | "saiu";

const LOGIN_REASONS: readonly LoginReason[] = ["expirada", "inatividade", "saiu"];

export function parseLoginReason(value: string | null | undefined): LoginReason | null {
  return LOGIN_REASONS.find((reason) => reason === value) ?? null;
}

/** Rotas do painel que podem ser abertas sem sessão. */
export function isPublicAdminPath(pathname: string): boolean {
  return pathname === LOGIN_PATH || pathname.startsWith(`${LOGIN_PATH}/`);
}

/**
 * Garante que o redirecionamento depois do login fique dentro do painel.
 * Evita "open redirect": um link malicioso não consegue mandar o
 * administrador para outro site depois de entrar.
 */
export function safeRedirectTarget(target: string | null | undefined): string {
  if (!target) return ADMIN_HOME;
  const isInternal =
    (target === ADMIN_HOME || target.startsWith(`${ADMIN_HOME}/`) || target.startsWith(`${ADMIN_HOME}?`)) &&
    !target.startsWith("//") &&
    !target.includes("\\");
  if (!isInternal) return ADMIN_HOME;
  const pathname = target.split(/[?#]/)[0];
  if (isPublicAdminPath(pathname)) return ADMIN_HOME;
  return target;
}

/** Monta a URL do login guardando para onde o usuário queria ir. */
export function loginRedirectFor(target?: string | null, reason?: LoginReason): string {
  const params = new URLSearchParams();
  if (reason) params.set("motivo", reason);
  const safeTarget = safeRedirectTarget(target);
  if (safeTarget !== ADMIN_HOME) params.set("redirect", safeTarget);
  const query = params.toString();
  return query ? `${LOGIN_PATH}?${query}` : LOGIN_PATH;
}
