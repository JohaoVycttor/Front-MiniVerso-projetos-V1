
const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
const path=require('node:path');
const os=require('node:os');
const net=require('node:net');
const {spawn}=require('node:child_process');
const {chromium,expect}=require('@playwright/test');
const root=path.resolve(__dirname,'..'),children=[];
let directory,browser,page;
async function port(){const server=net.createServer();await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const number=server.address().port;await new Promise(resolve=>server.close(resolve));return number;}
async function start(cwd,number,env){
 const child=spawn(process.execPath,[path.join(cwd,'node_modules/next/dist/bin/next'),'start','--hostname','127.0.0.1','--port',String(number)],{cwd,env:{...process.env,...env},windowsHide:true,stdio:['ignore','pipe','pipe']});
 children.push(child);let output='';child.stdout.on('data',value=>{output+=value;});child.stderr.on('data',value=>{output+=value;});
 const url='http://127.0.0.1:'+number;
 for(let attempt=0;attempt<100;attempt++){if(child.exitCode!==null)throw new Error(output);try{const response=await fetch(url);if(response.status<500)return url;}catch{}await new Promise(resolve=>setTimeout(resolve,200));}
 throw new Error('Servidor indisponível: '+output);
}
(async()=>{
 directory=await fs.mkdtemp(path.join(os.tmpdir(),'miniverso-cms-browser-'));
 const seed=JSON.parse(await fs.readFile(path.join(root,'data/site-content.json'),'utf8'));
 await fs.writeFile(path.join(directory,'site-content.json'),JSON.stringify(seed));
 await fs.writeFile(path.join(directory,'leads.json'),'[]');
 const sitePort=await port(),adminPort=await port();
 const env={HOME_DATA_DIR:directory,CONTENT_SOURCE:'local',API_MODE:'mock',API_URL:'',MOCK_LATENCY_MS:'0',MOCK_ADMIN_EMAIL:'admin@miniverso.test',MOCK_ADMIN_PASSWORD:'miniverso123',SITE_URL:'http://127.0.0.1:'+sitePort};
 const site=await start(root,sitePort,env),admin=await start(path.join(root,'miniverso-admin-main'),adminPort,env);
 browser=await chromium.launch({channel:'msedge',headless:true});
 const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 page=await context.newPage();const pageErrors=[];page.on('pageerror',error=>pageErrors.push(error.message));
 await page.goto(admin+'/admin/login');
 await page.getByLabel(/^E-mail/).fill('admin@miniverso.test');
 await page.getByLabel(/^Senha/).fill('miniverso123');
 await page.getByRole('button',{name:'Entrar',exact:true}).click();
 await page.waitForURL('**/admin/paginas');
 await expect(page.getByRole('heading',{name:'Conteúdo do site',exact:true})).toBeVisible();
 const nav=page.getByRole('navigation',{name:'Áreas do editor'});
 for(const entry of seed.pages){
  await nav.getByRole('button',{name:entry.label,exact:false}).first().click();
  await page.getByLabel('Título principal',{exact:true}).fill('QA HERO '+entry.id);
  await page.getByLabel('Texto de apoio',{exact:true}).fill('QA descrição '+entry.id);
  const hero=page.locator('details').filter({has:page.locator('summary',{hasText:'Hero — abertura da página'})}).first();
  await hero.getByLabel('Legenda',{exact:true}).first().fill('QA legenda '+entry.id);
 }
 await nav.getByRole('button',{name:'Marca e contatos',exact:true}).click();
 await page.getByLabel('E-mail de contato',{exact:true}).fill('publicado@example.com');
 await nav.getByRole('button',{name:'Dispositivos e redes',exact:true}).click();
 await page.getByLabel('Título dos dispositivos',{exact:true}).fill('QA dispositivos editáveis');
 await page.getByLabel('Título das redes',{exact:true}).fill('QA redes editáveis');
 await page.getByRole('button',{name:'Salvar e publicar',exact:true}).click();
 await expect(page.getByText('Conteúdo publicado. As páginas passam a ler esta versão sem novo build.')).toBeVisible();
 console.log('PASS edição e publicação pela interface nas cinco páginas');
 for(const entry of seed.pages){
  const target=await context.newPage();target.on('pageerror',error=>pageErrors.push(error.message));
  await target.goto(site+entry.path);
  await expect(target.locator('h1')).toHaveText('QA HERO '+entry.id);
  await expect(target.locator('.hero-caption')).toHaveText('QA legenda '+entry.id);
  assert.equal(await target.locator('a[href="mailto:publicado@example.com"]').count()>0,true);
  assert.equal(await target.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,entry.path+' com overflow');
  if(entry.id==='home'){await expect(target.getByText('QA dispositivos editáveis',{exact:true})).toBeVisible();await expect(target.getByText('QA redes editáveis',{exact:true})).toBeVisible();}
  await target.close();
 }
 console.log('PASS páginas públicas leem os dados publicados sem rebuild');
 let response=await page.request.get(admin+'/api/admin/pages');assert.equal(response.status(),200);
 const document=(await response.json()).data;
 const conflict=await page.request.put(admin+'/api/admin/pages',{data:seed,headers:{origin:admin}});assert.equal(conflict.status(),409);
 const invalid=structuredClone(document);invalid.pages[0].hero.image='javascript:alert(1)';
 assert.equal((await page.request.put(admin+'/api/admin/pages',{data:invalid,headers:{origin:admin}})).status(),422);
 assert.equal((await page.request.put(admin+'/api/admin/pages',{data:document,headers:{origin:'https://outro-site.test'}})).status(),403);
 const anonymous=await browser.newContext();assert.equal((await anonymous.request.get(admin+'/api/admin/pages')).status(),401);await anonymous.close();
 console.log('PASS sessão, origem, validação e conflito de revisão');
 const bytes=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aS9sAAAAASUVORK5CYII=','base64');
 response=await page.request.post(admin+'/api/uploads',{headers:{origin:admin},multipart:{file:{name:'qa.png',mimeType:'image/png',buffer:bytes}}});
 assert.equal(response.status(),201);const media=(await response.json()).url;
 assert.equal((await page.request.get(site+media)).status(),200);
 assert.equal((await page.request.get(admin+media)).status(),200);
 const format=document.pages.find(entry=>entry.id==='solutions').sections.find(section=>section.type==='solutions').items[0];
 format.image=media;format.imageAlt='QA imagem publicada';format.caption='QA legenda do formato';
 const featured=document.pages.find(entry=>entry.id==='projects').sections.find(section=>section.type==='featured');
 featured.projectId=document.projects.filter(project=>project.visible).at(-1).id;
 response=await page.request.put(admin+'/api/admin/pages',{data:document,headers:{origin:admin}});assert.equal(response.status(),200);
 await page.goto(site+'/servicos');await expect(page.getByAltText('QA imagem publicada')).toBeVisible();await expect(page.getByText('QA legenda do formato')).toBeVisible();
 await page.goto(site+'/projetos');await expect(page.locator('.future-featured-copy h3')).toHaveText(document.projects.find(project=>project.id===featured.projectId).title);
 console.log('PASS upload servido pelos dois apps, imagem/legenda e projeto em destaque');
 await page.goto(site+'/contato');
 await page.locator('input[name=name]').fill('QA integração');
 await page.locator('input[name=email]').fill('qa@example.com');
 await page.locator('select[name=subject]').selectOption(document.contact.subjects[0]);
 await page.locator('textarea[name=message]').fill('Mensagem temporária do teste de integração.');
 await page.locator('input[name=consent]').check();
 await page.locator('.future-inquiry button[type=submit]').click();
 await expect(page.locator('.inquiry-result')).toContainText('MV-');
 response=await page.request.get(admin+'/api/admin/leads?search=qa@example.com');const leads=await response.json();assert.equal(leads.data.length,1);assert.equal(leads.data[0].email,'qa@example.com');
 assert.equal((await page.request.delete(admin+'/api/admin/leads/'+leads.data[0].id,{headers:{origin:admin}})).status(),204);
 console.log('PASS formulário público gera mensagem real no painel');
 await page.goto(admin+'/admin/paginas');
 await expect(page.getByLabel('Título principal',{exact:true})).toHaveValue('QA HERO home');
 await fs.mkdir(path.join(root,'qa-artifacts'),{recursive:true});
 await page.screenshot({path:path.join(root,'qa-artifacts/admin-desktop.png'),fullPage:true});
 await page.setViewportSize({width:390,height:844});
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'Painel mobile com overflow');
 await page.screenshot({path:path.join(root,'qa-artifacts/admin-mobile.png'),fullPage:true});
 await page.goto(site+'/');await page.locator('#nosso-universo-digital').scrollIntoViewIfNeeded();
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'Site mobile com overflow');
 await page.locator('#nosso-universo-digital').screenshot({path:path.join(root,'qa-artifacts/dispositivos-mobile.png')});
 assert.deepEqual(pageErrors,[]);
 console.log('PASS responsividade e ausência de erros de JavaScript');
})().catch(async error=>{console.error(error);if(page)await page.screenshot({path:path.join(root,'qa-artifacts-failure.png')}).catch(()=>{});process.exitCode=1;}).finally(async()=>{
 await browser?.close();
 await Promise.all(children.map(child=>new Promise(resolve=>{if(child.exitCode!==null)return resolve();child.once('exit',resolve);child.kill();})));
 if(directory){const prefix=path.resolve(os.tmpdir())+path.sep+'miniverso-cms-browser-';assert.ok(path.resolve(directory).startsWith(prefix));await fs.rm(directory,{recursive:true,force:true});}
});
