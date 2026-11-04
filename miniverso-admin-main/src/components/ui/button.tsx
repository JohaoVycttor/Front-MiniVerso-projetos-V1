"use client";

import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ComponentProps, MouseEvent, ReactNode } from "react";
import { LuLoaderCircle } from "react-icons/lu";
import { cx } from "@/lib/cx";
import styles from "./button.module.css";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "danger-ghost";
type ButtonSize = "md" | "sm";

type Appearance = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  fullWidth?: boolean;
};

function classes({ variant = "primary", size = "md", fullWidth }: Appearance, className?: string) {
  return cx(styles.button, styles[variant], styles[size], fullWidth && styles.full, className);
}

// ComponentProps<"button"> inclui a prop `ref` (no React 19, ref é uma prop comum).
export type ButtonProps = ComponentProps<"button"> &
  Appearance & {
    /** Mostra o indicador de carregamento e ignora novos cliques (RNF08). */
    loading?: boolean;
    /** Texto exibido durante o carregamento. Ex.: "Salvando..." */
    loadingLabel?: string;
  };

export function Button({
  variant,
  size,
  icon,
  fullWidth,
  loading = false,
  loadingLabel,
  className,
  children,
  type = "button",
  onClick,
  ...rest
}: ButtonProps) {
  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    if (loading) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  }

  return (
    <button
      type={type}
      className={classes({ variant, size, fullWidth }, className)}
      aria-busy={loading || undefined}
      aria-disabled={loading || undefined}
      onClick={handleClick}
      {...rest}
    >
      {loading ? <LuLoaderCircle aria-hidden="true" className={styles.spinner} /> : icon}
      {children !== undefined && <span>{loading && loadingLabel ? loadingLabel : children}</span>}
    </button>
  );
}

type ButtonLinkProps = Appearance &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    href: string;
    /** Abre em nova aba e avisa leitores de tela. */
    external?: boolean;
    children: ReactNode;
  };

export function ButtonLink({ href, external, variant, size, icon, fullWidth, className, children, ...rest }: ButtonLinkProps) {
  const classNames = classes({ variant, size, fullWidth }, className);
  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={classNames} {...rest}>
        {icon}
        <span>{children}</span>
        <span className="sr-only"> (abre em nova aba)</span>
      </a>
    );
  }
  // mailto:, tel: e outros endereços fora do painel usam <a> comum.
  if (!href.startsWith("/") || href.startsWith("//")) {
    return (
      <a href={href} className={classNames} {...rest}>
        {icon}
        <span>{children}</span>
      </a>
    );
  }
  return (
    <Link href={href} className={classNames} {...rest}>
      {icon}
      <span>{children}</span>
    </Link>
  );
}

type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  /** Nome lido pelo leitor de tela, já que o botão só tem ícone. */
  label: string;
  icon: ReactNode;
  variant?: "ghost" | "danger-ghost";
};

export function IconButton({ label, icon, variant = "ghost", className, type = "button", ...rest }: IconButtonProps) {
  return (
    <button type={type} aria-label={label} title={label} className={cx(styles.iconButton, styles[variant], className)} {...rest}>
      {icon}
    </button>
  );
}
