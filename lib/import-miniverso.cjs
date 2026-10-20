const fs=require('node:fs');
const path=require('node:path');
function rebaseAssets(value,prefix){if(typeof value==='string')return /^\/(images|fonts)\//.test(value)?prefix+value:value;if(Array.isArray(value))return value.map(v=>rebaseAssets(v,prefix));if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([key,v])=>[key,rebaseAssets(v,prefix)]));return value}
function mergeItems(current,incoming,key){const merged=[...current];for(const item of incoming)if(!merged.some(existing=>existing[key]===item[key]))merged.push(structuredClone(item));return merged}
function integratePortfolio(current,main,lab,makeDetail){
 const result=structuredClone(current);const baseline=main.projects.find(p=>p.id==='chemistry');const imported=lab.projects.find(p=>p.id==='chemistry');
 result.categories=mergeItems(result.categories,main.categories,'id');result.projects=mergeItems(result.projects,main.projects,'id');result.pages=mergeItems(result.pages||[],main.pages||[],'slug');result.sections=mergeItems(result.sections,main.sections,'id');result.ui={...lab.ui,...main.ui,...result.ui};
 const index=result.projects.findIndex(p=>p.id==='chemistry');const existing=result.projects[index];
 if(existing&&imported){
  const project={...existing};for(const [key,value]of Object.entries(imported)){if(project[key]===undefined||JSON.stringify(project[key])===JSON.stringify(baseline?.[key]))project[key]=structuredClone(value)}
  if(!existing.detail){
   const detail=makeDetail(project);detail.background=imported.background;detail.position='center center';
   for(const section of detail.sections){
    if(section.type==='hero'){section.title=project.heading?.text||project.title;section.accent=project.heading?.accent||'';section.description=project.introduction}
    if(section.type==='media'){section.asset={...project.presentation};section.description=project.presentation.caption||''}
    if(section.type==='facts')section.items=project.facts.map(f=>({title:f.label,description:f.value}));
    if(section.type==='story')section.items=project.story.map(b=>({label:b.label||'',title:b.title,description:b.text}));
    if(section.type==='benefits'){section.label=result.ui.highlightsLabel;section.items=(project.highlights||[]).map(h=>({icon:h.icon,title:h.title,description:h.text}))}
    if(section.type==='gallery'){section.label=result.ui.galleryLabel;section.items=project.gallery.map((a,i)=>({...a,caption:String(i+1).padStart(2,'0')+'  '+(a.caption||a.alt)}))}
    if(section.type==='next')section.label=result.ui.nextProject;
    if(section.type==='contact'){section.title=result.ui.projectContactTitle;section.button=result.ui.projectContactAction}
   }
   project.detail=detail;
  }
  result.projects[index]=project;
 }
 return result;
}
module.exports={rebaseAssets,integratePortfolio};
