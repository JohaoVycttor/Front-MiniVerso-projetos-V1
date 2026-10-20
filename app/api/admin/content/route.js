import {editableContent} from "@/lib/editable-content";
import {parseContent as parsePortfolio} from "@/lib/portfolio-content";
import {validateContactPage} from "@/lib/contact-content";
import {validateSolutions} from "@/lib/solutions-content";
import {validateStudio} from "@/lib/studio-content";
import {validateHome,validateSite,homeContent,siteContent} from "@/lib/site-content";
import {revalidatePath} from "next/cache";
import {NextResponse} from "next/server";
import {cookies} from "next/headers";
import {tokenValid} from "@/lib/auth";
import {getContent,updateContent,upsertItem,deleteItem} from "@/lib/db";
async function allowed(){return tokenValid((await cookies()).get("miniverso_session")?.value)}
export async function GET(){if(!await allowed())return NextResponse.json({error:"Não autorizado"},{status:401});const data=await getContent();return NextResponse.json(editableContent(data))}
export async function POST(request){
 if(!await allowed())return NextResponse.json({error:"Não autorizado"},{status:401});
 try{const {type,item}=await request.json();if(!["services","projects"].includes(type)||!item||typeof item.title!=="string"||!item.title.trim()||typeof item.description!=="string"||item.title.length>200||item.description.length>10000)return NextResponse.json({error:"Dados inválidos"},{status:400});const result=await upsertItem(type,item);revalidatePath("/");return NextResponse.json(result)}catch(error){if(error.code==="CONTENT_CONFLICT")return NextResponse.json({error:"O conte\u00fado foi alterado por outra sess\u00e3o. Recarregue antes de salvar."},{status:409});return NextResponse.json({error:"Não foi possível salvar"},{status:400})}
}
export async function DELETE(request){if(!await allowed())return NextResponse.json({error:"Não autorizado"},{status:401});const {searchParams}=new URL(request.url);const type=searchParams.get("type"),id=searchParams.get("id");if(!["services","projects"].includes(type)||!id)return NextResponse.json({error:"Dados inválidos"},{status:400});await deleteItem(type,id);revalidatePath("/");return NextResponse.json({ok:true})}
export async function PUT(request){
 if(!await allowed())return NextResponse.json({error:"Não autorizado"},{status:401});
 try{
 const raw=await request.text();if(raw.length>250000)return NextResponse.json({error:"Conteúdo muito grande"},{status:413});
 const {type,content}=JSON.parse(raw);
 const validators={home:validateHome,site:validateSite,studio:validateStudio,solutions:validateSolutions,contactPage:validateContactPage};
 if(type==="portfolio"){const validated=parsePortfolio(content);await updateContent(data=>{data.portfolio=validated});revalidatePath("/projetos","layout");return NextResponse.json({ok:true})}
 if(!Object.hasOwn(validators,type)||!validators[type](content))return NextResponse.json({error:"Conteúdo inválido. Confira os links, cores, identificadores e limites dos campos."},{status:400});
 await updateContent(data=>{data[type]=type==="site"?siteContent({site:content}):content});
 if(type==="site")revalidatePath("/","layout");else revalidatePath({home:"/",studio:"/sobre",solutions:"/servicos",contactPage:"/contato"}[type]);
 return NextResponse.json({ok:true});
 }catch(error){if(error.code==="CONTENT_CONFLICT")return NextResponse.json({error:"Conte\u00fado alterado em outra sess\u00e3o. Recarregue antes de salvar."},{status:409});return NextResponse.json({error:"Não foi possível salvar. Confira os campos e tente novamente."},{status:400})}
}
