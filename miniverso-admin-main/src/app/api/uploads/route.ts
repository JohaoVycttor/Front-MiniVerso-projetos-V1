import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { homeAccess } from "@/lib/server/home-access";
import { homeDataDir } from "@/lib/server/home-storage";
import {remoteContent,contentBackend} from "@/lib/server/content-backend";
import {readSessionToken} from "@/lib/server/session";
import {getServerConfig} from "@/lib/server/config";
export async function POST(request: Request) {
  const denied = await homeAccess(request); if (denied) return denied;
  const maximum = 51*1024*1024;
  const reader = request.body?.getReader();
  if (!reader) return Response.json({message:"Escolha um arquivo."}, {status:400});
  const chunks: Uint8Array[] = []; let size = 0;
  while (true) { const part = await reader.read(); if (part.done) break; size += part.value.length;
    if (size > maximum) { await reader.cancel(); return Response.json({message:"Arquivo maior que 50 MB."}, {status:413}); }
    chunks.push(part.value);
  }
  try {
    const form = await new Response(Buffer.concat(chunks), {headers:{"Content-Type":request.headers.get("content-type") || ""}}).formData();
    const file = form.get("file");
    if (!(file instanceof File)) return Response.json({message:"Escolha um arquivo."}, {status:400});
    const bytes = Buffer.from(await file.arrayBuffer());
    const ext = file.name.split(".").pop()?.toLowerCase();
    const valid = ((ext === "jpg" || ext === "jpeg") && bytes.subarray(0,3).equals(Buffer.from([255,216,255]))) ||
      (ext === "png" && bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) ||
      (ext === "webp" && bytes.toString("ascii",0,4)==="RIFF" && bytes.toString("ascii",8,12)==="WEBP") ||
      (ext === "mp4" && bytes.toString("ascii",4,8)==="ftyp") ||
      (ext === "webm" && bytes.subarray(0,4).equals(Buffer.from([26,69,223,163]))) ||
      (ext === "glb" && bytes.toString("ascii",0,4)==="glTF");
    const limit = ext === "mp4" || ext === "webm" ? 50 : ext === "glb" ? 10 : 2;
    if (!valid || bytes.length > limit*1024*1024) return Response.json({message:"Formato ou tamanho de arquivo inválido."}, {status:422});
    if(remoteContent()){
      const response=await contentBackend("/uploads",readSessionToken(request),{method:"POST",body:form});
      if(!response.ok)return response;
      const result=await response.json();const url=result.url??result.data?.url;
      if(typeof url!=="string"||!url)return Response.json({message:"A API não retornou a URL do arquivo."},{status:502});
      const absolute=new URL(url,getServerConfig().apiUrl+"/");
      if(!["http:","https:"].includes(absolute.protocol))return Response.json({message:"URL de mídia inválida."},{status:502});
      return Response.json({url:absolute.href},{status:201});
    }
    const name = `${randomUUID()}.${ext}`;
    await fs.mkdir(path.join(homeDataDir(), "uploads"), {recursive:true});
    await fs.writeFile(path.join(homeDataDir(), "uploads", name), bytes, {flag:"wx"});
    return Response.json({url:`/api/media/${name}`}, {status:201});
  } catch { return Response.json({message:"Não foi possível enviar o arquivo."}, {status:400}); }
}
