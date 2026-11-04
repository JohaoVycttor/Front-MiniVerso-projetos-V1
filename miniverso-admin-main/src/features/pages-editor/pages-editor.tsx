"use client";

import { useEffect, useMemo, useState } from "react";
import { LuArrowDown, LuArrowUp, LuExternalLink, LuPlus, LuSave, LuUndo2, LuX } from "react-icons/lu";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { ErrorState, Skeleton } from "@/components/ui/state";
import { useToast } from "@/components/ui/toast";
import { TextAreaField, TextField } from "@/components/ui/field";
import { ApiError, errorMessage, isAbortError } from "@/lib/api/errors";
import { FieldInput } from "@/features/home-editor/field-input";
import type { FieldDef, FieldValue } from "@/features/home-editor/types";
import { getManagedPage, publishManagedPage } from "./api";
import styles from "./page-content-editor.module.css";
import type { JsonValue, ManagedPage, ManagedPageKey } from "./types";

const PAGES: ManagedPage[] = [
  { key: "studio", label: "O estúdio", description: "Textos, seções, cards e mídia da página sobre o estúdio.", href: "/sobre" },
  { key: "solutions", label: "Soluções", description: "Catálogo, formatos, processo e chamada de contato.", href: "/servicos" },
  { key: "contactPage", label: "Contato", description: "Hero, canais, formulário e mensagens da página de contato.", href: "/contato" },
  { key: "portfolio", label: "Portfólio e projetos", description: "Seções do portfólio, projetos, fichas, histórias, capas, vídeos e galerias.", href: "/projetos" },
];

const FIELD_LABELS: Record<string, string> = {
  accent: "Cor de destaque",
  actionHref: "Destino do botão",
  actionLabel: "Texto do botão",
  alt: "Texto alternativo",
  background: "Imagem ou cor de fundo",
  benefits: "Benefícios",
  benefitsLabel: "Título dos benefícios",
  brand: "Marca e identidade",
  button: "Texto do botão",
  cards: "Cards",
  cardsDescription: "Descrição dos cards",
  cardsHighlight: "Trecho destacado dos cards",
  cardsTitle: "Título dos cards",
  categoryIds: "Categorias",
  columns: "Colunas",
  contact: "Contato",
  cover: "Capa",
  description: "Descrição",
  details: "Detalhes",
  email: "E-mail",
  enabled: "Seção ativa",
  eyebrow: "Texto de apoio",
  experiencesLabel: "Rótulo das experiências",
  experiencesValue: "Formatos de experiência",
  facts: "Ficha técnica",
  fields: "Campos",
  formIntroSuffix: "Complemento do título de contato",
  gallery: "Galeria de mídia",
  heading: "Título",
  heroActionLabel: "Texto do botão do hero",
  heroEyebrow: "Legenda do hero",
  heroMeta: "Informações complementares do hero",
  heroScrollLabel: "Texto do link do hero",
  heroSpecialties: "Faixa de especialidades",
  highlight: "Trecho em destaque",
  href: "Link",
  icon: "Ícone",
  id: "Identificador",
  image: "Imagem",
  imageAlt: "Texto alternativo da imagem",
  imagePosition: "Posição da imagem",
  introduction: "Introdução",
  label: "Rótulo",
  layout: "Layout",
  logo: "Logotipo",
  metadata: "Metadados",
  name: "Nome",
  navigation: "Navegação",
  order: "Posição",
  originLabel: "Rótulo da origem",
  originValue: "Informação da origem",
  organizationLabel: "Rótulo da organização",
  organizationValue: "Informação da organização",
  overlay: "Intensidade da camada",
  paragraphs: "Parágrafos",
  pageTitle: "Título da página",
  poster: "Capa do vídeo",
  presentation: "Mídia principal",
  projects: "Projetos",
  specialties: "Especialidades",
  scrollCueLabel: "Texto para continuar explorando",
  scrollHref: "Destino do link para explorar",
  scrollLabel: "Texto para explorar",
  sections: "Seções",
  slug: "Endereço do projeto",
  src: "Arquivo de mídia",
  steps: "Etapas",
  story: "História do projeto",
  subtitle: "Subtítulo",
  studioLabel: "Rótulo do estúdio",
  studioValue: "Informação do estúdio",
  approachLabel: "Rótulo da proposta",
  approachValue: "Informação da proposta",
  tag: "Categoria ou etiqueta",
  tags: "Etiquetas",
  title: "Título",
  type: "Tipo de mídia",
  ui: "Textos da interface",
  video: "Vídeo de fundo",
  videoUrl: "Endereço do vídeo",
  visible: "Exibir no site",
  continueLabel: "Texto para continuar a leitura",
  statusSending: "Texto do estado de envio",
  statusSuccess: "Texto do estado de sucesso",
  statusError: "Texto do estado de erro",
  protocolLabel: "Rótulo do protocolo",
};

