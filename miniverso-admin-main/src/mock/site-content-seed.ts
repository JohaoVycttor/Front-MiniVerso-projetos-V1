/**
 * Conteúdo inicial da página, com os textos do layout público no Figma.
 * Imagens começam vazias: as oficiais ainda serão enviadas pela Miniverso.
 */
import type { SiteContent } from "@/features/home-editor/types";

export function createSeedContent(): SiteContent {
  return {
    publishedAt: "2026-10-11T14:32:00.000Z",
    sections: [
      {
        key: "hero",
        visible: true,
        fields: {
          eyebrow: "Realidade virtual · Tecnologia · Inovação",
          title: "Miniverso. Outras realidades.",
          subtitle: "Experiências imersivas que levam pessoas e empresas para onde a tela não alcança.",
          primaryLabel: "Ver projetos",
          primaryTarget: "projetos",
          secondaryLabel: "Conhecer serviços",
          secondaryTarget: "servicos",
          model3d: "",
          background: "",
          mobileImage: "",
          imageAlt: "",
          autoRotate: true,
        },
        items: [],
      },
      {
        key: "sobre",
        visible: true,
        fields: {
          title: "Um universo de possibilidades em escala humana.",
          text: "A Miniverso nasceu na educação e hoje cria experiências em realidade virtual, aumentada e mista, além de vídeos em 360 graus e software sob medida.",
          background: "",
        },
        items: [
          { id: "sobre-1", title: "Sob medida", description: "Cada experiência parte da necessidade do cliente." },
          { id: "sobre-2", title: "Tecnologia imersiva", description: "Realidade virtual, aumentada e mista." },
          { id: "sobre-3", title: "Criatividade com propósito", description: "Ideias que resolvem problemas reais." },
          { id: "sobre-4", title: "Foco em quem usa", description: "Interfaces pensadas para pessoas." },
        ],
      },
      {
        key: "servicos",
        visible: true,
        fields: { title: "Novas formas de experimentar.", subtitle: "Do conceito à entrega, com tecnologia imersiva.", background: "" },
        items: [
          { id: "serv-1", visible: true, title: "Realidade virtual", description: "Simulações e treinamentos imersivos com óculos de RV.", image: "", imageAlt: "" },
          { id: "serv-2", visible: true, title: "Realidade aumentada", description: "Conteúdo digital sobre o mundo real, direto no celular.", image: "", imageAlt: "" },
          { id: "serv-3", visible: true, title: "Vídeos 360°", description: "Captação e edição para tours e experiências envolventes.", image: "", imageAlt: "" },
          { id: "serv-4", visible: true, title: "Experiências educacionais", description: "Aprendizado prático com laboratórios e cenários virtuais.", image: "", imageAlt: "" },
          { id: "serv-5", visible: true, title: "Software, web e UI/UX", description: "Sistemas, sites e interfaces sob medida.", image: "", imageAlt: "" },
        ],
      },
      {
        key: "projetos",
        visible: true,
        fields: { title: "Projetos que viraram experiência.", subtitle: "Alguns trabalhos recentes da Miniverso.", featured: "proj-1", background: "" },
        items: [
          {
            id: "proj-1",
            visible: true,
            name: "Laboratório virtual de química",
            category: "Experiências educacionais",
            client: "",
            cover: "",
            coverAlt: "",
            summary: "Experimentos de química em realidade virtual, sem risco e sem reagentes.",
            technologies: "Realidade virtual, Unity",
            details: "",
            link: "",
          },
          {
            id: "proj-2",
            visible: true,
            name: "Tour 360° do campus",
            category: "Vídeos 360°",
            client: "",
            cover: "",
            coverAlt: "",
            summary: "Visita guiada em 360 graus para apresentar a estrutura de uma instituição.",
            technologies: "Vídeo 360°, Web",
            details: "",
            link: "",
          },
          {
            id: "proj-3",
            visible: true,
            name: "Ativação de marca em feira",
            category: "Realidade virtual",
            client: "",
            cover: "",
            coverAlt: "",
            summary: "Estande com óculos de RV para uma feira de tecnologia.",
            technologies: "Realidade virtual",
            details: "",
            link: "",
          },
        ],
      },
      {
        key: "diferenciais",
        visible: true,
        fields: { title: "Por que a Miniverso", background: "" },
        items: [
          { id: "dif-1", title: "Inovação" },
          { id: "dif-2", title: "Personalização" },
          { id: "dif-3", title: "Tecnologia" },
          { id: "dif-4", title: "Criatividade" },
          { id: "dif-5", title: "Experiência do usuário" },
          { id: "dif-6", title: "Soluções sob demanda" },
        ],
      },
      {
        key: "experiencia",
        visible: false,
        fields: { title: "Transforme atenção em conexão real.", text: "", background: "" },
        items: [],
      },
      {
        key: "processo",
        visible: true,
        fields: { title: "Da conversa à experiência.", subtitle: "Como uma ideia vira projeto.", background: "" },
        items: [
          { id: "proc-1", title: "Descobrir", description: "Entendemos a necessidade e o público do projeto." },
          { id: "proc-2", title: "Planejar", description: "Definimos a solução e a experiência pretendida." },
          { id: "proc-3", title: "Criar", description: "Desenvolvemos, testamos e ajustamos com o cliente." },
          { id: "proc-4", title: "Conectar", description: "Entregamos e acompanhamos o uso da experiência." },
        ],
      },
      {
        key: "clientes",
        visible: false,
        fields: { title: "Quem já viveu outras realidades com a gente", background: "" },
        items: [],
      },
      {
        key: "contato",
        visible: true,
        fields: {
          title: "Sua ideia. Nosso próximo universo.",
          support: "Conte o que você imagina e a gente responde.",
          email: "contato@example.com",
          whatsapp: "(98) 90000-0000",
          instagram: "@miniverso",
          successMessage: "Mensagem enviada! Em breve a equipe da Miniverso entra em contato.",
          errorMessage: "Não foi possível enviar agora. Seus dados foram mantidos, tente de novo.",
          background: "",
        },
        items: [],
      },
      {
        key: "rodape",
        visible: true,
        fields: {
          tagline: "Experiências imersivas feitas em São Luís.",
          useContactChannels: true,
          privacyUrl: "https://example.com/privacidade",
          copyright: "© 2026 Miniverso. Todos os direitos reservados.",
        },
        items: [{ id: "rede-1", name: "Instagram", url: "https://instagram.com/" }],
      },
    ],
  };
}
