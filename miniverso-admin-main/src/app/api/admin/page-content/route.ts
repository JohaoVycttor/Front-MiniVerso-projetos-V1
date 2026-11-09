import { homeAccess } from "@/lib/server/home-access";
import { isManagedPageKey, InvalidPageContentError, readManagedPage, saveManagedPage } from "@/lib/server/page-content";

export async function GET(request: Request) {
  const denied = await homeAccess(request);
  if (denied) return denied;

  const page = new URL(request.url).searchParams.get("page");
  if (!isManagedPageKey(page)) return Response.json({ message: "Página inválida." }, { status: 400 });

  return Response.json({ data: await readManagedPage(page) }, { headers: { "Cache-Control": "no-store" } });
}

export async function PUT(request: Request) {
  const denied = await homeAccess(request);
  if (denied) return denied;

  const page = new URL(request.url).searchParams.get("page");
  if (!isManagedPageKey(page)) return Response.json({ message: "Página inválida." }, { status: 400 });

  const raw = await request.text();
  if (raw.length > 2_000_000) return Response.json({ message: "Conteúdo muito grande." }, { status: 413 });

  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    return Response.json({ message: "O conteúdo enviado não é um JSON válido." }, { status: 400 });
  }

  try {
    const data = await saveManagedPage(page, value);
    return Response.json({ data }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof InvalidPageContentError) {
      return Response.json({ message: error.message }, { status: 422 });
    }
    throw error;
  }
}
