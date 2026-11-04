import type { Metadata } from "next";
import { LoginForm } from "@/features/auth/login-form";
import { parseLoginReason, safeRedirectTarget } from "@/lib/routes";

export const metadata: Metadata = { title: "Entrar" };

type LoginPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  return (
    <LoginForm reason={parseLoginReason(first(params.motivo))} redirectTo={safeRedirectTarget(first(params.redirect))} />
  );
}
