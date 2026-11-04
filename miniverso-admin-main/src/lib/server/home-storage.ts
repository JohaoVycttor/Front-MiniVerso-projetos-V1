import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { SECTION_DEFS } from "@/features/home-editor/schema";
import { validateContent, validateFields } from "@/features/home-editor/rules";
import type { SiteContent } from "@/features/home-editor/types";

export const homeDataDir = () => path.resolve(process.env.HOME_DATA_DIR || path.join(process.cwd(), "..", "data"));
export async function readHome(): Promise<SiteContent> {
  return JSON.parse(await fs.readFile(path.join(homeDataDir(), "home-content.json"), "utf8"));
}
export async function writeJson(name: string, value: unknown) {
  const destination = path.join(homeDataDir(), name);
  await fs.mkdir(path.dirname(destination), { recursive: true });
  const temporary = `${destination}.${randomUUID()}.tmp`;
  try { await fs.writeFile(temporary, JSON.stringify(value, null, 2)); await fs.rename(temporary, destination); }
  finally { await fs.rm(temporary, { force: true }); }
}
export function parseHome(value: unknown): SiteContent {
  const content = value as SiteContent;
  if (!content || !Array.isArray(content.sections) || content.sections.length !== SECTION_DEFS.length) throw new Error("Estrutura de seções inválida.");
  const keys = new Set<string>();
  for (const section of content.sections) {
    const def = SECTION_DEFS.find(d => d.key === section?.key);
    if (!def || keys.has(section.key) || typeof section.visible !== "boolean" || !section.fields || !Array.isArray(section.items) || section.items.length > 100) throw new Error("Seção inválida.");
    keys.add(section.key);
    if (def.requirement === "required" && !section.visible) throw new Error("Uma seção obrigatória foi ocultada.");
    const ids = new Set<string>();
    for (const item of section.items) {
      if (!item || typeof item.id !== "string" || !/^[a-zA-Z0-9_-]+$/.test(item.id) || ids.has(item.id)) throw new Error("Identificador de card inválido.");
      ids.add(item.id);
      if (def.items && Object.keys(validateFields(def.items.fields, item)).length) throw new Error(`Revise os cards de ${def.name}.`);
    }
    for (const fields of [section.fields, ...section.items]) {
      for (const [key, field] of Object.entries(fields)) {
        if (typeof field !== "string" && typeof field !== "boolean") throw new Error("Campo inválido.");
        if (typeof field === "string" && field.length > 12000) throw new Error("Texto muito longo.");
        if (typeof field === "string" && field && /(?:url|link|image|cover|background|video|poster|model3d)$/i.test(key) && !/Alt$/i.test(key)) {
          if (!(field.startsWith("/") && !field.startsWith("//") && !field.includes("\\")) && !/^https?:\/\//i.test(field)) throw new Error("Use um arquivo enviado ou um endereço HTTP/HTTPS.");
        }
      }
    }
  }
  if (content.sections[0].key !== "hero" || content.sections.at(-1)?.key !== "rodape") throw new Error("Mantenha Hero no início e Rodapé no fim.");
  if (Object.keys(validateContent(content)).length) throw new Error("Revise os campos obrigatórios antes de publicar.");
  return { sections: content.sections, publishedAt: content.publishedAt || null };
}
