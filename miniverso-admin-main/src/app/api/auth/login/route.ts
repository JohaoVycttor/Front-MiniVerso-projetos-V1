/**
 * POST /api/auth/login
 * Recebe { login, password } do formulário, autentica no back-end e grava o token
 * num cookie httpOnly. O token nunca é devolvido ao navegador (RNF20).
 * RF11, RNF10, RNF15, RNF16.
 */
import { MESSAGES } from "@/lib/messages";
import { loginWithBackend } from "@/lib/server/auth";
import { getServerConfig } from "@/lib/server/config";
import { isHttps, isSameOrigin } from "@/lib/server/request";
import { buildSessionCookie } from "@/lib/server/session";

const MAX_LOGIN_LENGTH = 254;
const MAX_PASSWORD_LENGTH = 256;

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return Response.json({ message: MESSAGES.forbidden }, { status: 403 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ message: MESSAGES.loginMissing }, { status: 422 });
  }

  const fields = (typeof payload === "object" && payload !== null ? payload : {}) as Record<string, unknown>;
  const login = typeof fields.login === "string" ? fields.login.trim() : "";
  const password = typeof fields.password === "string" ? fields.password : "";

  // Validação também no servidor (RNF23).
  if (!login || !password || login.length > MAX_LOGIN_LENGTH || password.length > MAX_PASSWORD_LENGTH) {
    return Response.json({ message: MESSAGES.loginMissing }, { status: 422 });
  }

  const outcome = await loginWithBackend(login, password);

  switch (outcome.kind) {
    case "ok": {
      const config = getServerConfig();
      return Response.json(
        { user: outcome.user },
        {
          status: 200,
          headers: {
            "Set-Cookie": buildSessionCookie(outcome.token, {
              maxAgeSeconds: config.sessionMaxAgeSeconds,
              secure: isHttps(request),
            }),
            "Cache-Control": "no-store",
          },
        },
      );
    }
    case "invalid":
      // Mensagem genérica: não diz se o erro foi no usuário ou na senha (RNF16).
      return Response.json({ message: MESSAGES.loginInvalid }, { status: 401 });
    case "locked": {
      const minutes = Math.max(1, Math.ceil(outcome.retryAfterSeconds / 60));
      return Response.json(
        { message: MESSAGES.loginLocked(minutes), retryAfterSeconds: outcome.retryAfterSeconds },
        { status: 429, headers: { "Retry-After": String(outcome.retryAfterSeconds) } },
      );
    }
    case "unavailable":
      return Response.json({ message: MESSAGES.serverUnavailable }, { status: 503 });
  }
}
