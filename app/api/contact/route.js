import {NextResponse} from "next/server";
import {addContact,getContent} from "@/lib/db";
import {defaultContact} from "@/lib/contact-content";
import {homeContent} from "@/lib/site-content";
export async function POST(request){
 try{
 const raw=await request.text();if(raw.length>32000)return NextResponse.json({error:"Mensagem muito grande"},{status:413});
 const body=JSON.parse(raw);if(!body||typeof body!=="object"||Array.isArray(body))return NextResponse.json({error:"Dados inválidos"},{status:400});const clean={};
 for(const [key,max] of Object.entries({name:150,email:254,phone:150,company:150,subject:150,preference:20,message:2000})){
 if(body[key]!==undefined&&typeof body[key]!=="string")return NextResponse.json({error:"Dados inválidos"},{status:400});
 clean[key]=(body[key]||"").trim();if(clean[key].length>max)return NextResponse.json({error:"Campo muito longo"},{status:400});
 }
 if(!clean.name||!clean.message||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean.email)||body.consent!==true||!["email","whatsapp","phone"].includes(clean.preference)||(clean.preference!=="email"&&clean.phone.replace(/\D/g,"").length<10))return NextResponse.json({error:"Confira os campos obrigatórios e a autorização de contato."},{status:400});
 const content=await getContent();const source=body.source||"contact";
 if(!["home","contact"].includes(source))return NextResponse.json({error:"Formulário inválido"},{status:400});
 const section=source==="home"?homeContent(content).sections.find(s=>s.enabled&&s.type==="contact"&&s.id===body.sectionId):(content.contactPage||defaultContact).sections.find(s=>s.enabled&&s.type==="contact"&&(!body.sectionId||s.id===body.sectionId));
 if(!section)return NextResponse.json({error:"Este formulário não está disponível. Atualize a página."},{status:400});
 if(!section.subjects.includes(clean.subject))return NextResponse.json({error:"Selecione um serviço válido."},{status:400});
 const definitions=section.extraFields||[];const extra=body.extra||{};
 if(!extra||typeof extra!=="object"||Array.isArray(extra)||Object.keys(extra).some(k=>!definitions.some(f=>f.id===k)))return NextResponse.json({error:"Campos adicionais inválidos"},{status:400});
 const customFields=[];
 for(const field of definitions){
 const value=extra[field.id]??"";
 if(typeof value!=="string"||value.length>2000||field.required&&!value.trim()||value&&field.type==="select"&&!field.options.includes(value)||value&&field.type==="email"&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)||value&&field.type==="number"&&!Number.isFinite(Number(value)))return NextResponse.json({error:"Confira o campo: "+field.label},{status:400});
 customFields.push({id:field.id,label:field.label,value:value.trim()});
 }
 const protocol="MV-"+crypto.randomUUID().slice(0,8).toUpperCase();
 await addContact({...clean,consent:true,protocol,source,sectionId:section.id,customFields});return NextResponse.json({ok:true,protocol},{status:201});
 }catch(error){if(error instanceof SyntaxError)return NextResponse.json({error:"Dados inválidos"},{status:400});return NextResponse.json({error:"Não foi possível registrar a mensagem."},{status:500})}
}
