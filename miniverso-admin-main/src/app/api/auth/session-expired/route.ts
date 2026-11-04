/**
 * GET /api/auth/session-expired
 * Usado quando o layout do painel descobre que o token não vale mais:
 * apaga o cookie e manda para o login com o aviso de sessão expirada (RF12, RNF14).
 * (Componentes de servidor não podem apagar cookies, por isso esta rota existe.)
 */
import { loginRedirectFor } from "@/lib/routes";
import { isHttps } from "@/lib/server/request";
import { buildClearedSessionCookie } from "@/lib/server/session";

export async function GET(request: Request) {
  return new Response(null, {
    status: 303,
    headers: {
      Location: loginRedirectFor(null, "expirada"),
      "Set-Cookie": buildClearedSessionCookie(isHttps(request)),
    },
  });
}
