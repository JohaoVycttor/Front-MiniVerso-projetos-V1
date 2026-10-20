export const defaultStudio = {background:'#060709',accent:'#7898ff',sections:[
{id:'intro',type:'intro',enabled:true,layout:'split',image:'/studio-background.jpg',imagePosition:'center 45%',overlay:0.48,label:'Nossa história',title:'Tecnologia para transformar',highlight:'a forma de aprender.',description:'Nascemos para criar ambientes de realidade virtual voltados à educação. Hoje, exploramos novas tecnologias para tornar experiências mais envolventes, efetivas e memoráveis.',tags:['Realidade virtual','Realidade aumentada','Realidade mista','Vídeos 360°'],storyTitle:'Um universo de possibilidades em',storyHighlight:'escala humana.',paragraphs:['A Miniverso apoia escolas, professores, estudantes e organizações que desejam inovar. Unimos conhecimento, design e desenvolvimento para criar soluções que fazem sentido para cada público.','Atuamos com realidade virtual, aumentada e mista, além de vídeos 360°, sempre com atenção à acessibilidade, ao conteúdo e aos objetivos de cada projeto.'],noteTitle:'Tecnologia com propósito. Pessoas em primeiro lugar.',note:'Cada projeto é um universo próprio, do tamanho da possibilidade de quem vai usar.'},
{id:'principles',type:'cards',enabled:true,label:'O que nos guia',title:'Quatro princípios em',highlight:'cada entrega.',layout:'lines',columns:4,cards:[{icon:'light',title:'Inovação',description:'Transformamos tecnologia em soluções úteis e acessíveis.'},{icon:'users',title:'Colaboração',description:'Criamos junto com clientes, educadores e usuários.'},{icon:'heart',title:'Engajamento',description:'Projetamos experiências que despertam curiosidade.'},{icon:'globe',title:'Responsabilidade',description:'Valorizamos diversidade e impacto social positivo.'}]},
{id:'audiences',type:'cards',enabled:true,label:'Para quem criamos',title:'Públicos diferentes,',highlight:'mesmo cuidado.',description:'Adaptamos linguagem, duração e nível de interação a cada público.',layout:'cards',columns:4,cards:[{icon:'school',title:'Escolas e universidades',description:'Conteúdo alinhado ao currículo e ao tempo real da aula.'},{icon:'screen',title:'Professores',description:'Material de apoio e orientação para conduzir a experiência.'},{icon:'users',title:'Estudantes',description:'Aprendizado ativo, com ritmo próprio e retorno imediato.'},{icon:'building',title:'Empresas e organizações',description:'Treinamento, ativação de marca e apresentação de produtos.'}]},
{id:'commitment',type:'cards',enabled:true,label:'Nossos compromissos',title:'Tecnologia só vale se',highlight:'todo mundo alcançar.',layout:'tinted',columns:3,cards:[{icon:'access',title:'Acessibilidade',description:'Contraste, navegação por teclado, legendas e redução de movimento para quem precisa.'},{icon:'book',title:'Conteúdo',description:'Roteiro construído com quem domina o assunto e revisado antes de virar experiência.'},{icon:'target',title:'Objetivo',description:'Toda experiência começa com uma pergunta: o que precisa mudar depois dela?'}]},
{id:'contact',type:'cta',enabled:true,label:'',title:'Quer construir uma'+String.fromCharCode(10)+'experiência',highlight:'com a gente?',description:'Conte seu desafio. A primeira conversa é sobre entender, não sobre vender.',image:'/studio-cta-background.png',imagePosition:'center',overlay:0.12,button:'Começar conversa',href:'/contato'}]};

export function normalizeStudio(content=defaultStudio){
 return {...content,sections:content.sections.map(s=>({
  customStyle:false,background:content.background,accent:content.accent,padding:s.type==='intro'?180:s.type==='cta'?65:65,
  headingLayout:'split',textAlign:'left',...(s.type==='cta'?{layout:'split',minHeight:540,description:''}:{}),
  ...(s.type==='intro'||s.type==='cta'?{imageFit:'cover'}:{}),...s,
  ...(s.type==='cards'?{description:s.description||'',cards:s.cards.map(c=>({button:'',href:'/contato',...c}))}:{})
 }))}
}

export function validateStudio(v){
 if(!v||!/^#[\da-f]{6}$/i.test(v.background)||!/^#[\da-f]{6}$/i.test(v.accent)||!Array.isArray(v.sections)||v.sections.length>30)return false;
 const ids=new Set(),strings=a=>a.every(x=>typeof x==='string'&&x.length<=10000);
 const href=x=>typeof x==='string'&&/^(\/(?![\/\\])|https:\/\/|#[a-zA-Z][\w-]*$)/.test(x)&&!/[\r\n\\]/.test(x);
 return v.sections.every(s=>{
  if(!s||typeof s.id!=='string'||!s.id||s.id.length>100||ids.has(s.id))return false;ids.add(s.id);
  if(!['intro','cards','cta'].includes(s.type)||typeof s.enabled!=='boolean'||!strings([s.title,s.highlight,s.label]))return false;
  if(s.description!==undefined&&!strings([s.description]))return false;
  if(s.customStyle!==undefined&&typeof s.customStyle!=='boolean')return false;
  if(['background','accent'].some(k=>s[k]!==undefined&&!/^#[\da-f]{6}$/i.test(s[k])))return false;
  if(s.padding!==undefined&&(!Number.isFinite(s.padding)||s.padding<0||s.padding>240))return false;
  if(s.textAlign!==undefined&&!['left','center'].includes(s.textAlign)||s.headingLayout!==undefined&&!['split','stacked'].includes(s.headingLayout))return false;
  if(s.type==='cards')return [1,2,3,4].includes(s.columns)&&['lines','cards','tinted'].includes(s.layout)&&Array.isArray(s.cards)&&s.cards.length<=24&&s.cards.every(c=>c&&strings([c.title,c.description,c.icon])&&(c.button===undefined||typeof c.button==='string'&&c.button.length<=200)&&(c.href===undefined||href(c.href)));
  if(!strings([s.image,s.imagePosition])||!(s.image===''||/^(\/(?![\/\\])|https:\/\/)/.test(s.image)&&!/[\r\n\\]/.test(s.image))||!Number.isFinite(s.overlay)||s.overlay<0||s.overlay>1)return false;
  if(s.imageFit!==undefined&&!['cover','contain'].includes(s.imageFit))return false;
  if(s.type==='cta')return strings([s.button,s.href])&&href(s.href)&&(s.layout===undefined||['split','centered'].includes(s.layout))&&(s.minHeight===undefined||Number.isFinite(s.minHeight)&&s.minHeight>=0&&s.minHeight<=1000);
  return ['split','stacked'].includes(s.layout)&&strings([s.storyTitle,s.storyHighlight,s.noteTitle,s.note])&&[s.tags,s.paragraphs].every(a=>Array.isArray(a)&&a.length<=30&&strings(a));
 });
}
