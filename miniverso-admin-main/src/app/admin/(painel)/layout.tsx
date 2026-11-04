import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { AdminShell } from "@/components/layout/admin-shell";
import { ToastProvider } from "@/components/ui/toast";
import { publicConfig } from "@/lib/public-config";
import { LOGIN_PATH } from "@/lib/routes";
import { fetchCurrentUser } from "@/lib/server/auth";
import { SESSION_COOKIE } from "@/lib/session-cookie";

/**
 * Layout de todas as telas protegidas do painel.
 * Confere no back-end se o token ainda vale (RF12, RNF13) antes de mostrar qualquer conteúdo.
 */
export default async function PainelLayout({ children }: Readonly<{ children: ReactNode }>) {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) redirect(LOGIN_PATH);

  const session = await fetchCurrentUser(token);
  if (session.kind === "unauthenticated") redirect("/api/auth/session-expired");
  if (session.kind === "unavailable") throw new Error("O back-end não respondeu ao validar a sessão.");

  return (
    <ToastProvider>
      <AdminShell user={session.user} siteUrl={publicConfig.siteUrl} idleTimeoutMinutes={publicConfig.idleTimeoutMinutes}>
        {children}
      </AdminShell>
    </ToastProvider>
  );
}
