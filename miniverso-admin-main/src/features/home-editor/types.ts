/** Tipos do editor da página inicial (RF15, RF18). */

export type SectionKey =
  | "hero"
  | "sobre"
  | "servicos"
  | "projetos"
  | "diferenciais"
  | "experiencia"
  | "processo"
  | "clientes"
  | "contato"
  | "rodape";

export type FieldValue = string | boolean;

export type FieldType = "text" | "textarea" | "select" | "toggle" | "checkbox" | "image" | "file" | "video" | "url" | "email";

/** De onde vêm as opções de um select. */
export type OptionSource = "sections" | "projects" | "services" | Array<{ value: string; label: string }>;

export type FieldDef = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  hint?: string;
  placeholder?: string;
  maxLength?: number;
  options?: OptionSource;
  /** Ocupa meia largura no desktop. */
  half?: boolean;
  /** Imagem só de enfeite (ex.: fundo): não exige texto alternativo (RNF34 vale para imagens com conteúdo). */
  decorative?: boolean;
  /** Para arquivos: tipos aceitos e tamanho máximo (RNF24). */
  accept?: string[];
  maxSizeMb?: number;
};

export type ItemsDef = {
  /** Ex.: "serviço" */
  singular: string;
  /** Ex.: "Serviços" */
  title: string;
  description: string;
  titleField: string;
  subtitleField?: string;
  imageField?: string;
  fields: FieldDef[];
  /** O item pode ser ocultado sem ser removido. */
  hasVisibility?: boolean;
  /** Mostra a posição como número (Processo). */
  numbered?: boolean;
  /** Usa painel lateral em vez de modal (formulários longos, como Projetos). */
  drawer?: boolean;
};

export type SectionDef = {
  key: SectionKey;
  name: string;
  description: string;
  /** "deverá" no DRDA vira obrigatória; "poderá" vira opcional; Clientes é condicional. */
  requirement: "required" | "optional" | "conditional";
  fixed?: "top" | "bottom";
  /** Motivo de o botão de exibir ficar bloqueado. */
  locked?: string;
  reqs: string;
  fields: FieldDef[];
  items?: ItemsDef;
  notes?: string[];
};

export type ContentItem = { id: string; visible?: boolean } & Record<string, FieldValue | undefined>;

export type SectionContent = {
  key: SectionKey;
  visible: boolean;
  fields: Record<string, FieldValue>;
  items: ContentItem[];
};

export type SiteContent = {
  /** Na ordem em que aparecem na página. */
  sections: SectionContent[];
  publishedAt: string | null;
};
