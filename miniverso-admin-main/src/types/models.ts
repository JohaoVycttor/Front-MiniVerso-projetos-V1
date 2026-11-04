/**
 * Modelos usados pelo front-end.
 * Os dados da API (Laravel, em snake_case) são convertidos para estes tipos em
 * src/lib/api/mappers.ts. Se o contrato do back-end mudar, só os mappers mudam.
 */

export type User = {
  id: string;
  name: string;
  email: string;
};

/** Contato enviado pelo formulário da página pública (RF06, RF16, RF17). */
export type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  /** Id do serviço no conteúdo da página inicial (seção Serviços). */
  serviceId: string | null;
  serviceName: string | null;
  message: string;
  /** Data e hora em ISO 8601. */
  createdAt: string;
};

export type Paginated<T> = {
  items: T[];
  page: number;
  lastPage: number;
  perPage: number;
  total: number;
};

export type LeadSort = "recentes" | "antigos";

export type LeadFilters = {
  search: string;
  serviceId: string;
  sort: LeadSort;
  page: number;
  perPage: number;
};

/** Opção de filtro "Serviço de interesse", vinda da seção Serviços do conteúdo. */
export type ServiceOption = { id: string; title: string };

// O conteúdo da página inicial tem tipos próprios em src/features/home-editor/types.ts.
