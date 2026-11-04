/**
 * Nome do cookie que guarda a sessão do administrador.
 * O cookie é httpOnly: o JavaScript do navegador não consegue ler o token
 * (RNF12, RNF20, RNF22). Só o servidor do Next.js tem acesso a ele.
 */
export const SESSION_COOKIE = "miniverso_admin_session";
