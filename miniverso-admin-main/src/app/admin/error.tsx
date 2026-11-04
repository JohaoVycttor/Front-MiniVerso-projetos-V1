"use client";

import { LuCircleAlert, LuRefreshCw } from "react-icons/lu";
import { Button, ButtonLink } from "@/components/ui/button";
import { LOGIN_PATH } from "@/lib/routes";
import styles from "../status-page.module.css";

/** Falha ao abrir o painel (ex.: back-end fora do ar). Mensagem sem termos técnicos (RNF43). */
export default function AdminError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className={`${styles.page} ${styles.danger}`}>
      <div className={styles.card} role="alert">
        <span className={styles.icon} aria-hidden="true">
          <LuCircleAlert />
        </span>
        <h1 className={styles.title}>Não foi possível abrir o painel</h1>
        <p className={styles.text}>O servidor não respondeu. Verifique sua conexão e tente de novo em instantes.</p>
        <div className={styles.actions}>
          <Button icon={<LuRefreshCw aria-hidden="true" />} onClick={() => reset()}>
            Tentar de novo
          </Button>
          <ButtonLink href={LOGIN_PATH} variant="secondary">
            Ir para o login
          </ButtonLink>
        </div>
      </div>
    </main>
  );
}
