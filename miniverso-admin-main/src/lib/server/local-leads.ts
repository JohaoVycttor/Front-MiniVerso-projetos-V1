
import {homeDataDir} from './home-storage';
import {readLeads,removeLead} from '../../../../shared/leads.mjs';
export async function localLeads(request:Request,segments:string[]){
 const id=segments[1];if(segments.length>2)return Response.json({message:'Mensagem não encontrada.'},{status:404});
 if(request.method==='DELETE'&&id){return await removeLead(homeDataDir(),id)?new Response(null,{status:204}):Response.json({message:'Mensagem não encontrada.'},{status:404});}
 if(request.method!=='GET')return Response.json({message:'Método não permitido.'},{status:405});
 const records=await readLeads(homeDataDir()) as Record<string,unknown>[];
 if(id){const record=records.find(lead=>lead.id===id);return record?Response.json({data:record}):Response.json({message:'Mensagem não encontrada.'},{status:404});}
 const query=new URL(request.url).searchParams,search=(query.get('search')||'').toLocaleLowerCase('pt-BR'),service=query.get('service_id')||'';
 const filtered=records.filter(lead=>[lead.name,lead.email,lead.company].join(' ').toLocaleLowerCase('pt-BR').includes(search)&&(!service||(lead.service as {id:string})?.id===service)).sort((a,b)=>String(b.created_at).localeCompare(String(a.created_at))*(query.get('sort')==='created_at'?-1:1));
 const size=Math.max(1,Math.min(100,Number(query.get('per_page'))||10)),last=Math.max(1,Math.ceil(filtered.length/size)),page=Math.max(1,Math.min(last,Number(query.get('page'))||1));
 return Response.json({data:filtered.slice((page-1)*size,page*size),meta:{current_page:page,last_page:last,per_page:size,total:filtered.length}},{headers:{'Cache-Control':'no-store'}});
}
