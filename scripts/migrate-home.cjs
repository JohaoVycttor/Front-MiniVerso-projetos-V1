// Run once: preserves existing publications; imports the current public home.
const fs = require('node:fs');
const path = require('node:path');
const destination = path.join(__dirname,'../data/home-content.json');
if (fs.existsSync(destination)) { console.log('Existing home preserved.'); process.exit(0); }
const data = JSON.parse(fs.readFileSync(path.join(__dirname,'../data/content.json'),'utf8'));
const section = (key,fields,items=[],visible=true) => ({key,visible,fields,items});
const content = {publishedAt:new Date().toISOString(),sections:[
  section('hero',{
    eyebrow:'ESTÚDIO DE EXPERIÊNCIAS IMERSIVAS',brandTitle:'MINIVERSO',title:'OUTRAS',highlight:'REALIDADES.',
    subtitle:'Expandimos a forma de aprender,\nconectar e experimentar o mundo.',location:'SÃO LUÍS, BRASIL\nIDEIAS SEM FRONTEIRAS',
    primaryLabel:'Vamos criar juntos',primaryTarget:'contato',secondaryLabel:'',secondaryTarget:'sobre',
    scrollLabel:'ENTRE NO NOSSO UNIVERSO',scrollTarget:'sobre',scrollCount:'01 / 05',
    strip:'REALIDADE VIRTUAL\nREALIDADE AUMENTADA\nVÍDEOS 360°\nEDUCAÇÃO IMERSIVA',
    background:'/home-vr-background.jpg',
    imageAlt:'Experiência de realidade virtual com a Miniverso',mobileImage:'',model3d:'',autoRotate:false,
  }),
  section('sobre',{
    eyebrow:'[ 01 — SUA MARCA, ALÉM DO ÓBVIO ]',title:'Transforme\natenção em',highlight:'conexão real.',
    text:'Sua marca pode ser mais do que vista. Pode ser vivida. Criamos experiências em realidade virtual, aumentada e vídeos 360° para apresentar produtos, ativar marcas e aproximar sua empresa do público.',
    buttonLabel:'Quero uma experiência para minha marca',buttonUrl:'/contato',buttonNote:'Conte seu desafio. Vamos desenhar as possibilidades.',secondaryLabel:'Conheça o estúdio',secondaryUrl:'/sobre',
    artLabel:'IDEIAS EM OUTRA DIMENSÃO',artFooter:'ESTRATÉGIA + CRIATIVIDADE + TECNOLOGIA',artCode:'MV / 01',
  },[
    {id:'sobre-1',eyebrow:'01 / PRESENÇA DE MARCA',title:'Um encontro que fica na memória.',description:'Transforme eventos, feiras e campanhas em experiências que convidam o público a participar e descobrir o que sua marca oferece.'},
    {id:'sobre-2',eyebrow:'02 / VALOR NA PRÁTICA',title:'Seu produto, em outra dimensão.',description:'Demonstre soluções, explore possibilidades e torne o valor da sua oferta mais fácil de entender com apresentações imersivas.'},
    {id:'sobre-3',eyebrow:'03 / PROJETO SOB MEDIDA',title:'Do briefing à experiência.',description:'Alinhamos objetivo, público, escopo e prazo com sua equipe para desenvolver uma solução que faça sentido para o seu negócio.'},
  ]),
  section('servicos',{eyebrow:'[ 02 — O QUE CRIAMOS ]',title:'Novas formas\nde',highlight:'experimentar.',subtitle:'Cada desafio pede um novo olhar.\nEncontre a dimensão da sua ideia.',buttonLabel:'Conheça todas as soluções',buttonUrl:'/servicos'},data.services.map(s=>({...s,visible:true,image:'',imageAlt:'',buttonLabel:'Conversar sobre esta solução'}))),
  section('projetos',{eyebrow:'[ 03 — POSSIBILIDADES EM PRÁTICA ]',title:'Ideias fora\ndo',highlight:'comum.',subtitle:'',buttonLabel:'Explorar portfólio',buttonUrl:'/projetos',featured:'',columns:'2'},data.portfolio.projects.filter(p=>p.visible).sort((a,b)=>a.order-b.order).slice(0,2).map(p=>({id:p.id,visible:true,name:p.title,summary:p.description,category:p.tag,cover:p.cover.src||'/hero-vr.jpg',coverAlt:p.cover.alt||p.title,link:`/projetos/${p.slug}`,details:p.introduction,technologies:'',client:'',buttonLabel:'Ver o projeto'}))),
  section('diferenciais',{title:'Por que a Miniverso'},[],false),
  section('experiencia',{title:'Experiência interativa',text:''},[],false),
  section('processo',{eyebrow:'[ 04 — COMO ACONTECE ]',title:'Da conversa\nà',highlight:'experiência.',subtitle:'Você faz parte de cada etapa.\nA gente constrói junto.',columns:'3'},[
    {id:'processo-1',title:'Descobrir',description:'Ouvimos sua ideia, entendemos seu público e definimos os objetivos da experiência.'},
    {id:'processo-2',title:'Criar',description:'Transformamos o conceito em design e tecnologia, com protótipos e testes ao longo do caminho.'},
    {id:'processo-3',title:'Conectar',description:'Preparamos a entrega e orientamos sua equipe para levar a experiência ao público.'},
  ]),
  section('clientes',{title:'Clientes e parceiros'},[],false),
  section('contato',{eyebrow:'[ 05 — PRÓXIMA DIMENSÃO ]',title:'Sua ideia.',highlight:'Nosso próximo universo.',support:'Vamos transformar possibilidades em experiências?',buttonLabel:'Conte seu projeto',buttonUrl:'/contato',email:'contato@miniverso.com.br',whatsapp:'',instagram:'',successMessage:'Mensagem enviada!',errorMessage:'Não foi possível enviar agora.'}),
  section('rodape',{tagline:'Pequeno no nome.\nInfinito em possibilidades.',contactTitle:'Vamos criar algo novo?',location:'São Luís, Maranhão · Brasil',copyright:'© 2026 Miniverso.',bottomText:'Realidades que conectam.',useContactChannels:true,privacyUrl:'',buttonLabel:'Iniciar uma conversa',buttonUrl:'/contato',navigationLabel:'Explore'},[]),
]};
content.sections.find(s=>s.key==='projetos').fields.featured=content.sections.find(s=>s.key==='projetos').items[0].id;
fs.writeFileSync(destination,JSON.stringify(content,null,2));
console.log('Current home migrated without changing legacy data.');
