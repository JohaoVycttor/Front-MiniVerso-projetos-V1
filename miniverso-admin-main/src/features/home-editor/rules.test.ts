import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createSeedContent } from "@/mock/site-content-seed";
import {
  canMoveSection,
  changedSections,
  findSection,
  moveItem,
  moveSection,
  resolveOptions,
  validateContent,
  validateFields,
  validateFile,
  visibilityControl,
} from "./rules";
import { SECTION_BY_KEY } from "./schema";
import type { SectionContent, SiteContent } from "./types";

function withSection(content: SiteContent, key: SectionContent["key"], update: (section: SectionContent) => SectionContent): SiteContent {
  return { ...content, sections: content.sections.map((section) => (section.key === key ? update(section) : section)) };
}

describe("regras do editor da página inicial", () => {
  it("o conteúdo inicial é válido para publicar", () => {
    assert.deepEqual(validateContent(createSeedContent()), {});
  });

  it("pede os campos obrigatórios com mensagem que diz o problema (RNF30)", () => {
    const errors = validateFields(SECTION_BY_KEY.hero.fields, { title: "", primaryLabel: "Ver", primaryTarget: "" });
    assert.equal(errors.title, 'Preencha o campo "Chamada principal".');
    assert.equal(errors.primaryTarget, 'Escolha uma opção no campo "Botão principal · destino".');
    const service = validateFields(SECTION_BY_KEY.servicos.items!.fields, { title: "RV", description: "Treinamentos" });
    assert.equal(service.image, 'Escolha uma imagem para o campo "Ícone ou imagem".');
  });

  it("confere limite de caracteres, link e e-mail", () => {
    const fields = SECTION_BY_KEY.contato.fields;
    const errors = validateFields(fields, { title: "x".repeat(81), email: "contato@", successMessage: "ok", errorMessage: "ok" });
    assert.match(errors.title, /no máximo 80/);
    assert.match(errors.email, /e-mail válido/);
    const footer = validateFields(SECTION_BY_KEY.rodape.fields, { privacyUrl: "miniverso.com", copyright: "©" });
    assert.match(footer.privacyUrl, /https:\/\//);
  });

  it("imagem enviada exige texto alternativo (RNF34)", () => {
    const errors = validateFields(SECTION_BY_KEY.servicos.items!.fields, {
      title: "RV",
      description: "Treinamentos",
      image: "data:image/png;base64,AAA",
      imageAlt: "",
    });
    assert.match(errors.imageAlt, /Descreva a imagem/);
  });

  it("o projeto em destaque precisa estar visível (RIU17)", () => {
    const content = withSection(createSeedContent(), "projetos", (section) => ({
      ...section,
      items: section.items.map((item) => (item.id === section.fields.featured ? { ...item, visible: false } : item)),
    }));
    assert.match(validateContent(content).projetos?.fields.featured ?? "", /visível/);
  });

  it("seção obrigatória não pode ser ocultada; Experiência fica bloqueada (RIU20)", () => {
    const content = createSeedContent();
    assert.equal(visibilityControl(SECTION_BY_KEY.servicos, findSection(content, "servicos")).canToggle, false);
    assert.equal(visibilityControl(SECTION_BY_KEY.experiencia, findSection(content, "experiencia")).canToggle, false);
    assert.equal(visibilityControl(SECTION_BY_KEY.diferenciais, findSection(content, "diferenciais")).canToggle, true);
  });

  it("Clientes só aparece com logo autorizado (RIU22, RIU23)", () => {
    const empty = createSeedContent();
    assert.equal(visibilityControl(SECTION_BY_KEY.clientes, findSection(empty, "clientes")).canToggle, false);
    const withLogo = withSection(empty, "clientes", (section) => ({
      ...section,
      items: [{ id: "c1", name: "Empresa Exemplo", logo: "data:image/png;base64,AAA", authorized: true }],
    }));
    assert.equal(visibilityControl(SECTION_BY_KEY.clientes, findSection(withLogo, "clientes")).canToggle, true);
    const visibleWithout = withSection(empty, "clientes", (section) => ({ ...section, visible: true }));
    assert.ok(validateContent(visibleWithout).clientes?.section);
  });

  it("move seções sem passar do Hero nem do Rodapé", () => {
    const content = createSeedContent();
    const second = content.sections[1].key;
    assert.equal(canMoveSection(content, second, -1), false);
    assert.equal(canMoveSection(content, "hero", 1), false);
    const beforeLast = content.sections.at(-2)!.key;
    assert.equal(canMoveSection(content, beforeLast, 1), false);
    const moved = moveSection(content, second, 1);
    assert.equal(moved.sections[2].key, second);
    assert.deepEqual(changedSections(moved, content).sort(), [content.sections[1].key, content.sections[2].key].sort());
  });

  it("reordena itens e ignora movimentos fora da lista", () => {
    const items = [{ id: "a" }, { id: "b" }, { id: "c" }];
    assert.deepEqual(moveItem(items, "c", -1).map((item) => item.id), ["a", "c", "b"]);
    assert.equal(moveItem(items, "a", -1), items);
  });

  it("opções de destino listam só seções visíveis, sem o Hero", () => {
    const options = resolveOptions("sections", createSeedContent()).map((option) => option.value);
    assert.ok(!options.includes("hero"));
    assert.ok(!options.includes("clientes"));
    assert.ok(options.includes("contato"));
  });

  it("confere tipo, extensão e tamanho do arquivo (RNF24)", () => {
    const def = SECTION_BY_KEY.servicos.items!.fields.find((field) => field.name === "image")!;
    assert.equal(validateFile({ name: "icone.png", type: "image/png", size: 1000 }, def), null);
    assert.match(validateFile({ name: "icone.gif", type: "image/gif", size: 1000 }, def) ?? "", /Formato não suportado/);
    assert.match(validateFile({ name: "foto.jpg", type: "image/jpeg", size: 3 * 1024 * 1024 }, def) ?? "", /maior que 2 MB/);
    const model = SECTION_BY_KEY.hero.fields.find((field) => field.name === "model3d")!;
    assert.equal(validateFile({ name: "oculos.glb", type: "", size: 5 * 1024 * 1024 }, model), null);
  });

  it("imagem de fundo é opcional e decorativa: não pede texto alternativo (RF15, RNF34)", () => {
    const sobre = SECTION_BY_KEY.sobre.fields;
    const background = sobre.find((field) => field.name === "background");
    assert.ok(background?.decorative);
    assert.equal(background?.required, undefined);
    const errors = validateFields(sobre, { title: "Quem somos", text: "Texto", background: "data:image/png;base64,AAA" });
    assert.deepEqual(errors, {});
    // O Rodapé não tem fundo próprio: mantém a identidade do site (RIU27).
    assert.ok(!SECTION_BY_KEY.rodape.fields.some((field) => field.name === "background"));
  });
});
