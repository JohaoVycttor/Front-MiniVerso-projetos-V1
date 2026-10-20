const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const modules=new Map();
function moduleUrl(file){
 file=path.resolve(file);if(modules.has(file))return modules.get(file);
 let source=fs.readFileSync(file,'utf8');
 if(file.endsWith('.json'))source='export default '+source;
 else source=source.replace(/(import\s+[\s\S]*?\s+from\s+)(['"])([^'"]+)\2/g,(all,prefix,quote,specifier)=>{
  if(!specifier.startsWith('.')&&!specifier.startsWith('@/'))return all;
  let target=specifier.startsWith('@/')?path.join(root,specifier.slice(2)):path.resolve(path.dirname(file),specifier);
  if(!path.extname(target))target+='.js';return prefix+quote+moduleUrl(target)+quote;
 });
 const url='data:text/javascript;base64,'+Buffer.from(source).toString('base64');modules.set(file,url);return url;
}
(async()=>{
 const site=await import(moduleUrl(path.join(root,'lib/site-content.js')));
 const studio=await import(moduleUrl(path.join(root,'lib/studio-content.js')));
 const solutions=await import(moduleUrl(path.join(root,'lib/solutions-content.js')));
 const contact=await import(moduleUrl(path.join(root,'lib/contact-content.js')));
 const portfolio=await import(moduleUrl(path.join(root,'lib/portfolio-content.js')));
 const editable=await import(moduleUrl(path.join(root,'lib/editable-content.js')));
 const data=editable.editableContent(JSON.parse(fs.readFileSync(path.join(root,'data/content.json'),'utf8')));
 assert.ok(site.validateSite(data.site));assert.ok(site.validateHome(data.home));assert.ok(studio.validateStudio(data.studio));assert.ok(solutions.validateSolutions(data.solutions));assert.ok(contact.validateContactPage(data.contactPage));portfolio.parseContent(data.portfolio);
 const edited=structuredClone(data.site);edited.header.transparentTop=false;edited.header.scrolledBackground='#142536';edited.header.scrollThreshold=80;edited.interactions.cardHover=false;edited.pages.home.title='Custom title';assert.ok(site.validateSite(edited));edited.header.scrolledBackground='invalid';assert.equal(site.validateSite(edited),false);
 const draft=structuredClone(data.portfolio);draft.projects[0].detail.sections.reverse();draft.projects[0].detail.sections[0].layout='stacked';portfolio.parseContent(draft);draft.projects[0].presentation.src='javascript:alert(1)';assert.throws(()=>portfolio.parseContent(draft));
 const db=await import(moduleUrl(path.join(root,'lib/db.js')));
 const originalFetch=global.fetch;const originalUrl=process.env.CONTENT_API_URL;const originalToken=process.env.CONTENT_API_TOKEN;
 try{
 process.env.CONTENT_API_URL='https://example.invalid/content';process.env.CONTENT_API_TOKEN='test-token';let stored={contacts:[],projects:[],services:[],counter:1};let conflict=false;
 global.fetch=async(url,options)=>{
  assert.equal(options.headers.Authorization,'Bearer test-token');
  if(options.method==='PUT'){assert.equal(options.headers['If-Match'],'"v1"');if(conflict)return new Response('',{status:412});stored=JSON.parse(options.body);return new Response(null,{status:204})}
  return new Response(JSON.stringify(stored),{headers:{etag:'"v1"','content-type':'application/json'}});
 };
 await db.updateContent(current=>{current.counter=2});assert.equal(stored.counter,2);
 conflict=true;await assert.rejects(db.updateContent(current=>{current.counter=3}),error=>error.code==='CONTENT_CONFLICT');assert.equal(stored.counter,2);
 }finally{global.fetch=originalFetch;if(originalUrl===undefined)delete process.env.CONTENT_API_URL;else process.env.CONTENT_API_URL=originalUrl;if(originalToken===undefined)delete process.env.CONTENT_API_TOKEN;else process.env.CONTENT_API_TOKEN=originalToken}
 console.log('PASS: persisted/default documents, editable global settings, project layouts, unsafe media rejection and remote ETag conflicts');
})().catch(error=>{console.error(error.message);process.exitCode=1});
