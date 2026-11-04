/**
 * API de mentira que imita as rotas e respostas do back-end Laravel.
 * Serve para o painel funcionar antes de o back-end estar disponível.
 * O contrato imitado está em docs/CONTRATO-API.md.
 *
 * Os dados ficam em memória (globalThis) e voltam ao estado inicial quando o servidor reinicia.
 */
import { validateContent } from "@/features/home-editor/rules";
import type { SiteContent } from "@/features/home-editor/types";
import { createSeedLeads, type MockLead } from "./leads-seed";
import { createSeedContent } from "./site-content-seed";

export type MockRequest = {
  method: string;
  path: string;
  search?: string;
  token?: string | null;
  body?: string | ArrayBuffer | null;
  contentType?: string | null;
  /** Usado no modo híbrido: o token veio do back-end real e já foi validado lá. */
  trustToken?: boolean;
};

export type MockResponse = {
  status: number;
  data: unknown;
  headers: Headers;
};

type LoginAttempts = { failures: number; lockedUntil: number };

type MockStore = {
  content: SiteContent;
  leads: MockLead[];
  attempts: Map<string, LoginAttempts>;
};

// Igual ao back-end: throttle:6,1 na rota /login (a 7ª tentativa em 1 minuto recebe 429).
const MAX_FAILED_ATTEMPTS = 6;
const LOCK_SECONDS = 60;
const TOKEN_TTL_SECONDS = 8 * 60 * 60;
const MOCK_USER = { id: 1, nome: "Administrador Miniverso" };

/** Mesmo formato do UserResource do back-end. */
function userResource() {
  return { nome: MOCK_USER.nome, email: credentials().email, created_at: "01/09/2026 10:00:00", updated_at: "01/09/2026 10:00:00" };
}

const globalForMock = globalThis as typeof globalThis & { __miniversoMockStore?: MockStore };

function createStore(): MockStore {
  return {
    content: createSeedContent(),
    leads: createSeedLeads(new Date()),
    attempts: new Map(),
  };
}

function store(): MockStore {
  globalForMock.__miniversoMockStore ??= createStore();
  return globalForMock.__miniversoMockStore;
}

/** Volta os dados ao estado inicial (usado nos testes). */
export function resetMockStore(): void {
  globalForMock.__miniversoMockStore = createStore();
}

function credentials() {
  return {
    email: (process.env.MOCK_ADMIN_EMAIL || "admin@miniverso.test").toLowerCase(),
    password: process.env.MOCK_ADMIN_PASSWORD || "miniverso123",
  };
}

function json(status: number, data: unknown, extraHeaders: Record<string, string> = {}): MockResponse {
  return { status, data, headers: new Headers({ "content-type": "application/json", ...extraHeaders }) };
}

function noContent(): MockResponse {
  return { status: 204, data: null, headers: new Headers() };
}

const unauthenticated = () => json(401, { message: "Não autenticado." });
const notFound = () => json(404, { message: "Not Found." });

