import { redirect } from "next/navigation";
import { adminLoginUrl } from "@/lib/admin-url";
import Link from "next/link";
export const metadata={title:"Painel administrativo"};
export default function AdminPage(){if(adminLoginUrl!=="/admin")redirect(adminLoginUrl);return <section className="shell" style={{minHeight:"70vh",display:"grid",alignContent:"center",gap:"1.5rem",paddingBlock:"6rem"}}><p>Painel administrativo</p><h1>O painel ainda não está conectado.</h1><p>O site já pode ser explorado. O acesso à administração será disponibilizado após a publicação do painel.</p><Link href="/" className="button">Voltar ao site</Link></section>}
