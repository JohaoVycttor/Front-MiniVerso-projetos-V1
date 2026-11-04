import { fetchCurrentUser } from "./auth";
import { isSameOrigin } from "./request";
import { readSessionToken } from "./session";
export async function homeAccess(request: Request) {
  if (request.method !== "GET" && !isSameOrigin(request)) return Response.json({message:"Origem não autorizada."}, {status:403});
  const token = readSessionToken(request);
  if (!token) return Response.json({message:"Entre novamente no painel."}, {status:401});
  const session = await fetchCurrentUser(token);
  if (session.kind !== "ok") return Response.json({message:"Sessão indisponível."}, {status:session.kind === "unauthenticated" ? 401 : 503});
  return null;
}