// Token sem estado no servidor: funciona mesmo com várias instâncias (ex.: Vercel).
// Não é seguro para produção, e não precisa ser: só existe no modo mock.
function base64UrlEncode(value: string): string {
  return btoa(value).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(value: string): string {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  return atob(padded);
}

function issueToken(): string {
  const exp = Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS;
  return `mock.${base64UrlEncode(JSON.stringify({ sub: MOCK_USER.id, exp }))}`;
}

function isValidToken(token: string | null | undefined): boolean {
  if (!token || !token.startsWith("mock.")) return false;
  try {
    const payload = JSON.parse(base64UrlDecode(token.slice(5))) as { sub?: number; exp?: number };
    return payload.sub === MOCK_USER.id && typeof payload.exp === "number" && payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

function parseBody(request: MockRequest): Record<string, unknown> {
  if (!request.body || !(request.contentType ?? "").includes("json")) return {};
  try {
    const text = typeof request.body === "string" ? request.body : new TextDecoder().decode(request.body);
    const parsed: unknown = JSON.parse(text);
    return typeof parsed === "object" && parsed !== null ? (parsed as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

function handleLogin(request: MockRequest): MockResponse {
  const body = parseBody(request);
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  if (!email || !password) {
    return json(422, {
      message: "O campo email é obrigatório.",
      errors: { ...(email ? {} : { email: ["O campo email é obrigatório."] }), ...(password ? {} : { password: ["O campo password é obrigatório."] }) },
    });
  }

  const attempts = store().attempts;
  const current = attempts.get(email) ?? { failures: 0, lockedUntil: 0 };
  const now = Date.now();
  if (current.lockedUntil > now) {
    const seconds = Math.ceil((current.lockedUntil - now) / 1000);
    return json(429, { message: "Too Many Attempts." }, { "retry-after": String(seconds) });
  }

  const expected = credentials();
  if (email !== expected.email || password !== expected.password) {
    const failures = current.failures + 1;
    const lockedUntil = failures >= MAX_FAILED_ATTEMPTS ? now + LOCK_SECONDS * 1000 : 0;
    attempts.set(email, { failures: lockedUntil ? 0 : failures, lockedUntil });
    // Mesma resposta do InvalidCredentialsException do back-end.
    return json(422, { errors: { message: "Credenciais inválidas." } });
  }

  attempts.delete(email);
  // Mesmo formato do AuthResource do back-end: { data: { token, user } }.
  return json(200, { data: { token: issueToken(), user: userResource() } });
}

/** Valida no "servidor" também (RNF23), com as mesmas regras do painel. */
function handleContentUpdate(request: MockRequest): MockResponse {
  const body = parseBody(request) as Partial<SiteContent>;
  if (!Array.isArray(body.sections) || body.sections.length !== store().content.sections.length) {
    return json(422, { message: "Conteúdo inválido.", errors: { sections: ["Conteúdo inválido."] } });
  }
  const candidate: SiteContent = { sections: body.sections, publishedAt: store().content.publishedAt };
  const problems = validateContent(candidate);
  if (Object.keys(problems).length > 0) {
    return json(422, { message: "Revise os campos destacados.", errors: problems });
  }
  store().content = { sections: candidate.sections, publishedAt: new Date().toISOString() };
  return json(200, { data: store().content });
}

function normalize(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

/** Formato proposto para o LeadResource (docs/CONTRATO-API.md). */
function leadResource(lead: MockLead) {
  return {
    id: lead.id,
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    company: lead.company,
    service: lead.service_id ? { id: lead.service_id, title: lead.service_title } : null,
    message: lead.message,
    created_at: lead.created_at,
  };
}

/** Paginação no formato do Laravel ({ data, links, meta }). */
function paginate<T>(items: T[], params: URLSearchParams, path: string) {
  const perPage = Math.min(Math.max(Number(params.get("per_page")) || 15, 1), 50);
  const lastPage = Math.max(1, Math.ceil(items.length / perPage));
  const page = Math.min(Math.max(Number(params.get("page")) || 1, 1), lastPage);
  const start = (page - 1) * perPage;
  const data = items.slice(start, start + perPage);
  return {
    data,
    links: {
      first: `${path}?page=1`,
      last: `${path}?page=${lastPage}`,
      prev: page > 1 ? `${path}?page=${page - 1}` : null,
      next: page < lastPage ? `${path}?page=${page + 1}` : null,
    },
    meta: {
      current_page: page,
      from: data.length ? start + 1 : null,
      last_page: lastPage,
      path,
      per_page: perPage,
      to: data.length ? start + data.length : null,
      total: items.length,
    },
  };
}

/** GET /leads com busca (nome, e-mail, empresa), filtro por serviço e ordenação por data (RF16). */
function handleLeadsList(params: URLSearchParams): MockResponse {
  const search = normalize(params.get("search") ?? "");
  const serviceId = params.get("service_id") || null;
  const ascending = params.get("sort") === "created_at";

  const leads = store()
    .leads.filter((lead) => {
      if (serviceId !== null && lead.service_id !== serviceId) return false;
      if (!search) return true;
      return [lead.name, lead.email, lead.company ?? ""].some((field) => normalize(field).includes(search));
    })
    .sort((a, b) => {
      const diff = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      return ascending ? diff : -diff;
    })
    .map(leadResource);

  return json(200, paginate(leads, params, "/leads"));
}

function delay(): Promise<void> {
  const ms = Number(process.env.MOCK_LATENCY_MS ?? 350);
  return ms > 0 ? new Promise((resolve) => setTimeout(resolve, ms)) : Promise.resolve();
}

export async function mockApi(request: MockRequest): Promise<MockResponse> {
  await delay();
  const method = request.method.toUpperCase();
  const segments = request.path.split("/").filter(Boolean);
  const params = new URLSearchParams(request.search ?? "");
  const [resource, id] = segments;

  if (method === "POST" && resource === "login" && segments.length === 1) return handleLogin(request);

  // Leitura pública, como no site: a página inicial lê o conteúdo sem login.
  // Com um token vencido, responde 401 como o Sanctum, para o painel encerrar a sessão.
  if (method === "GET" && resource === "site-content" && segments.length === 1) {
    if (request.token && !request.trustToken && !isValidToken(request.token)) return unauthenticated();
    return json(200, { data: store().content });
  }

  if (!request.trustToken && !isValidToken(request.token)) return unauthenticated();
  if (request.trustToken && !request.token) return unauthenticated();

  if (resource === "logout" && method === "POST") return noContent();
  if (resource === "me" && method === "GET") return json(200, { data: userResource() });
  if (resource === "site-content" && segments.length === 1 && method === "PUT") return handleContentUpdate(request);

  if (resource === "leads") {
    if (segments.length === 1 && method === "GET") return handleLeadsList(params);
    if (segments.length === 2) {
      const leads = store().leads;
      const index = leads.findIndex((lead) => String(lead.id) === id);
      if (index === -1) return notFound();
      if (method === "GET") return json(200, { data: leadResource(leads[index]) });
      if (method === "DELETE") {
        leads.splice(index, 1);
        return noContent();
      }
    }
  }

  return notFound();
}
