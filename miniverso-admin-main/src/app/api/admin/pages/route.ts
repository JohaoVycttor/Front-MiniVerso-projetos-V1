
import {homeAccess} from '@/lib/server/home-access';
import {readSessionToken} from '@/lib/server/session';
import {readSite,publishSite,SiteConflictError} from '@/lib/server/site-storage';
import {remoteContent,contentBackend,readLimited} from '@/lib/server/content-backend';
import {validateSiteDocument} from '@/features/site-editor/schema';
export const dynamic='force-dynamic';
export async function GET(request:Request){
 const denied=await homeAccess(request);if(denied)return denied;
 if(remoteContent())return contentBackend('/site-content',readSessionToken(request));
 try{return Response.json({data:await readSite()},{headers:{'Cache-Control':'no-store'}});}
 catch{return Response.json({message:'Não foi possível carregar o conteúdo do site.'},{status:500});}
}
export async function PUT(request:Request){
 const denied=await homeAccess(request);if(denied)return denied;
 try{
  const content=validateSiteDocument(JSON.parse((await readLimited(request)).toString('utf8')));
  if(remoteContent())return contentBackend('/site-content',readSessionToken(request),{method:'PUT',body:JSON.stringify(content),contentType:'application/json'});
  return Response.json({data:await publishSite(content)},{headers:{'Cache-Control':'no-store'}});
 }catch(error){return Response.json({message:error instanceof Error?error.message:'Não foi possível publicar.'},{status:error instanceof SiteConflictError?409:error instanceof SyntaxError?400:error instanceof RangeError?413:422});}
}
