"use client";

import Link from "next/link";
import { useState } from "react";
import { LuChevronLeft, LuChevronRight, LuExternalLink, LuInbox, LuSearchX, LuTrash2 } from "react-icons/lu";
import { Button, ButtonLink, IconButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SearchField, SelectField } from "@/components/ui/field";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, ErrorState } from "@/components/ui/state";
import { useToast } from "@/components/ui/toast";
import { errorMessage } from "@/lib/api/errors";
import { cx } from "@/lib/cx";
import { formatDateTime, pluralize } from "@/lib/format";
import { useAsync } from "@/lib/hooks/use-async";
import { useDebouncedValue } from "@/lib/hooks/use-debounced-value";
import { publicConfig } from "@/lib/public-config";
import type { Lead, LeadSort } from "@/types/models";
import { LEADS_PER_PAGE, listLeads, listServiceOptions } from "./api";
import { DeleteLeadDialog } from "./delete-lead-dialog";
import styles from "./leads.module.css";

const SORT_OPTIONS = [
  { value: "recentes", label: "Mais recentes" },
  { value: "antigos", label: "Mais antigos" },
];

function detailHref(lead: Lead) {
  return `/admin/leads/${encodeURIComponent(lead.id)}`;
}

function LeadsSkeleton() {
  return (
    <div className={styles.skeletonList} aria-busy="true">
      <span className="sr-only">Carregando leads...</span>
      {Array.from({ length: 5 }, (_, index) => (
        <div key={index} className={styles.skeletonRow}>
          <Skeleton width="22%" height={14} />
          <Skeleton width="28%" height={14} />
          <Skeleton width="16%" height={14} />
          <Skeleton width="14%" height={14} />
        </div>
      ))}
    </div>
  );
}

