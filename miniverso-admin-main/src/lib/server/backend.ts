/**
 * Ponto único de saída para o back-end (Laravel).
 * - Modo "live": chama a API_URL com o token no cabeçalho Authorization.
 * - Modo "mock": responde com os dados de exemplo de src/mock, no mesmo formato da API.
 */
import { mockApi } from "@/mock/mock-api";
import { getServerConfig } from "./config";

export type BackendRequest = {
  method?: string;
  /** Caminho sem o prefixo da API. Ex.: "/site-content" */
  path: string;
  /** Query string, com "?". Ex.: "?page=2" */
  search?: string;
  token?: string | null;
  body?: string | ArrayBuffer | null;
  contentType?: string | null;
};

export type BackendResponse = {
  status: number;
  data: unknown;
  headers: Headers;
};

export class BackendUnavailableError extends Error {
  constructor(cause?: unknown) {
    super("O back-end não respondeu.", { cause });
    this.name = "BackendUnavailableError";
  }
}

async function readJson(response: Response): Promise<unknown> {
  if (response.status === 204) return null;
  const type = response.headers.get("content-type") ?? "";
  if (!type.includes("json")) {
    await response.body?.cancel();
    return null;
  }
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export async function callBackend(request: BackendRequest): Promise<BackendResponse> {
  const config = getServerConfig();
  const method = (request.method ?? "GET").toUpperCase();

  if (config.mode === "mock") {
    return mockApi({ ...request, method });
  }

  // Modo híbrido: o login é real, mas recursos que o back-end ainda não tem vêm do mock.
  // O token já foi validado pelo back-end real (/me no layout), então o mock confia nele.
  const resource = request.path.split("/").filter(Boolean)[0] ?? "";
  if (config.mockResources.has(resource)) {
    return mockApi({ ...request, method, trustToken: true });
  }

  if (!config.apiUrl) {
    throw new BackendUnavailableError(new Error("API_URL não configurada no .env.local"));
  }

  const headers = new Headers({ Accept: "application/json" });
  if (request.token) headers.set("Authorization", `Bearer ${request.token}`);
  if (request.contentType) headers.set("Content-Type", request.contentType);

  let response: Response;
  try {
    response = await fetch(`${config.apiUrl}${request.path}${request.search ?? ""}`, {
      method,
      headers,
      body: request.body ?? undefined,
      cache: "no-store",
      signal: AbortSignal.timeout(config.requestTimeoutMs),
    });
  } catch (error) {
    throw new BackendUnavailableError(error);
  }

  return { status: response.status, data: await readJson(response), headers: response.headers };
}
