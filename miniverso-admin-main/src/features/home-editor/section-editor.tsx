"use client";

import { LuArrowDown, LuArrowUp, LuImage, LuInfo, LuPencil, LuPlus, LuTrash2 } from "react-icons/lu";
import { Alert } from "@/components/ui/alert";
import { Button, IconButton } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cx } from "@/lib/cx";
import { FieldInput } from "./field-input";
import { resolveOptions, visibilityControl, type SectionErrors } from "./rules";
import type { ContentItem, FieldValue, SectionContent, SectionDef, SiteContent } from "./types";
import styles from "./editor.module.css";

type SectionEditorProps = {
  def: SectionDef;
  section: SectionContent;
  content: SiteContent;
  /** Só aparecem depois de uma tentativa de publicar (RNF30). */
  errors?: SectionErrors;
  onFieldChange: (name: string, value: FieldValue) => void;
  onToggleVisible: (visible: boolean) => void;
  onAddItem: () => void;
  onEditItem: (item: ContentItem) => void;
  onRemoveItem: (item: ContentItem) => void;
  onMoveItem: (id: string, direction: -1 | 1) => void;
  onToggleItem: (id: string, visible: boolean) => void;
};

/** Formulário de uma seção, montado a partir do schema (RF15). */
export function SectionEditor({
  def,
  section,
  content,
  errors,
  onFieldChange,
  onToggleVisible,
  onAddItem,
  onEditItem,
  onRemoveItem,
  onMoveItem,
  onToggleItem,
}: SectionEditorProps) {
  const control = visibilityControl(def, section);
  const items = def.items;
  const headingId = `secao-${def.key}-titulo`;

  return (
    <section className={styles.editor} aria-labelledby={headingId}>
      <div className={styles.editorHead}>
        <div className={styles.editorTitleBlock}>
          <span className={styles.reqs}>{def.reqs}</span>
          <h2 id={headingId} className={styles.editorTitle} tabIndex={-1}>
            {def.name}
          </h2>
          <p className={styles.muted}>{def.description}</p>
        </div>
        {def.requirement === "required" ? (
          <span className={styles.pill}>Obrigatória · sempre visível</span>
        ) : (
          <Switch
            checked={section.visible}
            onChange={onToggleVisible}
            label={`Exibir ${def.name} na página`}
            stateText={section.visible ? "Visível na página" : "Oculta na página"}
            disabled={!control.canToggle}
            disabledReason={control.reason}
          />
        )}
      </div>

      {def.locked && (
        <Alert tone="info" title="Exibição bloqueada">
          {def.locked} Os textos podem ser preparados agora.
        </Alert>
      )}
      {!def.locked && !control.canToggle && control.reason && def.requirement !== "required" && (
        <Alert tone="info">{control.reason}</Alert>
      )}
      {errors?.section && (
        <Alert tone="error" title="Não dá para publicar ainda">
          {errors.section}
        </Alert>
      )}

      {def.fields.length > 0 && (
        <div className={styles.fieldGrid}>
          {def.fields.map((field) => (
            <FieldInput
              key={field.name}
              idPrefix={`secao-${def.key}`}
              def={field}
              value={section.fields[field.name]}
              error={errors?.fields[field.name]}
              options={resolveOptions(field.options, content)}
              onChange={(value) => onFieldChange(field.name, value)}
            />
          ))}
        </div>
      )}

      {items && (
        <div className={styles.items}>
          <div>
            <h3 className={styles.itemsTitle}>{items.title}</h3>
            <p className={styles.muted}>{items.description}</p>
          </div>

          {section.items.length === 0 ? (
            <div className={styles.itemsEmpty}>
              <p>Nenhum {items.singular} cadastrado ainda.</p>
            </div>
          ) : (
            <ol className={styles.itemList}>
              {section.items.map((item, index) => {
                const title = String(item[items.titleField] ?? "") || `${items.singular} sem título`;
                const subtitle = items.subtitleField ? String(item[items.subtitleField] ?? "") : "";
                const image = items.imageField ? String(item[items.imageField] ?? "") : "";
                const hidden = item.visible === false;
                const featured = def.key === "projetos" && section.fields.featured === item.id;
                const unauthorized = def.key === "clientes" && item.authorized !== true;
                return (
                  <li key={item.id} className={cx(styles.itemRow, hidden && styles.itemHidden)}>
                    <div className={styles.moveButtons}>
                      <IconButton
                        label={`Mover ${title} para cima`}
                        icon={<LuArrowUp aria-hidden="true" />}
                        className={styles.moveButton}
                        disabled={index === 0}
                        onClick={() => onMoveItem(item.id, -1)}
                      />
                      <IconButton
                        label={`Mover ${title} para baixo`}
                        icon={<LuArrowDown aria-hidden="true" />}
                        className={styles.moveButton}
                        disabled={index === section.items.length - 1}
                        onClick={() => onMoveItem(item.id, 1)}
                      />
                    </div>
                    {items.numbered && (
                      <span className={styles.itemNumber} aria-hidden="true">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    )}
                    {items.imageField &&
                      (image ? (
                        // eslint-disable-next-line @next/next/no-img-element -- miniatura do conteúdo, sem otimização do Next
                        <img src={image} alt="" className={styles.itemThumb} />
                      ) : (
                        <span className={styles.itemThumb} aria-hidden="true">
                          <LuImage />
                        </span>
                      ))}
                    <div className={styles.itemText}>
                      <span className={styles.itemTitle}>
                        {title}
                        {featured && <span className={styles.featuredTag}>Em destaque</span>}
                      </span>
                      {hidden ? (
                        <span className={styles.itemSub}>Oculto da página</span>
                      ) : unauthorized ? (
                        <span className={styles.itemSub}>
                          <LuInfo aria-hidden="true" className={styles.inlineIcon} /> Sem autorização: não aparece na página
                        </span>
                      ) : (
                        subtitle && <span className={styles.itemSub}>{subtitle}</span>
                      )}
                    </div>
                    <div className={styles.itemActions}>
                      {items.hasVisibility && (
                        <Switch
                          checked={!hidden}
                          onChange={(visible) => onToggleItem(item.id, visible)}
                          label={`Exibir ${title} na página`}
                        />
                      )}
                      <Button size="sm" variant="ghost" icon={<LuPencil aria-hidden="true" />} onClick={() => onEditItem(item)}>
                        Editar<span className="sr-only"> {title}</span>
                      </Button>
                      <Button size="sm" variant="danger-ghost" icon={<LuTrash2 aria-hidden="true" />} onClick={() => onRemoveItem(item)}>
                        Remover<span className="sr-only"> {title}</span>
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}

          <button type="button" className={styles.addItem} onClick={onAddItem}>
            <LuPlus aria-hidden="true" />
            Adicionar {items.singular}
          </button>
        </div>
      )}

      {def.notes?.map((note) => (
        <p key={note} className={styles.note}>
          <strong>Nota:</strong> {note}
        </p>
      ))}
    </section>
  );
}
