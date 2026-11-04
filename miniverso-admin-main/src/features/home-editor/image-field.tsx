"use client";

import { useId, useRef, useState, type ChangeEvent } from "react";
import { LuBox, LuCircleAlert, LuImagePlus, LuRefreshCw, LuTrash2 } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { cx } from "@/lib/cx";
import { validateFile } from "./rules";
import type { FieldDef } from "./types";
import styles from "./image-field.module.css";

type ImageFieldProps = {
  def: FieldDef;
  /** Endereço da imagem (ou data URL no modo de demonstração). Vazio quando não há arquivo. */
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
};

function fileLabel(def: FieldDef): string {
  const types = (def.accept ?? [])
    .map((item) => (item.startsWith(".") ? item.slice(1) : item.split("/")[1] ?? ""))
    .map((item) => item.replace("jpeg", "jpg").replace("gltf-binary", "glb").toUpperCase());
  return `${[...new Set(types)].join(", ")} · até ${def.maxSizeMb ?? 2} MB`;
}

function isImageValue(value: string): boolean {
  return value.startsWith("data:image/") || /\.(png|jpe?g|webp|svg)(\?|$)/i.test(value) || value.startsWith("/");
}

/**
 * Envio de imagem ou arquivo com prévia, substituir e remover.
 * Confere tipo, extensão e tamanho antes de aceitar (RNF24) e explica o problema sem termos técnicos (RNF43).
 * O texto alternativo fica em um campo próprio do formulário (RNF34).
 */
export function ImageField({ def, value, onChange, error, disabled }: ImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const id = useId();
  const [fileError, setFileError] = useState<string | null>(null);
  const [reading, setReading] = useState(false);
  const shownError = fileError ?? error;
  const isModel = def.type === "file";

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const problem = validateFile(file, def);
    if (problem) {
      setFileError(problem);
      return;
    }
    setFileError(null);

    setReading(true);
    try {
      const form = new FormData(); form.append("file", file);
      const response = await fetch("/api/uploads", {method:"POST", body:form});
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Não foi possível enviar.");
      onChange(result.url);
    } catch(error) { setFileError(error instanceof Error ? error.message : "Não foi possível enviar."); }
    finally { setReading(false); }
  }

  const describedBy = [`${id}-formatos`, def.hint ? `${id}-dica` : null, shownError ? `${id}-erro` : null].filter(Boolean).join(" ");

  return (
    <div className={styles.field} role="group" aria-labelledby={`${id}-rotulo`}>
      <span id={`${id}-rotulo`} className={styles.label}>
        {def.label}
        {def.required && <span className={styles.required} aria-hidden="true"> *</span>}
      </span>
      {def.hint && (
        <p id={`${id}-dica`} className={styles.hint}>
          {def.hint}
        </p>
      )}

      <input
        ref={inputRef}
        id={id}
        type="file"
        className="sr-only"
        tabIndex={-1}
        accept={(def.accept ?? []).join(",")}
        onChange={handleFile}
        disabled={disabled}
        aria-hidden="true"
      />

      {value ? (
        <div className={cx(styles.preview, shownError && styles.invalid)}>
          {def.type === "video" ? <video src={value} controls preload="metadata" className={styles.thumb} aria-label="Prévia do vídeo"/> : !isModel && isImageValue(value) ? (
            // eslint-disable-next-line @next/next/no-img-element -- prévia local (data URL), sem otimização do Next
            <img src={value} alt="" className={styles.thumb} />
          ) : (
            <span className={styles.fileIcon} aria-hidden="true">
              <LuBox />
            </span>
          )}
          <span className={styles.fileName}>{reading ? "Enviando…" : isModel ? value : def.type === "video" ? "Vídeo enviado" : "Imagem enviada"}</span>
          <div className={styles.previewActions}>
            <Button
              size="sm"
              variant="ghost"
              icon={<LuRefreshCw aria-hidden="true" />}
              onClick={() => inputRef.current?.click()}
              disabled={disabled || reading}
              aria-describedby={describedBy}
            >
              Substituir
            </Button>
            <Button
              size="sm"
              variant="danger-ghost"
              icon={<LuTrash2 aria-hidden="true" />}
              onClick={() => {
                setFileError(null);
                onChange("");
              }}
              disabled={disabled}
            >
              Remover
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          className={cx(styles.drop, shownError && styles.invalid)}
          onClick={() => inputRef.current?.click()}
          disabled={disabled || reading}
          aria-describedby={describedBy}
        >
          <LuImagePlus aria-hidden="true" />
          <span>{reading ? "Carregando prévia..." : isModel ? "Escolher arquivo" : "Escolher imagem"}</span>
        </button>
      )}

      <p id={`${id}-formatos`} className={styles.hint}>
        {fileLabel(def)}
      </p>
      {shownError && (
        <p id={`${id}-erro`} className={styles.error} role={fileError ? "alert" : undefined}>
          <LuCircleAlert aria-hidden="true" />
          <span>{shownError}</span>
        </p>
      )}
    </div>
  );
}
