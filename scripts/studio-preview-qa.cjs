const path = require('node:path');
const os = require('node:os');
const assert = require('node:assert/strict');
const { chromium } = require(path.join(os.tmpdir(), 'miniverso-studio-qa/node_modules/playwright'));
(async () => {
 const browser = await chromium.launch({channel:'msedge',headless:true});
 try {
  const page = await browser.newPage({viewport:{width:1440,height:960}});
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto('http://localhost:3000/admin');
  await page.locator('input[name=user]').fill(process.env.ADMIN_USER||'admin@miniverso.com.br');
  await page.locator('input[name=password]').fill(process.env.ADMIN_PASSWORD||'miniverso123');
  await page.getByRole('button',{name:'Entrar',exact:true}).click();
  await page.getByRole('button',{name:'O estúdio',exact:true}).click();
  await page.locator('.studio-editor details').first().locator('summary').click();
  const savedBefore=await (await page.request.get('http://localhost:3000/api/admin/content')).json();
  await page.getByRole('textbox',{name:'Título',exact:true}).first().fill('Prévia sem publicar');
  await page.getByRole('button',{name:'Visualizar alterações'}).click();
  const frame=page.frameLocator('iframe[title="Prévia da página O estúdio"]');
  await frame.getByRole('heading',{level:1}).filter({hasText:'Prévia sem publicar'}).waitFor();
  await page.getByRole('button',{name:'Celular',exact:true}).click();
  assert.equal(await page.locator('iframe').evaluate(el=>el.clientWidth),390);
  assert.ok(await frame.locator('body').evaluate(el=>el.scrollWidth<=390));
  await frame.getByRole('link',{name:'Vamos conversar'}).click();
  assert.ok(page.url().endsWith('/admin'));
  await page.screenshot({path:path.join(os.tmpdir(),'studio-preview-admin.png')});
  await page.getByRole('button',{name:'Fechar prévia'}).click();
  assert.equal(await page.getByRole('dialog').count(),0);
  const savedAfter=await (await page.request.get('http://localhost:3000/api/admin/content')).json();
  assert.deepEqual(savedAfter,savedBefore);
  await page.getByRole('button',{name:'Visualizar alterações'}).click();
  await page.keyboard.press('Escape');
  assert.equal(await page.getByRole('dialog').count(),0);
  assert.deepEqual(errors,[]);
  console.log('PASS draft preview, mobile viewport, navigation isolation, no persistence, Escape and browser runtime');
 } finally {await browser.close()}
})().catch(error=>{console.error(error);process.exit(1)});
