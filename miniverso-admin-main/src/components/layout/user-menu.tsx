"use client";

import { useEffect, useRef, useState } from "react";
import { LuChevronDown, LuLogOut } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { requestLogout } from "@/features/auth/api";
import { getInitials } from "@/lib/format";
import { ADMIN_HOME, loginRedirectFor } from "@/lib/routes";
import type { User } from "@/types/models";
import styles from "./user-menu.module.css";

/** Menu da conta com a opção de sair (RF19). */
export function UserMenu({ user }: { user: User }) {
  const [open, setOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Fecha ao clicar fora ou apertar Esc.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  async function handleLogout() {
    setLeaving(true);
    await requestLogout();
    // Recarrega a página inteira para limpar qualquer dado que estava em memória.
    window.location.assign(loginRedirectFor(ADMIN_HOME, "saiu"));
  }

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <button
        ref={buttonRef}
        type="button"
        className={styles.button}
        aria-label={`Menu da conta de ${user.name}`}
        aria-expanded={open}
        aria-controls="menu-usuario"
        onClick={() => setOpen((current) => !current)}
      >
        <span className={styles.avatar} aria-hidden="true">
          {getInitials(user.name)}
        </span>
        <span className={styles.name}>{user.name}</span>
        <LuChevronDown aria-hidden="true" className={styles.chevron} />
      </button>

      {open && (
        <div id="menu-usuario" className={styles.panel}>
          <div className={styles.info}>
            <strong>{user.name}</strong>
            <span>{user.email}</span>
          </div>
          <Button
            variant="secondary"
            size="sm"
            fullWidth
            icon={<LuLogOut aria-hidden="true" />}
            loading={leaving}
            loadingLabel="Saindo..."
            onClick={handleLogout}
          >
            Sair do painel
          </Button>
        </div>
      )}
    </div>
  );
}
