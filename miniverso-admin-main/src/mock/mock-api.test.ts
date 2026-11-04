import assert from "node:assert/strict";
import { beforeEach, describe, it } from "node:test";
import { mockApi, resetMockStore } from "./mock-api";

process.env.MOCK_LATENCY_MS = "0";

const login = (email: string, password: string) =>
  mockApi({ method: "POST", path: "/login", body: JSON.stringify({ email, password }), contentType: "application/json" });

async function token(): Promise<string> {
  const response = await login("admin@miniverso.test", "miniverso123");
  return (response.data as { data: { token: string } }).data.token;
}

type Content = { sections: Array<{ key: string; visible: boolean; fields: Record<string, unknown>; items: Array<Record<string, unknown>> }>; publishedAt: string };

async function getContent(): Promise<Content> {
  return ((await mockApi({ method: "GET", path: "/site-content" })).data as { data: Content }).data;
}

type LeadPage = {
  data: Array<{ id: number; name: string; created_at: string; service: { id: string; title: string } | null }>;
  meta: { total: number; last_page: number };
};

const put = async (sections: Content["sections"], auth: string | null) =>
  mockApi({ method: "PUT", path: "/site-content", body: JSON.stringify({ sections }), contentType: "application/json", token: auth });

describe("mock da API", () => {
  beforeEach(() => resetMockStore());

  it("faz login com as credenciais de teste", async () => {
    const response = await login("ADMIN@miniverso.test", "miniverso123");
    assert.equal(response.status, 200);
    const body = response.data as { data: { token: string; user: { nome: string } } };
    assert.match(body.data.token, /^mock\./);
    assert.equal(body.data.user.nome, "Administrador Miniverso");
  });

  it("recusa senha errada com 422 e a mesma mensagem do back-end", async () => {
    const response = await login("admin@miniverso.test", "errada");
    assert.equal(response.status, 422);
    assert.deepEqual(response.data, { errors: { message: "Credenciais inválidas." } });
  });

  it("bloqueia na 7ª tentativa, como o throttle:6,1 do back-end (RNF15)", async () => {
    for (let attempt = 1; attempt <= 6; attempt += 1) {
      assert.equal((await login("admin@miniverso.test", "errada")).status, 422);
    }
    const blocked = await login("admin@miniverso.test", "errada");
    assert.equal(blocked.status, 429);
    assert.ok(Number(blocked.headers.get("retry-after")) > 0);
    // Mesmo com a senha certa, continua bloqueado até o tempo acabar.
    assert.equal((await login("admin@miniverso.test", "miniverso123")).status, 429);
  });

  it("exige token para publicar e para /me (RNF13)", async () => {
    const { sections } = await getContent();
    assert.equal((await put(sections, null)).status, 401);
    assert.equal((await mockApi({ method: "GET", path: "/me", token: "mock.invalido" })).status, 401);
  });

  it("entrega a página com Hero no topo e Rodapé no fim", async () => {
    const content = await getContent();
    assert.equal(content.sections.length, 10);
    assert.equal(content.sections[0].key, "hero");
    assert.equal(content.sections.at(-1)?.key, "rodape");
  });

  it("publica alterações válidas e atualiza a data (RF18)", async () => {
    const before = await getContent();
    const sections = before.sections.map((section) =>
      section.key === "sobre" ? { ...section, fields: { ...section.fields, title: "Quem somos" } } : section,
    );
    const response = await put(sections, await token());
    assert.equal(response.status, 200);
    const after = await getContent();
    assert.equal(after.sections.find((section) => section.key === "sobre")?.fields.title, "Quem somos");
    assert.notEqual(after.publishedAt, before.publishedAt);
  });

  it("recusa conteúdo inválido com 422 e mantém o publicado (RNF23)", async () => {
    const before = await getContent();
    const sections = before.sections.map((section) =>
      section.key === "hero" ? { ...section, fields: { ...section.fields, title: "" } } : section,
    );
    const response = await put(sections, await token());
    assert.equal(response.status, 422);
    assert.ok("hero" in (response.data as { errors: Record<string, unknown> }).errors);
    assert.deepEqual(await getContent(), before);
  });

  it("recusa a lista de seções incompleta", async () => {
    const { sections } = await getContent();
    assert.equal((await put(sections.slice(1), await token())).status, 422);
  });

  it("lista leads paginados, do mais recente ao mais antigo (RF16)", async () => {
    const response = await mockApi({ method: "GET", path: "/leads", search: "?per_page=10", token: await token() });
    const page = response.data as LeadPage;
    assert.equal(response.status, 200);
    assert.equal(page.data.length, 10);
    assert.equal(page.meta.total, 18);
    assert.equal(page.meta.last_page, 2);
    const dates = page.data.map((lead) => new Date(lead.created_at).getTime());
    assert.deepEqual(dates, [...dates].sort((a, b) => b - a));
  });

  it("busca leads sem diferenciar acentos e maiúsculas", async () => {
    const response = await mockApi({ method: "GET", path: "/leads", search: "?search=CLINICA", token: await token() });
    const page = response.data as LeadPage;
    assert.equal(page.meta.total, 1);
    assert.equal(page.data[0].name, "Carla Mendes");
  });

  it("filtra leads pelo serviço da seção Serviços", async () => {
    const content = await getContent();
    const firstService = content.sections.find((section) => section.key === "servicos")?.items[0];
    assert.ok(firstService);
    const response = await mockApi({ method: "GET", path: "/leads", search: `?service_id=${String(firstService.id)}&per_page=50`, token: await token() });
    const page = response.data as LeadPage;
    assert.ok(page.meta.total > 0);
    assert.ok(page.data.every((lead) => lead.service?.id === firstService.id && lead.service?.title === firstService.title));
  });

  it("exige login para ver leads (RNF19)", async () => {
    assert.equal((await mockApi({ method: "GET", path: "/leads" })).status, 401);
  });

  it("exclui um lead e depois responde 404", async () => {
    const auth = await token();
    assert.equal((await mockApi({ method: "DELETE", path: "/leads/18", token: auth })).status, 204);
    assert.equal((await mockApi({ method: "GET", path: "/leads/18", token: auth })).status, 404);
    const page = (await mockApi({ method: "GET", path: "/leads", token: auth })).data as LeadPage;
    assert.equal(page.meta.total, 17);
  });
});
