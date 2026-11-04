/** Chamadas do módulo de leads (RF16, RF17). Parâmetros no formato da API Laravel. */
import { getSiteContent } from "@/features/home-editor/api";
import { findSection } from "@/features/home-editor/rules";
import { ApiError } from "@/lib/api/errors";
import { adminRequest } from "@/lib/api/http";
import { mapLead, mapPaginated, unwrapData } from "@/lib/api/mappers";
import type { Lead, LeadFilters, Paginated, ServiceOption } from "@/types/models";

export const LEADS_PER_PAGE = 10;

export async function listLeads(filters: Partial<LeadFilters>, signal?: AbortSignal): Promise<Paginated<Lead>> {
  const payload = await adminRequest("/leads", {
    signal,
    query: {
      search: filters.search?.trim(),
      service_id: filters.serviceId,
      sort: filters.sort === "antigos" ? "created_at" : "-created_at",
      page: filters.page ?? 1,
      per_page: filters.perPage ?? LEADS_PER_PAGE,
    },
  });
  return mapPaginated(payload, mapLead);
}

export async function getLead(id: string, signal?: AbortSignal): Promise<Lead> {
  const payload = await adminRequest(`/leads/${encodeURIComponent(id)}`, { signal });
  const lead = mapLead(unwrapData(payload));
  if (!lead) throw new ApiError(404);
  return lead;
}

export async function deleteLead(id: string): Promise<void> {
  await adminRequest(`/leads/${encodeURIComponent(id)}`, { method: "DELETE" });
}

/**
 * Serviços para o filtro "Serviço de interesse". Vêm da seção Serviços da página inicial,
 * a mesma lista que alimenta o formulário de contato do site.
 */
export async function listServiceOptions(signal?: AbortSignal): Promise<ServiceOption[]> {
  const content = await getSiteContent(signal);
  return findSection(content, "servicos").items.map((item) => ({ id: item.id, title: String(item.title ?? "Serviço sem nome") }));
}
