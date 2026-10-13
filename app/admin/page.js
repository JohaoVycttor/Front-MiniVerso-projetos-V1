import { cookies } from "next/headers";
import { tokenValid } from "@/lib/auth";
import AdminApp from "./AdminApp";
export const metadata={title:"Painel administrativo"};
export default async function AdminPage(){const logged=tokenValid((await cookies()).get("miniverso_session")?.value);return <AdminApp initialLogged={logged}/>}
