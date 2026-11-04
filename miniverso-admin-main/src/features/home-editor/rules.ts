/**
 * Regras do editor da página inicial, sem dependência de React (testáveis).
 * Validação por campo (RNF23, RNF30, RN04), regras de estrutura do DRDA (3.1.1)
 * e controle de alterações não publicadas.
 */
import { SECTION_BY_KEY, SECTION_DEFS } from "./schema";
import type { ContentItem, FieldDef, FieldValue, OptionSource, SectionContent, SectionDef, SectionKey, SiteContent } from "./types";

export type FieldErrors = Record<string, string>;
export type SectionErrors = { fields: FieldErrors; section?: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isBlank(value: FieldValue | undefined): boolean {
  return value === undefined || value === "" || (typeof value === "string" && value.trim() === "");
}

export function isValidUrl(value: string): boolean {
  if (value.startsWith("/") && !value.startsWith("//") && !value.includes("\\")) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

/** Campo obrigatório vazio: diz o que fazer e em qual campo, pelo rótulo visível (RNF30). */
function requiredMessage(def: FieldDef): string {
  if (def.type === "image") return `Escolha uma imagem para o campo "${def.label}".`;
  if (def.type === "file") return `Escolha um arquivo para o campo "${def.label}".`;
  if (def.type === "select") return `Escolha uma opção no campo "${def.label}".`;
  return `Preencha o campo "${def.label}".`;
}

/** Erros de cada campo, com mensagem que diz o problema (RNF30). */
export function validateFields(defs: FieldDef[], values: Record<string, FieldValue | undefined>): FieldErrors {
  const errors: FieldErrors = {};
  for (const def of defs) {
    const value = values[def.name];
    if (def.type === "toggle" || def.type === "checkbox") continue;
    if (isBlank(value)) {
      if (def.required) errors[def.name] = requiredMessage(def);
      continue;
    }
    const text = String(value).trim();
    if (def.maxLength && text.length > def.maxLength) {
      errors[def.name] = `Use no máximo ${def.maxLength} caracteres (agora são ${text.length}).`;
    } else if (def.type === "url" && !isValidUrl(text)) {
      errors[def.name] = "Digite um endereço completo, começando com https://";
    } else if (def.type === "email" && !EMAIL.test(text)) {
      errors[def.name] = "Digite um e-mail válido, como contato@empresa.com.";
    }
  }
  // Imagem enviada pede texto alternativo (RNF34).
  const imageFields = defs.filter((def) => def.type === "image" && !def.decorative).map((def) => def.name);
  const altField = defs.find((def) => /alt$/i.test(def.name));
  if (altField && imageFields.some((name) => !isBlank(values[name])) && isBlank(values[altField.name])) {
    errors[altField.name] = "Descreva a imagem para quem usa leitor de tela.";
  }
  return errors;
}

export function findSection(content: SiteContent, key: SectionKey): SectionContent {
  const section = content.sections.find((item) => item.key === key);
  if (!section) throw new Error(`Seção ${key} não encontrada`);
  return section;
}

/** Clientes só pode aparecer com pelo menos um logo autorizado (RIU22, RIU23). */
export function hasAuthorizedLogo(section: SectionContent): boolean {
  return section.items.some((item) => item.authorized === true && !isBlank(item.logo));
}

/** Diz se o administrador pode ligar ou desligar a seção, e por quê. */
export function visibilityControl(def: SectionDef, section: SectionContent): { canToggle: boolean; reason?: string } {
  if (def.requirement === "required") return { canToggle: false, reason: "Seção obrigatória: não pode ser ocultada." };
  if (def.locked) return { canToggle: false, reason: def.locked };
  if (def.key === "clientes" && !section.visible && !hasAuthorizedLogo(section)) {
    return { canToggle: false, reason: "Adicione pelo menos um logo com uso autorizado para exibir esta seção." };
  }
  return { canToggle: true };
}

export function validateSection(def: SectionDef, section: SectionContent): SectionErrors {
  const fields = validateFields(def.fields, section.fields);
  let message: string | undefined;

  if (def.key === "projetos") {
    const featured = section.fields.featured;
    const project = section.items.find((item) => item.id === featured);
    if (!featured) fields.featured = "Escolha o projeto em destaque.";
    else if (!project || project.visible === false) fields.featured = "O projeto em destaque precisa estar visível na página.";
  }
  if (def.key === "clientes" && section.visible && !hasAuthorizedLogo(section)) {
    message = "A seção está visível, mas não tem nenhum logo autorizado.";
  }
  // The footer is required, while its extra social links are optional.
  if (def.items && def.key !== "rodape" && def.requirement === "required" && !section.items.some((item) => item.visible !== false)) {
    message = `Deixe pelo menos um ${def.items.singular} visível.`;
  }
  return { fields, section: message };
}

export function validateContent(content: SiteContent): Partial<Record<SectionKey, SectionErrors>> {
  const result: Partial<Record<SectionKey, SectionErrors>> = {};
  for (const section of content.sections) {
    const errors = validateSection(SECTION_BY_KEY[section.key], section);
    if (Object.keys(errors.fields).length > 0 || errors.section) result[section.key] = errors;
  }
  return result;
}

/** Resumo exibido abaixo do nome da seção na estrutura. */
export function sectionSummary(def: SectionDef, section: SectionContent): string {
  const prefix = def.fixed === "top" ? "Posição fixa no topo" : def.fixed === "bottom" ? "Posição fixa no fim" : "";
  if (def.locked) return "Complementar · depende do 3D";
  if (!def.items) return prefix || def.description;
  const visible = section.items.filter((item) => item.visible !== false).length;
  const hidden = section.items.length - visible;
  if (def.key === "clientes") {
    const authorized = section.items.filter((item) => item.authorized === true).length;
    return `${authorized} ${authorized === 1 ? "logo autorizado" : "logos autorizados"}`;
  }
  const label = `${visible} ${visible === 1 ? "visível" : "visíveis"}${hidden ? ` · ${hidden} ${hidden === 1 ? "oculto" : "ocultos"}` : ""}`;
  return prefix ? `${prefix} · ${label}` : label;
}

/** Seções com conteúdo ou posição diferente do publicado (alterações pendentes). */
export function changedSections(draft: SiteContent, published: SiteContent): SectionKey[] {
  return draft.sections
    .filter((section, index) => {
      const before = published.sections[index];
      if (before?.key !== section.key) return true;
      return JSON.stringify(section) !== JSON.stringify(before);
    })
    .map((section) => section.key);
}

/** Move uma seção, sem passar do Hero (topo) nem do Rodapé (fim). */
export function moveSection(content: SiteContent, key: SectionKey, direction: -1 | 1): SiteContent {
  const sections = [...content.sections];
  const index = sections.findIndex((section) => section.key === key);
  const target = index + direction;
  if (index < 0 || target < 0 || target >= sections.length) return content;
  if (SECTION_BY_KEY[key].fixed || SECTION_BY_KEY[sections[target].key].fixed) return content;
  [sections[index], sections[target]] = [sections[target], sections[index]];
  return { ...content, sections };
}

export function canMoveSection(content: SiteContent, key: SectionKey, direction: -1 | 1): boolean {
  return moveSection(content, key, direction) !== content;
}

export function moveItem(items: ContentItem[], id: string, direction: -1 | 1): ContentItem[] {
  const index = items.findIndex((item) => item.id === id);
  const target = index + direction;
  if (index < 0 || target < 0 || target >= items.length) return items;
  const next = [...items];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

/** Opções dos selects que dependem do próprio conteúdo. */
export function resolveOptions(source: OptionSource | undefined, content: SiteContent): Array<{ value: string; label: string }> {
  if (!source) return [];
  if (Array.isArray(source)) return source;
  if (source === "sections") {
    return content.sections
      .filter((section) => section.key !== "hero" && section.visible)
      .map((section) => ({ value: section.key, label: `Seção ${SECTION_BY_KEY[section.key].name}` }));
  }
  if (source === "projects") {
    return findSection(content, "projetos")
      .items.filter((item) => item.visible !== false)
      .map((item) => ({ value: item.id, label: String(item.name ?? "Projeto sem nome") }));
  }
  return findSection(content, "servicos").items.map((item) => ({ value: String(item.title), label: String(item.title) }));
}

/** Confere tipo, extensão e tamanho do arquivo antes de aceitar (RNF24). */
export function validateFile(file: { name: string; type: string; size: number }, def: FieldDef): string | null {
  const accept = def.accept ?? [];
  const extension = `.${file.name.split(".").pop()?.toLowerCase() ?? ""}`;
  const typeOk = accept.length === 0 || accept.includes(file.type) || accept.includes(extension);
  const allowedExtensions = accept
    .map((item) => (item.startsWith(".") ? item : `.${item.split("/")[1] ?? ""}`))
    .map((item) => item.replace(".jpeg", ".jpg").replace(".gltf-binary", ".glb"));
  const extensionOk = allowedExtensions.length === 0 || allowedExtensions.includes(extension === ".jpeg" ? ".jpg" : extension);
  if (!typeOk || !extensionOk) {
    const names = [...new Set(allowedExtensions)].map((item) => item.slice(1).toUpperCase()).join(", ");
    return `Formato não suportado. Envie ${names}.`;
  }
  const maxBytes = (def.maxSizeMb ?? 2) * 1024 * 1024;
  if (file.size > maxBytes) return `Arquivo maior que ${def.maxSizeMb ?? 2} MB. Reduza o tamanho e tente de novo.`;
  return null;
}

export function sectionDefsInOrder(content: SiteContent): Array<{ def: SectionDef; section: SectionContent }> {
  return content.sections.map((section) => ({ def: SECTION_BY_KEY[section.key], section }));
}

export { SECTION_DEFS };
