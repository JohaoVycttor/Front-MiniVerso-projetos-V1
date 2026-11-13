
import {NextResponse} from 'next/server';
import {getSiteContent} from '@/lib/site-content';
import {homeDataDir} from '@/lib/home-content';
import {saveLead} from '@/shared/leads.mjs';
import {contentApiConfig,publicApi,readLimitedBody} from '@/shared/content-client.mjs';
export async function POST(request){
 try{
  const body=JSON.parse(await readLimitedBody(request));
  if(!body||typeof body!=='object'||Array.isArray(body))return NextResponse.json({error:'Dados inválidos.'},{status:400});
  const clean={};
  for(const [key,max] of Object.entries({name:150,email:254,phone:150,company:150,subject:150,preference:20,message:2000})){
   if(body[key]!==undefined&&typeof body[key]!=='string')return NextResponse.json({error:'Dados inválidos.'},{status:400});
   clean[key]=(body[key]||'').trim();if(clean[key].length>max)return NextResponse.json({error:'Campo muito longo.'},{status:400});
  }
  if(!clean.name||!clean.message||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean.email)||body.consent!==true||!['email','whatsapp','phone'].includes(clean.preference)||(clean.preference!=='email'&&clean.phone.replace(/\D/g,'').length<10))return NextResponse.json({error:'Confira os campos obrigatórios e a autorização de contato.'},{status:400});
  const site=await getSiteContent();
  if(!site.contact.subjects.includes(clean.subject))return NextResponse.json({error:'Selecione um assunto válido.'},{status:400});
  if(contentApiConfig().remote){
   const result=await publicApi('/contacts',{method:'POST',body:JSON.stringify({...clean,consent:true})});
   if(typeof result.protocol!=='string'||!result.protocol)throw new Error('Protocolo ausente.');
   return NextResponse.json({ok:true,protocol:result.protocol},{status:201});
  }
  const protocol='MV-'+crypto.randomUUID().slice(0,8).toUpperCase();
  await saveLead(homeDataDir(),{...clean,consent:true,protocol});
  return NextResponse.json({ok:true,protocol},{status:201});
 }catch(error){
  const status=error instanceof RangeError?413:error instanceof SyntaxError?400:503;
  return NextResponse.json({error:status===413?'Mensagem muito grande.':status===400?'Dados inválidos.':'Não foi possível registrar a mensagem. Tente novamente.'},{status});
 }
}
