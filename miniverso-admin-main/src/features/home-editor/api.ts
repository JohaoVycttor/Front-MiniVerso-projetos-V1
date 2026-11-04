/** Leitura e publicação do conteúdo da página inicial (RF15, RF18, RN02). */
import { ApiError } from "@/lib/api/errors";
import { adminRequest } from "@/lib/api/http";
import { unwrapData } from "@/lib/api/mappers";
import { SECTION_DEFS } from "./schema";
import type { SiteContent } from "./types";

function isSiteContent(value: unknown): value is SiteContent {
  if (typeof value !== "object" || value === null) return false;
  const sections = (value as { sections?: unknown }).sections;
  return Array.isArray(sections) && sections.length === SECTION_DEFS.length;
}

export async function getSiteContent(signal?: AbortSignal): Promise<SiteContent> {
  const payload = unwrapData(await adminRequest("/site-content", { signal }));
  if (!isSiteContent(payload)) throw new ApiError(500);
  return payload;
}

/** Publica tudo de uma vez: a página pública passa a mostrar o novo conteúdo (RF18, RNF44). */
export async function publishSiteContent(content: SiteContent): Promise<SiteContent> {
  const payload = unwrapData(await adminRequest("/site-content", { method: "PUT", body: { sections: content.sections } }));
  if (!isSiteContent(payload)) throw new ApiError(500);
  return payload;
}
