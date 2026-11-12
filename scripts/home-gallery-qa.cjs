const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs/promises');
const { spawn } = require('node:child_process');
const { chromium } = require('../tmp/home-visual-refresh/qa/node_modules/playwright');

(async () => {
  const root = 'http://127.0.0.1:3121';
  const output = path.resolve('output/home-gallery-motion');
  await fs.mkdir(output, { recursive: true });
  const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', '3121'], { windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
  let log = '', browser, page;
  server.stdout.on('data', chunk => { log += chunk; });
  server.stderr.on('data', chunk => { log += chunk; });
  try {
    let ready = false;
    for (let i = 0; i < 60; i++) {
      if (server.exitCode !== null) throw new Error(log);
      try { ready = (await fetch(root)).ok; } catch {}
      if (ready) break;
      await new Promise(resolve => setTimeout(resolve, 250));
    }
    assert.ok(ready, log);
    browser = await chromium.launch({ channel: 'msedge', headless: true });
    page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', error => { errors.push(error.message); console.log('BROWSER ERROR:', error.message); });
    page.on('console', message => { if (message.type() === 'error') console.log('CONSOLE:', message.text()); });
    assert.equal((await page.goto(root)).status(), 200);
    const track = page.getByRole('region', { name: 'Projetos Miniverso' });
    const next = page.getByRole('button', { name: 'Próximo: Projetos Miniverso' });
    const previous = page.getByRole('button', { name: 'Anterior: Projetos Miniverso' });
    for (const width of [1440, 1024, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 1000 });
      await track.scrollIntoViewIfNeeded();
      await track.evaluate(el => { el.scrollLeft = 0; });
      await page.waitForFunction(() => document.querySelector('#projetos .mobile-carousel-count')?.textContent.includes('01'));
      await track.locator('img').evaluateAll(images => Promise.all(images.map(image => image.decode())));
      assert.ok(await track.evaluate(el => el.scrollWidth > el.clientWidth), 'Gallery must slide at ' + width);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Page overflow at ' + width);
      await page.waitForFunction(() => document.querySelector('#projetos button[aria-label="Anterior: Projetos Miniverso"]')?.disabled);
      await next.click();
      await page.waitForFunction(() => document.querySelector('#projetos .mobile-carousel-count')?.textContent.includes('02'));
      await page.waitForFunction(() => document.querySelector('#projetos button[aria-label="Próximo: Projetos Miniverso"]')?.disabled);
      await track.focus();
      await page.keyboard.press('Home');
      await page.waitForFunction(() => document.querySelector('#projetos .mobile-carousel-count')?.textContent.includes('01'));
      await page.locator('#projetos').screenshot({ path: path.join(output, `gallery-${width}.png`) });
      console.log('PASS layout, images, controls, keyboard:', width);
    }
    await page.setViewportSize({ width: 1440, height: 1000 });
    await track.scrollIntoViewIfNeeded();
    const box = await track.boundingBox();
    await page.mouse.move(box.x + box.width * .65, box.y + 160);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * .2, box.y + 160, { steps: 15 });
    await page.mouse.up();
    assert.equal(page.url(), root + '/', 'Dragging must not follow the project link');
    assert.ok(await track.evaluate(el => el.scrollLeft > 100));
    await track.locator('a').last().click();
    await page.waitForURL('**/projetos/tour-360-do-campus');
    console.log('PASS mouse drag without accidental navigation, project link');
    await page.goto(root);
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.evaluate(() => window.scrollTo(0, 450));
    await page.waitForFunction(() => parseFloat(document.querySelector('.vr-scene').style.getPropertyValue('--scene-drift')) > 0);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForFunction(() => !document.querySelector('.vr-scene').style.getPropertyValue('--scene-drift'));
    console.log('PASS scroll depth and live reduced-motion preference');
    const staticPage = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
    await staticPage.goto(root);
    assert.equal(await staticPage.locator('#projetos article').count(), 2);
    assert.equal(await staticPage.locator('#projetos article>a').count(), 2);
    assert.deepEqual(errors, []);
    console.log('PASS server-rendered gallery without JavaScript; no browser errors');
  } catch (error) {
    if (page) {
      console.log('DEBUG:', await page.locator('#projetos').innerHTML().catch(() => 'Missing gallery'));
      await page.screenshot({ path: path.join(output, 'failure.png') }).catch(() => {});
    }
    throw error;
  } finally {
    await browser?.close();
    server.kill();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
