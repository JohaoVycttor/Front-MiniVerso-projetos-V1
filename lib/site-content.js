import {defaultContact} from "./contact-content";
import {publicNavigation} from "./navigation";
export const sectionNames={hero:"Abertura / Hero",strip:"Faixa de temas",commercial:"Apresentação",services:"Serviços",projects:"Projetos",process:"Etapas",contact:"Formulário de contato",text:"Texto e imagem",cards:"Grupo de cards",cta:"Chamada para ação"};
export const sectionLayouts={hero:["imageRight","imageFull","centered"],strip:["inline"],commercial:["split","stacked"],services:["accordion","cards"],projects:["cards","list"],process:["cards","list"],contact:["split","stacked"],text:["split","stacked"],cards:["cards","list"],cta:["split","centered"]};
const base=(id,type,label,title="",highlight="")=>({id,type,enabled:true,label,title,highlight,description:"",layout:sectionLayouts[type][0],background:"#060709",accent:"#7898ff",image:"",imagePosition:"center",overlay:0.35,padding:90,columns:3});
export const sectionTemplates={
 hero:{...base("inicio","hero","ESTÚDIO DE EXPERIÊNCIAS IMERSIVAS","OUTRAS","REALIDADES."),background:"#030405",description:"Expandimos a forma de aprender,\nconectar e experimentar o mundo.",image:"https://res.cloudinary.com/dsokg03zb/image/upload/v1790081978/man-with-vr-glasses-technology-_1__vxnpl0.webp",imagePosition:"90% center",imageAlt:"Experiência de realidade virtual com a Miniverso",brand:"MINIVERSO",location:"SÃO LUÍS, BRASIL\nIDEIAS SEM FRONTEIRAS",button:"Vamos criar juntos",href:"/contato",scrollLabel:"ENTRE NO NOSSO UNIVERSO",scrollHref:"#universo",height:780},
 strip:{...base("temas","strip","Temas"),background:"#0a1430",padding:18,items:["REALIDADE VIRTUAL","REALIDADE AUMENTADA","VÍDEOS 360°","EDUCAÇÃO IMERSIVA"]},
 commercial:{...base("universo","commercial","[ 01 — SUA MARCA, ALÉM DO ÓBVIO ]","Transforme\natenção em","conexão real."),description:"Sua marca pode ser mais do que vista. Pode ser vivida. Criamos experiências em realidade virtual, aumentada e vídeos 360° para apresentar produtos, ativar marcas e aproximar sua empresa do público.",showArt:true,artLabel:"IDEIAS EM OUTRA DIMENSÃO",artFooter:"ESTRATÉGIA + CRIATIVIDADE + TECNOLOGIA",button:"Quero uma experiência para minha marca",href:"/contato",note:"Conte seu desafio. Vamos desenhar as possibilidades.",cards:[{title:"Um encontro que fica na memória.",description:"Transforme eventos, feiras e campanhas em experiências que convidam o público a participar e descobrir o que sua marca oferece."},{title:"Seu produto, em outra dimensão.",description:"Demonstre soluções e torne o valor da sua oferta mais fácil de entender com apresentações imersivas."},{title:"Do briefing à experiência.",description:"Alinhamos objetivo, público, escopo e prazo com sua equipe para desenvolver uma solução sob medida."}]},
 services:{...base("solucoes","services","[ 02 — O QUE CRIAMOS ]","Novas formas\nde","experimentar."),description:"Cada desafio pede um novo olhar.\nEncontre a dimensão da sua ideia.",source:"services",button:"Explorar projetos",href:"/projetos",items:[{title:"Software, web e UX/UI",description:"Plataformas e interfaces que sustentam a experiência do começo ao fim.",icon:"screen",tags:["Sob medida"]}]},
 projects:{...base("projetos","projects","[ 03 — O QUE ENTREGAMOS ]","Projetos que\nviram","experiência."),source:"projects",limit:3,button:"Ver todos os projetos",href:"/projetos",itemButton:"Ver detalhes",items:[{title:"Novo projeto",description:"Descreva o projeto.",category:"Experiência",image:"/hero-vr.jpg",href:"/projetos"}]},
 process:{...base("processo","process","[ 04 — COMO CONECTA ]","Da conversa\nà","experiência."),description:"Você faz parte de cada etapa.\nA gente constrói junto.",columns:4,items:[{title:"Descobrir",description:"Ouvimos sua ideia, entendemos seu público e definimos os objetivos da experiência."},{title:"Planejar",description:"Desenhamos o conceito, o roteiro e o escopo, com prazos e responsáveis definidos."},{title:"Criar",description:"Transformamos o conceito em design e tecnologia, com protótipos e testes ao longo do caminho."},{title:"Conectar",description:"Preparamos a entrega e orientamos sua equipe para levar a experiência ao público."}]},
 contact:{...base("conversa","contact","[ 05 — VAMOS CONVERSAR ]","Sua ideia.","Nosso próximo\nuniverso."),description:"Vamos transformar possibilidades em experiências?",image:"/home-contact-background.jpg",background:"#05256d",imagePosition:"center top",overlay:0.16,padding:80,channels:[{title:"E-mail",value:"contato@miniverso.com.br",href:"mailto:contato@miniverso.com.br"},{title:"Localização",value:"São Luís, Maranhão · Brasil",href:""}],form:structuredClone(defaultContact.sections[0].form),subjects:[...defaultContact.sections[0].subjects],extraFields:[]},
 text:{...base("texto","text","Sobre a experiência","Uma nova forma de","conectar."),description:"Edite este texto no painel para apresentar sua ideia.",image:"/hero-vr.jpg",button:"Saiba mais",href:"/sobre"},
 cards:{...base("cards","cards","Possibilidades","Feito para","sua ideia."),items:[{title:"Novo card",description:"Conte mais sobre esta possibilidade.",image:"",button:"Saiba mais",href:"/contato"}]},
 cta:{...base("chamada","cta","Vamos conversar","Vamos construir","algo novo?"),button:"Começar conversa",href:"/contato"}
};
export const defaultHome={background:"#060709",accent:"#7898ff",animations:true,sections:["hero","strip","commercial","services","projects","process","contact"].map(type=>structuredClone(sectionTemplates[type]))};
export const defaultSite={
 interactions:{cardHover:true,cardEntrance:true},
 pages:{home:{title:"Miniverso",description:"Experi\u00eancias imersivas que conectam pessoas e possibilidades."},studio:{title:"O est\u00fadio",description:"Conhe\u00e7a o est\u00fadio Miniverso."},solutions:{title:"Solu\u00e7\u00f5es",description:"Realidade virtual, aumentada, v\u00eddeos 360 e software."},portfolio:{title:"Projetos",description:"Explore os projetos da Miniverso."},contact:{title:"Contato",description:"Converse com a Miniverso sobre seu projeto."}},
 brand:{name:"miniverso",logo:"/logo-symbol.png",description:"Pequeno no nome.\nInfinito em possibilidades."},
 header:{transparentTop:true,scrolledBackground:"#000000",scrollThreshold:24,enabled:true,layout:"split",sticky:true,background:"#050914",button:"Vamos conversar",href:"/contato",links:publicNavigation.map(link=>({...link}))},
 footer:{enabled:true,layout:"columns",background:"#060709",showWordmark:true,exploreTitle:"Explore",contactTitle:"Vamos criar algo novo?",email:"contato@miniverso.com.br",location:"São Luís, Maranhão · Brasil",button:"Iniciar uma conversa",href:"/contato",note:"Realidades que conectam.",links:publicNavigation.map(link=>({...link})),socialLinks:[]}
};
export const extraFieldTemplate={id:"campo",label:"Novo campo",type:"text",required:false,placeholder:"",options:["Opção 1","Opção 2"]};
export function homeContent(data){return data.home||structuredClone(defaultHome)}
export function siteContent(data){const site=data.site||{};return {...structuredClone(defaultSite),...site,header:{...defaultSite.header,...site.header},interactions:{...defaultSite.interactions,...site.interactions},pages:Object.fromEntries(Object.entries(defaultSite.pages).map(([key,value])=>[key,{...value,...site.pages?.[key]}]))}}
const object=v=>v!==null&&typeof v==="object"&&!Array.isArray(v);
const safePath=v=>v===""||/^(\/(?![\/\\])|#[A-Za-z][\w-]*$|https:\/\/|mailto:|tel:)/.test(v)&&!/[\r\n\\]/.test(v);
const safeImage=v=>v===""||(/^(\/(?![\/\\])|https:\/\/)/.test(v)&&!/[\r\n\\]/.test(v));
function shape(v,s,key=""){
 if(typeof s==="string"){
  if(typeof v!=="string"||v.length>10000)return false;
  if(["href","scrollHref"].includes(key))return v.length<=2000&&safePath(v);
  if(["image","logo"].includes(key))return v.length<=2000&&safeImage(v);
  if(["background","accent","scrolledBackground"].includes(key))return /^#[\da-f]{6}$/i.test(v);
  if(key==="id")return /^[a-zA-Z][a-zA-Z0-9_-]{0,79}$/.test(v);
  if(key==="imagePosition")return /^[a-zA-Z0-9%.\s-]{1,80}$/.test(v);
  if(key==="email")return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  return true;
 }
 if(typeof s==="number")return typeof v==="number"&&Number.isFinite(v)&&v>=0&&(key==="overlay"?v<=1:key==="columns"?Number.isInteger(v)&&v>=1&&v<=4:key==="limit"?Number.isInteger(v)&&v>=1&&v<=24:key==="height"?v>=300&&v<=1400:v<=200);
 if(typeof s==="boolean")return typeof v==="boolean";
 if(Array.isArray(s))return Array.isArray(v)&&v.length<=40&&v.every(x=>shape(x,s[0]));
 return object(v)&&Object.keys(v).every(k=>Object.hasOwn(s,k))&&Object.entries(s).every(([k,t])=>shape(v[k],t,k));
}
export function validateHome(v){
 if(!object(v)||Object.keys(v).some(k=>!["background","accent","animations","sections"].includes(k))||!shape({background:v.background,accent:v.accent,animations:v.animations},{background:defaultHome.background,accent:defaultHome.accent,animations:true})||!Array.isArray(v.sections)||v.sections.length>30)return false;
 const ids=new Set();
 return v.sections.every(s=>{
  if(!object(s)||!Object.hasOwn(sectionTemplates,s.type)||ids.has(s.id))return false;ids.add(s.id);
  const template=structuredClone(sectionTemplates[s.type]);
  if(s.type==="contact")template.extraFields=[extraFieldTemplate];
  if(!shape(s,template)||!sectionLayouts[s.type].includes(s.layout))return false;
  if(s.source&&!["services","projects","portfolio","custom"].includes(s.source))return false;
  if(s.type==="services"&&!["services","custom"].includes(s.source)||s.type==="projects"&&!["projects","portfolio","custom"].includes(s.source))return false;
  if(s.type==="contact"){
   if(!s.subjects.length||s.subjects.some(x=>!x.trim()||x.length>150)||new Set(s.subjects).size!==s.subjects.length)return false;
   if(s.extraFields.length>15||new Set(s.extraFields.map(f=>f.id)).size!==s.extraFields.length)return false;
   if(s.extraFields.some(f=>!["text","email","tel","number","select","textarea"].includes(f.type)||!f.label.trim()||f.type==="select"&&(!f.options.length||f.options.some(x=>!x.trim()))))return false;
  }
  return true;
 });
}
export function validateSite(v){
 v=siteContent({site:v});
 const template=structuredClone(defaultSite);template.footer.socialLinks=[{label:"Rede social",href:"https://example.com"}];
 return shape(v,template)&&["split","centered"].includes(v.header.layout)&&["columns","minimal"].includes(v.footer.layout)&&v.header.links.every(l=>l.label.trim()&&l.href)&&v.footer.links.every(l=>l.label.trim()&&l.href);
}
