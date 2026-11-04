"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LuArrowLeft, LuClock, LuCopy, LuMail, LuSearchX, LuTrash2 } from "react-icons/lu";
import { Button, ButtonLink, IconButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, ErrorState } from "@/components/ui/state";
import { useToast } from "@/components/ui/toast";
import { ApiError, errorMessage } from "@/lib/api/errors";
import { formatDateTime } from "@/lib/format";
import { useAsync } from "@/lib/hooks/use-async";
import type { Lead } from "@/types/models";
import { getLead } from "./api";
import { DeleteLeadDialog } from "./delete-lead-dialog";
import styles from "./leads.module.css";

const LEADS_PATH = "/admin/leads";

function contactText(lead: Lead) {
  return [lead.name, lead.email, lead.phone, lead.company].filter(Boolean).join("\n");
}

function replyHref(lead: Lead) {
  const firstName = lead.name.split(" ")[0];
  const subject = encodeURIComponent("Contato pelo site da Miniverso");
  const body = encodeURIComponent(`Olá, ${firstName}!\n\n`);
  return `mailto:${lead.email}?subject=${subject}&body=${body}`;
}

function DetailSkeleton() {
  return (
    <div className={styles.detailGrid} aria-busy="true">
      <span className="sr-only">Carregando lead...</span>
      <Card padded className={styles.detailCard}>
        <Skeleton width="45%" height={28} />
        <Skeleton width="30%" height={14} />
        <div className={styles.infoList}>
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className={styles.skeletonField}>
              <Skeleton width="40%" height={12} />
              <Skeleton width="80%" height={16} />
            </div>
          ))}
        </div>
        <Skeleton height={120} radius={12} />
      </Card>
      <Card padded className={styles.actionsCard}>
        <Skeleton height={44} radius={999} />
        <Skeleton height={44} radius={999} />
      </Card>
    </div>
  );
}

/** Detalhe de um lead com a mensagem completa (RF17, RNF19). */
export function LeadDetailView({ id }: { id: string }) {
  const router = useRouter();
  const { showToast } = useToast();
  const lead = useAsync((signal) => getLead(id, signal), id);
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);

  async function copy(text: string, successMessage: string) {
    try {
      await navigator.clipboard.writeText(text);
      showToast(successMessage);
    } catch {
      showToast("Não foi possível copiar. Selecione o texto e copie manualmente.", "error");
    }
  }

  function handleDeleted(deleted: Lead) {
    setLeadToDelete(null);
    showToast(`Lead de ${deleted.name} excluído.`);
    router.push(LEADS_PATH);
  }

  const backLink = (
    <Link href={LEADS_PATH} className={styles.back}>
      <LuArrowLeft aria-hidden="true" />
      Voltar para leads
    </Link>
  );

  if (lead.status === "error") {
    const notFound = lead.error instanceof ApiError && lead.error.status === 404;
    return (
      <div className={styles.page}>
        {backLink}
        <Card>
          {notFound ? (
            <EmptyState
              icon={<LuSearchX />}
              title="Lead não encontrado"
              description="Ele pode ter sido excluído ou o endereço está incompleto."
              actions={<ButtonLink href={LEADS_PATH}>Ver todos os leads</ButtonLink>}
            />
          ) : (
            <ErrorState title="Não foi possível carregar o lead" message={errorMessage(lead.error)} onRetry={lead.reload} />
          )}
        </Card>
      </div>
    );
  }

  if (lead.status === "loading" || !lead.data) {
    return (
      <div className={styles.page}>
        {backLink}
        <DetailSkeleton />
      </div>
    );
  }

  const data = lead.data;

  return (
    <div className={styles.page}>
      {backLink}

      <div className={styles.detailGrid}>
        <Card padded className={styles.detailCard} aria-labelledby="lead-nome">
          <div className={styles.leadHeader}>
            <div className={styles.leadHeading}>
              <h2 id="lead-nome" className={styles.leadName}>
                {data.name}
              </h2>
              <p className={styles.received}>
                <LuClock aria-hidden="true" />
                Recebido em {formatDateTime(data.createdAt)}
              </p>
            </div>
            {data.serviceName && <span className={styles.serviceTag}>{data.serviceName}</span>}
          </div>

          <dl className={styles.infoList}>
            <div>
              <dt>E-mail</dt>
              <dd>
                <a href={`mailto:${data.email}`}>{data.email}</a>
                <IconButton label="Copiar e-mail" icon={<LuCopy aria-hidden="true" />} onClick={() => copy(data.email, "E-mail copiado.")} />
              </dd>
            </div>
            <div>
              <dt>Telefone</dt>
              <dd>
                {data.phone ? (
                  <>
                    <a href={`tel:${data.phone.replace(/[^\d+]/g, "")}`}>{data.phone}</a>
                    <IconButton
                      label="Copiar telefone"
                      icon={<LuCopy aria-hidden="true" />}
                      onClick={() => copy(data.phone ?? "", "Telefone copiado.")}
                    />
                  </>
                ) : (
                  <span className={styles.muted}>Não informado</span>
                )}
              </dd>
            </div>
            <div>
              <dt>Empresa</dt>
              <dd>{data.company ?? <span className={styles.muted}>Não informada</span>}</dd>
            </div>
            <div>
              <dt>Serviço de interesse</dt>
              <dd>{data.serviceName ?? <span className={styles.muted}>Não informado</span>}</dd>
            </div>
          </dl>

          <div className={styles.messageBlock}>
            <h3 className={styles.messageTitle}>Mensagem</h3>
            {/* O React escapa o texto: o conteúdo enviado pelo visitante nunca vira HTML (RNF22). */}
            <p className={styles.message}>{data.message || "O visitante não escreveu mensagem."}</p>
          </div>
        </Card>

        <Card as="aside" padded className={styles.actionsCard} aria-label="Ações do lead">
          <ButtonLink href={replyHref(data)} fullWidth icon={<LuMail aria-hidden="true" />}>
            Responder por e-mail
          </ButtonLink>
          <Button variant="secondary" fullWidth icon={<LuCopy aria-hidden="true" />} onClick={() => copy(contactText(data), "Contato copiado.")}>
            Copiar contato
          </Button>
          <hr className={styles.divider} />
          <Button variant="danger-ghost" fullWidth icon={<LuTrash2 aria-hidden="true" />} onClick={() => setLeadToDelete(data)}>
            Excluir lead
          </Button>
          <p className={styles.privacyNote}>
            Use estes dados só para responder ao pedido de contato, como prevê a LGPD.
          </p>
        </Card>
      </div>

      <DeleteLeadDialog lead={leadToDelete} onClose={() => setLeadToDelete(null)} onDeleted={handleDeleted} />
    </div>
  );
}
