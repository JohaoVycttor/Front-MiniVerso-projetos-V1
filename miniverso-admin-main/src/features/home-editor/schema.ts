/**
 * Definição das seções da página inicial, seguindo o DRDA (3.1.1) e o frame
 * "Painel · Editor da página inicial" no Figma. O editor monta os formulários a partir daqui.
 */
import type { FieldDef, SectionDef, SectionKey } from "./types";

const IMAGE: Pick<FieldDef, "accept" | "maxSizeMb"> = {
  accept: ["image/jpeg", "image/png", "image/webp"],
  maxSizeMb: 2,
};

/**
 * Imagem de fundo opcional da seção (RF15: imagens institucionais).
 * É decorativa: não precisa de texto alternativo. A página pública aplica uma
 * camada sobre a imagem para o texto continuar legível (RNF33).
 */
const BACKGROUND: FieldDef = {
  name: "background",
  label: "Imagem de fundo (opcional)",
  type: "image",
  ...IMAGE,
  decorative: true,
  hint: "Fica atrás do conteúdo da seção. É decorativa, então não precisa de texto alternativo.",
};

export const SECTION_DEFS: SectionDef[] = [
  {
    key: "hero",
    name: "Hero",
    description: "Primeira dobra da página, com destaque para as soluções de Realidade Virtual.",
    requirement: "required",
    fixed: "top",
    reqs: "RIU01 a RIU10 · RF15",
    fields: [
      { name: "eyebrow", label: "Texto de apoio (acima da chamada)", type: "text", maxLength: 60 },
      { name: "title", label: "Chamada principal", type: "text", required: true, maxLength: 80, hint: "Frase curta e direta (RIU08, RNF27)." },
      { name: "subtitle", label: "Subtítulo", type: "textarea", maxLength: 160 },
      { name: "primaryLabel", label: "Botão principal · texto", type: "text", required: true, maxLength: 30, half: true },
      { name: "primaryTarget", label: "Botão principal · destino", type: "select", required: true, options: "sections", half: true },
      { name: "secondaryLabel", label: "Botão secundário · texto", type: "text", maxLength: 30, half: true },
      { name: "secondaryTarget", label: "Botão secundário · destino", type: "select", options: "sections", half: true },
      {
        name: "model3d",
        label: "Modelo 3D do óculos",
        type: "file",
        accept: ["model/gltf-binary", ".glb"],
        maxSizeMb: 10,
        hint: "Arquivo .glb de até 10 MB (RIU03, RNF03).",
        half: true,
      },
      { name: "background", label: "Imagem de fundo", type: "image", ...IMAGE, half: true },
      { name: "mobileImage", label: "Imagem alternativa (celular)", type: "image", ...IMAGE, hint: "Substitui o 3D quando ele é simplificado (RIU30, RNF05).", half: true },
      { name: "imageAlt", label: "Texto alternativo das imagens", type: "textarea", maxLength: 160, hint: "Obrigatório quando houver imagem (RNF34).", half: true },
      { name: "autoRotate", label: "Rotação automática do modelo 3D (RIU04)", type: "toggle" },
    ],
  },
  {
    key: "sobre",
    name: "Sobre a Miniverso",
    description: "Quem é a Miniverso, área de atuação e proposta.",
    requirement: "required",
    reqs: "RF01 · RF15 · RIU11 · RIU12",
    fields: [
      { name: "title", label: "Título", type: "text", required: true, maxLength: 80 },
      { name: "text", label: "Texto institucional", type: "textarea", required: true, maxLength: 1200, hint: "Conte a história em parágrafos curtos, separados por uma linha em branco." },
      { name: "audienceIntro", label: "Para quem criamos · introdução", type: "textarea", maxLength: 300 },
      { name: "audienceSchools", label: "Para escolas", type: "textarea", maxLength: 300 },
      { name: "audienceTeachers", label: "Para professores", type: "textarea", maxLength: 300 },
      { name: "audienceStudents", label: "Para estudantes", type: "textarea", maxLength: 300 },
      BACKGROUND,
    ],
    items: {
      singular: "destaque",
      title: "Destaques",
      description: "Cards sobre atuação, proposta, tecnologia e tipos de solução (RIU12).",
      titleField: "title",
      subtitleField: "description",
      fields: [
        { name: "title", label: "Título", type: "text", required: true, maxLength: 40 },
        { name: "description", label: "Descrição", type: "textarea", maxLength: 400 },
      ],
    },
  },
  {
    key: "servicos",
    name: "Serviços",
    description: "Cards dos serviços oferecidos pela empresa.",
    requirement: "required",
    reqs: "RF02 · RF13 · RIU13 a RIU15",
    fields: [
      { name: "title", label: "Título da seção", type: "text", required: true, maxLength: 80, half: true },
      { name: "subtitle", label: "Subtítulo", type: "text", maxLength: 120, half: true },
      BACKGROUND,
    ],
    items: {
      singular: "serviço",
      title: "Serviços",
      description: "Quantidade livre (RIU15). Use as setas para definir a ordem dos cards.",
      titleField: "title",
      subtitleField: "description",
      imageField: "image",
      hasVisibility: true,
      fields: [
        { name: "title", label: "Título", type: "text", required: true, maxLength: 40 },
        { name: "description", label: "Descrição breve", type: "textarea", required: true, maxLength: 140, hint: "Uma ou duas linhas (RIU13, RNF27)." },
        { name: "image", label: "Ícone ou imagem (opcional)", type: "image", ...IMAGE },
        { name: "imageAlt", label: "Texto alternativo da imagem", type: "text", maxLength: 120 },
      ],
    },
    notes: ["A lista de serviços também alimenta o campo \"Serviço de interesse\" do formulário de contato."],
  },
  {
    key: "projetos",
    name: "Projetos",
    description: "Portfólio com projeto em destaque e grade de projetos.",
    requirement: "required",
    reqs: "RF03 · RF04 · RF14 · RIU16 a RIU18",
    fields: [
      { name: "title", label: "Título da seção", type: "text", required: true, maxLength: 80, half: true },
      { name: "subtitle", label: "Subtítulo", type: "text", maxLength: 120, half: true },
      { name: "featured", label: "Projeto em destaque", type: "select", required: true, options: "projects", hint: "Exibido com maior destaque antes da grade (RIU17)." },
      BACKGROUND,
    ],
    items: {
      singular: "projeto",
      title: "Projetos",
      description: "Cada projeto tem página de detalhes (RF04). Projeto oculto ou removido sai da página pública (RN03).",
      titleField: "name",
      subtitleField: "category",
      imageField: "cover",
      hasVisibility: true,
      drawer: true,
      fields: [
        { name: "name", label: "Nome do projeto", type: "text", required: true, maxLength: 60 },
        { name: "category", label: "Categoria", type: "select", required: true, options: "services", half: true },
        { name: "client", label: "Cliente", type: "text", maxLength: 60, placeholder: "Só se o cliente autorizar", half: true },
        { name: "cover", label: "Capa", type: "image", required: true, ...IMAGE },
        { name: "coverAlt", label: "Texto alternativo da capa", type: "text", required: true, maxLength: 120 },
        { name: "summary", label: "Descrição breve", type: "textarea", required: true, maxLength: 160, hint: "Exibida no card do portfólio." },
        { name: "technologies", label: "Tecnologias ou serviços utilizados", type: "text", maxLength: 120, hint: "Separe por vírgula." },
        { name: "details", label: "Descrição detalhada (página do projeto)", type: "textarea", maxLength: 1200 },
        { name: "link", label: "Link externo", type: "url", placeholder: "https://" },
      ],
    },
  },
  {
    key: "diferenciais",
    name: "Diferenciais",
    description: "Características da empresa, em formato visual e objetivo.",
    requirement: "optional",
    reqs: "RIU19",
    fields: [
      { name: "title", label: "Título da seção", type: "text", required: true, maxLength: 80 },
      { name: "statement", label: "Mensagem da marca", type: "textarea", maxLength: 240 },
      { name: "attributes", label: "Atributos da marca", type: "textarea", maxLength: 160, hint: "Um atributo por linha." },
      BACKGROUND,
    ],
    items: {
      singular: "diferencial",
      title: "Itens",
      description: "Título curto, sem blocos de texto (RIU19).",
      titleField: "title",
      fields: [
        { name: "title", label: "Título", type: "text", required: true, maxLength: 30 },
        { name: "description", label: "Descrição", type: "textarea", maxLength: 300 },
      ],
    },
  },
  {
    key: "experiencia",
    name: "Experiência interativa",
    description: "Área de demonstração tecnológica com elementos 3D.",
    requirement: "optional",
    locked: "A experiência 3D é construída em código e depende de viabilidade técnica e cronograma (RIU20).",
    reqs: "RIU20",
    fields: [
      { name: "title", label: "Título da seção", type: "text", required: true, maxLength: 80 },
      { name: "text", label: "Texto de apoio", type: "textarea", maxLength: 200 },
      BACKGROUND,
    ],
  },
  {
    key: "processo",
    name: "Processo",
    description: "Como a Miniverso transforma uma ideia em projeto.",
    requirement: "optional",
    reqs: "RF05 · RIU21",
    fields: [
      { name: "title", label: "Título da seção", type: "text", required: true, maxLength: 80, half: true },
      { name: "subtitle", label: "Subtítulo", type: "text", maxLength: 120, half: true },
      BACKGROUND,
    ],
    items: {
      singular: "etapa",
      title: "Etapas",
      description: "A numeração segue a ordem da lista (RIU21).",
      titleField: "title",
      subtitleField: "description",
      numbered: true,
      fields: [
        { name: "title", label: "Título", type: "text", required: true, maxLength: 30 },
        { name: "description", label: "Descrição", type: "textarea", required: true, maxLength: 140 },
      ],
    },
  },
  {
    key: "clientes",
    name: "Clientes e parceiros",
    description: "Logos de empresas e parceiros, somente com autorização.",
    requirement: "conditional",
    reqs: "RIU22 · RIU23",
    fields: [{ name: "title", label: "Título da seção", type: "text", required: true, maxLength: 80 }, BACKGROUND],
    items: {
      singular: "logo",
      title: "Logos",
      description: "Só logos com uso autorizado aparecem na página (RIU22).",
      titleField: "name",
      imageField: "logo",
      fields: [
        { name: "name", label: "Nome da empresa", type: "text", required: true, maxLength: 60, half: true },
        { name: "link", label: "Link", type: "url", placeholder: "https://", half: true },
        { name: "logo", label: "Logo", type: "image", required: true, accept: ["image/png", "image/webp"], maxSizeMb: 1, hint: "PNG ou WebP com fundo transparente." },
        { name: "authorized", label: "Confirmo que a empresa autorizou o uso da marca no site da Miniverso.", type: "checkbox" },
      ],
    },
    notes: ["Sem nenhum logo autorizado, a seção fica oculta sem afetar a página (RIU23)."],
  },
  {
    key: "contato",
    name: "Contato",
    description: "Captação de interessados e canais diretos.",
    requirement: "required",
    reqs: "RF06 · RF09 · RIU24 a RIU26",
    fields: [
      { name: "title", label: "Título da seção", type: "text", required: true, maxLength: 80, half: true },
      { name: "support", label: "Texto de apoio", type: "text", maxLength: 120, half: true },
      { name: "email", label: "E-mail", type: "email", half: true },
      { name: "whatsapp", label: "WhatsApp", type: "text", maxLength: 20, placeholder: "(98) 90000-0000", half: true },
      { name: "instagram", label: "Instagram", type: "text", maxLength: 40, placeholder: "@miniverso", half: true },
      { name: "successMessage", label: "Mensagem de sucesso", type: "textarea", required: true, maxLength: 160, half: true },
      { name: "errorMessage", label: "Mensagem de erro", type: "textarea", required: true, maxLength: 160, half: true },
      BACKGROUND,
    ],
    notes: [
      "Os campos do formulário (nome, e-mail, telefone, empresa, serviço de interesse e mensagem) são definidos pelo RF06 e não mudam pelo painel.",
      "O DRDA ainda não define quais campos do formulário são obrigatórios (RF07).",
    ],
  },
  {
    key: "rodape",
    name: "Rodapé",
    description: "Encerramento da página com contatos, redes e informações legais.",
    requirement: "required",
    fixed: "bottom",
    reqs: "RIU27",
    fields: [
      { name: "tagline", label: "Frase de identificação", type: "textarea", maxLength: 120 },
      { name: "useContactChannels", label: "Usar os canais diretos da seção Contato", type: "toggle" },
      { name: "privacyUrl", label: "Link da Política de Privacidade", type: "url", required: true, placeholder: "https://", half: true },
      { name: "copyright", label: "Texto de direitos autorais", type: "text", required: true, maxLength: 80, half: true },
    ],
    items: {
      singular: "rede social",
      title: "Redes sociais",
      description: "Ícones com link para os perfis.",
      titleField: "name",
      subtitleField: "url",
      fields: [
        { name: "name", label: "Rede", type: "text", required: true, maxLength: 30 },
        { name: "url", label: "Endereço do perfil", type: "url", required: true, placeholder: "https://" },
      ],
    },
    notes: ["Os atalhos de navegação do rodapé seguem as seções visíveis, sem edição manual."],
  },
];

