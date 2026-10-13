const assert = require('node:assert/strict');
const path = require('node:path');
const os = require('node:os');
const { chromium } = require(path.join(os.tmpdir(), 'miniverso-visual-qa/node_modules/playwright'));

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 960 }, reducedMotion: 'reduce' });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const root = 'http://localhost:3000';
  async function checkLayout(label) {
    await page.locator('img').evaluateAll(images => Promise.all(images.map(img => { img.loading = 'eager'; return img.decode().catch(() => {}); })));
    const layout = await page.evaluate(() => ({ viewport: innerWidth, width: document.documentElement.scrollWidth, brokenImages: Array.from(document.images).filter(img => !img.complete || img.naturalWidth === 0).map(img => img.src) }));
    assert.ok(layout.width <= layout.viewport, `${label}: horizontal overflow ${JSON.stringify(layout)}`);
    assert.deepEqual(layout.brokenImages, [], `${label}: missing images`);
    console.log('PASS', label);
  }
  await page.goto(root, { waitUntil: 'networkidle' });
  await checkLayout('Desktop home');
  await page.screenshot({ path: path.join(os.tmpdir(), 'miniverso-desktop.png') });
  await page.screenshot({ path: path.join(os.tmpdir(), 'miniverso-full.png'), fullPage: true });
  await page.locator('.service-card summary').first().click();
  assert.equal(await page.locator('.service-card').first().getAttribute('open'), '');
  await page.locator('.service-description a').first().click();
  await page.waitForURL('**/contato?subject=*');
  await page.waitForLoadState('networkidle');
  assert.equal(await page.locator('select[name=subject]').inputValue(), 'Realidade virtual');
  await page.locator('input[name=name]').fill('Teste de interface');
  await page.locator('input[name=email]').fill('teste@example.com');
  await page.locator('textarea').fill('Validação local do formulário.');
  await page.route('**/api/contact', route => route.fulfill({ status: 500, contentType: 'application/json', body: '{}' }));
  await page.locator('button[type=submit], .contact-form button').click();
  await page.locator('.form-error').waitFor();
  assert.equal(await page.locator('input[name=name]').inputValue(), 'Teste de interface');
  await page.unroute('**/api/contact');
  await page.route('**/api/contact', route => route.fulfill({ status: 201, contentType: 'application/json', body: '{"ok":true}' }));
  await page.locator('.contact-form button').click();
  await page.locator('.form-success').waitFor();
  assert.equal(await page.locator('input[name=name]').inputValue(), '');
  console.log('PASS contact success/error states (mocked API), subject prefill');
  await page.goto(root + '/projetos', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Educação imersiva' }).click();
  assert.equal(await page.locator('.project-card').count(), 1);
  await page.getByRole('button', { name: 'Todos' }).click();
  assert.equal(await page.locator('.project-card').count(), 3);
  console.log('PASS portfolio filters');
  for (const width of [390, 320, 768]) {
    await page.setViewportSize({ width, height: 844 });
    for (const route of ['', '/servicos', '/projetos', '/sobre', '/contato']) {
      await page.goto(root + route, { waitUntil: 'networkidle' });
      await checkLayout(`${width}px ${route || '/'}`);
      if (width === 390 && route === '') {
        await page.screenshot({ path: path.join(os.tmpdir(), 'miniverso-mobile.png'), fullPage: true });
        await page.getByRole('button', { name: 'Abrir menu' }).click();
        assert.equal(await page.locator('#main-navigation').isVisible(), true);
        await page.keyboard.press('Escape');
        assert.equal(await page.locator('#main-navigation').isVisible(), false);
        console.log('PASS mobile menu and Escape');
      }
    }
  }
  assert.deepEqual(errors, [], 'Browser runtime errors');
  await browser.close();
  console.log('All visual and interaction checks passed.');
})().catch(error => { console.error(error); process.exit(1); });
