/**
 * Modo claro ou escuro do painel.
 *
 * A escolha fica num cookie para o servidor já desenhar a página no tema certo,
 * sem mostrar o tema claro por um instante antes de trocar. Sem escolha salva,
 * vale o tema do sistema do aparelho (regra em app/globals.css).
 */
export const THEME_COOKIE = "miniverso_admin_theme";

/** A escolha vale por um ano neste navegador. */
export const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export type Theme = "light" | "dark";

/** Lê o valor salvo; qualquer outro valor conta como "sem escolha". */
export function parseTheme(value: string | null | undefined): Theme | null {
  return value === "light" || value === "dark" ? value : null;
}

/** Tema que vale agora: a escolha salva ou, sem ela, o do sistema. */
export function resolveTheme(saved: Theme | null, systemPrefersDark: boolean): Theme {
  return saved ?? (systemPrefersDark ? "dark" : "light");
}

/** Tema que o botão aplica ao ser apertado. */
export function nextTheme(current: Theme): Theme {
  return current === "dark" ? "light" : "dark";
}

/**
 * Cookie da escolha, gravado pelo navegador. Não é httpOnly porque o próprio botão
 * precisa gravá-lo; ele guarda só a preferência de tema, sem dado pessoal nem de sessão.
 */
export function themeCookie(theme: Theme, secure: boolean): string {
  return `${THEME_COOKIE}=${theme}; Path=/; Max-Age=${THEME_COOKIE_MAX_AGE}; SameSite=Lax${secure ? "; Secure" : ""}`;
}
