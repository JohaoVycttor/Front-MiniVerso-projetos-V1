import { promises as fs } from "node:fs";
import path from "node:path";
import { defaultContact, validateContactPage } from "@site/lib/contact-content.js";
import { defaultSolutions, validateSolutions } from "@site/lib/solutions-content.js";
import { defaultStudio, validateStudio } from "@site/lib/studio-content.js";
import { parseContent } from "@site/lib/portfolio-content.js";
import portfolioDefaults from "@site/data/portfolio-default.json";
import { mergeContentDefaults } from "@site/lib/content-defaults.js";
import { homeDataDir, writeJson } from "@/lib/server/home-storage";

export const MANAGED_PAGE_KEYS = ["studio", "solutions", "contactPage", "portfolio"] as const;
export type ManagedPageKey = (typeof MANAGED_PAGE_KEYS)[number];

export class InvalidPageContentError extends Error {
  constructor() {
    super("O conteúdo desta página não passou pela validação.");
    this.name = "InvalidPageContentError";
  }
}

const pageDefaults: Record<ManagedPageKey, unknown> = {
  studio: defaultStudio,
  solutions: defaultSolutions,
  contactPage: defaultContact,
  portfolio: portfolioDefaults,
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isManagedPageKey(value: string | null): value is ManagedPageKey {
  return MANAGED_PAGE_KEYS.some((key) => key === value);
}

function validatePageContent(page: ManagedPageKey, content: unknown): unknown {
  if (!isObject(content)) throw new InvalidPageContentError();

  try {
    if (page === "studio" && validateStudio(content)) return content;
    if (page === "solutions" && validateSolutions(content)) return content;
    if (page === "contactPage" && validateContactPage(content)) return content;
    if (page === "portfolio") return parseContent(content);
  } catch {
    throw new InvalidPageContentError();
  }

  throw new InvalidPageContentError();
}

async function readDocument(): Promise<Record<string, unknown>> {
  const raw = await fs.readFile(path.join(homeDataDir(), "content.json"), "utf8");
  const document: unknown = JSON.parse(raw);
  if (!isObject(document)) throw new Error("O arquivo de conteúdo do site tem um formato inválido.");
  return document;
}

export async function readManagedPage(page: ManagedPageKey): Promise<unknown> {
  const document = await readDocument();
  const content = mergeContentDefaults(document[page], pageDefaults[page]);
  return validatePageContent(page, content);
}

export async function saveManagedPage(page: ManagedPageKey, value: unknown): Promise<unknown> {
  const content = mergeContentDefaults(value, pageDefaults[page]);
  const validated = validatePageContent(page, content);
  const document = await readDocument();
  await writeJson("content.json", { ...document, [page]: validated });
  return validated;
}
