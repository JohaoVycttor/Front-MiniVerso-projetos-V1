"use client";

import { LuArrowDown, LuArrowUp, LuCircleAlert, LuLock } from "react-icons/lu";
import { IconButton } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cx } from "@/lib/cx";
import { canMoveSection, sectionDefsInOrder, sectionSummary, visibilityControl } from "./rules";
import type { SectionKey, SiteContent } from "./types";
import styles from "./editor.module.css";

type StructurePanelProps = {
  content: SiteContent;
  selected: SectionKey;
  changed: SectionKey[];
  invalid: SectionKey[];
  onSelect: (key: SectionKey) => void;
  onMove: (key: SectionKey, direction: -1 | 1) => void;
  onToggle: (key: SectionKey, visible: boolean) => void;
};

/**
 * Lista das seções na ordem da página pública (RF15, RF18).
 * Setas no lugar de arrastar: funcionam no teclado e no toque (RNF35, RNF40).
 * Estado em texto e ícone, nunca só por cor (RNF39).
 */
export function StructurePanel({ content, selected, changed, invalid, onSelect, onMove, onToggle }: StructurePanelProps) {
  return (
    <section className={styles.structure} aria-labelledby="estrutura-titulo">
      <span className={styles.reqs}>RF15 · RF18 · RNF41 · RNF44</span>
      <h2 id="estrutura-titulo" className={styles.panelTitle}>
        Estrutura da página
      </h2>
      <p className={styles.muted}>Use as setas para reordenar. Hero e Rodapé têm posição fixa.</p>

      <ol className={styles.sectionList}>
        {sectionDefsInOrder(content).map(({ def, section }, index) => {
          const control = visibilityControl(def, section);
          const isSelected = selected === def.key;
          const isChanged = changed.includes(def.key);
          const hasError = invalid.includes(def.key);
          const hidden = !section.visible;
          return (
            <li key={def.key} className={cx(styles.sectionRow, isSelected && styles.sectionRowActive, hidden && styles.sectionRowHidden)}>
              <div className={styles.moveButtons}>
                {def.fixed ? (
                  <span className={styles.fixedIcon} title="Posição fixa">
                    <LuLock aria-hidden="true" />
                    <span className="sr-only">Posição fixa</span>
                  </span>
                ) : (
                  <>
                    <IconButton
                      label={`Mover ${def.name} para cima`}
                      icon={<LuArrowUp aria-hidden="true" />}
                      className={styles.moveButton}
                      disabled={!canMoveSection(content, def.key, -1)}
                      onClick={() => onMove(def.key, -1)}
                    />
                    <IconButton
                      label={`Mover ${def.name} para baixo`}
                      icon={<LuArrowDown aria-hidden="true" />}
                      className={styles.moveButton}
                      disabled={!canMoveSection(content, def.key, 1)}
                      onClick={() => onMove(def.key, 1)}
                    />
                  </>
                )}
              </div>

              <button
                type="button"
                className={styles.sectionSelect}
                aria-current={isSelected ? "true" : undefined}
                onClick={() => onSelect(def.key)}
              >
                <span className={styles.sectionName}>
                  <span className="sr-only">{index + 1}. </span>
                  {def.name}
                  {isChanged && (
                    <span className={styles.changedTag}>
                      <span className={styles.dot} aria-hidden="true" />
                      Alterada
                    </span>
                  )}
                </span>
                <span className={styles.sectionMeta}>{hidden && !def.locked ? "Oculta na página" : sectionSummary(def, section)}</span>
                {hasError && (
                  <span className={styles.errorTag}>
                    <LuCircleAlert aria-hidden="true" />
                    Revisar campos
                  </span>
                )}
              </button>

              <div className={styles.sectionVisibility}>
                {def.requirement === "required" ? (
                  <span className={styles.pill}>Obrigatória</span>
                ) : (
                  <Switch
                    checked={section.visible}
                    onChange={(visible) => onToggle(def.key, visible)}
                    label={`Exibir ${def.name} na página`}
                    disabled={!control.canToggle}
                    disabledReason={control.reason}
                  />
                )}
              </div>
            </li>
          );
        })}
      </ol>

      <p className={styles.note}>
        <strong>Nota:</strong> seções novas exigem desenvolvimento (3.1.1). O painel exibe, oculta, reordena e edita as seções existentes.
      </p>
      <p className={styles.note}>
        <strong>Cabeçalho:</strong> o menu do site e os atalhos do rodapé seguem as seções visíveis, na ordem desta lista.
      </p>
    </section>
  );
}
