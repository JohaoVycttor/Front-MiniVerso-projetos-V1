import mockContent from "@/data/content.json";
import type { PageContent, PageSection, Project } from "@/types/content";

/** Validate the JSON boundary before passing content to the presentation layer. */
export function parseContent(value: unknown): PageContent {
  const object = (input: unknown): input is Record<string, unknown> => !!input && typeof input === "object" && !Array.isArray(input);
  function matches(input: unknown, sample: unknown, path: string): void {
    if (Array.isArray(sample)) {
      if (!Array.isArray(input)) throw new Error(`Invalid content: ${path} must be an array`);
      if (sample.length) input.forEach((item, index) => matches(item, sample[0], `${path}[${index}]`));
    } else if (object(sample)) {
      if (!object(input)) throw new Error(`Invalid content: ${path} must be an object`);
      Object.entries(sample).forEach(([key, template]) => matches(input[key], template, `${path}.${key}`));
    } else if (typeof input !== typeof sample) {
      throw new Error(`Invalid content: ${path} must be ${typeof sample}`);
    }
  }
  if (!object(value) || value.schemaVersion !== 1) throw new Error("Unsupported content schema");
  // Section variants have their own templates rather than inheriting the first item.
  const { sections, projects, ...common } = mockContent;
  matches(value, common, "page");
  if (!Array.isArray(value.sections) || !Array.isArray(value.projects)) throw new Error("Invalid section or project list");
  const validAsset = (asset: unknown) => {
    if (!object(asset) || !["image", "video"].includes(String(asset.type)) || typeof asset.id !== "string" || typeof asset.alt !== "string") throw new Error("Invalid media asset");
    for (const key of ["src", "poster", "caption"]) {
      if (asset[key] !== undefined && typeof asset[key] !== "string") throw new Error(`Invalid media ${key}`);
    }
    for (const key of ["src", "poster"]) {
      const url = asset[key];
      if (typeof url === "string" && !(url.startsWith("/") && !url.startsWith("//")) && !/^https?:\/\//i.test(url)) throw new Error(`Invalid media URL: ${key}`);
    }
    if (asset.duration !== undefined && !Number.isFinite(asset.duration)) throw new Error("Invalid media duration");
  };
  // Detail page extras are optional, so they stay out of the template and are checked here.
  const validStory = (block: unknown) => {
    if (!object(block) || typeof block.title !== "string" || typeof block.text !== "string" || (block.label !== undefined && typeof block.label !== "string")) throw new Error("Invalid project story");
  };
  const validHighlight = (item: unknown) => {
    if (!object(item) || !["shield", "headset", "chart"].includes(String(item.icon)) || typeof item.title !== "string" || typeof item.text !== "string") throw new Error("Invalid project highlight");
  };
  const validDetailExtras = (project: Record<string, unknown>) => {
    if (!Array.isArray(project.story)) throw new Error("Invalid project story");
    project.story.forEach(validStory);
    if (project.highlights !== undefined) {
      if (!Array.isArray(project.highlights)) throw new Error("Invalid project highlights");
      project.highlights.forEach(validHighlight);
    }
    const heading = project.heading;
    if (heading !== undefined && (!object(heading) || typeof heading.text !== "string" || typeof heading.accent !== "string")) throw new Error("Invalid project heading");
    for (const key of ["year", "background"]) {
      if (project[key] !== undefined && typeof project[key] !== "string") throw new Error(`Invalid project ${key}`);
    }
  };
  value.sections.forEach((section) => {
    if (!object(section)) throw new Error("Invalid section");
    const template = sections.find((item) => item.type === section.type);
    if (!template) throw new Error(`Unknown section type: ${section.type}`);
    matches(section, template, "section");
    if (!Number.isFinite(section.order)) throw new Error("Invalid section order");
    if (section.type === "projects" && ![2, 3].includes(Number(section.columns))) throw new Error("Invalid grid columns");
  });
  value.projects.forEach((project) => {
    const { cover, presentation, gallery, story, heading, year, background, highlights, ...template } = projects[0];
    matches(project, template, "project");
    if (!object(project) || !Array.isArray(project.gallery)) throw new Error("Invalid project gallery");
    validDetailExtras(project);
    validAsset(project.cover);
    validAsset(project.presentation);
    project.gallery.forEach(validAsset);
    if (!Number.isFinite(project.order)) throw new Error("Invalid project order");
  });
  const content = value as unknown as PageContent;
  function validHref(href: string) {
    return (href.startsWith("/") && !href.startsWith("//")) || /^https?:\/\//i.test(href) || /^mailto:[^\s]+$/i.test(href);
  }
  const links = [...content.navigation, ...content.footer.socialLinks, ...content.footer.legalLinks];
  if (links.some((link) => typeof link.label !== "string" || typeof link.href !== "string" || !validHref(link.href))) throw new Error("Invalid navigation URL");
  if (![content.brand.logo, content.brand.background].every((url) => validHref(url) && !url.startsWith("mailto:"))) throw new Error("Invalid brand asset URL");
  if (content.projects.some((project) => project.background !== undefined && (!validHref(project.background) || project.background.startsWith("mailto:")))) throw new Error("Invalid project background URL");
  if (content.projects.some((project) => !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project.slug))) throw new Error("Invalid project slug");
  for (const list of [content.sections, content.projects, content.categories]) {
    if (new Set(list.map((item) => item.id)).size !== list.length) throw new Error("Duplicate content IDs");
  }
  if (new Set(content.projects.map((project) => project.slug)).size !== content.projects.length) throw new Error("Duplicate project slugs");
  const categories = new Set(content.categories.map((category) => category.id));
  if (content.projects.some((project) => project.categoryIds.some((id) => !categories.has(id)))) throw new Error("Unknown project category");
  const ids = new Set(content.projects.map((project) => project.id));
  if (content.sections.some((section) => section.type === "featured" && !ids.has(section.projectId))) throw new Error("Unknown featured project");
  return content;
}

export async function getContent(): Promise<PageContent> {
  const endpoint = process.env.CONTENT_API_URL;
  if (!endpoint) return parseContent(mockContent);
  const response = await fetch(endpoint, { cache: "no-store", signal: AbortSignal.timeout(10000) });
  if (!response.ok) throw new Error(`Content API failed (${response.status})`);
  return parseContent(await response.json());
}

export function visibleSections(sections: PageSection[]) {
  return sections.filter((section) => section.visible).sort((a, b) => a.order - b.order);
}

export function visibleProjects(projects: Project[], category?: string) {
  return projects.filter((project) => project.visible && (!category || project.categoryIds.includes(category))).sort((a, b) => a.order - b.order);
}
