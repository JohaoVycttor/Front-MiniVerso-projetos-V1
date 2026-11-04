"use client";

import { useEffect, useId, useRef, type ReactNode, type SyntheticEvent } from "react";
import { LuTrash2 } from "react-icons/lu";
import { Alert } from "./alert";
import { Button } from "./button";
import styles from "./confirm-dialog.module.css";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  /** Deve nomear o item e avisar que a ação é permanente (RNF42). */
  children: ReactNode;
  confirmLabel: string;
  pendingLabel: string;
  pending?: boolean;
  error?: string | null;
  onConfirm: () => void;
  onCancel: () => void;
};

/**
 * Confirmação de ação irreversível (RNF42).
 * Usa o <dialog> nativo: prende o foco dentro do modal e fecha com Esc.
 * O foco começa em "Cancelar", a opção segura.
 */
export function ConfirmDialog({
  open,
  title,
  children,
  confirmLabel,
  pendingLabel,
  pending = false,
  error,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      cancelRef.current?.focus();
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={(event: SyntheticEvent<HTMLDialogElement>) => {
        // Esc: fecha pelo nosso fluxo, para não fechar no meio de uma exclusão.
        event.preventDefault();
        if (!pending) onCancel();
      }}
    >
      <div className={styles.inner}>
        <span className={styles.icon} aria-hidden="true">
          <LuTrash2 />
        </span>
        <h2 id={titleId} className={styles.title}>
          {title}
        </h2>
        <div id={descriptionId} className={styles.description}>
          {children}
        </div>
        {error && <Alert tone="error">{error}</Alert>}
        <div className={styles.actions}>
          <Button ref={cancelRef} variant="secondary" onClick={onCancel} disabled={pending}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={onConfirm} loading={pending} loadingLabel={pendingLabel}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </dialog>
  );
}
