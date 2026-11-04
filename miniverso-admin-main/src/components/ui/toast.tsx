"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { LuCircleAlert, LuCircleCheck, LuX } from "react-icons/lu";
import { cx } from "@/lib/cx";
import styles from "./toast.module.css";

type ToastTone = "success" | "error";
type ToastItem = { id: number; tone: ToastTone; message: string };
type ToastContextValue = { showToast: (message: string, tone?: ToastTone) => void };

const ToastContext = createContext<ToastContextValue | null>(null);

const DURATION_MS = 5000;

/** Avisos rápidos depois de salvar ou excluir (RNF29). Anunciados por leitores de tela. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, tone: ToastTone = "success") => {
      nextId.current += 1;
      const id = nextId.current;
      setToasts((current) => [...current.slice(-2), { id, tone, message }]);
      window.setTimeout(() => dismiss(id), DURATION_MS);
    },
    [dismiss],
  );

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext value={value}>
      {children}
      <div className={styles.region} role="status" aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id} className={cx(styles.toast, styles[toast.tone])}>
            {toast.tone === "success" ? (
              <LuCircleCheck aria-hidden="true" className={styles.icon} />
            ) : (
              <LuCircleAlert aria-hidden="true" className={styles.icon} />
            )}
            <p className={styles.message}>{toast.message}</p>
            <button type="button" className={styles.close} aria-label="Fechar aviso" onClick={() => dismiss(toast.id)}>
              <LuX aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast precisa estar dentro de <ToastProvider>.");
  return context;
}
