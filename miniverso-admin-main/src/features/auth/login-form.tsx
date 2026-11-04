"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { PasswordField, TextField } from "@/components/ui/field";
import type { LoginReason } from "@/lib/routes";
import { requestLogin } from "./api";
import styles from "./login.module.css";

type LoginFormProps = {
  /** Motivo de ter caído no login (sessão expirada, inatividade ou saída). */
  reason: LoginReason | null;
  /** Página do painel para onde voltar depois de entrar. Já validada no servidor. */
  redirectTo: string;
};

type FieldErrors = { login?: string; password?: string };

const REASON_MESSAGES: Record<LoginReason, { tone: "info" | "success"; text: string }> = {
  expirada: { tone: "info", text: "Sua sessão expirou. Entre novamente para continuar." },
  inatividade: { tone: "info", text: "Sua sessão foi encerrada depois de um tempo sem uso. Entre novamente." },
  saiu: { tone: "success", text: "Você saiu do painel com segurança." },
};

function formatCountdown(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

/** Tela de login (RF11, RNF10, RNF15, RNF16, RNF30, RNF32). */
export function LoginForm({ reason, redirectTo }: LoginFormProps) {
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [lockSeconds, setLockSeconds] = useState(0);
  const [lockEnded, setLockEnded] = useState(false);
  const loginRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  // Contagem regressiva do bloqueio temporário (RNF15).
  useEffect(() => {
    if (lockSeconds <= 0) return;
    const timer = window.setTimeout(() => {
      const next = lockSeconds - 1;
      setLockSeconds(next);
      if (next === 0) {
        // Fim do bloqueio: o aviso de bloqueio sai e a tela diz que já dá para tentar de novo.
        setFormError(null);
        setLockEnded(true);
      }
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [lockSeconds]);

  const locked = lockSeconds > 0;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending || locked) return;

    const errors: FieldErrors = {};
    if (!login.trim()) errors.login = "Informe seu e-mail.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(login.trim())) errors.login = "Digite um e-mail válido, como nome@empresa.com.";
    if (!password) errors.password = "Informe sua senha.";
    setFieldErrors(errors);
    setFormError(null);
    setLockEnded(false);
    if (errors.login || errors.password) {
      // Leva o foco ao primeiro campo com problema (RNF30).
      (errors.login ? loginRef : passwordRef).current?.focus();
      return;
    }

    setPending(true);
    const result = await requestLogin(login.trim(), password);

    if (result.ok) {
      // O botão continua em "Entrando..." até o painel abrir.
      router.replace(redirectTo);
      return;
    }

    setPending(false);
    setFormError(result.message);
    if (result.kind === "locked") {
      setLockSeconds(result.retryAfterSeconds);
    }
    if (result.kind === "invalid") {
      // Mantém o e-mail e limpa só a senha. Em falha de conexão, os dois ficam (RNF31).
      setPassword("");
      passwordRef.current?.focus();
    }
  }

  const reasonMessage = reason ? REASON_MESSAGES[reason] : null;

  return (
    <div className={styles.page}>
      <aside className={styles.aside}>
        <div className={styles.brand}>
          {/* Logo oficial exportado do Figma (versão branca, para fundo escuro) */}
          {/* eslint-disable-next-line @next/next/no-img-element -- SVG estático, sem otimização */}
          <img src="/brand/logo-branca-horizontal.svg" alt="Miniverso" className={styles.brandLogo} width={180} height={30} />
          <span className={styles.brandSub}>Painel administrativo</span>
        </div>
        <div className={styles.asideBody}>
          <p className={styles.asideTitle}>A página inicial do site, editável num só lugar.</p>
          <p className={styles.asideText}>
            Organize as seções da página inicial, atualize textos, imagens, serviços e projetos e acompanhe os contatos recebidos pelo site.
          </p>
        </div>
        <span className={styles.asideFooter}>Acesso restrito à equipe da Miniverso</span>
      </aside>

      <main className={styles.main}>
        <div className={styles.card}>
          <div className={styles.mobileBrand}>
            <span className={styles.mobileBrandName}>Miniverso</span>
            <span className={styles.mobileBrandSub}>Painel administrativo</span>
          </div>

          <div className={styles.heading}>
            <h1 className={styles.title}>Entrar no painel</h1>
            <p className={styles.subtitle}>Use o e-mail e a senha de administrador.</p>
          </div>

          {reasonMessage && !formError && !lockEnded && <Alert tone={reasonMessage.tone}>{reasonMessage.text}</Alert>}

          {lockEnded && !formError && <Alert tone="info">O bloqueio terminou. Você já pode tentar entrar de novo.</Alert>}

          {formError && (
            <Alert tone={locked ? "warning" : "error"} title={locked ? "Acesso bloqueado temporariamente" : undefined}>
              {formError}
              {locked && (
                <>
                  {" "}
                  {/* A contagem muda a cada segundo: fica fora do leitor de tela para não ser anunciada sem parar */}
                  <span aria-hidden="true">
                    Tente de novo em <strong>{formatCountdown(lockSeconds)}</strong>.
                  </span>
                </>
              )}
            </Alert>
          )}

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <p className={styles.legend}>
              Campos com <span aria-hidden="true">*</span>
              <span className="sr-only">asterisco</span> são obrigatórios.
            </p>
            <TextField
              ref={loginRef}
              label="E-mail"
              name="login"
              type="email"
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              required
              value={login}
              onChange={(event) => setLogin(event.target.value)}
              error={fieldErrors.login}
            />
            <PasswordField
              ref={passwordRef}
              label="Senha"
              name="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              error={fieldErrors.password}
            />
            <Button type="submit" fullWidth loading={pending} loadingLabel="Entrando..." disabled={locked}>
              Entrar
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
