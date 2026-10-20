import {validateProjectDetail} from './project-detail';
import { getContent as getDatabaseContent } from "@/lib/db";
import mockContent from "@/data/portfolio-default.json";
/** Validate the JSON boundary before passing content to the presentation layer. */ export function parseContent(value) {
    const object = (input)=>!!input && typeof input === "object" && !Array.isArray(input);
    function matches(input, sample, path) {
        if (Array.isArray(sample)) {
            if (!Array.isArray(input)) throw new Error(`Invalid content: ${path} must be an array`);
            if (sample.length) input.forEach((item, index)=>matches(item, sample[0], `${path}[${index}]`));
        } else if (object(sample)) {
            if (!object(input)) throw new Error(`Invalid content: ${path} must be an object`);
            Object.entries(sample).forEach(([key, template])=>matches(input[key], template, `${path}.${key}`));
        } else if (typeof input !== typeof sample) {
            throw new Error(`Invalid content: ${path} must be ${typeof sample}`);
        }
    }
    if (!object(value) || value.schemaVersion !== 1) throw new Error("Unsupported content schema");
    const optionalUi=Object.fromEntries(["projectsLabel","watchPresentation","highlightsLabel","nextProject","projectContactTitle","projectContactAction"].map(key=>[key,mockContent.ui[key]]));
    value={...value,ui:{...optionalUi,...value.ui}};
    // Section variants have their own templates rather than inheriting the first item.
    const { sections, projects, ...common } = mockContent;
    matches(value, common, "page");
    if (!Array.isArray(value.sections) || !Array.isArray(value.projects)) throw new Error("Invalid section or project list");
    const validAsset = (asset)=>{
        if (!object(asset) || ![
            "image",
            "video"
        ].includes(String(asset.type)) || typeof asset.id !== "string" || typeof asset.alt !== "string") throw new Error("Invalid media asset");
        for (const key of [
            "src",
            "poster",
            "caption"
        ]){
            if (asset[key] !== undefined && typeof asset[key] !== "string") throw new Error(`Invalid media ${key}`);
        }
        for (const key of [
            "src",
            "poster"
        ]){
            const url = asset[key];
            if (typeof url === "string" && url !== "" && !(url.startsWith("/") && !url.startsWith("//")) && !/^https?:\/\//i.test(url)) throw new Error(`Invalid media URL: ${key}`);
        }
    };
    value.sections.forEach((section)=>{
        if (!object(section)) throw new Error("Invalid section");
        const template = sections.find((item)=>item.type === section.type);
        if (!template) throw new Error(`Unknown section type: ${section.type}`);
        matches(section, template, "section");
        if (!Number.isFinite(section.order)) throw new Error("Invalid section order");
        if (section.type === "projects" && ![
            2,
            3
        ].includes(Number(section.columns))) throw new Error("Invalid grid columns");
    });
    value.projects.forEach((project)=>{
        const { cover, presentation, gallery, story, detail, heading, year, background, highlights, ...template } = projects[0];
        matches(project, template, "project");
        if(!Array.isArray(project.story)||project.story.some(b=>!object(b)||typeof b.title!=="string"||typeof b.text!=="string"||(b.label!==undefined&&typeof b.label!=="string")))throw new Error("Invalid project story");
        if (!object(project) || !Array.isArray(project.gallery)) throw new Error("Invalid project gallery");
        if (project.detail !== undefined && !validateProjectDetail(project.detail)) throw new Error("Invalid project detail layout");
        if(project.heading!==undefined&&(!object(project.heading)||typeof project.heading.text!=='string'||typeof project.heading.accent!=='string'))throw new Error('Invalid project heading');
        if(project.year!==undefined&&typeof project.year!=='string')throw new Error('Invalid project year');
        if(project.background!==undefined&&(typeof project.background!=='string'||!(/^(\/(?![\/\\])|https?:\/\/)/.test(project.background))))throw new Error('Invalid project background');
        if(project.highlights!==undefined&&(!Array.isArray(project.highlights)||project.highlights.some(h=>!object(h)||!['shield','headset','chart'].includes(h.icon)||typeof h.title!=='string'||typeof h.text!=='string')))throw new Error('Invalid project highlights');
        validAsset(project.cover);
        validAsset(project.presentation);
        project.gallery.forEach(validAsset);
        if (!Number.isFinite(project.order)) throw new Error("Invalid project order");
    });
    if(value.projects.some(p=>[p.presentation,p.cover,...p.gallery].some(a=>a.duration!==undefined&&(!Number.isFinite(a.duration)||a.duration<0))))throw new Error('Invalid media duration');
    const content = value;
    function validHref(href) {
        return href.startsWith("/") && !href.startsWith("//") || /^https?:\/\//i.test(href) || /^mailto:[^\s]+$/i.test(href);
    }
    const links = [
        ...content.navigation,
        ...content.footer.socialLinks,
        ...content.footer.legalLinks
    ];
    if (links.some((link)=>typeof link.label !== "string" || typeof link.href !== "string" || !validHref(link.href))) throw new Error("Invalid navigation URL");
    if (![
        content.brand.logo,
        content.brand.background
    ].every((url)=>validHref(url) && !url.startsWith("mailto:"))) throw new Error("Invalid brand asset URL");
    if (content.projects.some((project)=>!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project.slug))) throw new Error("Invalid project slug");
    for (const list of [
        content.sections,
        content.projects,
        content.categories
    ]){
        if (new Set(list.map((item)=>item.id)).size !== list.length) throw new Error("Duplicate content IDs");
    }
    if (new Set(content.projects.map((project)=>project.slug)).size !== content.projects.length) throw new Error("Duplicate project slugs");
    const categories = new Set(content.categories.map((category)=>category.id));
    if (content.projects.some((project)=>project.categoryIds.some((id)=>!categories.has(id)))) throw new Error("Unknown project category");
    const ids = new Set(content.projects.map((project)=>project.id));
    if (content.sections.some((section)=>section.type === "featured" && !ids.has(section.projectId))) throw new Error("Unknown featured project");
    return content;
}
export async function getContent() {
    const data = await getDatabaseContent();
    return parseContent(data.portfolio || mockContent);
}
export function visibleSections(sections) {
    return sections.filter((section)=>section.visible).sort((a, b)=>a.order - b.order);
}
export function visibleProjects(projects, category) {
    return projects.filter((project)=>project.visible && (!category || project.categoryIds.includes(category))).sort((a, b)=>a.order - b.order);
}
