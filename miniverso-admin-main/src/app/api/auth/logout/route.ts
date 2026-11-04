/**
 * POST /api/auth/logout
 * Invalida o token no back-end e apaga o cookie de sessão (RF19, RNF14).
 */
import { MESSAGES } from "@/lib/messages";
import { logoutFromBackend } from "@/lib/server/auth";
import { isHttps, isSameOrigin } from "@/lib/server/request";
import { buildClearedSessionCookie, readSessionToken } from "@/lib/server/session";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return Response.json({ message: MESSAGES.forbidden }, { status: 403 });
  }

  const token = readSessionToken(request);
  if (token) await logoutFromBackend(token);

  return new Response(null, {
    status: 204,
    headers: { "Set-Cookie": buildClearedSessionCookie(isHttps(request)) },
  });
}
