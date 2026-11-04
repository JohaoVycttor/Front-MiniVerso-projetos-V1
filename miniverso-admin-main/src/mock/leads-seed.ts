/**
 * Leads de exemplo do modo mock.
 * Nomes, e-mails, telefones e empresas são fictícios (RNF18, LGPD); os e-mails usam o domínio reservado example.com.
 * O serviço de interesse aponta para os ids da seção Serviços do conteúdo (site-content-seed.ts).
 */

export type MockLead = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  /** Id do serviço na seção Serviços, como o formulário do site envia. */
  service_id: string | null;
  /** Título do serviço no momento do envio: o lead continua legível se o serviço mudar de nome ou sair do site. */
  service_title: string | null;
  message: string;
  created_at: string;
};

const SERVICES: Record<string, string> = {
  "serv-1": "Realidade virtual",
  "serv-2": "Realidade aumentada",
  "serv-3": "Vídeos 360°",
  "serv-4": "Experiências educacionais",
  "serv-5": "Software, web e UI/UX",
};

type LeadSeed = Omit<MockLead, "id" | "created_at" | "service_title"> & { daysAgo: number; hour: number; minute: number };

const LEAD_SEEDS: LeadSeed[] = [
  {
    name: "Ana Ribeiro",
    email: "ana.ribeiro@example.com",
    phone: "(98) 90000-0101",
    company: "Colégio Horizonte",
    service_id: "serv-1",
    message:
      "Olá! Queremos levar uma experiência de realidade virtual para a feira de ciências da escola em novembro. Vocês fazem a montagem no local?\n\nSomos cerca de 400 alunos.",
    daysAgo: 0,
    hour: 9,
    minute: 14,
  },
  {
    name: "Bruno Carvalho",
    email: "bruno.carvalho@example.com",
    phone: "(98) 90000-0102",
    company: "Construtora Atlântica",
    service_id: "serv-1",
    message: "Precisamos de um treinamento de segurança em altura usando RV para a equipe de obra. Podem enviar uma proposta?",
    daysAgo: 1,
    hour: 16,
    minute: 2,
  },
  {
    name: "Carla Mendes",
    email: "carla.mendes@example.com",
    phone: null,
    company: "Clínica Vida Plena",
    service_id: "serv-5",
    message: "Gostaria de um orçamento para um site novo da clínica, com agendamento online.",
    daysAgo: 1,
    hour: 10,
    minute: 37,
  },
  {
    name: "Diego Sousa",
    email: "diego.sousa@example.com",
    phone: "(98) 90000-0104",
    company: null,
    service_id: "serv-5",
    message: "Tenho um aplicativo em fase inicial e preciso de ajuda com a experiência do usuário antes de lançar.",
    daysAgo: 2,
    hour: 19,
    minute: 45,
  },
  {
    name: "Elisa Martins",
    email: "elisa.martins@example.com",
    phone: "(98) 90000-0105",
    company: "Instituto Lumen",
    service_id: "serv-2",
    message: "Estamos montando uma exposição sobre a história de São Luís e queremos conteúdos em realidade aumentada nas peças.",
    daysAgo: 3,
    hour: 14,
    minute: 20,
  },
  {
    name: "Felipe Araújo",
    email: "felipe.araujo@example.com",
    phone: "(98) 90000-0106",
    company: "Rede Bom Preço",
    service_id: "serv-5",
    message: "Precisamos de um sistema para controlar o estoque das nossas três lojas.",
    daysAgo: 4,
    hour: 11,
    minute: 5,
  },
  {
    name: "Gabriela Nunes",
    email: "gabriela.nunes@example.com",
    phone: "(98) 90000-0107",
    company: "Agência Maré",
    service_id: "serv-3",
    message: "Um cliente nosso quer um lançamento imobiliário com tour em 360 graus. Vocês trabalham em parceria com agências?",
    daysAgo: 6,
    hour: 17,
    minute: 50,
  },
  {
    name: "Henrique Lopes",
    email: "henrique.lopes@example.com",
    phone: null,
    company: "Startup Rotas",
    service_id: "serv-5",
    message: "Queremos refazer nossa landing page e integrar com o nosso sistema de cadastro.",
    daysAgo: 8,
    hour: 8,
    minute: 31,
  },
  {
    name: "Isabela Costa",
    email: "isabela.costa@example.com",
    phone: "(98) 90000-0109",
    company: "Faculdade Aurora",
    service_id: "serv-4",
    message: "Temos interesse em laboratórios virtuais para as aulas de anatomia.",
    daysAgo: 9,
    hour: 15,
    minute: 12,
  },
  {
    name: "Jonas Pereira",
    email: "jonas.pereira@example.com",
    phone: "(98) 90000-0110",
    company: null,
    service_id: "serv-1",
    message: "Vocês alugam equipamentos de RV para eventos de fim de semana?",
    daysAgo: 11,
    hour: 20,
    minute: 3,
  },
  {
    name: "Larissa Almeida",
    email: "larissa.almeida@example.com",
    phone: "(98) 90000-0111",
    company: "Hotel Brisa Mar",
    service_id: "serv-5",
    message: "Queremos melhorar o fluxo de reservas do nosso site. Hoje muita gente desiste no meio.",
    daysAgo: 13,
    hour: 9,
    minute: 58,
  },
  {
    name: "Marcos Vieira",
    email: "marcos.vieira@example.com",
    phone: "(98) 90000-0112",
    company: "Indústria Norte Metal",
    service_id: "serv-1",
    message: "Buscamos simulação em RV para operação de máquinas pesadas.",
    daysAgo: 15,
    hour: 13,
    minute: 26,
  },
  {
    name: "Natália Freitas",
    email: "natalia.freitas@example.com",
    phone: null,
    company: "ONG Raízes",
    service_id: "serv-5",
    message: "Somos uma ONG e precisamos de um site simples para divulgar nossos projetos. Existe algum valor social?",
    daysAgo: 18,
    hour: 18,
    minute: 9,
  },
  {
    name: "Otávio Ramos",
    email: "otavio.ramos@example.com",
    phone: "(98) 90000-0114",
    company: "Escritório Ramos & Pires",
    service_id: "serv-5",
    message: "Precisamos de um sistema interno para acompanhar prazos de processos.",
    daysAgo: 21,
    hour: 10,
    minute: 44,
  },
  {
    name: "Paula Teixeira",
    email: "paula.teixeira@example.com",
    phone: "(98) 90000-0115",
    company: "Museu Casa Azul",
    service_id: "serv-2",
    message: "Gostaríamos de transformar parte do acervo em uma experiência com realidade aumentada.",
    daysAgo: 24,
    hour: 16,
    minute: 33,
  },
  {
    name: "Rafael Moura",
    email: "rafael.moura@example.com",
    phone: "(98) 90000-0116",
    company: null,
    service_id: "serv-5",
    message: "Preciso de um protótipo navegável para apresentar a investidores.",
    daysAgo: 27,
    hour: 11,
    minute: 18,
  },
  {
    name: "Sofia Barros",
    email: "sofia.barros@example.com",
    phone: "(98) 90000-0117",
    company: "Escola de Idiomas Ponte",
    service_id: "serv-4",
    message: "Queremos usar RV para simular viagens nas aulas de conversação.",
    daysAgo: 29,
    hour: 14,
    minute: 1,
  },
  {
    name: "Tiago Cardoso",
    email: "tiago.cardoso@example.com",
    phone: "(98) 90000-0118",
    company: "Cooperativa Verde",
    service_id: null,
    message: "Precisamos organizar o cadastro dos cooperados, que hoje é feito em planilhas.",
    daysAgo: 33,
    hour: 9,
    minute: 27,
  },
];

/** Gera os leads com datas relativas ao momento em que o mock é iniciado. */
export function createSeedLeads(now: Date): MockLead[] {
  return LEAD_SEEDS.map(({ daysAgo, hour, minute, ...lead }, index) => {
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);
    date.setHours(hour, minute, 0, 0);
    // Garante que nenhum lead fique no futuro.
    if (date.getTime() > now.getTime()) date.setTime(now.getTime() - (index + 1) * 60_000);
    return {
      ...lead,
      id: LEAD_SEEDS.length - index,
      service_title: lead.service_id ? (SERVICES[lead.service_id] ?? null) : null,
      created_at: date.toISOString(),
    };
  });
}