const URL_KEYS = new Set(["href", "link", "url"]);
const LONG_TEXT_KEYS = /(?:description|introduction|summary|details|paragraph|text|note|caption|highlight|subtitle|statement|objective|delivery|format|consent|privacy)/i;
const IMAGE_KEYS = new Set(["background", "cover", "image", "logo", "poster", "mediaImage"]);
const VIDEO_KEYS = new Set(["video", "videoUrl"]);

function labelFor(key: string): string {
  return FIELD_LABELS[key] ?? key.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/^./, (letter) => letter.toLocaleUpperCase("pt-BR"));
}

function valueForItem(value: JsonValue): string {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    for (const key of ["title", "name", "label", "tag", "slug", "id"]) {
      if (typeof value[key] === "string" && value[key]) return value[key] as string;
    }
  }
  if (typeof value === "string" && value) return value;
  return "Novo item";
}

function isJsonObject(value: JsonValue): value is { [key: string]: JsonValue } {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function mediaType(key: string, value: string, parent: JsonValue | undefined): "image" | "video" | null {
  if (VIDEO_KEYS.has(key) || (key === "src" && parent !== undefined && isJsonObject(parent) && parent.type === "video")) return "video";
  if ((IMAGE_KEYS.has(key) && !(key === "background" && /^#[\da-f]{6}$/i.test(value))) || (key === "src" && parent !== undefined && isJsonObject(parent))) return "image";
  if (key === "source" && /\.(mp4|webm)(?:\?|$)/i.test(value)) return "video";
  return null;
}

function createFieldDef(key: string, type: "image" | "video" | "url" | "text" | "textarea"): FieldDef {
  const media: Partial<FieldDef> =
    type === "video"
      ? { accept: ["video/mp4", "video/webm"], maxSizeMb: 50 }
      : type === "image"
        ? { accept: ["image/jpeg", "image/png", "image/webp"], maxSizeMb: 2 }
        : {};
  return {
    name: key,
    label: labelFor(key),
    type,
    decorative: key === "background" || key === "poster",
    ...media,
  };
}

function setAtPath(root: JsonValue, path: Array<string | number>, value: JsonValue): JsonValue {
  if (path.length === 0) return value;
  const [head, ...tail] = path;
  if (Array.isArray(root) && typeof head === "number") {
    return root.map((item, index) => (index === head ? setAtPath(item, tail, value) : item));
  }
  if (isJsonObject(root) && typeof head === "string") {
    return { ...root, [head]: setAtPath(root[head], tail, value) };
  }
  return root;
}

function blankValue(value: JsonValue, key: string, suffix: string): JsonValue {
  if (Array.isArray(value)) return [];
  if (isJsonObject(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([childKey, child]) => {
        if (childKey === "id") return [childKey, `${String(child)}-${suffix}`];
        if (childKey === "slug") return [childKey, `novo-projeto-${suffix}`];
        if (childKey === "order") return [childKey, 0];
        if (childKey === "type") return [childKey, child];
        if (childKey === "visible" || childKey === "enabled" || childKey === "authorized") return [childKey, false];
        return [childKey, blankValue(child, childKey, suffix)];
      }),
    );
  }
  if (typeof value === "boolean") return false;
  if (typeof value === "number") return key === "overlay" ? value : 0;
  return "";
}

function emptyArrayItem(key: string): JsonValue {
  const suffix = crypto.randomUUID();
  if (key === "gallery") return { id: suffix, type: "image", src: "", poster: "", alt: "", caption: "" };
  if (key === "facts") return { label: "", value: "" };
  if (key === "story") return { title: "", text: "" };
  if (key === "rows") return { objective: "", format: "", delivery: "" };
  if (key === "cards" || key === "steps") return { title: "", description: "" };
  return "";
}

function withOrderedItems(items: JsonValue[]): JsonValue[] {
  return items.map((item, index) => (isJsonObject(item) && typeof item.order === "number" ? { ...item, order: index } : item));
}

type JsonNodeProps = {
  value: JsonValue;
  path: Array<string | number>;
  parent?: JsonValue;
  onChange: (path: Array<string | number>, value: JsonValue) => void;
};

function JsonNode({ value, path, parent, onChange }: JsonNodeProps) {
  const key = String(path.at(-1) ?? "content");
  const label = labelFor(key);

  if (Array.isArray(value)) {
    return (
      <details className={styles.group} open={path.length < 2}>
        <summary>{label} · {value.length}</summary>
        <div className={styles.objectFields}>
          {value.map((item, index) => {
            const itemPath = [...path, index];
            const itemLabel = valueForItem(item);
            return isJsonObject(item) || Array.isArray(item) ? (
              <details className={styles.arrayItem} key={`${itemLabel}-${index}`}>
                <summary>{itemLabel}</summary>
                <JsonNode value={item} path={itemPath} parent={value} onChange={onChange} />
                <ArrayActions
                  index={index}
                  count={value.length}
                  onMove={(direction) => {
                    const target = index + direction;
                    if (target < 0 || target >= value.length) return;
                    const next = [...value];
                    [next[index], next[target]] = [next[target], next[index]];
                    onChange(path, withOrderedItems(next));
                  }}
                  onRemove={() => onChange(path, withOrderedItems(value.filter((_, itemIndex) => itemIndex !== index)))}
                />
              </details>
            ) : (
              <JsonNode key={`${label}-${index}`} value={item} path={itemPath} parent={value} onChange={onChange} />
            );
          })}
          {value.length === 0 && <p className={styles.empty}>Ainda não há itens nesta lista.</p>}
          <Button
            size="sm"
            variant="secondary"
            icon={<LuPlus aria-hidden="true" />}
            onClick={() => {
              const exemplar = value[0];
              const item = exemplar === undefined ? emptyArrayItem(key) : blankValue(exemplar, key, crypto.randomUUID().slice(0, 8));
              onChange(path, withOrderedItems([...value, item]));
            }}
          >
            Adicionar item
          </Button>
        </div>
      </details>
    );
  }

  if (isJsonObject(value)) {
    return (
      <details className={styles.group} open={path.length < 2}>
        <summary>{label}</summary>
        <div className={styles.objectFields}>
          {Object.entries(value).map(([childKey, child]) => (
            <JsonNode key={childKey} value={child} path={[...path, childKey]} parent={value} onChange={onChange} />
          ))}
        </div>
      </details>
    );
  }

  const onValueChange = (next: JsonValue) => onChange(path, next);
  if (typeof value === "boolean") {
    return (
      <label className={`${styles.primitive} ${styles.booleanField}`}>
        <input type="checkbox" checked={value} onChange={(event) => onValueChange(event.target.checked)} />
        <span>{label}</span>
      </label>
    );
  }
  if (typeof value === "number") {
    return (
      <TextField
        id={`page-${path.join("-")}`}
        className={styles.primitive}
        label={label}
        type="number"
        step={key === "overlay" ? "0.01" : "1"}
        min={key === "overlay" ? "0" : undefined}
        max={key === "overlay" ? "1" : undefined}
        value={value}
        onChange={(event) => onValueChange(event.target.value === "" ? 0 : Number(event.target.value))}
      />
    );
  }

  const text = value ?? "";
  const media = mediaType(key, text, parent);
  if (media) {
    return (
      <FieldInput
        def={createFieldDef(key, media)}
        value={text as FieldValue}
        idPrefix={`page-${path.join("-")}`}
        onChange={onValueChange}
      />
    );
  }
  if (URL_KEYS.has(key)) {
    return (
      <TextField
        id={`page-${path.join("-")}`}
        className={styles.primitive}
        label={label}
        value={text}
        onChange={(event) => onValueChange(event.target.value)}
      />
    );
  }
  if (key === "type" && isJsonObject(parent) && "src" in parent) {
    return (
      <label className={styles.primitive}>
        <span>{label}</span>
        <select value={text} onChange={(event) => onValueChange(event.target.value)}>
          <option value="image">Imagem</option>
          <option value="video">Vídeo</option>
        </select>
      </label>
    );
  }
  if (key === "layout") {
    return (
      <TextField
        id={`page-${path.join("-")}`}
        className={styles.primitive}
        label={label}
        value={text}
        onChange={(event) => onValueChange(event.target.value)}
      />
    );
  }
  if (key === "accent" || (key === "background" && /^#[\da-f]{6}$/i.test(text))) {
    return (
      <TextField
        id={`page-${path.join("-")}`}
        className={styles.primitive}
        label={label}
        type="color"
        value={text}
        onChange={(event) => onValueChange(event.target.value)}
      />
    );
  }
  if (LONG_TEXT_KEYS.test(key) || text.length > 180) {
    return (
      <TextAreaField
        id={`page-${path.join("-")}`}
        className={styles.primitive}
        label={label}
        value={text}
        rows={4}
        onChange={(event) => onValueChange(event.target.value)}
      />
    );
  }
  return (
    <TextField
      id={`page-${path.join("-")}`}
      className={styles.primitive}
      label={label}
      value={text}
      onChange={(event) => onValueChange(event.target.value)}
    />
  );
}

function ArrayActions({
  index,
  count,
  onMove,
  onRemove,
}: {
  index: number;
  count: number;
  onMove: (direction: -1 | 1) => void;
  onRemove: () => void;
}) {
  return (
    <div className={styles.arrayActions}>
      <Button size="sm" variant="ghost" icon={<LuArrowUp aria-hidden="true" />} disabled={index === 0} onClick={() => onMove(-1)}>
        Mover para cima
      </Button>
      <Button size="sm" variant="ghost" icon={<LuArrowDown aria-hidden="true" />} disabled={index === count - 1} onClick={() => onMove(1)}>
        Mover para baixo
      </Button>
      <Button size="sm" variant="danger-ghost" icon={<LuX aria-hidden="true" />} onClick={onRemove}>
        Remover
      </Button>
    </div>
  );
}

export function PagesEditor({ siteUrl }: { siteUrl: string }) {
  const { showToast } = useToast();
  const [pageKey, setPageKey] = useState<ManagedPageKey>("studio");
  const [reloadKey, setReloadKey] = useState(0);
  const [published, setPublished] = useState<Record<string, JsonValue> | null>(null);
  const [draft, setDraft] = useState<Record<string, JsonValue> | null>(null);
  const [status, setStatus] = useState<"loading" | "error" | "ready">("loading");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const page = PAGES.find((item) => item.key === pageKey)!;
  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(published), [draft, published]);

  useEffect(() => {
    const controller = new AbortController();
    setStatus("loading");
    setError("");
    getManagedPage(pageKey, controller.signal)
      .then((content) => {
        setPublished(content);
        setDraft(content);
        setStatus("ready");
      })
      .catch((reason: unknown) => {
        if (!isAbortError(reason)) {
          setError(errorMessage(reason));
          setStatus("error");
        }
      });
    return () => controller.abort();
  }, [pageKey, reloadKey]);

  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  async function save() {
    if (!draft) return;
    setSaving(true);
    try {
      const result = await publishManagedPage(pageKey, draft);
      setPublished(result);
      setDraft(result);
      showToast(`${page.label} publicada. O site já mostra as alterações.`);
    } catch (reason) {
      const message = reason instanceof ApiError && reason.status === 422
        ? "O conteúdo tem campos inválidos ou obrigatórios vazios. Revise as seções e tente novamente."
        : errorMessage(reason);
      showToast(`${message} Suas alterações continuam aqui.`, "error");
    } finally {
      setSaving(false);
    }
  }

  function changePage(next: ManagedPageKey) {
    if (dirty && !window.confirm("Descartar as alterações não publicadas desta página?")) return;
    setPageKey(next);
  }

  if (status === "loading") return <Skeleton />;
  if (status === "error") {
    return (
      <ErrorState
        title="Não foi possível carregar esta página"
        message={error}
        onRetry={() => {
          setStatus("loading");
          setReloadKey((key) => key + 1);
        }}
      />
    );
  }

  return (
    <div className={styles.editor}>
      <div className={styles.toolbar}>
        <div className={styles.pagePicker}>
          <label htmlFor="managed-page">Página</label>
          <select
            id="managed-page"
            value={pageKey}
            onChange={(event) => changePage(event.target.value as ManagedPageKey)}
          >
            {PAGES.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
          </select>
          <p className={styles.toolbarHint}>{page.description} O layout visual do site permanece inalterado.</p>
        </div>
        <ButtonLink href={`${siteUrl.replace(/\/$/, "")}${page.href}`} external variant="secondary" icon={<LuExternalLink aria-hidden="true" />}>
          Ver página
        </ButtonLink>
        <Button
          variant="primary"
          loading={saving}
          loadingLabel="Publicando…"
          icon={<LuSave aria-hidden="true" />}
          disabled={!dirty}
          onClick={save}
        >
          Publicar alterações
        </Button>
      </div>

      <Card padded>
        <CardHeader
          title={page.label}
          description="Edite os campos e a ordem das seções. Imagens e vídeos podem ser enviados, substituídos ou removidos."
          action={dirty ? (
            <Button
              variant="ghost"
              icon={<LuUndo2 aria-hidden="true" />}
              onClick={() => {
                setDraft(published);
                showToast("Alterações descartadas.");
              }}
            >
              Descartar
            </Button>
          ) : undefined}
        />
        <div className={styles.objectFields}>
          {draft && Object.entries(draft).map(([key, value]) => (
            <JsonNode
              key={key}
              value={value}
              path={[key]}
              onChange={(path, next) => setDraft((current) => current ? setAtPath(current, path, next) as Record<string, JsonValue> : current)}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}
