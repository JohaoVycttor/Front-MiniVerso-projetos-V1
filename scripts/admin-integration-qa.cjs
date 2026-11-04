const assert = require('node:assert/strict');
const base = process.env.QA_BASE_URL || 'http://localhost:3000';
let cookie = '';
async function request(route, method = 'GET', body) {
  return fetch(base + route, {method, headers: {'Content-Type': 'application/json', cookie}, body: body ? JSON.stringify(body) : undefined});
}
async function pageHas(route, text) {
  const response = await request(route);
  assert.equal(response.status, 200, route);
  assert.ok((await response.text()).includes(text), `${route} should contain ${text}`);
}
(async () => {
  assert.equal((await request('/api/admin/content')).status, 401);
  for (const route of ['/', '/sobre', '/servicos', '/projetos', '/contato']) await pageHas(route, 'nav-login');
  const login = await request('/api/auth/login', 'POST', {user: process.env.ADMIN_USER || 'admin@miniverso.com.br', password: process.env.ADMIN_PASSWORD || 'miniverso123'});
  assert.equal(login.status, 200);
  cookie = login.headers.get('set-cookie').split(';')[0];
  const original = await (await request('/api/admin/content')).json();
  for (const [type, route] of [['studio', '/sobre'], ['solutions', '/servicos'], ['contactPage', '/contato'], ['portfolio', '/projetos']]) {
    const draft = structuredClone(original[type]);
    const marker = `QA-integration-${type}-${Date.now()}`;
    let project;
    if (type === 'portfolio') {
      project = draft.projects.filter(p => p.visible).sort((a,b) => a.order-b.order)[0];
      project.title = marker;
    } else draft.sections.find(section => section.enabled).title = marker;
    try {
      assert.equal((await request('/api/admin/content', 'PUT', {type, content: draft})).status, 200);
      await pageHas(route, marker);
      if (project) {
        await pageHas('/', marker);
        await pageHas(`/projetos/${project.slug}`, marker);
        project.visible = false;
        assert.equal((await request('/api/admin/content', 'PUT', {type, content: draft})).status, 200);
        assert.ok(!(await (await request('/')).text()).includes(marker));
      }
      console.log('PASS publication:', type);
    } finally {
      assert.equal((await request('/api/admin/content', 'PUT', {type, content: original[type]})).status, 200, `Restore ${type}`);
    }
  }
  assert.equal((await request('/api/auth/logout', 'POST')).status, 200);
  console.log('PASS public login links, authentication, publication and logout');
})().catch(error => {console.error(error);process.exitCode=1});
