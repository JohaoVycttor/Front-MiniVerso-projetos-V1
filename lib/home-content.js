import { promises as fs } from "node:fs";
import path from "node:path";
export const homeDataDir = () => path.resolve(process.env.HOME_DATA_DIR || path.join(process.cwd(), "data"));
export async function getHomeContent() { return JSON.parse(await fs.readFile(path.join(homeDataDir(), "home-content.json"), "utf8")); }
export async function getHomePreview(token) {
  if (!/^[a-f0-9-]{36}$/.test(token)) return null;
  try { const preview = JSON.parse(await fs.readFile(path.join(homeDataDir(), "previews", `${token}.json`), "utf8")); return preview.expires > Date.now() ? preview.content : null; } catch { return null; }
}
