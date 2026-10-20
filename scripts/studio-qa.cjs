const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const assert = require('node:assert/strict');
const {chromium} = require(path.join(os.tmpdir(),'miniverso-studio-qa/node_modules/playwright'));
(async()=>{
 const {defaultStudio,validateStudio}=await import('../lib/studio-content.js');
 assert.ok(validateStudio(defaultStudio));
 assert.equal(validateStudio({...defaultStudio,sections:[{...defaultStudio.sections[4],href:'javascript:alert(1)'}]}),false);
 const browser=await chromium.launch({channel:'msedge',headless:true});
 const page=await browser.newPage({reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const width of [1440,768,390,320]){
  await page.setViewportSize({width,height:960});await page.goto('http://localhost:3000/sobre',{waitUntil:'networkidle'});
  assert.equal(await page.locator('.studio-page h1').count(),1);
  assert.equal(await page.locator('.studio-cards article').count(),11);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  assert.ok(await page.locator('.studio-backdrop').evaluateAll(imgs=>imgs.every(i=>i.complete&&i.naturalWidth>0)));
  if(width===1440||width===390)await page.screenshot({path:path.join(os.tmpdir(),`studio-${width}.png`),fullPage:true});
  console.log('PASS responsive layout',width);
 }
 assert.equal((await page.request.put('http://localhost:3000/api/admin/content',{data:{type:'studio',content:defaultStudio}})).status(),401);
 await page.goto('http://localhost:3000/admin');
 await page.locator('input[name=user]').fill(process.env.ADMIN_USER||'admin@miniverso.com.br');await page.locator('input[name=password]').fill(process.env.ADMIN_PASSWORD||'miniverso123');await page.getByRole('button',{name:'Entrar',exact:true}).click();
 await page.getByRole('button',{name:'O estúdio',exact:true}).click();await page.locator('.studio-editor').waitFor();
 await page.locator('.studio-editor details').first().locator('summary').click();
 await page.locator('.studio-editor details').first().locator('textarea').nth(3).fill('Tecnologia para transformar');
 await page.getByRole('button',{name:'Salvar página',exact:true}).click();await page.getByRole('status').filter({hasText:'Página salva'}).waitFor();
 const saved=await (await page.request.get('http://localhost:3000/api/admin/content')).json();assert.ok(validateStudio(saved.studio));
 assert.equal((await page.request.put('http://localhost:3000/api/admin/content',{data:{type:'studio',content:{}}})).status(),400);
 await page.goto('http://localhost:3000/sobre');assert.ok(await page.locator('h1').textContent());
 assert.deepEqual(errors,[]);await browser.close();console.log('PASS authenticated editor persistence, validation, unauthorized access, no browser errors');
})().catch(e=>{console.error(e);process.exit(1)});
