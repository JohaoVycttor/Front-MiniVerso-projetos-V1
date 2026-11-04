import type { ReactNode } from "react";
import { LuCircleAlert, LuRefreshCw } from "react-icons/lu";
import { cx } from "@/lib/cx";
import { Button } from "./button";
import styles from "./state.module.css";

type EmptyStateProps = {
  icon: ReactNode;
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
};

/** Estado vazio com chamada para a próxima ação. */
export function EmptyState({ icon, title, description, actions, className }: EmptyStateProps) {
  return (
    <div className={cx(styles.state, className)}>
      <span className={styles.iconWrap} aria-hidden="true">
        {icon}
      </span>
      <p className={styles.title}>{title}</p>
      {description && <p className={styles.description}>{description}</p>}
      {actions && <div className={styles.actions}>{actions}</div>}
    </div>
  );
}

type ErrorStateProps = {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
};

/** Falha ao carregar, sempre com a opção de tentar de novo (RNF29, RNF43). */
export function ErrorState({ title = "Não foi possível carregar", message, onRetry, className }: ErrorStateProps) {
  return (
    <div className={cx(styles.state, styles.error, className)} role="alert">
      <span className={styles.iconWrap} aria-hidden="true">
        <LuCircleAlert />
      </span>
      <p className={styles.title}>{title}</p>
      <p className={styles.description}>{message}</p>
      {onRetry && (
        <div className={styles.actions}>
          <Button variant="secondary" icon={<LuRefreshCw aria-hidden="true" />} onClick={onRetry}>
            Tentar de novo
          </Button>
        </div>
      )}
    </div>
  );
}
