
# Administração e integração PHP

## O que é editável

O painel oficial está em miniverso-admin-main, na rota /admin/paginas.
Site e painel compartilham o contrato em shared/site-content.mjs.

- Cinco páginas: Início, O estúdio, Soluções, Projetos e Contato.
- Menu, SEO, nome da abertura, título, texto, imagem, texto alternativo, legenda, enquadramento, botões e cenas do hero.
- Faixa animada, textos, exibição e ordem das seções; adicionar/remover seções e itens.
- Textos complementares, imagens/legendas, links, seleção e quantidade de projetos, projeto em destaque.
- Projetos completos: título, categoria, endereço, resumo, introdução, capas, vídeos, galeria, legendas, ficha técnica e história.
- Marca, logo, ícone da aba, localização, contatos, cabeçalho, rodapé e textos da interface.
- Formulário: assuntos, rótulos, exemplos de preenchimento, autorização e mensagens de sucesso/erro.
- Dispositivos: nomes, capturas, descrições, legendas e links de notebook, celular e tablet.
- Redes: títulos, biografia, links, fotos, destaques e mensagens de demonstração do smartphone.
- Mensagens reais recebidas pelo formulário: busca, filtro, detalhe e exclusão.

Os campos publicados alimentam as páginas públicas. Os cards de formatos começam sem imagens, conforme solicitado; cadastrar uma imagem preenche a área. Tipos de seção e rotas são componentes do aplicativo, não HTML enviado pelo administrador.

## Execução local

Instale as dependências na raiz e no painel. Execute npm run dev na raiz.
Site: http://localhost:3000. Painel: http://localhost:3001/admin/login.

Sem API configurada, a autenticação de demonstração usa MOCK_ADMIN_EMAIL e MOCK_ADMIN_PASSWORD do .env.example do painel. O conteúdo é real e persistido:
- data/site-content.json: documento completo publicado;
- data/leads.json: mensagens do formulário, não versionar;
- data/uploads/: arquivos enviados, não versionar.

Painel e site precisam usar o mesmo HOME_DATA_DIR quando estiverem em pastas diferentes no modo local. A gravação é atômica, com bloqueio de arquivo e revisão para evitar sobrescrita entre sessões. Disco local serve para desenvolvimento ou servidor persistente. Em produção com PHP, use o modo API e armazenamento persistente no back-end.

O rascunho é preservado quando a publicação falha. O navegador avisa ao recarregar com alterações. Descartar recupera a versão carregada; Recarregar busca a publicação mais recente. Upload não publica sozinho: é necessário Salvar e publicar.

## Ativar o futuro PHP

Configure **nos dois aplicativos**:
- API_URL=https://api.exemplo.com/api (base da API, sem barra final);
- API_MODE=live;
- CONTENT_SOURCE=api.

No painel, mantenha MOCK_RESOURCES vazio. Configure NEXT_PUBLIC_SITE_URL com o endereço público e NEXT_PUBLIC_ADMIN_LOGIN_URL na raiz com o login do painel. SITE_URL é a alternativa de endereço público lida no servidor do editor. Tokens e API_URL ficam no servidor; não use NEXT_PUBLIC para segredos.

O navegador chama as rotas do próprio Next. O servidor administrativo lê o cookie HttpOnly e encaminha Authorization: Bearer TOKEN. O site público busca o conteúdo no PHP em cada requisição, com cache desativado. Não há fallback para JSON/mock quando a API falha.

## Rotas que o PHP precisa implementar

| Método e rota relativa a API_URL | Autenticação | Contrato |
| --- | --- | --- |
| POST /login | Pública, limitar tentativas | Entrada {email,password}; saída {data:{token,user:{nome,email}}} |
| GET /me | Bearer, administrador | {data:{nome,email}} |
| POST /logout | Bearer | Invalida token; 204 |
| GET /site-content/public | Pública | {data: SiteDocument}, somente conteúdo publicado |
| GET /site-content | Bearer, administrador | {data: SiteDocument} para edição |
| PUT /site-content | Bearer, administrador | Recebe SiteDocument completo com revision; valida e persiste em transação; devolve {data: SiteDocument} |
| POST /uploads | Bearer, administrador | multipart/form-data com file; saída 201 {url: URL_ABSOLUTA} ou {data:{url: URL_ABSOLUTA}} |
| POST /contacts | Pública, limitar requisições | {name,email,phone,company,subject,preference,message,consent:true}; saída 201 {data:{protocol: PROTOCOLO}} após persistir |
| GET /leads | Bearer, administrador | Filtros search, service_id, sort, page, per_page; lista paginada |
| GET /leads/{id} | Bearer, administrador | {data: Lead} |
| DELETE /leads/{id} | Bearer, administrador | Exclui mensagem; 204 |

Lead: {id,name,email,phone,company,message,created_at,service:{id,title}}.
service.id e service.title são o texto do assunto escolhido. Paginação: {data:[...],meta:{current_page,last_page,per_page,total}}. sort é -created_at ou created_at.

**O PHP real ainda não está incluído.** A integração foi preparada e testada contra um servidor de contrato; o back-end deve implementar essas rotas.

## Documento

Use data/site-content.json como exemplo completo e docs/site-content.schema.json como JSON Schema. A validação em shared/site-content.mjs também verifica IDs únicos, referências a projetos, rotas fixas e URLs seguras.

Campos: schemaVersion (1), revision (inteiro positivo), publishedAt (ISO 8601), settings, ui, contact, digital, pages e projects.

IDs de seção são âncoras únicas na página; explorar é reservada. projectIds vazio seleciona todos os projetos visíveis; projectId escolhe o destaque. Imagem vazia exibe a área sem foto automática. O hero sem imagem não deve manter cenas com URLs vazias.

No PUT, confira revision dentro de uma transação. Incremente a revisão e atribua publishedAt antes de responder. Se outra sessão já publicou, devolva 409 sem gravar. Não devolva sucesso antes de concluir a transação.

Erros: 400 JSON inválido; 401 sessão inválida; 403 acesso negado; 409 revisão antiga; 413 tamanho excedido; 422 campos inválidos; 5xx indisponibilidade. Para campos, use {message: MENSAGEM,errors: {CAMINHO: [MENSAGEM_DO_CAMPO]}}.

Mídia: JPG/PNG/WebP até 2 MB; MP4/WebM até 50 MB. Valide conteúdo real, extensão e tamanho no PHP; gere nomes únicos e recuse executáveis. Mídias remotas devem ter URLs absolutas públicas, sem depender do cookie administrativo.

O back-end deve aplicar autorização de administrador, limites de requisições e persistência no banco. Credenciais, tokens, leads e dados privados não pertencem ao documento público. Textos são renderizados como texto React, sem executar HTML do administrador.

## Verificação

- npm run build na raiz;
- npm run build em miniverso-admin-main;
- npm test em miniverso-admin-main;
- npm run test:e2e na raiz, após os builds.

O teste de navegador usa Microsoft Edge e dados temporários isolados. Verifica login, edição das cinco páginas, publicação sem rebuild, imagens/legendas, destaque, upload, mensagens, conflitos, autenticação e desktop/mobile. Capturas ficam em qa-artifacts, ignorado pelo Git.
