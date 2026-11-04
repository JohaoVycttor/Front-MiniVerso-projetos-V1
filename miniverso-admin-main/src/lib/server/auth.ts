/**
 * Regras de autenticação do lado do servidor (BFF).
 * Funções puras sobre o back-end, sem depender do Next.js, para poderem ser testadas.
 */
import { mapUser, unwrapData } from "@/lib/api/mappers";
import type { User } from "@/types/models";
import { BackendUnavailableError, callBackend, type BackendResponse } from "./backend";

export type LoginOutcome =
  | { kind: "ok"; token: string; user: User }
  | { kind: "invalid" }
  | { kind: "locked"; retryAfterSeconds: number }
  | { kind: "unavailable" };

export type SessionCheck =
  | { kind: "ok"; user: User }
  | { kind: "unauthenticated" }
  | { kind: "unavailable" };

const DEFAULT_LOCK_SECONDS = 60;

function readField(data: unknown, key: string): unknown {
  return typeof data === "object" && data !== null ? (data as Record<string, unknown>)[key] : undefined;
}

/** Sanctum costuma devolver { token } ou { access_token }. */
function extractToken(data: unknown): string | null {
  const payload = unwrapData(data);
  const token = readField(payload, "token") ?? readField(payload, "access_token");
  return typeof token === "string" && token.length > 0 ? token : null;
}

function extractUser(data: unknown): User | null {
  return mapUser(readField(unwrapData(data), "user"));
}

/** Tempo de bloqueio informado pelo back-end (cabeçalho Retry-After do throttle do Laravel). */
function retryAfterSeconds(response: BackendResponse): number {
  const fromHeader = Number(response.headers.get("retry-after"));
  if (Number.isFinite(fromHeader) && fromHeader > 0) return Math.ceil(fromHeader);
  const fromBody = Number(readField(response.data, "retry_after"));
  if (Number.isFinite(fromBody) && fromBody > 0) return Math.ceil(fromBody);
  return DEFAULT_LOCK_SECONDS;
}

export async function fetchCurrentUser(token: string): Promise<SessionCheck> {
  let response: BackendResponse;
  try {
    response = await callBackend({ path: "/me", token });
  } catch (error) {
    if (error instanceof BackendUnavailableError) return { kind: "unavailable" };
    throw error;
  }
  if (response.status === 401 || response.status === 403 || response.status === 419) {
    return { kind: "unauthenticated" };
  }
  if (response.status >= 200 && response.status < 300) {
    const user = mapUser(unwrapData(response.data));
    return user ? { kind: "ok", user } : { kind: "unavailable" };
  }
  return { kind: "unavailable" };
}

export async function loginWithBackend(identifier: string, password: string): Promise<LoginOutcome> {
  let response: BackendResponse;
  try {
    response = await callBackend({
      method: "POST",
      path: "/login",
      body: JSON.stringify({ email: identifier, password }),
      contentType: "application/json",
    });
  } catch (error) {
    if (error instanceof BackendUnavailableError) return { kind: "unavailable" };
    throw error;
  }

  if (response.status === 429) return { kind: "locked", retryAfterSeconds: retryAfterSeconds(response) };
  // O Laravel responde 422 (Breeze/Fortify) ou 401 para credenciais erradas.
  if (response.status === 401 || response.status === 403 || response.status === 422) return { kind: "invalid" };
  if (response.status < 200 || response.status >= 300) return { kind: "unavailable" };

  const token = extractToken(response.data);
  if (!token) return { kind: "unavailable" };

  const user = extractUser(response.data);
  if (user) return { kind: "ok", token, user };

  // Alguns back-ends devolvem só o token: busca o usuário em /me.
  const session = await fetchCurrentUser(token);
  return session.kind === "ok" ? { kind: "ok", token, user: session.user } : { kind: "unavailable" };
}

/** Invalida o token no back-end (RNF14). A sessão local é apagada mesmo se falhar. */
export async function logoutFromBackend(token: string): Promise<void> {
  try {
    await callBackend({ method: "POST", path: "/logout", token });
  } catch {
    // Sem rede: o cookie é removido do mesmo jeito.
  }
}
