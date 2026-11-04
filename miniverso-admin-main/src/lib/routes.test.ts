import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isPublicAdminPath, loginRedirectFor, parseLoginReason, safeRedirectTarget } from "./routes";

describe("safeRedirectTarget", () => {
  it("aceita páginas do painel", () => {
    assert.equal(safeRedirectTarget("/admin/leads"), "/admin/leads");
    assert.equal(safeRedirectTarget("/admin/leads/12?x=1"), "/admin/leads/12?x=1");
  });

  it("recusa endereços fora do painel (open redirect)", () => {
    assert.equal(safeRedirectTarget("https://site-malicioso.com"), "/admin");
    assert.equal(safeRedirectTarget("//site-malicioso.com"), "/admin");
    assert.equal(safeRedirectTarget("/\\site-malicioso.com"), "/admin");
    assert.equal(safeRedirectTarget("/administracao-falsa"), "/admin");
    assert.equal(safeRedirectTarget(null), "/admin");
  });

  it("não volta para o próprio login", () => {
    assert.equal(safeRedirectTarget("/admin/login"), "/admin");
    assert.equal(safeRedirectTarget("/admin/login?motivo=saiu"), "/admin");
  });
});

describe("loginRedirectFor", () => {
  it("guarda o destino e o motivo", () => {
    assert.equal(loginRedirectFor("/admin/leads", "expirada"), "/admin/login?motivo=expirada&redirect=%2Fadmin%2Fleads");
  });

  it("omite o destino quando é a visão geral", () => {
    assert.equal(loginRedirectFor("/admin", "saiu"), "/admin/login?motivo=saiu");
    assert.equal(loginRedirectFor(null), "/admin/login");
  });
});

describe("rotas públicas e motivos", () => {
  it("só o login é público", () => {
    assert.equal(isPublicAdminPath("/admin/login"), true);
    assert.equal(isPublicAdminPath("/admin"), false);
    assert.equal(isPublicAdminPath("/admin/leads"), false);
  });

  it("ignora motivos desconhecidos", () => {
    assert.equal(parseLoginReason("inatividade"), "inatividade");
    assert.equal(parseLoginReason("<script>"), null);
  });
});
