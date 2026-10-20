import { parseContent as parsePortfolio } from "@/lib/portfolio-content";
import { validateContactPage } from "@/lib/contact-content";
import { validateSolutions } from "@/lib/solutions-content";
import { revalidatePath } from "next/cache";
import { validateStudio } from "@/lib/studio-content";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { tokenValid } from "@/lib/auth";
import { getContent,saveContent,upsertItem,deleteItem } from "@/lib/db";
async function allowed(){return tokenValid((await cookies()).get("miniverso_session")?.value)}
export async function GET(){if(!await allowed())return NextResponse.json({error:"Não autorizado"},{status:401});return NextResponse.json(await getContent())}
export async function POST(request){if(!await allowed())return NextResponse.json({error:"Não autorizado"},{status:401});const {type,item}=await request.json();if(!["services","projects"].includes(type))return NextResponse.json({error:"Tipo inválido"},{status:400});return NextResponse.json(await upsertItem(type,item))}
export async function DELETE(request){if(!await allowed())return NextResponse.json({error:"Não autorizado"},{status:401});const {searchParams}=new URL(request.url);const type=searchParams.get("type"),id=searchParams.get("id");if(!["services","projects"].includes(type)||!id)return NextResponse.json({error:"Dados inválidos"},{status:400});await deleteItem(type,id);return NextResponse.json({ok:true})}

export async function PUT(request){
 if(!await allowed())return NextResponse.json({error:"Não autorizado"},{status:401});
 try{
  const raw=await request.text();
  if(raw.length>250000)return NextResponse.json({error:"Conteúdo muito grande"},{status:413});
  const {type,content}=JSON.parse(raw);
  if(type==="portfolio"){const validated=parsePortfolio(content);const data=await getContent();data.portfolio=validated;await saveContent(data);revalidatePath("/projetos","layout");return NextResponse.json({ok:true})}
  if(!["studio","solutions","contactPage"].includes(type)||!(type==="contactPage"?validateContactPage(content):type==="studio"?validateStudio(content):validateSolutions(content)))return NextResponse.json({error:"Conteúdo inválido"},{status:400});
  const data=await getContent();data[type]=content;await saveContent(data);
  revalidatePath(type==='contactPage'?'/contato':type==='studio'?'/sobre':'/servicos');return NextResponse.json({ok:true});
 }catch{return NextResponse.json({error:"Não foi possível salvar"},{status:400})}
}
