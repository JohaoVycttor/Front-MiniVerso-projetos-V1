/**
 * Proteção das rotas do painel (RF12, RNF10, RN01).
 * No Next.js 16 este arquivo substitui o antigo middleware.ts.
 *
 * É uma checagem rápida: só confere se existe cookie de sessão. A validação do
 * token acontece no layout do painel (/me) e em toda chamada à API.
 */
import { NextResponse, type NextRequest } from "next/server";
import { isPublicAdminPath, loginRedirectFor } from "@/lib/routes";
import { SESSION_COOKIE } from "@/lib/session-cookie";

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (isPublicAdminPath(pathname) || request.cookies.has(SESSION_COOKIE)) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL(loginRedirectFor(pathname + search), request.url));
}

export const config = {
  matcher: ["/admin/:path*"],
};
