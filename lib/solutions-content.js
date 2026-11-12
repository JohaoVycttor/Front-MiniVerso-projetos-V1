export const defaultSolutions = {
  "background": "#060709",
  "accent": "#7898ff",
  "sections": [
    {
      "id": "solutions",
      "type": "catalog",
      "enabled": true,
      "label": "Soluções",
      "title": "Seu conteúdo.",
      "highlight": "Em outra dimensão.",
      "description": "VR, AR, realidade mista e 360° para aprender, descobrir e participar.",
      "image": "/solutions-vr.jpg",
      "imagePosition": "center 65%",
      "overlay": 0.18,
      "columns": 2,
      "benefitsLabel": "Onde usar este formato",
      "button": "Quero explorar esta ideia",
      "cards": [
        {
          "title": "Realidade virtual na educação",
          "description": "Leve a turma para dentro do conteúdo, com cenários que convidam à descoberta.",
          "icon": "screen",
          "wide": false,
          "benefits": [
            "Exploração de ambientes e situações de aprendizagem",
            "Vivências que aproximam os alunos dos conteúdos",
            "Aulas mais cativantes, com participação e descoberta"
          ],
          "tags": [
            "Imersão",
            "Aprendizagem",
            "Engajamento"
          ],
          "href": "/contato?subject=Realidade%20virtual"
        },
        {
          "title": "Realidade aumentada",
          "description": "Transforme uma página, um objeto ou um espaço em uma nova forma de aprender.",
          "icon": "layers",
          "wide": false,
          "benefits": [
            "Visualização de conteúdos no contexto da aula",
            "Conexões entre materiais físicos e recursos digitais",
            "Atividades que incentivam a curiosidade dos alunos"
          ],
          "tags": [
            "Exploração",
            "Interatividade",
            "Educação"
          ],
          "href": "/contato?subject=Realidade%20aumentada"
        },
        {
          "title": "Realidade mista",
          "description": "Faça o ambiente real conversar com elementos digitais.",
          "icon": "globe",
          "wide": false,
          "benefits": [
            "Integração de elementos reais e virtuais",
            "Exploração de conceitos em experiências interativas",
            "Novas possibilidades para práticas de ensino"
          ],
          "tags": [
            "Mundo físico",
            "Mundo virtual",
            "Interação"
          ],
          "href": "/contato?subject=Outro%20projeto"
        },
        {
          "title": "Vídeos 360°",
          "description": "Abra uma janela para lugares e histórias em todas as direções.",
          "icon": "globe",
          "wide": false,
          "benefits": [
            "Visitas virtuais a diferentes ambientes",
            "Observação de contextos para discussão em sala",
            "Experiências visuais que despertam o interesse"
          ],
          "tags": [
            "Imersão",
            "Descoberta",
            "Contexto"
          ],
          "href": "/contato?subject=Vídeos%20360%C2%B0"
        },
        {
          "title": "Tecnologia a serviço de quem ensina e aprende",
          "description": "Do planejamento ao encontro com o público, construímos a experiência com a sua equipe.",
          "icon": "school",
          "wide": true,
          "benefits": [
            "Inovação conectada aos desafios da educação",
            "Colaboração entre escola, professores e alunos",
            "Valorização da diversidade nas experiências de aprendizagem",
            "Responsabilidade social no uso da tecnologia"
          ],
          "tags": [
            "Escolas",
            "Professores",
            "Alunos"
          ],
          "href": "/contato?subject=Experi%C3%AAncias%20educacionais"
        }
      ]
    },
    {
      "id": "comparison",
      "type": "comparison",
      "enabled": true,
      "label": "Vamos encontrar o seu caminho",
      "title": "Comece pela ideia.",
      "highlight": "O formato vem depois.",
      "description": "Conte quem vai participar e o que você quer despertar.",
      "headers": [
        "Objetivo de aprendizagem",
        "Tecnologia",
        "Possibilidade de uso"
      ],
      "rows": [
        {
          "objective": "Explorar um conteúdo em um ambiente imersivo",
          "format": "Realidade virtual",
          "delivery": "Vivências em cenários virtuais voltados à aprendizagem"
        },
        {
          "objective": "Relacionar recursos digitais ao mundo real",
          "format": "Realidade aumentada",
          "delivery": "Elementos digitais que complementam a exploração de conteúdos"
        },
        {
          "objective": "Conectar experiências físicas e virtuais",
          "format": "Realidade mista",
          "delivery": "Interação entre o ambiente real e elementos virtuais"
        },
        {
          "objective": "Conhecer lugares e ampliar o repertório da turma",
          "format": "Vídeos 360°",
          "delivery": "Exploração visual de espaços e contextos em todas as direções"
        }
      ]
    },
    {
      "id": "process",
      "type": "process",
      "enabled": true,
      "label": "Nosso jeito de criar",
      "title": "Boas experiências",
      "highlight": "começam com boas escolhas.",
      "columns": 4,
      "steps": [
        {
          "title": "Inovação",
          "description": "Testar possibilidades antes de definir o caminho."
        },
        {
          "title": "Engajamento",
          "description": "Criar vontade de conhecer, tentar e descobrir."
        },
        {
          "title": "Colaboração e diversidade",
          "description": "Ouvir quem ensina e quem aprende."
        },
        {
          "title": "Responsabilidade social",
          "description": "Pensar no uso da tecnologia em cada contexto."
        }
      ]
    },
    {
      "id": "contact",
      "type": "banner",
      "enabled": true,
      "label": "Ainda não escolheu um formato?",
      "title": "Traga a pergunta.",
      "highlight": "Vamos explorar juntos.",
      "description": "Uma conversa para conectar seu objetivo às possibilidades.",
      "image": "/solutions-format.png",
      "imagePosition": "center 45%",
      "overlay": 0.15,
      "button": "Conte sua ideia",
      "href": "/contato"
    }
  ]
};
const text=v=>typeof v==='string'&&v.length<=10000;
const list=(v,check)=>Array.isArray(v)&&v.length<=30&&v.every(check);
const link=v=>text(v)&&/^\/(?![\/\\])/.test(v)&&!/[\r\n\\]/.test(v);
const image=v=>text(v)&&(v===''||link(v)||/^https:\/\/[^\s]+$/.test(v));
export function validateSolutions(v){
 if(!v||!/^#[\da-f]{6}$/i.test(v.background)||!/^#[\da-f]{6}$/i.test(v.accent))return false;
 const ids=new Set();
 return list(v.sections,s=>{
  if(!s||!text(s.id)||ids.has(s.id)||typeof s.enabled!=='boolean'||![s.label,s.title,s.highlight].every(text))return false;ids.add(s.id);
  if(s.description!==undefined&&!text(s.description))return false;
  if(['catalog','banner'].includes(s.type)&&(!image(s.image)||!text(s.imagePosition)||typeof s.overlay!=='number'||s.overlay<0||s.overlay>1))return false;
  switch(s.type){
   case 'catalog':return [1,2].includes(s.columns)&&text(s.button)&&text(s.benefitsLabel)&&list(s.cards,c=>c&&[c.title,c.description,c.icon].every(text)&&typeof c.wide==='boolean'&&link(c.href)&&list(c.benefits,text)&&list(c.tags,text));
   case 'comparison':return Array.isArray(s.headers)&&s.headers.length===3&&s.headers.every(text)&&list(s.rows,r=>r&&[r.objective,r.format,r.delivery].every(text));
   case 'process':return [1,2,3,4].includes(s.columns)&&list(s.steps,r=>r&&[r.title,r.description].every(text));
   case 'banner':return text(s.button)&&link(s.href);
   default:return false;
  }
 });
}
