/**
 * /api/admin/* : ponte entre o navegador e a API Laravel (padrão BFF, "backend for frontend").
 *
 * 1. Lê o token do cookie httpOnly (o navegador não tem acesso a ele).
 * 2. Repassa a chamada para a API com "Authorization: Bearer <token>" (RNF12, RNF13).
 * 3. Troca erros técnicos do servidor por mensagens simples (RNF20, RNF43).
 */
import { MESSAGES } from "@/lib/messages";
import { ADMIN_RESOURCES } from "@/lib/server/allowed-resources";
import { BackendUnavailableError, callBackend } from "@/lib/server/backend";
import { isHttps, isSameOrigin } from "@/lib/server/request";
import { buildClearedSessionCookie, readSessionToken } from "@/lib/server/session";

type RouteContext = { params: Promise<{ path: string[] }> };

const METHODS_WITH_BODY = new Set(["POST", "PUT", "PATCH"]);

/** Aceita só caminhos simples, como ["site-content"]. Recusa "..", vazios e recursos fora da lista. */
function toBackendPath(segments: string[] | undefined): string | null {
  if (!segments || segments.length === 0) return null;
  if (segments.some((segment) => segment === "" || segment === "." || segment === "..")) return null;
  if (!ADMIN_RESOURCES.has(segments[0])) return null;
  return `/${segments.map((segment) => encodeURIComponent(segment)).join("/")}`;
}

async function forward(request: Request, context: RouteContext): Promise<Response> {
  const method = request.method.toUpperCase();

  if (method !== "GET" && !isSameOrigin(request)) {
    return Response.json({ message: MESSAGES.forbidden }, { status: 403 });
  }

  const token = readSessionToken(request);
  if (!token) {
    return Response.json({ message: MESSAGES.sessionExpired }, { status: 401 });
  }

  const { path } = await context.params;
  const backendPath = toBackendPath(path);
  if (!backendPath) {
    return Response.json({ message: MESSAGES.notFound }, { status: 404 });
  }

  let result;
  try {
    result = await callBackend({
      method,
      path: backendPath,
      search: new URL(request.url).search,
      token,
      body: METHODS_WITH_BODY.has(method) ? await request.arrayBuffer() : null,
      contentType: METHODS_WITH_BODY.has(method) ? request.headers.get("content-type") : null,
    });
  } catch (error) {
    if (error instanceof BackendUnavailableError) {
      return Response.json({ message: MESSAGES.serverUnavailable }, { status: 503 });
    }
    throw error;
  }

  if (result.status === 401 || result.status === 419) {
    // Token vencido ou revogado no back-end: encerra a sessão local também.
    return Response.json(
      { message: MESSAGES.sessionExpired },
      { status: 401, headers: { "Set-Cookie": buildClearedSessionCookie(isHttps(request)) } },
    );
  }

  if (result.status >= 500) {
    // Não repassa detalhes técnicos do servidor (RNF20, RNF43).
    return Response.json({ message: MESSAGES.generic }, { status: 502 });
  }

  if (result.status === 204 || result.data === null) {
    return new Response(null, { status: result.status === 200 ? 204 : result.status });
  }

  return Response.json(result.data, { status: result.status, headers: { "Cache-Control": "no-store" } });
}

export const GET = forward;
export const POST = forward;
export const PUT = forward;
export const PATCH = forward;
export const DELETE = forward;
