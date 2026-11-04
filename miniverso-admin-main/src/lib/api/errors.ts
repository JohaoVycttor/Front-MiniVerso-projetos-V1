import { MESSAGES } from "@/lib/messages";

/** Mensagem amigável para cada tipo de falha (RNF43). */
export function messageForStatus(status: number): string {
  if (status === 0) return MESSAGES.network;
  if (status === 401) return MESSAGES.sessionExpired;
  if (status === 403) return MESSAGES.forbidden;
  if (status === 404) return MESSAGES.notFound;
  if (status === 422) return MESSAGES.validation;
  if (status === 429) return MESSAGES.tooManyRequests;
  if (status >= 500) return MESSAGES.generic;
  return MESSAGES.unknown;
}

/**
 * Erro das chamadas ao painel. A mensagem já vem pronta para exibir.
 * `fields` lista os campos que o servidor recusou (respostas 422 do Laravel),
 * para o formulário destacar cada um com uma mensagem própria (RNF30).
 */
export class ApiError extends Error {
  readonly status: number;
  readonly fields: string[];

  constructor(status: number, message = messageForStatus(status), fields: string[] = []) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fields = fields;
  }

  static fromResponse(status: number, data: unknown): ApiError {
    const errors =
      typeof data === "object" && data !== null && "errors" in data ? (data as { errors: unknown }).errors : null;
    const fields = typeof errors === "object" && errors !== null ? Object.keys(errors) : [];
    return new ApiError(status, messageForStatus(status), fields);
  }
}

export function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

/** Texto para exibir a partir de qualquer erro. */
export function errorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  return MESSAGES.unknown;
}
