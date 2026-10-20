const fs=require('node:fs');const path=require('node:path');
const {rebaseAssets,integratePortfolio}=require('../lib/import-miniverso.cjs');
const root=path.resolve(__dirname,'..');
(async()=>{
 const mainFolder=path.join(root,'Front-MiniVerso-projetos-V1-main');const labFolder=path.join(root,'Front-MiniVerso-projetos-V1-feat-pagina-laboratorio-quimica');
 const main=rebaseAssets(JSON.parse(fs.readFileSync(path.join(mainFolder,'src/data/content.json'),'utf8')),'/imported/miniverso-main');
 const lab=rebaseAssets(JSON.parse(fs.readFileSync(path.join(labFolder,'src/data/content.json'),'utf8')),'/imported/miniverso-chemistry');
 const {defaultProjectDetail}=await import('data:text/javascript;base64,'+Buffer.from(fs.readFileSync(path.join(root,'lib/project-detail.js'),'utf8')).toString('base64'));
 const file=path.join(root,'data/content.json');const data=JSON.parse(fs.readFileSync(file,'utf8'));
 const next=integratePortfolio(data.portfolio,main,lab,defaultProjectDetail);
 if(!process.argv.includes('--apply')){console.log('Preview:',next.projects.length,'projects; chemistry blocks:',next.projects.find(p=>p.id==='chemistry').detail.sections.length);return}
 fs.mkdirSync(path.join(root,'public/imported'),{recursive:true});
 for(const [folder,name]of [[mainFolder,'miniverso-main'],[labFolder,'miniverso-chemistry']])fs.cpSync(path.join(folder,'public'),path.join(root,'public/imported',name),{recursive:true,force:false,errorOnExist:false});
 data.portfolio=next;fs.writeFileSync(file+'.integration.tmp',JSON.stringify(data,null,2));fs.renameSync(file+'.integration.tmp',file);
 const defaultsFile=path.join(root,'data/portfolio-default.json');const defaults=JSON.parse(fs.readFileSync(defaultsFile,'utf8'));fs.writeFileSync(defaultsFile,JSON.stringify(integratePortfolio(defaults,main,lab,defaultProjectDetail),null,2));
 console.log('Integrated main portfolio and chemistry detail, namespaced assets, existing projects preserved.');
})();
