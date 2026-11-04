import { SESSION_COOKIE } from "@/lib/session-cookie";
import { readCookie } from "./request";

type CookieOptions = { maxAgeSeconds: number; secure: boolean };

/**
 * Cookie de sessão:
 * - HttpOnly: o JavaScript da página não lê o token (RNF20, RNF22).
 * - SameSite=Lax: o navegador não envia o cookie em POST/DELETE vindos de outros sites.
 * - Secure em HTTPS (RNF17).
 * - Max-Age limita a duração da sessão (RNF14).
 */
export function buildSessionCookie(token: string, { maxAgeSeconds, secure }: CookieOptions): string {
  return [
    `${SESSION_COOKIE}=${encodeURIComponent(token)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${maxAgeSeconds}`,
    secure ? "Secure" : null,
  ]
    .filter(Boolean)
    .join("; ");
}

export function buildClearedSessionCookie(secure: boolean): string {
  return [`${SESSION_COOKIE}=`, "Path=/", "HttpOnly", "SameSite=Lax", "Max-Age=0", secure ? "Secure" : null]
    .filter(Boolean)
    .join("; ");
}

export function readSessionToken(request: Request): string | null {
  return readCookie(request, SESSION_COOKIE);
}
