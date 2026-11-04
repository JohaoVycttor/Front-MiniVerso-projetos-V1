import { promises as fs } from "node:fs";
import path from "node:path";
import { homeDataDir } from "@/lib/home-content";
export async function GET(request, {params}) {
  const {name} = await params;
  if (!/^[a-f0-9-]{36}\.(png|jpe?g|webp|mp4|webm|glb)$/.test(name)) return new Response(null,{status:404});
  try {
    const bytes = await fs.readFile(path.join(homeDataDir(),"uploads",name));
    const mime = {png:"image/png",jpg:"image/jpeg",jpeg:"image/jpeg",webp:"image/webp",mp4:"video/mp4",webm:"video/webm",glb:"model/gltf-binary"}[name.split('.').pop()];
    const headers = {"Content-Type":mime,"X-Content-Type-Options":"nosniff","Cache-Control":"public, max-age=31536000, immutable","Accept-Ranges":"bytes"};
    const range = request.headers.get("range");
    if (range) {
      const match = /^bytes=(\d+)-(\d*)$/.exec(range);
      const start = match ? Number(match[1]) : -1;
      const end = match?.[2] ? Math.min(Number(match[2]),bytes.length-1) : bytes.length-1;
      if (start < 0 || start > end || start >= bytes.length) return new Response(null,{status:416,headers:{"Content-Range":`bytes */${bytes.length}`}});
      return new Response(bytes.subarray(start,end+1),{status:206,headers:{...headers,"Content-Range":`bytes ${start}-${end}/${bytes.length}`,"Content-Length":String(end-start+1)}});
    }
    return new Response(bytes,{headers:{...headers,"Content-Length":String(bytes.length)}});
  } catch { return new Response(null,{status:404}); }
}
