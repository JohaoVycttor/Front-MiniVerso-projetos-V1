import { notFound } from "next/navigation";
import { getHomePreview } from "@/lib/home-content";
import HomePage from "@/app/components/HomePage";
export const dynamic = "force-dynamic";
export const metadata = {title:"Prévia não publicada",robots:{index:false,follow:false}};
export default async function Preview({params}) {
  const {token}=await params; const content=await getHomePreview(token);
  if(!content) notFound();
  return <><p style={{position:"fixed",bottom:0,left:0,zIndex:50,padding:"8px 16px",background:"#12234b",color:"white",margin:0}}>Prévia do rascunho · não publicada · válida por 30 minutos</p><HomePage content={content} preview/></>;
}
