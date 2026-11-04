"use client";

import { useState } from "react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ApiError, errorMessage } from "@/lib/api/errors";
import type { Lead } from "@/types/models";
import { deleteLead } from "./api";

type DeleteLeadDialogProps = {
  /** Lead a excluir. `null` mantém o modal fechado. */
  lead: Lead | null;
  onClose: () => void;
  onDeleted: (lead: Lead) => void;
};

/** Exclusão com confirmação que nomeia o lead e avisa que é permanente (RNF42). */
export function DeleteLeadDialog({ lead, onClose, onDeleted }: DeleteLeadDialogProps) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    if (!lead || pending) return;
    setPending(true);
    setError(null);
    try {
      await deleteLead(lead.id);
      setPending(false);
      onDeleted(lead);
    } catch (caught) {
      setPending(false);
      // Se o lead já tinha sido excluído (em outra aba, por exemplo), o resultado é o mesmo: ele não existe mais.
      if (caught instanceof ApiError && caught.status === 404) {
        onDeleted(lead);
        return;
      }
      setError(errorMessage(caught));
    }
  }

  function handleCancel() {
    if (pending) return;
    setError(null);
    onClose();
  }

  return (
    <ConfirmDialog
      open={lead !== null}
      title="Excluir lead?"
      confirmLabel="Excluir lead"
      pendingLabel="Excluindo..."
      pending={pending}
      error={error}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    >
      {lead && (
        <>
          <p>
            O contato de <strong>{lead.name}</strong> e a mensagem enviada serão excluídos permanentemente.
          </p>
          <p>Esta ação não pode ser desfeita.</p>
        </>
      )}
    </ConfirmDialog>
  );
}
