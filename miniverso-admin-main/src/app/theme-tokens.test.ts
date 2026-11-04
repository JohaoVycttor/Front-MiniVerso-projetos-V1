import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, it } from "node:test";

/*
 * Confere os tokens de cor de globals.css nos dois temas:
 * - os dois blocos do modo escuro (escolha salva e tema do sistema) são iguais;
 * - todo papel de cor tem valor no modo escuro;
 * - os pares de texto e fundo usados no painel passam no contraste mínimo (RNF33);
 * - os componentes usam os papéis, não as cores fixas, para o modo escuro valer em todo lugar.
 */

const SRC = join(process.cwd(), "src");
const css = readFileSync(join(SRC, "app/globals.css"), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");

function declarations(body: string): Map<string, string> {
  const map = new Map<string, string>();
  for (const part of body.split(";")) {
    const separator = part.indexOf(":");
    if (separator === -1) continue;
    map.set(part.slice(0, separator).trim(), part.slice(separator + 1).trim());
  }
  return map;
}

function block(pattern: RegExp): Map<string, string> {
  const match = css.match(pattern);
  assert.ok(match, `bloco não encontrado: ${pattern}`);
  return declarations(match[1]);
}

const light = block(/(?:^|\n):root \{([^}]*)\}/);
const darkChosen = block(/:root\[data-theme="dark"\] \{([^}]*)\}/);
const darkSystem = block(/@media \(prefers-color-scheme: dark\) \{\s*:root:not\(\[data-theme="light"\]\) \{([^}]*)\}\s*\}/);

function resolve(name: string, theme: Map<string, string>): string {
  let value = theme.get(name) ?? light.get(name);
  for (let depth = 0; value && depth < 5; depth++) {
    const reference = value.match(/^var\((--[\w-]+)\)$/);
    if (!reference) break;
    value = theme.get(reference[1]) ?? light.get(reference[1]);
  }
  assert.ok(value, `token sem valor: ${name}`);
  return value;
}

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((index) => {
    const channel = parseInt(hex.slice(index, index + 2), 16) / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [lighter, darker] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (lighter + 0.05) / (darker + 0.05);
}

// [texto ou ícone, fundo, mínimo]: 4,5:1 para texto e 3:1 para bordas, foco e ícones (RNF33).
const PAIRS: Array<[string, string, number]> = [
  ["--color-text", "--color-bg", 4.5],
  ["--color-text", "--color-surface", 4.5],
  ["--color-text", "--color-surface-subtle", 4.5],
  ["--color-text", "--color-accent-soft", 4.5],
  ["--color-heading", "--color-surface", 4.5],
  ["--color-heading", "--color-bg", 4.5],
  ["--color-text-muted", "--color-surface", 4.5],
  ["--color-text-muted", "--color-bg", 4.5],
  ["--color-text-muted", "--color-surface-subtle", 4.5],
  ["--color-text-muted", "--color-fill", 4.5],
  ["--color-text-muted", "--color-accent-soft", 4.5],
  ["--color-text-subtle", "--color-surface", 4.5],
  ["--color-accent", "--color-surface", 4.5],
  ["--color-accent", "--color-bg", 4.5],
  ["--color-accent", "--color-surface-subtle", 4.5],
  ["--color-accent", "--color-accent-soft", 4.5],
  ["--color-info-text", "--color-info-soft", 4.5],
  ["--color-info-text", "--color-accent-soft", 4.5],
  ["--color-success-text", "--color-success-soft", 4.5],
  ["--color-success-text", "--color-bg", 4.5],
  ["--color-warning-text", "--color-warning-soft", 4.5],
  ["--color-warning-text", "--color-bg", 4.5],
  ["--color-warning-text", "--color-surface", 4.5],
  ["--color-warning-text", "--color-accent-soft", 4.5],
  ["--color-danger-text", "--color-surface", 4.5],
  ["--color-danger-text", "--color-danger-soft", 4.5],
  ["--color-danger-text", "--color-accent-soft", 4.5],
  ["#ffffff", "--color-primary", 4.5],
  ["#ffffff", "--color-danger-fill", 4.5],
  ["#ffffff", "--color-avatar", 4.5],
  ["#ffffff", "--color-toast", 4.5],
  ["--color-border-strong", "--color-surface", 3],
  ["--color-focus", "--color-surface", 3],
  ["--color-focus", "--color-bg", 3],
  ["--color-switch-thumb", "--color-fill", 3],
];

function checkContrast(theme: Map<string, string>) {
  for (const [foreground, background, minimum] of PAIRS) {
    const fg = foreground.startsWith("#") ? foreground : resolve(foreground, theme);
    const bg = resolve(background, theme);
    assert.match(fg, /^#[0-9a-f]{6}$/i, `${foreground} precisa ser uma cor hexadecimal`);
    assert.match(bg, /^#[0-9a-f]{6}$/i, `${background} precisa ser uma cor hexadecimal`);
    const ratio = contrast(fg, bg);
    assert.ok(ratio >= minimum, `${foreground} sobre ${background}: ${ratio.toFixed(2)}:1 (mínimo ${minimum}:1)`);
  }
}

function moduleFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return moduleFiles(path);
    return entry.name.endsWith(".module.css") ? [path] : [];
  });
}

// Partes que são escuras nos dois temas: menu lateral, lateral do login e aviso flutuante.
const ALWAYS_DARK = new Set(["components/layout/admin-shell.module.css", "features/auth/login.module.css", "components/ui/toast.module.css"]);

describe("tokens de cor nos temas claro e escuro", () => {
  it("os dois blocos do modo escuro são iguais", () => {
    assert.deepEqual([...darkSystem.entries()], [...darkChosen.entries()]);
  });

  it("todo papel de cor tem valor no modo escuro", () => {
    const roles = [...light.keys()].filter((name) => name.startsWith("--color-") || name.startsWith("--shadow-"));
    assert.ok(roles.length > 30);
    for (const name of roles) assert.ok(darkChosen.has(name), `falta ${name} no modo escuro`);
    for (const name of darkChosen.keys()) {
      if (name !== "color-scheme") assert.ok(light.has(name), `${name} existe só no modo escuro`);
    }
    assert.equal(light.get("color-scheme"), "light");
    assert.equal(darkChosen.get("color-scheme"), "dark");
  });

  it("contraste mínimo no tema claro (RNF33)", () => {
    checkContrast(new Map());
  });

  it("contraste mínimo no modo escuro (RNF33)", () => {
    checkContrast(darkChosen);
  });

  it("os componentes usam os papéis de cor, não as cores fixas", () => {
    for (const file of moduleFiles(SRC)) {
      const name = relative(SRC, file).split("\\").join("/");
      const source = readFileSync(file, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
      const primitives = source.match(/var\(--(gray|danger|success|warning|info)-\d+\)/g) ?? [];
      assert.deepEqual(primitives, [], `${name} usa cores fixas: ${primitives.join(", ")}`);
      if (ALWAYS_DARK.has(name)) continue;
      const brand = source.match(/var\(--mv-[\w-]+\)/g) ?? [];
      assert.deepEqual(brand, [], `${name} usa cores da marca direto: ${brand.join(", ")}`);
      const literals = (source.match(/#[0-9a-f]{3,8}\b|rgba?\([^)]*\)/gi) ?? []).filter((color) => color.toLowerCase() !== "#fff");
      assert.deepEqual(literals, [], `${name} usa cores escritas à mão: ${literals.join(", ")}`);
    }
  });
});
