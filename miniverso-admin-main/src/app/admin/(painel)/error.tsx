"use client";

import { Card } from "@/components/ui/card";
import { ErrorState } from "@/components/ui/state";
import { MESSAGES } from "@/lib/messages";

/** Erro inesperado numa tela do painel: o menu continua disponível. */
export default function PainelError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <Card>
      <ErrorState title="Esta tela não carregou" message={MESSAGES.generic} onRetry={() => reset()} />
    </Card>
  );
}
