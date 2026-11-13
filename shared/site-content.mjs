
// Public content contract shared by the website, the admin and the future PHP API.
export const PAGE_PATHS = {home:'/',studio:'/sobre',solutions:'/servicos',projects:'/projetos',contact:'/contato'};
export const SECTION_TYPES = {intro:'Texto e imagem',formats:'Cards de formatos',solutions:'Formatos interativos',projects:'Seleção de projetos',catalog:'Galeria de projetos',featured:'Projeto em destaque',values:'Itens em colunas',experience:'Animação em partículas',digital:'Dispositivos e redes sociais',contact:'Formulário de contato',cta:'Chamada para contato'};
export const UI_FIELDS = {
 skipLink:['Link para o conteúdo','Pular para o conteúdo'],login:['Link de login','Login'],adminArea:['Link administrativo no rodapé','Área administrativa ↗'],
 footerEyebrow:['Etiqueta do rodapé','MINIVERSO / CONECTE-SE AO NOVO'],footerExplore:['Título dos links do rodapé','Explore'],footerConnect:['Título dos contatos do rodapé','Vamos conversar'],
 heroLocationLabel:['Descrição da localização no hero','ESTÚDIO INDEPENDENTE'],heroMetaTitle:['Metadado principal do hero','TECNOLOGIA × CRIATIVIDADE'],heroMetaSubtitle:['Metadado secundário do hero','REALIDADES QUE CONECTAM'],
 catalogAll:['Filtro de todos os projetos','Todos'],catalogCount:['Nome da contagem de projetos','projetos'],projectBack:['Voltar ao portfólio','Voltar aos projetos'],projectOverline:['Etiqueta de projeto','PROJETO'],projectPrevious:['Projeto anterior','Anterior'],projectNext:['Próximo projeto','Próximo'],projectAll:['Link para todos os projetos','Todos os projetos'],projectExplore:['Chamada para explorar projetos','Explore'],projectDetails:['Botão do projeto em destaque','Conheça o projeto'],
 videoPlay:['Reproduzir vídeo','Assistir à apresentação'],videoEmpty:['Vídeo sem arquivo','Vídeo de apresentação'],videoSoon:['Vídeo ainda não publicado','Em breve'],galleryPrevious:['Mídia anterior','Mídia anterior'],galleryNext:['Próxima mídia','Próxima mídia'],
 contactChannels:['Etiqueta dos contatos','CANAIS DIRETOS'],contactWhatsapp:['Chamada do WhatsApp','Converse com a equipe'],formatAction:['Link dos formatos','Vamos explorar este formato'],
 formName:['Rótulo do nome','Seu nome'],formNamePlaceholder:['Exemplo do nome','Como podemos chamar você?'],formEmail:['Rótulo do e-mail','Seu e-mail'],formEmailPlaceholder:['Exemplo do e-mail','voce@empresa.com'],formSubject:['Rótulo do assunto','O que você tem em mente?'],formSubjectPlaceholder:['Opção inicial do assunto','Selecione um formato'],formMessage:['Rótulo da mensagem','Conte um pouco da sua ideia'],formMessagePlaceholder:['Exemplo da mensagem','Seu desafio, seu público e o que você imagina.'],formSending:['Estado de envio','Enviando…'],formProtocol:['Rótulo do protocolo','Protocolo'],
};
export const UI_DEFAULTS = Object.fromEntries(Object.entries(UI_FIELDS).map(([key,value])=>[key,value[1]]));
export const SETTING_DEFAULTS = {logo:'/logo-symbol.png',logoAlt:'Miniverso',favicon:'/favicon.svg',headerButtonHref:'/contato',footerButtonHref:'/contato',seoTitle:'Miniverso | Outras formas de ver o mundo',seoDescription:'Experiências imersivas em VR, AR, MR e vídeos 360°.'};
export const DIGITAL_DEFAULTS = {
 siteEyebrow:'01 / EXPLORE O NOVO SITE',siteTitle:'Uma experiência que acompanha você.',siteDescription:'Conheça projetos e possibilidades no notebook, tablet ou celular.',
 socialEyebrow:'02 / VAMOS NOS CONECTAR',socialTitle:'Projetos, bastidores e boas conversas.',socialDescription:'Acompanhe a Miniverso no Instagram ou conte sua ideia pelo WhatsApp.',
 devices:[
  {id:'notebook',title:'Notebook',image:'/site-preview-notebook.jpg',imageAlt:'Site da Miniverso no notebook',caption:'',href:'/projetos'},
  {id:'celular',title:'Smartphone',image:'/site-preview-celular.jpg',imageAlt:'Site da Miniverso no celular',caption:'',href:'/projetos'},
  {id:'tablet',title:'Tablet',image:'/site-preview-tablet.jpg',imageAlt:'Site da Miniverso no tablet',caption:'',href:'/projetos'},
 ],
 social:{whatsappLabel:'WhatsApp',instagramLabel:'Instagram',siteLabel:'Site mobile',whatsappAction:'Conversar no WhatsApp',bio:'Sua nova dimensão de aprendizado e treinamento! Conheça nossos projetos e agende sua demonstração.',followers:'523',following:'172',profileLink:'https://www.instagram.com/meuminiverso/',highlights:['Eventos','Apoio','Onde estamos','Feedbacks','NEon'],posts:['/home-team-v2.webp','/home-vr-people-v2.webp','/home-vr-person-v2.webp'].map((src,i)=>({id:'post-'+i,type:'image',src,alt:'Experiências e bastidores da Miniverso',caption:''})),
 messages:[
  {id:'message-1',text:'Olá! Quero conhecer as experiências da Miniverso.',direction:'sent'},
  {id:'message-2',text:'Olá! Vamos criar uma nova realidade juntos?',direction:'received'},
  {id:'message-3',text:'Criamos experiências em VR, AR e vídeos 360° para aproximar pessoas do conhecimento.',direction:'received'},
  {id:'message-4',text:'Tenho uma ideia para meu projeto!',direction:'sent'},
  {id:'message-5',text:'Conte pra gente. Tudo começa com uma conversa.',direction:'received'},
 ]},
};
export function normalizeSiteDocument(input){
 const next=structuredClone(input);
 next.settings={...SETTING_DEFAULTS,...next.settings};
 next.ui={...UI_DEFAULTS,...next.ui};
 next.digital={...structuredClone(DIGITAL_DEFAULTS),...next.digital};
 next.digital.social={...structuredClone(DIGITAL_DEFAULTS.social),...next.digital.social};
 for(const project of next.projects||[]){
  const defaults={src:'',alt:'',caption:'',poster:''};
  project.cover={...defaults,...project.cover};project.presentation={...defaults,...project.presentation};
  project.gallery=(project.gallery||[]).map(asset=>({...defaults,...asset}));
 }
 for(const page of next.pages||[]){
  page.hero={masthead:page.id==='home'?next.settings.brand:page.label,scrollLabel:'DESÇA PARA EXPLORAR',scrollHref:'#explorar',...page.hero};
  page.ribbon={visible:true,text:'REALIDADE VIRTUAL\nREALIDADE AUMENTADA\nREALIDADE MISTA\nVÍDEOS 360°\nEDUCAÇÃO IMERSIVA',...page.ribbon};
  page.sections=(page.sections||[]).map(section=>({supportTitle:'CRIATIVIDADE × TECNOLOGIA',supportText:next.settings.tagline,projectIds:[],limit:2,...section}));
 }
 return next;
}
export function isSafeSiteUrl(value){
 if(typeof value!=='string')return false;
 if(value==='')return true;
 if(/[\\\u0000-\u0020]/.test(value))return false;
 if(/^\/(?!\/)/.test(value)||/^#[a-zA-Z0-9_-]+$/.test(value))return true;
 try{const parsed=new URL(value);return ['http:','https:','mailto:','tel:'].includes(parsed.protocol);}catch{return false;}
}
function requireValue(condition,message){if(!condition)throw new Error(message);}
function object(value,label='conteúdo'){requireValue(value&&typeof value==='object'&&!Array.isArray(value),'Estrutura inválida em '+label+'.');}
function text(value,label,required=false,max=12000){requireValue(typeof value==='string'&&value.length<=max&&(!required||value.trim().length>0),'Revise o campo '+label+'.');}
function list(value,label,max=100){requireValue(Array.isArray(value)&&value.length<=max,'Revise a lista de '+label+'.');}
function url(value,label,media=false){text(value,label);requireValue(isSafeSiteUrl(value)&&(!media||!value||/^(?:https?:\/\/|\/(?!\/))/i.test(value)),'Endereço inválido em '+label+'.');}
function unique(values,key,label){const ids=values.map(value=>{object(value,label);text(value[key],label,true,160);return value[key];});requireValue(new Set(ids).size===ids.length,'Identificadores repetidos em '+label+'.');}
function media(value,label){url(value.image,label,true);text(value.imageAlt,label+' / texto alternativo',Boolean(value.image));text(value.caption,label+' / legenda');}
function asset(value,label){object(value,label);text(value.id,label,true,160);requireValue(['image','video'].includes(value.type),'Tipo de mídia inválido.');url(value.src,label,true);text(value.alt,label+' / texto alternativo',Boolean(value.src||value.poster));if(value.caption!==undefined)text(value.caption,label+' / legenda');if(value.poster!==undefined)url(value.poster,label+' / capa',true);}
function position(value){text(value,'enquadramento',false,100);requireValue(!value||/^(?:(?:left|right|center|top|bottom|-?\d+(?:\.\d+)?(?:%|px))(?:\s+|$)){1,4}$/.test(value),'Enquadramento inválido. Exemplo: center 30%.');}
export function validateSiteDocument(input){
 object(input);requireValue(input.schemaVersion===1,'Versão de conteúdo inválida.');requireValue(Number.isSafeInteger(input.revision)&&input.revision>0,'Revisão inválida.');text(input.publishedAt,'data');
 object(input.settings);
 for(const key of ['brand','tagline','email','whatsapp','instagram','location','headerButton','footerTitle','footerDescription','footerButton','copyright','seoTitle','seoDescription'])text(input.settings[key],key,true,1000);
 for(const key of ['logo','favicon'])url(input.settings[key],key,true);
 text(input.settings.logoAlt,'descrição da marca',Boolean(input.settings.logo),300);
 for(const key of ['headerButtonHref','footerButtonHref'])url(input.settings[key],key);
 requireValue(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.settings.email),'Revise o e-mail de contato.');
 requireValue(/^\d{10,15}$/.test(input.settings.whatsapp),'Informe o WhatsApp com código do país e DDD, apenas números.');
 requireValue(/^[\w.]{1,40}$/.test(input.settings.instagram),'Informe o usuário do Instagram sem @.');
 object(input.ui);for(const key of Object.keys(UI_FIELDS))text(input.ui[key],'rótulo / '+UI_FIELDS[key][0],true,1000);
 object(input.contact);for(const key of ['title','description','button','consentLabel','successText','errorText','privacyText'])text(input.contact[key],'formulário / '+key,true,1000);
 list(input.contact.subjects,'assuntos',30);requireValue(input.contact.subjects.length>0,'Cadastre ao menos um assunto.');input.contact.subjects.forEach(value=>text(value,'assunto',true,150));requireValue(new Set(input.contact.subjects).size===input.contact.subjects.length,'Assuntos repetidos.');
 list(input.pages,'páginas',5);requireValue(input.pages.length===5,'Mantenha as cinco páginas.');unique(input.pages,'id','páginas');
 for(const page of input.pages){
  object(page);requireValue(PAGE_PATHS[page.id]===page.path,'Endereço de página inválido.');text(page.label,'nome no menu',true,80);text(page.seoTitle,'SEO / título',true,150);text(page.seoDescription,'SEO / descrição',true,400);
  object(page.hero);for(const key of ['masthead','eyebrow','title','description','caption','buttonLabel','scrollLabel'])text(page.hero[key],'hero / '+key,['masthead','title'].includes(key),2000);
  media(page.hero,'hero');position(page.hero.imagePosition);url(page.hero.buttonHref,'botão do hero');url(page.hero.scrollHref,'rolagem do hero');
  list(page.hero.slides,'cenas do hero',5);unique(page.hero.slides,'id','cenas do hero');
  for(const slide of page.hero.slides){text(slide.title,'nome da cena',true,80);media(slide,'cena do hero');requireValue(Boolean(slide.image),'Selecione a imagem da cena.');}
  object(page.ribbon);requireValue(typeof page.ribbon.visible==='boolean','Visibilidade da faixa inválida.');text(page.ribbon.text,'texto da faixa',page.ribbon.visible,2000);
  list(page.sections,'seções',25);unique(page.sections,'id','seções');
  for(const section of page.sections){
   requireValue(/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(section.id)&&section.id!=='explorar','Âncora de seção inválida ou reservada.');
   requireValue(Object.hasOwn(SECTION_TYPES,section.type),'Tipo de seção inválido.');requireValue(typeof section.visible==='boolean','Visibilidade inválida.');
   for(const key of ['eyebrow','title','description','buttonLabel','supportTitle','supportText'])text(section[key],'seção '+section.id+' / '+key,key==='title');
   media(section,'seção '+section.id);url(section.buttonHref,'botão da seção');
   if(section.projectId!==undefined)text(section.projectId,'projeto em destaque',false,160);
   requireValue(Number.isSafeInteger(section.limit)&&section.limit>=1&&section.limit<=100,'Quantidade de projetos inválida.');
   list(section.projectIds,'projetos da seção',100);section.projectIds.forEach(id=>text(id,'projeto da seção',true,160));
   list(section.items,'itens',30);unique(section.items,'id','itens');
   for(const item of section.items){for(const key of ['title','description','tag'])text(item[key],'item / '+key,key==='title');media(item,'item');url(item.href,'link do item');}
  }
 }
 list(input.projects,'projetos',100);unique(input.projects,'id','projetos');unique(input.projects,'slug','endereços dos projetos');
 for(const project of input.projects){
  requireValue(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project.slug),'Endereço do projeto inválido.');
  for(const key of ['title','tag','description','introduction'])text(project[key],'projeto / '+key,true);
  requireValue(typeof project.visible==='boolean'&&Number.isSafeInteger(project.order)&&project.order>=0,'Ordem ou visibilidade inválida.');
  list(project.categoryIds,'categorias',30);project.categoryIds.forEach(id=>text(id,'categoria',true,160));
  asset(project.cover,'capa');requireValue(project.cover.type==='image','A capa deve ser uma imagem.');asset(project.presentation,'apresentação');
  list(project.gallery,'galeria',30);unique(project.gallery,'id','galeria');project.gallery.forEach(value=>asset(value,'galeria'));
  list(project.facts,'ficha técnica',15);for(const fact of project.facts){object(fact);text(fact.label,'rótulo',true,100);text(fact.value,'valor',true,1000);}
  list(project.story,'textos do projeto',20);for(const block of project.story){object(block);text(block.title,'título',true,150);text(block.text,'texto',true);}
 }
 const projectIds=new Set(input.projects.map(project=>project.id));
 for(const page of input.pages)for(const section of page.sections){
  if(section.projectId)requireValue(projectIds.has(section.projectId),'O projeto em destaque não existe.');
  requireValue(new Set(section.projectIds).size===section.projectIds.length,'Projetos repetidos na seção.');
  section.projectIds.forEach(id=>requireValue(projectIds.has(id),'Um projeto selecionado não existe.'));
 }
 object(input.digital);for(const key of ['siteEyebrow','siteTitle','siteDescription','socialEyebrow','socialTitle','socialDescription'])text(input.digital[key],'dispositivos / '+key,true,1000);
 list(input.digital.devices,'dispositivos',3);requireValue(input.digital.devices.length===3,'Mantenha notebook, smartphone e tablet.');unique(input.digital.devices,'id','dispositivos');
 for(const device of input.digital.devices){requireValue(['notebook','celular','tablet'].includes(device.id),'Dispositivo inválido.');text(device.title,'nome do dispositivo',true,80);media(device,'dispositivo');url(device.href,'link do dispositivo');}
 object(input.digital.social);const social=input.digital.social;
 for(const key of ['whatsappLabel','instagramLabel','siteLabel','whatsappAction','bio','followers','following'])text(social[key],'redes sociais / '+key,true,2000);
 url(social.profileLink,'link do perfil');list(social.highlights,'destaques',8);social.highlights.forEach(value=>text(value,'destaque',true,80));
 list(social.posts,'fotos do Instagram',12);unique(social.posts,'id','fotos do Instagram');social.posts.forEach(value=>{asset(value,'foto do Instagram');requireValue(value.type==='image','O perfil usa imagens.');});
 list(social.messages,'mensagens da prévia',15);requireValue(social.messages.length>0,'Cadastre ao menos uma mensagem de demonstração.');unique(social.messages,'id','mensagens');
 for(const message of social.messages){text(message.text,'mensagem de demonstração',true,500);requireValue(['sent','received'].includes(message.direction),'Tipo de mensagem inválido.');}
 return input;
}
