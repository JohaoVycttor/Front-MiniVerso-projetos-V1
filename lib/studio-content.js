export const defaultStudio = {
  "background": "#060709",
  "accent": "#90d9ef",
  "sections": [
    {
      "id": "intro",
      "type": "intro",
      "enabled": true,
      "layout": "split",
      "image": "/studio-background.png",
      "imagePosition": "center 42%",
      "overlay": 0.48,
      "label": "Nossa história",
      "title": "Feito de ideias.",
      "highlight": "Movido por gente.",
      "description": "Somos um estúdio de São Luís que cria encontros entre pessoas, conteúdo e tecnologia.",
      "tags": [
        "Realidade virtual",
        "Realidade aumentada",
        "Realidade mista",
        "Vídeos 360°"
      ],
      "storyTitle": "Por trás de cada mundo,",
      "storyHighlight": "gente de verdade.",
      "paragraphs": [
        "Criamos junto com educadores, equipes e marcas para transformar uma ideia em algo que as pessoas possam explorar."
      ],
      "noteTitle": "Criar é um trabalho em conjunto.",
      "note": "Seu conhecimento encontra nosso jeito de imaginar, desenhar e desenvolver."
    },
    {
      "id": "formats",
      "type": "cards",
      "enabled": true,
      "label": "Um formato para cada ideia",
      "title": "Você imagina.",
      "highlight": "A gente explora os caminhos.",
      "description": "Conheça as tecnologias que dão forma às experiências.",
      "layout": "cards",
      "columns": 2,
      "cards": [
        {
          "icon": "screen",
          "title": "Realidade virtual",
          "description": "Entre em um cenário digital e aprenda explorando."
        },
        {
          "icon": "phone",
          "title": "Realidade aumentada",
          "description": "Descubra conteúdo digital sobre o que já está ao seu redor."
        },
        {
          "icon": "layers",
          "title": "Realidade mista",
          "description": "Conecte objetos, espaços e conteúdo em uma só experiência."
        },
        {
          "icon": "globe",
          "title": "Vídeos 360°",
          "description": "Olhe ao redor e conheça um lugar por novos ângulos."
        }
      ]
    },
    {
      "id": "principles",
      "type": "cards",
      "enabled": true,
      "label": "O que nos guia",
      "title": "Nosso jeito",
      "highlight": "de fazer acontecer.",
      "layout": "lines",
      "columns": 4,
      "cards": [
        {
          "icon": "light",
          "title": "Inovação",
          "description": "Experimentar para encontrar caminhos úteis."
        },
        {
          "icon": "users",
          "title": "Colaboração",
          "description": "Somar conhecimentos desde a primeira conversa."
        },
        {
          "icon": "heart",
          "title": "Engajamento",
          "description": "Despertar vontade de explorar e participar."
        },
        {
          "icon": "globe",
          "title": "Responsabilidade",
          "description": "Criar com atenção às pessoas e ao contexto."
        }
      ]
    },
    {
      "id": "audiences",
      "type": "cards",
      "enabled": true,
      "label": "Para quem criamos",
      "title": "Muda o público.",
      "highlight": "A curiosidade continua.",
      "description": "Cada experiência começa por quem vai usá-la.",
      "layout": "cards",
      "columns": 4,
      "cards": [
        {
          "icon": "school",
          "title": "Escolas e universidades",
          "description": "Conteúdo que ganha espaço além da sala de aula."
        },
        {
          "icon": "screen",
          "title": "Professores",
          "description": "Novas maneiras de apresentar uma ideia à turma."
        },
        {
          "icon": "users",
          "title": "Estudantes",
          "description": "Aprender participando, descobrindo e experimentando."
        },
        {
          "icon": "building",
          "title": "Empresas e organizações",
          "description": "Treinar, apresentar e aproximar pessoas de uma marca."
        }
      ]
    },
    {
      "id": "commitment",
      "type": "cards",
      "enabled": true,
      "label": "Nosso compromisso",
      "title": "Bem pensado.",
      "highlight": "Do começo ao encontro.",
      "layout": "tinted",
      "columns": 3,
      "cards": [
        {
          "icon": "access",
          "title": "Acessibilidade",
          "description": "Experiências pensadas para diferentes formas de participar."
        },
        {
          "icon": "book",
          "title": "Conteúdo",
          "description": "O assunto vem primeiro. A tecnologia dá forma."
        },
        {
          "icon": "target",
          "title": "Objetivo",
          "description": "Cada escolha responde ao que seu público precisa."
        }
      ]
    },
    {
      "id": "contact",
      "type": "cta",
      "enabled": true,
      "label": "A próxima ideia pode ser sua",
      "title": "Que mundo vamos",
      "highlight": "criar juntos?",
      "image": "/hero-vr.jpg",
      "imagePosition": "center",
      "overlay": 0.65,
      "button": "Vamos conversar",
      "href": "/contato"
    }
  ]
};
export function validateStudio(v){
if(!v||!/^#[\da-f]{6}$/i.test(v.background)||!/^#[\da-f]{6}$/i.test(v.accent)||!Array.isArray(v.sections)||v.sections.length>30)return false;
const ids=new Set();const strings=a=>a.every(x=>typeof x==='string'&&x.length<=10000);
return v.sections.every(s=>{if(!s||typeof s.id!=='string'||ids.has(s.id))return false;ids.add(s.id);if(!['intro','cards','cta'].includes(s.type)||typeof s.enabled!=='boolean'||!strings([s.title,s.highlight,s.label]))return false;if(s.description!==undefined&&!strings([s.description]))return false;if(s.type==='cards')return [1,2,3,4].includes(s.columns)&&['lines','cards','tinted'].includes(s.layout)&&Array.isArray(s.cards)&&s.cards.length<=24&&s.cards.every(c=>c&&strings([c.title,c.description,c.icon]));if(!strings([s.image,s.imagePosition])||!(/^(\/(?!\/)|https:\/\/)/.test(s.image)||s.image==='')||typeof s.overlay!=='number'||s.overlay<0||s.overlay>1)return false;if(s.type==='cta')return strings([s.button,s.href])&&/^\/(?!\/)/.test(s.href);return ['split','stacked'].includes(s.layout)&&strings([s.storyTitle,s.storyHighlight,s.noteTitle,s.note])&&[s.tags,s.paragraphs].every(a=>Array.isArray(a)&&a.length<=30&&strings(a))});
}
