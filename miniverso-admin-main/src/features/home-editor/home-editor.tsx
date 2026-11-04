"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { LuCircleAlert, LuCircleCheck, LuExternalLink, LuUndo2 } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { FormDialog } from "@/components/ui/form-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/state";
import { useToast } from "@/components/ui/toast";
import { ApiError, errorMessage, isAbortError } from "@/lib/api/errors";
import { formatDateTime } from "@/lib/format";
import { getSiteContent, publishSiteContent } from "./api";
import { FieldInput } from "./field-input";
import { changedSections, findSection, moveItem, moveSection, resolveOptions, validateContent, validateFields, type FieldErrors } from "./rules";
import { SECTION_BY_KEY } from "./schema";
import { SectionEditor } from "./section-editor";
import { StructurePanel } from "./structure-panel";
import type { ContentItem, FieldValue, SectionContent, SectionKey, SiteContent } from "./types";
import styles from "./editor.module.css";

type LoadState = { status: "loading" } | { status: "error"; message: string } | { status: "ready" };

type ItemDraft = { section: SectionKey; id: string | null; values: Record<string, FieldValue> };

function newItemId(section: SectionKey): string {
  return `${section}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

/**
 * Editor da página inicial (frame "Painel · Editor da página inicial" no Figma).
 * O administrador edita um rascunho local e publica tudo de uma vez (RF15, RF18, RNF44).
 * Se a publicação falhar, o rascunho continua na tela (RNF31).
 */
export function HomeEditor({ siteUrl }: { siteUrl: string }) {
  const { showToast } = useToast();
  const [load, setLoad] = useState<LoadState>({ status: "loading" });
  const [reloadKey, setReloadKey] = useState(0);
  const [published, setPublished] = useState<SiteContent | null>(null);
  const [draft, setDraft] = useState<SiteContent | null>(null);
  const [selected, setSelected] = useState<SectionKey>("hero");
  const [showErrors, setShowErrors] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewBusy, setPreviewBusy] = useState(false);
  const [previewMobile, setPreviewMobile] = useState(false);
  const [itemDraft, setItemDraft] = useState<ItemDraft | null>(null);
  const [itemErrors, setItemErrors] = useState<FieldErrors>({});
  const [removing, setRemoving] = useState<{ section: SectionKey; item: ContentItem } | null>(null);
  const [discardOpen, setDiscardOpen] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const scrollToEditor = useRef(false);

  // O estado começa em "loading"; "Tentar de novo" volta para ele antes de pedir de novo.
  useEffect(() => {
    const controller = new AbortController();
    getSiteContent(controller.signal)
      .then((content) => {
        setPublished(content);
        setDraft(content);
        setLoad({ status: "ready" });
      })
      .catch((error: unknown) => {
        if (!isAbortError(error)) setLoad({ status: "error", message: errorMessage(error) });
      });
    return () => controller.abort();
  }, [reloadKey]);

  const changed = useMemo(() => (draft && published ? changedSections(draft, published) : []), [draft, published]);
  const dirty = changed.length > 0;
  const errors = useMemo(() => (draft ? validateContent(draft) : {}), [draft]);
  const invalidKeys = showErrors ? (Object.keys(errors) as SectionKey[]) : [];

  // Em telas estreitas a estrutura fica acima do editor: ao escolher uma seção, leva o foco até ela.
  useEffect(() => {
    if (!scrollToEditor.current) return;
    scrollToEditor.current = false;
    const target = editorRef.current;
    if (!target || !window.matchMedia("(max-width: 1180px)").matches) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    target.querySelector<HTMLElement>("h2")?.focus({ preventScroll: true });
  }, [selected]);

  // Aviso do navegador ao sair com alterações não publicadas.
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  if (load.status === "loading" || !draft || !published) {
    if (load.status === "error") {
      return (
        <ErrorState
          message={load.message}
          onRetry={() => {
            setLoad({ status: "loading" });
            setReloadKey((key) => key + 1);
          }}
        />
      );
    }
    return <EditorSkeleton />;
  }

  const content = draft;
  const section = findSection(content, selected);
  const def = SECTION_BY_KEY[selected];

  function updateSection(key: SectionKey, update: (current: SectionContent) => SectionContent) {
    setDraft((current) =>
      current ? { ...current, sections: current.sections.map((item) => (item.key === key ? update(item) : item)) } : current,
    );
  }

  async function handlePublish() {
    if (Object.keys(errors).length > 0) {
      setShowErrors(true);
      const first = content.sections.find((item) => errors[item.key])?.key;
      if (first) setSelected(first);
      showToast("Revise os campos destacados antes de publicar.", "error");
      return;
    }
    setPublishing(true);
    try {
      const result = await publishSiteContent(content);
      setPublished(result);
      setDraft(result);
      setShowErrors(false);
      showToast("Página inicial publicada. O site já mostra as alterações.");
    } catch (error) {
      if (error instanceof ApiError && error.status === 422) setShowErrors(true);
      showToast(
        error instanceof ApiError && error.status === 0
          ? "Não foi possível publicar. Verifique sua conexão e tente de novo. Suas alterações continuam aqui."
          : `${errorMessage(error)} Suas alterações continuam aqui.`,
        "error",
      );
    } finally {
      setPublishing(false);
    }
  }

  async function handlePreview() {
    setPreviewBusy(true);
    try {
      const response = await fetch("/api/home-preview", {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(content)});
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Não foi possível abrir a prévia.");
      setPreviewUrl(result.url);
    } catch(error) { showToast(error instanceof Error ? error.message : "Prévia indisponível.","error"); }
    finally { setPreviewBusy(false); }
  }

  function openNewItem() {
    const items = def.items;
    if (!items) return;
    const values: Record<string, FieldValue> = {};
    if (items.hasVisibility) values.visible = true;
    setItemErrors({});
    setItemDraft({ section: selected, id: null, values });
  }

  function saveItem() {
    if (!itemDraft) return;
    const items = SECTION_BY_KEY[itemDraft.section].items;
    if (!items) return;
    const fieldErrors = validateFields(items.fields, itemDraft.values);
    if (Object.keys(fieldErrors).length > 0) {
      setItemErrors(fieldErrors);
      return;
    }
    const { id } = itemDraft;
    updateSection(itemDraft.section, (current) => ({
      ...current,
      items: id
        ? current.items.map((item) => (item.id === id ? { ...item, ...itemDraft.values } : item))
        : [...current.items, { ...itemDraft.values, id: newItemId(itemDraft.section) }],
    }));
    setItemDraft(null);
    showToast(id ? `${capitalize(items.singular)} atualizado no rascunho.` : `${capitalize(items.singular)} adicionado ao rascunho.`);
  }

  function confirmRemove() {
    if (!removing) return;
    const { section: key, item } = removing;
    updateSection(key, (current) => ({
      ...current,
      fields: key === "projetos" && current.fields.featured === item.id ? { ...current.fields, featured: "" } : current.fields,
      items: current.items.filter((entry) => entry.id !== item.id),
    }));
    setRemoving(null);
    showToast("Item removido do rascunho. Publique para aplicar no site.");
  }

  const itemDef = itemDraft ? SECTION_BY_KEY[itemDraft.section].items : undefined;
  const removingItems = removing ? SECTION_BY_KEY[removing.section].items : undefined;
  const removingTitle = removing && removingItems ? String(removing.item[removingItems.titleField] ?? "este item") : "";

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <p className={styles.muted}>Estrutura e conteúdo das seções da página pública.</p>
        <div className={styles.topActions}>
          <p className={styles.status} role="status">
            {dirty ? (
              <>
                <LuCircleAlert aria-hidden="true" className={styles.statusPending} />
                Alterações não publicadas em {changed.length} {changed.length === 1 ? "seção" : "seções"}
              </>
            ) : (
              <>
                <LuCircleCheck aria-hidden="true" className={styles.statusOk} />
                {published.publishedAt ? `Publicado em ${formatDateTime(published.publishedAt)}` : "Ainda não publicado"}
              </>
            )}
          </p>
          {dirty && (
            <Button variant="ghost" icon={<LuUndo2 aria-hidden="true" />} onClick={() => setDiscardOpen(true)} disabled={publishing}>
              Descartar
            </Button>
          )}
          <a href={siteUrl} target="_blank" rel="noreferrer" className={styles.previewLink}>Ver publicação <LuExternalLink aria-hidden="true" /></a>
          <Button onClick={handlePreview} loading={previewBusy} variant="secondary">Visualizar rascunho</Button>
          <Button onClick={handlePublish} disabled={!dirty} loading={publishing} loadingLabel="Publicando...">
            Salvar e publicar
          </Button>
        </div>
      </div>

      <div className={styles.layout}>
        <StructurePanel
          content={content}
          selected={selected}
          changed={changed}
          invalid={invalidKeys}
          onSelect={(key) => {
            scrollToEditor.current = true;
            setSelected(key);
          }}
          onMove={(key, direction) => setDraft((current) => (current ? moveSection(current, key, direction) : current))}
          onToggle={(key, visible) => updateSection(key, (current) => ({ ...current, visible }))}
        />

        <div ref={editorRef} className={styles.editorAnchor}>
          <SectionEditor
            key={selected}
            def={def}
            section={section}
            content={content}
            errors={showErrors ? errors[selected] : undefined}
            onFieldChange={(name, value) => updateSection(selected, (current) => ({ ...current, fields: { ...current.fields, [name]: value } }))}
            onToggleVisible={(visible) => updateSection(selected, (current) => ({ ...current, visible }))}
            onAddItem={openNewItem}
            onEditItem={(item) => {
              setItemErrors({});
              setItemDraft({ section: selected, id: item.id, values: Object.fromEntries(Object.entries(item).filter(([, v]) => v !== undefined)) as Record<string, FieldValue> });
            }}
            onRemoveItem={(item) => setRemoving({ section: selected, item })}
            onMoveItem={(id, direction) => updateSection(selected, (current) => ({ ...current, items: moveItem(current.items, id, direction) }))}
            onToggleItem={(id, visible) =>
              updateSection(selected, (current) => ({ ...current, items: current.items.map((item) => (item.id === id ? { ...item, visible } : item)) }))
            }
          />
        </div>
      </div>

      {previewUrl && <div role="dialog" aria-modal="true" aria-label="Prévia do rascunho" className={styles.homePreview} onKeyDown={event=>{if(event.key==="Escape")setPreviewUrl("")}}>
        <div className={styles.homePreviewToolbar}><strong>Prévia · alterações não publicadas</strong><Button onClick={()=>setPreviewMobile(!previewMobile)} variant="secondary">{previewMobile?"Ver no computador":"Ver no celular"}</Button><Button autoFocus onClick={()=>setPreviewUrl("")}>Fechar prévia</Button></div>
        <iframe title="Prévia da página inicial" src={previewUrl} className={styles.homePreviewFrame} style={{width:previewMobile?390:"100%"}} sandbox="allow-scripts allow-same-origin"/>
      </div>}
      <FormDialog
        open={itemDraft !== null}
        title={itemDef ? `${itemDraft?.id ? "Editar" : "Adicionar"} ${itemDef.singular}` : ""}
        reqs={itemDraft ? SECTION_BY_KEY[itemDraft.section].reqs : undefined}
        variant={itemDef?.drawer ? "drawer" : "modal"}
        submitLabel={itemDraft?.id ? "Salvar alterações" : `Adicionar ${itemDef?.singular ?? ""}`}
        onSubmit={saveItem}
        onCancel={() => setItemDraft(null)}
      >
        {itemDraft && itemDef && (
          <div className={styles.fieldGrid}>
            <p className={styles.requiredNote}>
              Campos com <span aria-hidden="true">*</span>
              <span className="sr-only">asterisco</span> são obrigatórios.
            </p>
            {itemDef.fields.map((field) => (
              <FieldInput
                key={field.name}
                idPrefix={`item-${itemDraft.section}`}
                def={field}
                value={itemDraft.values[field.name]}
                error={itemErrors[field.name]}
                options={resolveOptions(field.options, content)}
                onChange={(value) => {
                  setItemDraft((current) => (current ? { ...current, values: { ...current.values, [field.name]: value } } : current));
                  if (itemErrors[field.name]) {
                    // O erro do campo some quando ele é editado
                    setItemErrors((current) => {
                      const next = { ...current };
                      delete next[field.name];
                      return next;
                    });
                  }
                }}
              />
            ))}
          </div>
        )}
      </FormDialog>

      <ConfirmDialog
        open={removing !== null}
        title={`Remover ${removingItems?.singular ?? "item"}?`}
        confirmLabel="Remover"
        pendingLabel="Removendo..."
        onConfirm={confirmRemove}
        onCancel={() => setRemoving(null)}
      >
        <p>
          <strong>{removingTitle}</strong> sai da página inicial. Depois de publicar, a remoção é permanente e não pode ser desfeita.
        </p>
      </ConfirmDialog>

      <ConfirmDialog
        open={discardOpen}
        title="Descartar alterações?"
        confirmLabel="Descartar"
        pendingLabel="Descartando..."
        onConfirm={() => {
          setDraft(published);
          setShowErrors(false);
          setDiscardOpen(false);
          showToast("Alterações descartadas. O editor voltou ao conteúdo publicado.");
        }}
        onCancel={() => setDiscardOpen(false)}
      >
        <p>
          As alterações em {changed.length} {changed.length === 1 ? "seção" : "seções"} serão perdidas. Esta ação não pode ser desfeita.
        </p>
      </ConfirmDialog>
    </div>
  );
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function EditorSkeleton() {
  return (
    <div className={styles.page} aria-busy="true" aria-label="Carregando o conteúdo da página inicial">
      <div className={styles.topBar}>
        <Skeleton width={280} height={16} />
        <Skeleton width={360} height={44} radius={999} />
      </div>
      <div className={styles.layout}>
        <div className={styles.structure}>
          <Skeleton width={160} height={22} />
          {Array.from({ length: 8 }, (_, index) => (
            <Skeleton key={index} height={56} radius={12} />
          ))}
        </div>
        <div className={styles.editor}>
          <Skeleton width={120} height={20} />
          <Skeleton width={220} height={28} />
          <Skeleton height={48} radius={12} />
          <Skeleton height={48} radius={12} />
          <Skeleton height={96} radius={12} />
        </div>
      </div>
    </div>
  );
}
