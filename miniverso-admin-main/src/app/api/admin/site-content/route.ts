import { homeAccess } from "@/lib/server/home-access";
import { readHome, parseHome, writeJson } from "@/lib/server/home-storage";
export async function GET(request: Request) {
  const denied = await homeAccess(request); if (denied) return denied;
  return Response.json({data:await readHome()}, {headers:{"Cache-Control":"no-store"}});
}
export async function PUT(request: Request) {
  const denied = await homeAccess(request); if (denied) return denied;
  try {
    const raw = await request.text();
    if (raw.length > 2000000) return Response.json({message:"Conteúdo muito grande."}, {status:413});
    const content = parseHome(JSON.parse(raw));
    content.publishedAt = new Date().toISOString();
    await writeJson("home-content.json", content);
    return Response.json({data:content});
  } catch (error) { return Response.json({message:error instanceof Error ? error.message : "Não foi possível publicar."}, {status:422}); }
}
