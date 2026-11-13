
import {getServerConfig} from './config';
export function remoteContent(){return (process.env.CONTENT_SOURCE||'').trim()==='local'?false:(process.env.CONTENT_SOURCE||'').trim()==='api'||getServerConfig().mode==='live';}
export async function contentBackend(path:string,token:string|null,options:{method?:string;body?:BodyInit;contentType?:string}={}){
 const config=getServerConfig();
 if(!config.apiUrl)return Response.json({message:'Configure API_URL para conectar o conteúdo ao back-end.'},{status:503});
 try{
  const headers=new Headers({Accept:'application/json'});
  if(token)headers.set('Authorization','Bearer '+token);
  if(options.contentType)headers.set('Content-Type',options.contentType);
  const response=await fetch(config.apiUrl+path,{method:options.method||'GET',headers,body:options.body,cache:'no-store',signal:AbortSignal.timeout(config.requestTimeoutMs)});
  if(response.status===204)return new Response(null,{status:204});
  const data=await response.json().catch(()=>null);
  if(!data||response.status>=500)return Response.json({message:'O back-end está indisponível. Tente novamente.'},{status:502});
  return Response.json(data,{status:response.status,headers:{'Cache-Control':'no-store'}});
 }catch{return Response.json({message:'Não foi possível conectar ao back-end. Suas alterações não foram publicadas.'},{status:503});}
}
export async function readLimited(request:Request,maximum=1500000){
 const reader=request.body?.getReader();if(!reader)throw new Error('Envie o conteúdo da requisição.');
 let size=0;const chunks:Uint8Array[]=[];
 while(true){const item=await reader.read();if(item.done)break;size+=item.value.byteLength;if(size>maximum){await reader.cancel();throw new RangeError('Conteúdo muito grande.');}chunks.push(item.value);}
 return Buffer.concat(chunks);
}
