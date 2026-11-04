/**
 * Conversão do formato da API (Laravel, snake_case) para os modelos do front.
 * É o único lugar que conhece os nomes dos campos do back-end: se o contrato
 * mudar, ajuste aqui e em docs/CONTRATO-API.md.
 */
import type { Lead, Paginated, User } from "@/types/models";

type JsonObject = Record<string, unknown>;

function isObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function text(value: unknown): string | null {
  if (typeof value === "string") return value.trim() === "" ? null : value;
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return null;
}

function count(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

/** O Laravel embrulha recursos em { data: ... }. Esta função tira o embrulho, se existir. */
export function unwrapData(payload: unknown): unknown {
  return isObject(payload) && "data" in payload ? payload.data : payload;
}

/** O back-end devolve { nome, email } (UserResource), sem id. O e-mail serve de identificador. */
export function mapUser(raw: unknown): User | null {
  if (!isObject(raw)) return null;
  const email = text(raw.email);
  if (!email) return null;
  return { id: text(raw.id) ?? email, email, name: text(raw.nome) ?? text(raw.name) ?? email };
}

/** Lead no formato proposto em docs/CONTRATO-API.md. Itens sem id são descartados. */
export function mapLead(raw: unknown): Lead | null {
  if (!isObject(raw)) return null;
  const id = text(raw.id);
  if (!id) return null;
  const service = isObject(raw.service) ? raw.service : null;
  return {
    id,
    name: text(raw.name) ?? "Nome não informado",
    email: text(raw.email) ?? "",
    phone: text(raw.phone),
    company: text(raw.company),
    serviceId: service ? text(service.id) : text(raw.service_id),
    serviceName: service ? text(service.title) : null,
    message: text(raw.message) ?? "",
    createdAt: text(raw.created_at) ?? "",
  };
}

export function mapList<T>(payload: unknown, mapItem: (raw: unknown) => T | null): T[] {
  const data = unwrapData(payload);
  if (!Array.isArray(data)) return [];
  return data.map(mapItem).filter((item): item is T => item !== null);
}

/** Lê uma resposta paginada do Laravel ({ data, meta }). Também aceita listas simples. */
export function mapPaginated<T>(payload: unknown, mapItem: (raw: unknown) => T | null): Paginated<T> {
  const items = mapList(payload, mapItem);
  const meta = isObject(payload) && isObject(payload.meta) ? payload.meta : {};
  return {
    items,
    page: count(meta.current_page, 1),
    lastPage: Math.max(1, count(meta.last_page, 1)),
    perPage: count(meta.per_page, items.length),
    total: count(meta.total, items.length),
  };
}
