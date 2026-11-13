
# Miniverso

Site público em Next.js/React e painel administrativo separado, com conteúdo editável das cinco páginas.

## Executar

Instale as dependências na raiz e em miniverso-admin-main. Copie os .env.example para .env.local se necessário.
Execute npm run dev na raiz para iniciar:
- site: http://localhost:3000;
- painel: http://localhost:3001/admin/login;
- editor: http://localhost:3001/admin/paginas.

As credenciais locais são definidas por MOCK_ADMIN_EMAIL e MOCK_ADMIN_PASSWORD no painel. Em produção, use a autenticação da API PHP.

## Conteúdo e PHP

data/site-content.json é a fonte de conteúdo das cinco páginas. O painel edita textos, imagens, títulos, legendas, botões, seções, projetos, contatos, dispositivos e redes sociais.

Para conectar o futuro PHP, configure API_URL, API_MODE=live e CONTENT_SOURCE=api nos dois aplicativos. O painel encaminha publicações/uploads; o site lê o conteúdo publicado sem cache. Falhas da API não usam dados de demonstração.

Veja [Administração e contrato PHP](docs/ADMIN-E-PHP.md). O PHP real ainda deve implementar as rotas documentadas.

Os editores antigos foram preservados como referência. /admin/pagina-inicial redireciona ao editor completo. O antigo endpoint administrativo da raiz não publica no site atual. data/home-content.json e data/content.json não alimentam o conteúdo público atual.

## Verificar

- npm run build: compila o site.
- npm --prefix miniverso-admin-main run build: compila o painel.
- npm run test:cms: testes do painel e integração.
- npm run test:e2e: teste de navegador isolado após os builds (Microsoft Edge).

Mensagens e uploads locais ficam em data/leads.json e data/uploads, ignorados pelo Git. Em produção sem disco persistente, use a API PHP.
