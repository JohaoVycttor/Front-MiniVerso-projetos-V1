import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { mapLead, mapPaginated, mapUser, unwrapData } from "./mappers";

describe("mappers", () => {
  it("tira o embrulho { data } do Laravel", () => {
    assert.deepEqual(unwrapData({ data: [1, 2] }), [1, 2]);
    assert.deepEqual(unwrapData([1, 2]), [1, 2]);
  });

  it("lê o usuário no formato do back-end (nome, sem id)", () => {
    assert.deepEqual(mapUser({ nome: "Admin", email: "admin@example.com", created_at: "01/09/2026 10:00:00" }), {
      id: "admin@example.com",
      name: "Admin",
      email: "admin@example.com",
    });
  });

  it("descarta usuário sem e-mail", () => {
    assert.equal(mapUser({ id: 1 }), null);
    assert.equal(mapUser(null), null);
  });

  it("converte um lead da API para o modelo do front", () => {
    const lead = mapLead({
      id: 7,
      name: "Ana Ribeiro",
      email: "ana@example.com",
      phone: "",
      company: null,
      service: { id: "serv-1", title: "Realidade virtual" },
      message: "Olá",
      created_at: "2026-10-01T12:00:00.000Z",
    });
    assert.deepEqual(lead, {
      id: "7",
      name: "Ana Ribeiro",
      email: "ana@example.com",
      phone: null,
      company: null,
      serviceId: "serv-1",
      serviceName: "Realidade virtual",
      message: "Olá",
      createdAt: "2026-10-01T12:00:00.000Z",
    });
  });

  it("descarta lead sem id", () => {
    assert.equal(mapLead({ name: "Sem id" }), null);
  });

  it("lê a paginação do Laravel e aceita lista simples", () => {
    const page = mapPaginated(
      { data: [{ id: 1, name: "A", email: "a@example.com" }], meta: { current_page: 2, last_page: 3, per_page: 1, total: 3 } },
      mapLead,
    );
    assert.equal(page.items.length, 1);
    assert.equal(page.page, 2);
    assert.equal(page.lastPage, 3);
    assert.equal(page.total, 3);
    const simple = mapPaginated([{ id: 1, name: "A", email: "a@example.com" }], mapLead);
    assert.equal(simple.total, 1);
    assert.equal(simple.lastPage, 1);
  });
});
