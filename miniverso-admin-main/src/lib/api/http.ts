/**
 * Cliente HTTP do painel (roda no navegador).
 *
 * O navegador nunca fala direto com o Laravel. Ele chama /api/admin/* do próprio
 * Next.js, que confere o cookie de sessão e repassa a chamada para a API com o
 * token. Ver src/app/api/admin/[...path]/route.ts.
 */
import { loginRedirectFor } from "@/lib/routes";
import { ApiError, isAbortError } from "./errors";

type QueryValue = string | number | null | undefined;

export type AdminRequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  query?: Record<string, QueryValue>;
  body?: unknown;
  signal?: AbortSignal;
};

async function readBody(response: Response): Promise<unknown> {
  if (response.status === 204) return null;
  const type = response.headers.get("content-type") ?? "";
  if (!type.includes("json")) return null;
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function redirectToLogin() {
  const here = window.location.pathname + window.location.search;
  window.location.assign(loginRedirectFor(here, "expirada"));
}

export async function adminRequest<T = unknown>(path: string, options: AdminRequestOptions = {}): Promise<T> {
  const url = new URL(`/api/admin${path}`, window.location.origin);
  for (const [key, value] of Object.entries(options.query ?? {})) {
    if (value !== undefined && value !== null && value !== "") url.searchParams.set(key, String(value));
  }

  const hasBody = options.body !== undefined;
  let response: Response;
  try {
    response = await fetch(url, {
      method: options.method ?? "GET",
      headers: hasBody ? { Accept: "application/json", "Content-Type": "application/json" } : { Accept: "application/json" },
      body: hasBody ? JSON.stringify(options.body) : undefined,
      credentials: "same-origin",
      signal: options.signal,
    });
  } catch (error) {
    if (isAbortError(error)) throw error;
    throw new ApiError(0);
  }

  const data = await readBody(response);

  if (response.status === 401) {
    // Sessão expirada ou inválida: volta para o login guardando a página atual (RF12).
    redirectToLogin();
    throw new ApiError(401);
  }
  if (!response.ok) throw ApiError.fromResponse(response.status, data);
  return data as T;
}
