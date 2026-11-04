import { randomUUID } from "node:crypto";
import { homeAccess } from "@/lib/server/home-access";
import { parseHome, writeJson } from "@/lib/server/home-storage";
import { publicConfig } from "@/lib/public-config";
export async function POST(request: Request) {
  const denied = await homeAccess(request); if (denied) return denied;
  try {
    const raw = await request.text();
    if (raw.length > 2000000) return Response.json({message:"Conteúdo muito grande."}, {status:413});
    const content = parseHome(JSON.parse(raw));
    const token = randomUUID();
    await writeJson(`previews/${token}.json`, {content, expires:Date.now()+30*60*1000});
    return Response.json({url:new URL(`/preview/${token}`, publicConfig.siteUrl).href});
  } catch(error) { return Response.json({message:error instanceof Error ? error.message : "Prévia indisponível."}, {status:422}); }
}
