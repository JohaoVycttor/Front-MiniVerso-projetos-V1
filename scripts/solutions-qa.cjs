const path=require('node:path');const os=require('node:os');const assert=require('node:assert/strict');
const {chromium}=require(path.join(os.tmpdir(),'miniverso-studio-qa/node_modules/playwright'));
(async()=>{
 const {defaultSolutions,validateSolutions}=await import('../lib/solutions-content.js');
 assert.ok(validateSolutions(defaultSolutions));
 const invalid=structuredClone(defaultSolutions);invalid.sections[0].cards[0].href='javascript:alert(1)';assert.equal(validateSolutions(invalid),false);
 const browser=await chromium.launch({channel:'msedge',headless:true});let restore;let request;
 try{
 const page=await browser.newPage({reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));request=page.request;
 for(const width of [1440,768,390,320]){
 await page.setViewportSize({width,height:960});await page.goto('http://localhost:3000/servicos',{waitUntil:'networkidle'});
 assert.equal(await page.locator('.solution-tile').count(),5);assert.equal(await page.locator('h1').count(),1);assert.equal(await page.locator('tbody tr').count(),4);
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 assert.ok(await page.locator('.solutions-backdrop').evaluateAll(images=>images.every(i=>i.complete&&i.naturalWidth>0)));
 if(width===1440||width===390)await page.screenshot({path:path.join(os.tmpdir(),`solutions-${width}.png`),fullPage:true});
 console.log('PASS layout and images',width);
 }
 await page.locator('.solution-tile a').first().click();await page.waitForURL('**/contato?subject=*');assert.equal(await page.locator('select[name=subject]').inputValue(),'Realidade virtual');
 assert.equal((await request.put('http://localhost:3000/api/admin/content',{data:{type:'solutions',content:defaultSolutions}})).status(),401);
 await page.setViewportSize({width:1440,height:960});await page.goto('http://localhost:3000/admin');
 await page.locator('input[name=user]').fill(process.env.ADMIN_USER||'admin@miniverso.com.br');await page.locator('input[name=password]').fill(process.env.ADMIN_PASSWORD||'miniverso123');await page.getByRole('button',{name:'Entrar',exact:true}).click();
 await page.getByRole('button',{name:'Página Soluções',exact:true}).click();await page.locator('.studio-editor').waitFor();
 restore=(await (await request.get('http://localhost:3000/api/admin/content')).json()).solutions||defaultSolutions;
 await page.locator('.studio-editor details').first().locator('summary').click();
 await page.getByRole('textbox',{name:'Título',exact:true}).first().fill('Cada desafio merece uma');
 await page.getByRole('button',{name:'Visualizar alterações'}).click();
 const frame=page.frameLocator('iframe');await frame.getByRole('heading',{level:1}).filter({hasText:'Cada desafio merece uma'}).waitFor();
 await page.getByRole('button',{name:'Celular',exact:true}).click();assert.equal(await page.locator('iframe').evaluate(e=>e.clientWidth),390);
 await page.getByRole('button',{name:'Fechar prévia'}).click();
 await page.getByRole('button',{name:'Salvar página',exact:true}).click();await page.getByRole('status').filter({hasText:'Página salva'}).waitFor();
 const result=await (await request.get('http://localhost:3000/api/admin/content')).json();assert.ok(validateSolutions(result.solutions));assert.equal(result.solutions.sections[0].title,'Cada desafio merece uma');
 await page.goto('http://localhost:3000/servicos');assert.match(await page.locator('h1').textContent(),/Cada desafio merece uma/);
 assert.equal((await request.put('http://localhost:3000/api/admin/content',{data:{type:'solutions',content:invalid}})).status(),400);
 assert.deepEqual(errors,[]);console.log('PASS contact links, authenticated persistence, preview, validation and runtime');
 }finally{if(restore&&request)assert.equal((await request.put('http://localhost:3000/api/admin/content',{data:{type:'solutions',content:restore}})).status(),200);await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
