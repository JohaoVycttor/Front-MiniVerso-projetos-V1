import {NextResponse} from 'next/server';
import {addContact,getContent} from '@/lib/db';
import {defaultContact} from '@/lib/contact-content';
export async function POST(request){
 try{
  const raw=await request.text();if(raw.length>16000)return NextResponse.json({error:'Mensagem muito grande'},{status:413});
  const body=JSON.parse(raw);const clean={};
  for(const [key,max] of Object.entries({name:150,email:254,phone:150,company:150,subject:150,preference:20,message:2000})){
   if(body[key]!==undefined&&typeof body[key]!=='string')return NextResponse.json({error:'Dados inválidos'},{status:400});
   clean[key]=(body[key]||'').trim();if(clean[key].length>max)return NextResponse.json({error:'Campo muito longo'},{status:400});
  }
  if(!clean.name||!clean.message||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean.email)||body.consent!==true||!['email','whatsapp','phone'].includes(clean.preference)||(clean.preference!=='email'&&clean.phone.replace(/\D/g,'').length<10))return NextResponse.json({error:'Confira os campos obrigatórios e a autorização de contato.'},{status:400});
  const content=await getContent();const subjects=(content.contactPage||defaultContact).sections.filter(s=>s.enabled&&s.type==='contact').flatMap(s=>s.subjects);
  if(!subjects.includes(clean.subject))return NextResponse.json({error:'Selecione um serviço válido.'},{status:400});
  const protocol=`MV-${crypto.randomUUID().slice(0,8).toUpperCase()}`;
  await addContact({...clean,consent:true,protocol});return NextResponse.json({ok:true,protocol},{status:201});
 }catch(error){if(error instanceof SyntaxError)return NextResponse.json({error:'Dados inválidos'},{status:400});return NextResponse.json({error:'Não foi possível registrar a mensagem.'},{status:500})}
}
