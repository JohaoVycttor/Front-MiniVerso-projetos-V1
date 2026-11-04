/**
 * Configuração do servidor (BFF). Lida a cada requisição para respeitar o .env.
 * Nada daqui vai para o navegador.
 */
export type ApiMode = "mock" | "live";

export type ServerConfig = {
  apiUrl: string;
  mode: ApiMode;
  /** Recursos que o back-end ainda não tem: continuam vindo do mock mesmo no modo live. */
  mockResources: Set<string>;
  sessionMaxAgeSeconds: number;
  requestTimeoutMs: number;
};

export function getServerConfig(): ServerConfig {
  const apiUrl = (process.env.API_URL ?? "").trim().replace(/\/+$/, "");
  const explicitMode = (process.env.API_MODE ?? "").trim().toLowerCase();
  const mode: ApiMode =
    explicitMode === "live" ? "live" : explicitMode === "mock" ? "mock" : apiUrl ? "live" : "mock";

  const hours = Number(process.env.SESSION_MAX_AGE_HOURS);
  const sessionHours = Number.isFinite(hours) && hours > 0 ? hours : 8;

  const mockResources = new Set(
    (process.env.MOCK_RESOURCES ?? "site-content,leads")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
  );

  return {
    apiUrl,
    mode,
    mockResources,
    sessionMaxAgeSeconds: Math.round(sessionHours * 60 * 60),
    requestTimeoutMs: 10_000,
  };
}
