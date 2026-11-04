"use client";

import { useEffect, useId, useRef, type FormEvent, type ReactNode, type SyntheticEvent } from "react";
import { LuX } from "react-icons/lu";
import { cx } from "@/lib/cx";
import { Button } from "./button";
import styles from "./form-dialog.module.css";

type FormDialogProps = {
  open: boolean;
  title: string;
  /** Códigos de requisito exibidos no topo, como no Figma. */
  reqs?: string;
  /** "drawer" abre como painel lateral (formulários longos). */
  variant?: "modal" | "drawer";
  submitLabel: string;
  onSubmit: () => void;
  onCancel: () => void;
  children: ReactNode;
};

/** Formulário em modal ou painel lateral, com Esc e foco presos no diálogo. */
export function FormDialog({ open, title, reqs, variant = "modal", submitLabel, onSubmit, onCancel, children }: FormDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <dialog
      ref={ref}
      className={cx(styles.dialog, variant === "drawer" && styles.drawer)}
      aria-labelledby={titleId}
      onCancel={(event: SyntheticEvent<HTMLDialogElement>) => {
        event.preventDefault();
        onCancel();
      }}
    >
      {open && (
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.header}>
            <div className={styles.heading}>
              {reqs && <span className={styles.reqs}>{reqs}</span>}
              <h2 id={titleId} className={styles.title}>
                {title}
              </h2>
            </div>
            <button type="button" className={styles.close} aria-label="Fechar" onClick={onCancel}>
              <LuX aria-hidden="true" />
            </button>
          </div>
          <div className={styles.body}>{children}</div>
          <div className={styles.actions}>
            <Button variant="secondary" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit">{submitLabel}</Button>
          </div>
        </form>
      )}
    </dialog>
  );
}
