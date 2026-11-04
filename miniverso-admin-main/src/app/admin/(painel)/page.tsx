import { redirect } from "next/navigation";
import { HOME_EDITOR_PATH } from "@/components/layout/nav";

/** /admin abre direto o editor da página inicial, único módulo do painel nesta versão. */
export default function PainelPage() {
  redirect(HOME_EDITOR_PATH);
}
