"use client";

import { CheckboxField, SelectField, TextAreaField, TextField } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { cx } from "@/lib/cx";
import { ImageField } from "./image-field";
import type { FieldDef, FieldValue } from "./types";
import styles from "./editor.module.css";

type FieldInputProps = {
  def: FieldDef;
  value: FieldValue | undefined;
  onChange: (value: FieldValue) => void;
  error?: string;
  options?: Array<{ value: string; label: string }>;
  /** Prefixo do id, para o mesmo campo existir na seção e no modal sem colidir. */
  idPrefix: string;
};

/** Monta o controle certo para cada tipo de campo do schema. Rótulo sempre visível (RNF36). */
export function FieldInput({ def, value, onChange, error, options = [], idPrefix }: FieldInputProps) {
  const id = `${idPrefix}-${def.name}`;
  const text = typeof value === "string" ? value : "";
  const className = cx(styles.field, def.half && styles.half);

  switch (def.type) {
    case "textarea":
      return (
        <TextAreaField
          id={id}
          className={className}
          label={def.label}
          hint={def.hint}
          error={error}
          required={def.required}
          maxLength={def.maxLength}
          showCount={Boolean(def.maxLength)}
          placeholder={def.placeholder}
          value={text}
          rows={3}
          onChange={(event) => onChange(event.target.value)}
        />
      );
    case "select":
      return (
        <SelectField
          id={id}
          className={className}
          label={def.label}
          hint={def.hint}
          error={error}
          required={def.required}
          value={text}
          options={[{ value: "", label: "Selecione" }, ...options]}
          onChange={(event) => onChange(event.target.value)}
        />
      );
    case "toggle":
      return (
        <div className={cx(styles.field, styles.full)}>
          <Switch checked={value === true} onChange={onChange} label={def.label} showLabel />
        </div>
      );
    case "checkbox":
      return (
        <div className={cx(styles.field, styles.full)}>
          <CheckboxField id={id} label={def.label} checked={value === true} error={error} onChange={(event) => onChange(event.target.checked)} />
        </div>
      );
    case "video":
    case "image":
    case "file":
      return (
        <div className={className}>
          <ImageField def={def} value={text} onChange={onChange} error={error} />
        </div>
      );
    default:
      return (
        <TextField
          id={id}
          className={className}
          label={def.label}
          hint={def.hint}
          error={error}
          required={def.required}
          type={def.type === "email" ? "email" : def.type === "url" ? "url" : "text"}
          inputMode={def.type === "email" ? "email" : def.type === "url" ? "url" : undefined}
          maxLength={def.maxLength}
          placeholder={def.placeholder}
          value={text}
          onChange={(event) => onChange(event.target.value)}
        />
      );
  }
}
