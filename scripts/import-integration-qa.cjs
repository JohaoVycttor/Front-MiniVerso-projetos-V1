const fs=require('node:fs');const path=require('node:path');const assert=require('node:assert/strict');
const {integratePortfolio,rebaseAssets}=require('../lib/import-miniverso.cjs');const root=path.resolve(__dirname,'..');
(async()=>{
 const make=(folder,prefix)=>{const original=path.join(root,folder,'src/data/content.json');const fixture=path.join(root,'scripts/fixtures',folder.endsWith('-main')?'miniverso-main.json':'miniverso-chemistry.json');return rebaseAssets(JSON.parse(fs.readFileSync(fs.existsSync(original)?original:fixture,'utf8')),prefix)};
 const main=make('Front-MiniVerso-projetos-V1-main','/imported/miniverso-main');const lab=make('Front-MiniVerso-projetos-V1-feat-pagina-laboratorio-quimica','/imported/miniverso-chemistry');
 const {defaultProjectDetail}=await import('data:text/javascript;base64,'+Buffer.from(fs.readFileSync(path.join(root,'lib/project-detail.js'),'utf8')).toString('base64'));
 const portfolio=JSON.parse(fs.readFileSync(path.join(root,'data/content.json'),'utf8')).portfolio;
 assert.deepEqual(integratePortfolio(portfolio,main,lab,defaultProjectDetail),portfolio,'Import must preserve existing edits and be idempotent');
 for(const project of main.projects)assert.ok(portfolio.projects.find(p=>p.id===project.id));
 for(const id of ['prj-1','prj-2','prj-3'])assert.ok(portfolio.projects.find(p=>p.id===id),'Existing custom project must remain');
 const chemistry=portfolio.projects.find(p=>p.id==='chemistry');assert.equal(chemistry.detail.sections.find(s=>s.type==='media').asset.duration,84);assert.equal(chemistry.detail.sections.find(s=>s.type==='gallery').items.length,3);assert.equal(chemistry.detail.sections.find(s=>s.type==='benefits').items.length,3);
 function checkAssets(value){if(typeof value==='string'&&value.startsWith('/imported/'))assert.ok(fs.existsSync(path.join(root,'public',value)),value);else if(Array.isArray(value))value.forEach(checkAssets);else if(value&&typeof value==='object')Object.values(value).forEach(checkAssets)}checkAssets(portfolio);
 console.log('PASS: idempotent integration, imported projects, custom-project preservation, chemistry sections, media duration and every imported asset');
})();
