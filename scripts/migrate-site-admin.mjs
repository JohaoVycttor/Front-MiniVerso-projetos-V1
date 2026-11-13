
import {readFile,writeFile} from 'node:fs/promises';
import {normalizeSiteDocument,validateSiteDocument} from '../shared/site-content.mjs';
const file=new URL('../data/site-content.json',import.meta.url);
const current=JSON.parse(await readFile(file,'utf8'));
const site=normalizeSiteDocument(current);
if(!current.ui){
 const home=site.pages.find(page=>page.id==='home');
 const experience=home.sections.filter(section=>section.type==='experience');
 home.sections=[...experience,...home.sections.filter(section=>section.type!=='experience')];
 if(!home.sections.some(section=>section.type==='digital')){
  const index=home.sections.findIndex(section=>section.type==='intro');
  home.sections.splice(index+1,0,{id:'nosso-universo-digital',type:'digital',visible:true,eyebrow:'MINIVERSO / SEMPRE POR PERTO',title:'NOSSO UNIVERSO,\nEM QUALQUER TELA.',description:'O novo site aproxima você dos nossos projetos. Nas redes, a conversa continua.',supportTitle:'',supportText:'',image:'',imageAlt:'',caption:'',buttonLabel:'',buttonHref:'',items:[],projectIds:[],limit:2});
 }
 for(const page of site.pages)for(const section of page.sections)if(['formats','solutions'].includes(section.type))for(const item of section.items){item.image='';item.imageAlt='';}
 for(const page of site.pages)if(page.hero.slides[0])page.hero.caption=page.hero.slides[0].caption;
 site.revision+=1;
}
validateSiteDocument(site);
await writeFile(file,JSON.stringify(site,null,2)+'\n');
console.log('Documento validado: '+site.pages.length+' páginas, '+site.projects.length+' projetos.');