// Campos compartilhados pelo renderizador público. Os valores vazios removem o elemento.
const text = (name: string, label: string, maxLength = 160): FieldDef => ({name,label,type:"textarea",maxLength});
const media: FieldDef[] = [
  {name:"mediaImage",label:"Imagem do conteúdo",type:"image",...IMAGE},
  text("mediaAlt","Descrição acessível da mídia"),
  {name:"video",label:"Vídeo (MP4 ou WebM, até 50 MB)",type:"video",accept:["video/mp4","video/webm"],maxSizeMb:50},
  {name:"videoUrl",label:"Ou endereço direto do vídeo (MP4/WebM)",type:"url"},
  {name:"poster",label:"Capa do vídeo",type:"image",...IMAGE,decorative:true},
  text("caption","Legenda visível da mídia",300),
];
for (const def of SECTION_DEFS) {
  // Os comprimentos acompanham os textos já publicados no site.
  for (const field of [...def.fields,...(def.items?.fields || [])]) {
    if (field.maxLength) field.maxLength = Math.max(field.maxLength, field.type === "textarea" ? 1200 : 160);
    if (field.name === "privacyUrl" || field.name === "image" || field.name === "imageAlt") field.required = false;
  }
  if (def.key !== "rodape") {
    def.fields.push(text("highlight","Trecho do título em destaque"), ...media);
    if (!def.fields.some(f=>f.name==="eyebrow")) def.fields.push(text("eyebrow","Legenda acima do título"));
    if (!def.fields.some(f=>f.name==="background")) def.fields.push(BACKGROUND);
  }
  if (def.key !== "hero") def.fields.push(text("buttonLabel","Texto do botão"),{name:"buttonUrl",label:"Destino do botão",type:"url"});
  if (def.items) {
    def.items.hasVisibility = true;
    def.fields.push({name:"columns",label:"Colunas de cards no computador",type:"select",options:[{value:"1",label:"Uma"},{value:"2",label:"Duas"},{value:"3",label:"Três"}]});
    def.items.fields.push(text("eyebrow","Legenda acima do card"),...media);
    if (!def.items.fields.some(f=>f.name==="link")) def.items.fields.push({name:"link",label:"Link do card",type:"url"});
    def.items.fields.push(text("buttonLabel","Texto do link do card"));
  }
  if (def.key === "experiencia") { delete def.locked; def.description = "Demonstração com imagem, vídeo ou experiência visual do site."; }
  if (def.key === "hero") def.fields = def.fields.filter(f=>!["model3d","autoRotate"].includes(f.name));
  if (def.key === "contato") { def.fields = def.fields.filter(f=>!["successMessage","errorMessage"].includes(f.name)); def.notes = ["Esta seção abre a página de contato. Os canais também podem aparecer no rodapé."]; }
  if (def.key === "hero") def.fields.push(text("brandTitle","Nome acima da chamada"),text("location","Localização"),text("scrollLabel","Texto do link para explorar"),{name:"scrollTarget",label:"Seção ao explorar",type:"select",options:"sections"},text("scrollCount","Indicador de seções"),text("strip","Faixa de especialidades (uma por linha)",600));
  if (def.key === "sobre") def.fields.push(text("buttonNote","Texto ao lado do botão"),text("secondaryLabel","Texto do segundo link"),{name:"secondaryUrl",label:"Destino do segundo link",type:"url"},text("artLabel","Legenda acima da animação"),text("artFooter","Legenda abaixo da animação"),text("artCode","Identificação da animação"));
  if (def.key === "rodape") def.fields.push(text("contactTitle","Título do contato"),text("location","Localização"),text("bottomText","Frase ao final"),text("navigationLabel","Título da navegação"));
}
export const SECTION_BY_KEY = Object.fromEntries(SECTION_DEFS.map((def) => [def.key, def])) as Record<SectionKey, SectionDef>;
