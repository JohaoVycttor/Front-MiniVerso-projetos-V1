export const defaultSolutions = {
 background:'#060709',accent:'#7898ff',sections:[
 {id:'solutions',type:'catalog',enabled:true,label:'Soluções',title:'Cada desafio pede uma',highlight:'dimensão diferente.',description:'Escolha pelo objetivo, não pela tecnologia. Abaixo estão os formatos que trabalhamos, para que servem e o que você recebe no final.',image:'/hero-vr.jpg',imagePosition:'center 48%',overlay:0.52,columns:2,benefitsLabel:'Ideal para',button:'Falar sobre esta solução',cards:[
 {title:'Realidade virtual',description:'Ambientes completos em VR para treinar, ensinar e apresentar o que ainda não existe no mundo físico.',icon:'screen',wide:false,benefits:['Treinamento de procedimentos sem risco ou custo alto','Aulas e visitas que seriam impossíveis no mundo real','Apresentação de produtos antes deles saírem do planejamento'],tags:['Treinamento','Educação','Simulação'],href:'/contato?subject=Realidade%20virtual'},
 {title:'Realidade aumentada',description:'Camadas digitais sobre o mundo real: aponte a câmera para um objeto, uma imagem ou um lugar.',icon:'layers',wide:false,benefits:['Ativações em eventos, embalagens e pontos de venda','Demonstração de produtos grandes ou ainda não fabricados','Aulas e atividades que saltam para fora do livro'],tags:['Web AR','Varejo','Educação'],href:'/contato?subject=Realidade%20aumentada'},
 {title:'Vídeos 360°',description:'Registros imersivos de espaços, viagens e processos, com narrativa guiada e navegação livre.',icon:'globe',wide:false,benefits:['Tours em universidades, obras e espaços de eventos','Registro de processos para treinar novas equipes','Conteúdo institucional com sensação de presença'],tags:['Tour virtual','Institucional','Cultura'],href:'/contato?subject=Vídeos%20360°'},
 {title:'Experiências educacionais',description:'Conteúdo desenhado junto com quem ensina, no tempo certo da aula e com acompanhamento do professor.',icon:'school',wide:false,benefits:['Aulas, oficinas e trilhas fora do quadro','Atividades interativas com retorno imediato','Conteúdo alinhado com os objetivos de aprendizagem'],tags:['Escolas','Museus','Educação'],href:'/contato?subject=Experiências%20educacionais'},
 {title:'Software, web e UX/UI',description:'Sites e aplicações que saem da ideia e funcionam com clareza. Design centrado em pessoas, interfaces que resolvem problemas e sistemas conectados ao seu negócio.',icon:'code',wide:true,benefits:['Sites e portais institucionais','Design de interfaces e protótipos','Plataformas interativas e integrações','Testes de usabilidade com usuários reais'],tags:['Web','UX/UI','Desenvolvimento'],href:'/contato?subject=Outro%20projeto'}]},
 {id:'comparison',type:'comparison',enabled:true,label:'Como escolher',title:'Comece pelo objetivo.',highlight:'Pelo óculos.',description:'Na dúvida, mande o objetivo por mensagem. A gente indica.',headers:['Seu objetivo','Formato indicado','O que você recebe'],rows:[
 {objective:'Treinar uma equipe em um procedimento de risco',format:'Realidade virtual',delivery:'Aplicação para óculos e relatório de uso'},
 {objective:'Chamar atenção em um evento ou ponto de venda',format:'Realidade aumentada',delivery:'Web AR aberta por QR Code, sem instalação'},
 {objective:'Mostrar um espaço para quem está longe',format:'Vídeos 360°',delivery:'Player no navegador e versão para óculos'},
 {objective:'Ensinar um conteúdo difícil de imaginar',format:'Experiência educacional',delivery:'Roteiro, atividade e material do professor'}]},
 {id:'process',type:'process',enabled:true,label:'Sem letra miúda',title:'O que entra em',highlight:'todo projeto.',columns:4,steps:[
 {title:'Roteiro e conceito',description:'Definimos juntos o que a pessoa faz, vê e aprende dentro da experiência.'},
 {title:'Protótipo no Figma',description:'Você aprova a interface antes de qualquer linha de código.'},
 {title:'Testes com usuários',description:'Levamos a versão de teste para o público real e ajustamos o que travar.'},
 {title:'Entrega e treinamento',description:'Publicamos, documentamos e orientamos sua equipe para usar sozinha.'}]},
 {id:'contact',type:'banner',enabled:true,label:'Vamos encontrar o caminho',title:'Ainda em dúvida sobre',highlight:'o melhor formato?',description:'Descreva o desafio em poucas linhas. Indicamos o caminho mais simples que resolve.',image:'/hero-vr.jpg',imagePosition:'75% 35%',overlay:0.25,button:'Conte seu desafio',href:'/contato'}
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
