export const detailTypes = {hero:'Título e introdução',media:'Foto ou vídeo',facts:'Ficha técnica',story:'Desafio e solução',benefits:'Benefícios',gallery:'Galeria',next:'Próximo projeto',contact:'Chamada de contato',text:'Texto livre'};
export const detailLayouts = ['columns','stacked','centered'];
export function detailTemplate(type, project) {
  const base={id:type, type, visible:true, layout:'columns', label:'', title:'', accent:'', description:'', button:'', href:'/contato', items:[]};
  if(type==='hero') return {...base,title:project.title,description:project.introduction};
  if(type==='media') return {...base,description:'',asset:{...project.presentation}};
  if(type==='facts') return {...base,items:project.facts.map(f=>({title:f.label,description:f.value}))};
  if(type==='story') return {...base,items:project.story.map(f=>({label:'',title:f.title,description:f.text}))};
  if(type==='benefits') return {...base,label:'O QUE MUDOU',items:[]};
  if(type==='gallery') return {...base,label:'GALERIA',items:project.gallery.map(a=>({...a}))};
  if(type==='next') return {...base,label:'PRÓXIMO PROJETO',projectId:''};
  if(type==='contact') return {...base,title:'Quer construir uma experiência \ncom a gente?',button:'Começar conversa'};
  return {...base,title:'Novo conteúdo'};
}
export function defaultProjectDetail(project) {
  const sections=['hero','media','facts','story','benefits','gallery','next','contact'].map(type=>detailTemplate(type,project));
  const chemistry=project.id==='chemistry';
  if(chemistry){
    Object.assign(sections[0],{title:'LABORATÓRIO VIRTUAL',accent:'DE QUÍMICA.'});
    sections[1].description='Estudante usa óculos de realidade virtual em uma bancada de laboratório simulada.';
    sections[2].items=[{title:'SEGMENTO',description:'Ensino médio e técnico'},{title:'FORMATO',description:'Realidade virtual'},{title:'TECNOLOGIAS',description:'Unity, Meta Quest 3 e Blender'},{title:'SERVIÇOS',description:'Roteiro, modelagem 3D e desenvolvimento'},{title:'ANO',description:'2026'}];
    sections[3].items=[{label:'O DESAFIO',title:'Química sem laboratório.',description:'Aulas práticas dependem de reagentes caros e de um laboratório equipado. Muitas escolas não têm nenhum dos dois, e os estudantes acabam vendo os experimentos só no quadro.'},{label:'A SOLUÇÃO',title:'Uma bancada que cabe nos óculos.',description:'Um laboratório em realidade virtual com vidrarias e reações. O estudante segue um roteiro guiado, pode errar e repetir quantas vezes precisar, e o professor acompanha cada etapa pelo painel.'}];
    sections[4].items=[{icon:'shield',title:'Prática sem risco',description:'Reações perigosas viram exercício seguro, e o erro passa a fazer parte da aula.'},{icon:'headset',title:'Uso em sala comum',description:'Funciona com óculos autônomos, sem precisar de laboratório físico.'},{icon:'chart',title:'Professor no controle',description:'Roteiro, liberação das práticas e acompanhamento ficam com quem ensina.'}];
    sections[5].items=['Bancada com vidrarias','Roteiro guiado da prática','Painel do professor'].map((alt,i)=>({id:'chemistry-gallery-'+i,type:'image',alt,caption:String(i+1).padStart(2,'0')+'  '+alt}));
    sections[6].projectId='campus';
  }
  return {background:chemistry?'/portfolio/images/laboratory-background.webp':'',position:'center center',overlay:0.16,animations:true,sections};
}
export function projectDetail(project){return project.detail || defaultProjectDetail(project)}
const object=v=>v!==null&&typeof v==='object'&&!Array.isArray(v);
const text=v=>typeof v==='string'&&v.length<=10000;
const url=v=>text(v)&&v.length<=2000&&(v===''||/^(\/(?![\/\\])|https?:\/\/)/.test(v))&&!/[\r\n\\]/.test(v);
const href=v=>url(v)||text(v)&&/^mailto:[^\s]+$/.test(v);
const asset=v=>object(v)&&['image','video'].includes(v.type)&&text(v.id)&&text(v.alt)&&['src','poster'].every(k=>v[k]===undefined||url(v[k]))&&(v.caption===undefined||text(v.caption))&&(v.duration===undefined||Number.isFinite(v.duration)&&v.duration>=0);
export function validateProjectDetail(detail){
 if(!object(detail)||!url(detail.background)||typeof detail.animations!=='boolean'||!text(detail.position)||!/^[a-zA-Z0-9%. -]{1,80}$/.test(detail.position)||!Number.isFinite(detail.overlay)||detail.overlay<0||detail.overlay>0.85||!Array.isArray(detail.sections)||detail.sections.length>40)return false;
 const ids=new Set();
 return detail.sections.every(s=>{
  if(!object(s)||!text(s.id)||!/^[a-zA-Z0-9_-]{1,80}$/.test(s.id)||ids.has(s.id)||!Object.hasOwn(detailTypes,s.type)||typeof s.visible!=='boolean'||!detailLayouts.includes(s.layout)||!['label','title','accent','description','button'].every(k=>text(s[k]))||!href(s.href)||!Array.isArray(s.items)||s.items.length>40)return false;
  ids.add(s.id);
  if(s.type==='media'&&!asset(s.asset))return false;
  if(s.type==='next'&&!text(s.projectId))return false;
  if(s.type==='gallery')return s.items.every(asset);
  return s.items.every(i=>object(i)&&text(i.title)&&text(i.description)&&(i.label===undefined||text(i.label))&&(i.icon===undefined||['shield','headset','chart'].includes(i.icon)));
 });
}