/** Lista de leads com busca, filtro por serviço, ordenação e exclusão (RF16, RNF19, RNF42). */
export function LeadsView() {
  const { showToast } = useToast();
  const [search, setSearch] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [sort, setSort] = useState<LeadSort>("recentes");
  const [page, setPage] = useState(1);
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);
  const debouncedSearch = useDebouncedValue(search);

  const services = useAsync((signal) => listServiceOptions(signal), "servicos");
  const filters = { search: debouncedSearch, serviceId, sort, page, perPage: LEADS_PER_PAGE };
  const leads = useAsync((signal) => listLeads(filters, signal), JSON.stringify(filters));

  const hasFilters = debouncedSearch.trim() !== "" || serviceId !== "";
  const serviceOptions = [
    { value: "", label: "Todos os serviços" },
    ...(services.data ?? []).map((service) => ({ value: service.id, label: service.title })),
  ];

  function clearFilters() {
    setSearch("");
    setServiceId("");
    setPage(1);
  }

  function handleDeleted(lead: Lead) {
    setLeadToDelete(null);
    showToast(`Lead de ${lead.name} excluído.`);
    // Se era o último item da página, volta uma página.
    if (leads.data && leads.data.items.length === 1 && page > 1) setPage(page - 1);
    else leads.reload();
  }

  const result = leads.data;
  const firstItem = result ? (result.page - 1) * result.perPage + 1 : 0;
  const lastItem = result ? firstItem + result.items.length - 1 : 0;

  let content;
  if (leads.status === "error") {
    content = <ErrorState title="Não foi possível carregar os leads" message={errorMessage(leads.error)} onRetry={leads.reload} />;
  } else if (result === undefined || (leads.isRefreshing && result.items.length === 0)) {
    content = <LeadsSkeleton />;
  } else if (result.items.length === 0) {
    content = hasFilters ? (
      <EmptyState
        icon={<LuSearchX />}
        title="Nenhum lead encontrado"
        description="Tente buscar por outro termo ou escolha outro serviço."
        actions={
          <Button variant="secondary" onClick={clearFilters}>
            Limpar filtros
          </Button>
        }
      />
    ) : (
      <EmptyState
        icon={<LuInbox />}
        title="Nenhum lead por aqui ainda"
        description="Quando alguém preencher o formulário de contato do site, o pedido aparece nesta lista."
        actions={
          <ButtonLink href={publicConfig.siteUrl} external variant="secondary" icon={<LuExternalLink aria-hidden="true" />}>
            Ver o formulário no site
          </ButtonLink>
        }
      />
    );
  } else {
    content = (
      <div className={cx(leads.isRefreshing && styles.busy)} aria-busy={leads.isRefreshing || undefined}>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <caption className="sr-only">Leads recebidos pelo formulário de contato</caption>
            <thead>
              <tr>
                <th scope="col">Nome e empresa</th>
                <th scope="col">Contato</th>
                <th scope="col">Serviço de interesse</th>
                <th scope="col">Recebido em</th>
                <th scope="col">
                  <span className="sr-only">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {result.items.map((lead) => (
                <tr key={lead.id}>
                  <td>
                    <div className={styles.stack}>
                      <Link href={detailHref(lead)} className={styles.nameLink}>
                        {lead.name}
                      </Link>
                      <span className={styles.muted}>{lead.company ?? "Empresa não informada"}</span>
                    </div>
                  </td>
                  <td>
                    <div className={styles.stack}>
                      <span>{lead.email}</span>
                      <span className={styles.muted}>{lead.phone ?? "Telefone não informado"}</span>
                    </div>
                  </td>
                  <td>
                    {lead.serviceName ? (
                      <span className={styles.serviceTag}>{lead.serviceName}</span>
                    ) : (
                      <span className={styles.muted}>Não informado</span>
                    )}
                  </td>
                  <td className={styles.date}>{formatDateTime(lead.createdAt)}</td>
                  <td>
                    <div className={styles.rowActions}>
                      <ButtonLink href={detailHref(lead)} variant="ghost" size="sm" aria-label={`Ver detalhes do lead de ${lead.name}`}>
                        Ver
                      </ButtonLink>
                      <IconButton
                        variant="danger-ghost"
                        label={`Excluir lead de ${lead.name}`}
                        icon={<LuTrash2 aria-hidden="true" />}
                        onClick={() => setLeadToDelete(lead)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ul className={styles.cards} aria-label="Leads recebidos">
          {result.items.map((lead) => (
            <li key={lead.id} className={styles.leadCard}>
              <div className={styles.leadCardTop}>
                <Link href={detailHref(lead)} className={styles.nameLink}>
                  {lead.name}
                </Link>
                <IconButton
                  variant="danger-ghost"
                  label={`Excluir lead de ${lead.name}`}
                  icon={<LuTrash2 aria-hidden="true" />}
                  onClick={() => setLeadToDelete(lead)}
                />
              </div>
              {lead.company && <span className={cx(styles.cardLine, styles.muted)}>{lead.company}</span>}
              {lead.serviceName && <span className={styles.serviceTag}>{lead.serviceName}</span>}
              <span className={styles.cardLine}>{lead.email}</span>
              {lead.phone && <span className={styles.cardLine}>{lead.phone}</span>}
              <span className={cx(styles.cardLine, styles.muted)}>Recebido em {formatDateTime(lead.createdAt)}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <p className={styles.intro}>Pessoas e empresas que enviaram o formulário de contato do site.</p>

      <Card>
        <div className={styles.toolbar} role="search">
          <SearchField
            className={styles.search}
            label="Buscar por nome, e-mail ou empresa"
            placeholder="Ex.: Ana, @empresa.com"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
          />
          <SelectField
            label="Serviço de interesse"
            options={serviceOptions}
            value={serviceId}
            onChange={(event) => {
              setServiceId(event.target.value);
              setPage(1);
            }}
          />
          <SelectField
            label="Ordenar"
            options={SORT_OPTIONS}
            value={sort}
            onChange={(event) => {
              setSort(event.target.value === "antigos" ? "antigos" : "recentes");
              setPage(1);
            }}
          />
        </div>

        <p className={styles.summary} aria-live="polite">
          {result && result.total > 0 && leads.status !== "error"
            ? `Mostrando ${firstItem} a ${lastItem} de ${pluralize(result.total, "lead", "leads")}`
            : " "}
        </p>

        <div className={styles.body}>{content}</div>

        {result && result.lastPage > 1 && leads.status !== "error" && (
          <nav className={styles.pagination} aria-label="Paginação">
            <Button
              variant="secondary"
              size="sm"
              icon={<LuChevronLeft aria-hidden="true" />}
              disabled={result.page <= 1 || leads.isRefreshing}
              onClick={() => setPage(result.page - 1)}
            >
              Anterior
            </Button>
            <span className={styles.pageInfo}>
              Página {result.page} de {result.lastPage}
            </span>
            <Button
              variant="secondary"
              size="sm"
              disabled={result.page >= result.lastPage || leads.isRefreshing}
              onClick={() => setPage(result.page + 1)}
            >
              Próxima
              <LuChevronRight aria-hidden="true" />
            </Button>
          </nav>
        )}
      </Card>

      <DeleteLeadDialog lead={leadToDelete} onClose={() => setLeadToDelete(null)} onDeleted={handleDeleted} />
    </div>
  );
}
