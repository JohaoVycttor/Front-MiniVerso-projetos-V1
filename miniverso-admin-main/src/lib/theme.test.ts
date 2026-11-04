import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { THEME_COOKIE, nextTheme, parseTheme, resolveTheme, themeCookie } from "./theme";

describe("modo claro e escuro", () => {
  it("aceita só os valores conhecidos no cookie", () => {
    assert.equal(parseTheme("dark"), "dark");
    assert.equal(parseTheme("light"), "light");
    assert.equal(parseTheme("DARK"), null);
    assert.equal(parseTheme("<script>"), null);
    assert.equal(parseTheme(""), null);
    assert.equal(parseTheme(undefined), null);
    assert.equal(parseTheme(null), null);
  });

  it("sem escolha salva, segue o sistema", () => {
    assert.equal(resolveTheme(null, true), "dark");
    assert.equal(resolveTheme(null, false), "light");
  });

  it("a escolha salva vale mais que o sistema", () => {
    assert.equal(resolveTheme("light", true), "light");
    assert.equal(resolveTheme("dark", false), "dark");
  });

  it("o botão alterna entre os dois temas", () => {
    assert.equal(nextTheme("light"), "dark");
    assert.equal(nextTheme("dark"), "light");
  });

  it("grava o cookie para o site inteiro, por um ano, e Secure só em HTTPS", () => {
    assert.equal(themeCookie("dark", false), `${THEME_COOKIE}=dark; Path=/; Max-Age=31536000; SameSite=Lax`);
    assert.equal(themeCookie("light", true), `${THEME_COOKIE}=light; Path=/; Max-Age=31536000; SameSite=Lax; Secure`);
  });
});
