import assert from "node:assert/strict";
import { test } from "node:test";
import mock from "../src/data/content.json";
import { getContent, parseContent, visibleProjects, visibleSections } from "../src/lib/content";

test("the centralized mock satisfies the API contract", () => {
  assert.equal(parseContent(mock).schemaVersion, 1);
  assert.equal(parseContent(mock).projects.length, 6);
});
test("sections respect visibility and editorial order without mutating the source", () => {
  const content = parseContent(structuredClone(mock));
  content.sections[0].visible = false;
  content.sections[3].order = -1;
  const result = visibleSections(content.sections);
  assert.equal(result[0].type, "contact");
  assert.equal(result.length, 3);
  assert.equal(content.sections[0].type, "hero");
});
test("category filters exclude unpublished projects and honor card order", () => {
  const content = parseContent(structuredClone(mock));
  content.projects[0].visible = false;
  content.projects[4].order = -1;
  const result = visibleProjects(content.projects, "education");
  assert.equal(result[0].id, "book");
  assert.equal(result.length, 3);
  assert.ok(result.every((project) => project.id !== "chemistry"));
  assert.deepEqual(visibleProjects(content.projects, "missing"), []);
});
test("media URLs and captions from an API are accepted", () => {
  const value = structuredClone(mock) as unknown as Record<string, any>;
  value.projects[0].cover.src = "https://cdn.example.com/cover.webp";
  value.projects[0].presentation.src = "/videos/demo.mp4";
  value.projects[0].gallery[0].caption = "Uma nova legenda";
  assert.equal(parseContent(value).projects[0].cover.src, "https://cdn.example.com/cover.webp");
});
test("unknown schemas, sections and grid configurations fail at the API boundary", () => {
  for (const mutate of [
    (v: any) => { v.schemaVersion = 2; },
    (v: any) => { v.sections[0].type = "unknown"; },
    (v: any) => { v.sections[2].columns = 8; },
    (v: any) => { v.sections[0].order = Infinity; },
  ]) {
    const value = structuredClone(mock); mutate(value);
    assert.throws(() => parseContent(value));
  }
});
test("inconsistent references and duplicate IDs are rejected", () => {
  for (const mutate of [
    (v: any) => { v.projects[1].id = v.projects[0].id; },
    (v: any) => { v.projects[1].slug = v.projects[0].slug; },
    (v: any) => { v.projects[0].categoryIds = ["missing"]; },
    (v: any) => { v.sections[1].projectId = "missing"; },
  ]) {
    const value = structuredClone(mock); mutate(value);
    assert.throws(() => parseContent(value));
  }
});
test("unsafe link and media protocols are rejected", () => {
  const navigation = structuredClone(mock);
  navigation.navigation[0].href = "javascript:alert(1)";
  assert.throws(() => parseContent(navigation));
  const media = structuredClone(mock) as any;
  media.projects[0].cover.src = "javascript:alert(1)";
  assert.throws(() => parseContent(media));
});

test("the API adapter uses server-side configuration and rejects failed responses", async () => {
  const priorEndpoint = process.env.CONTENT_API_URL;
  const priorFetch = globalThis.fetch;
  try {
    process.env.CONTENT_API_URL = "https://api.example.com/content";
    globalThis.fetch = async (input, options) => {
      assert.equal(input, process.env.CONTENT_API_URL);
      assert.equal(options?.cache, "no-store");
      const content = parseContent(structuredClone(mock));
      const hero = content.sections.find((section) => section.type === "hero");
      assert.ok(hero);
      hero.heading.text = "CONTEÚDO DA API";
      return Response.json(content);
    };
    const content = await getContent();
    const hero = content.sections.find((section) => section.type === "hero");
    assert.equal(hero?.heading.text, "CONTEÚDO DA API");
    assert.equal(content.metadata.title, mock.metadata.title);
    globalThis.fetch = async () => new Response(null, { status: 503 });
    await assert.rejects(getContent, /Content API failed \(503\)/);
    globalThis.fetch = async () => Response.json({ schemaVersion: 2 });
    await assert.rejects(getContent, /Unsupported content schema/);
  } finally {
    globalThis.fetch = priorFetch;
    if (priorEndpoint === undefined) delete process.env.CONTENT_API_URL;
    else process.env.CONTENT_API_URL = priorEndpoint;
  }
});
