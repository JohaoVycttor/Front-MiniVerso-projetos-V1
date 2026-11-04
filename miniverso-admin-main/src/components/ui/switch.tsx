"use client";

import { cx } from "@/lib/cx";
import styles from "./switch.module.css";

type SwitchProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Nome lido pelo leitor de tela. Não muda com o estado: quem diz se está ligado é o próprio switch. */
  label: string;
  /** Mostra o nome ao lado do botão. */
  showLabel?: boolean;
  /** Texto visível que acompanha o estado (ex.: "Visível na página" ou "Oculta na página"). */
  stateText?: string;
  disabled?: boolean;
  /** Explica por que está bloqueado; aparece como dica. */
  disabledReason?: string;
};

/** Liga e desliga, com estado em texto para não depender só da cor (RNF39). */
export function Switch({ checked, onChange, label, showLabel, stateText, disabled, disabledReason }: SwitchProps) {
  const visibleText = stateText ?? (showLabel ? label : null);
  return (
    <span className={styles.wrapper} title={disabled ? disabledReason : undefined}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        aria-disabled={disabled || undefined}
        className={cx(styles.track, checked && styles.on, disabled && styles.disabled)}
        onClick={() => {
          if (!disabled) onChange(!checked);
        }}
      >
        <span className={styles.thumb} aria-hidden="true" />
      </button>
      {visibleText && (
        <span className={styles.text} aria-hidden="true">
          {visibleText}
        </span>
      )}
    </span>
  );
}
