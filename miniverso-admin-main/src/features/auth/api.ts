/** Chamadas de autenticação feitas pelo navegador ao BFF (/api/auth/*). */
import { messageForStatus } from "@/lib/api/errors";
import { MESSAGES } from "@/lib/messages";

export type LoginResult =
  | { ok: true }
  | { ok: false; kind: "invalid" | "validation" | "unavailable"; message: string }
  | { ok: false; kind: "locked"; message: string; retryAfterSeconds: number };

export async function requestLogin(login: string, password: string): Promise<LoginResult> {
  let response: Response;
  try {
    response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ login, password }),
    });
  } catch {
    return { ok: false, kind: "unavailable", message: MESSAGES.network };
  }

  if (response.ok) return { ok: true };

  const data = (await response.json().catch(() => null)) as { message?: unknown; retryAfterSeconds?: unknown } | null;
  // As mensagens do BFF já vêm prontas e em português.
  const message = typeof data?.message === "string" ? data.message : messageForStatus(response.status);

  if (response.status === 429) {
    const seconds = Number(data?.retryAfterSeconds);
    return { ok: false, kind: "locked", message, retryAfterSeconds: Number.isFinite(seconds) && seconds > 0 ? seconds : 60 };
  }
  if (response.status === 401) return { ok: false, kind: "invalid", message };
  if (response.status === 422) return { ok: false, kind: "validation", message };
  return { ok: false, kind: "unavailable", message };
}

export async function requestLogout(): Promise<void> {
  try {
    await fetch("/api/auth/logout", { method: "POST" });
  } catch {
    // Sem rede: o redirecionamento para o login acontece mesmo assim.
  }
}
