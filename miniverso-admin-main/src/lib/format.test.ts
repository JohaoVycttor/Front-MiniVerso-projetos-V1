import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { formatDateTime, getInitials, pluralize } from "./format";

describe("format", () => {
  it("formata data e hora no padrão brasileiro", () => {
    const text = formatDateTime(new Date(2026, 8, 24, 14, 32).toISOString());
    assert.equal(text, "24/09/2026 às 14:32");
  });

  it("lida com data inválida sem quebrar a tela", () => {
    assert.equal(formatDateTime("não é data"), "Data não informada");
  });

  it("gera iniciais", () => {
    assert.equal(getInitials("Ana Ribeiro"), "AR");
    assert.equal(getInitials("Administrador"), "A");
    assert.equal(getInitials("  "), "?");
  });

  it("pluraliza", () => {
    assert.equal(pluralize(1, "lead", "leads"), "1 lead");
    assert.equal(pluralize(3, "lead", "leads"), "3 leads");
  });
});
