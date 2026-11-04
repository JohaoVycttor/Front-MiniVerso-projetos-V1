# Miniverso - Portfólio institucional

Aplicação full-stack criada com Next.js e React para apresentar a Miniverso, seus serviços e projetos. Inclui formulário de contato e painel administrativo para gerenciar o conteúdo do portfólio.

## Como executar no VS Code

1. Extraia a pasta e abra `miniverso-portfolio` no VS Code.
2. Abra o terminal e execute:

```bash
npm install
```

3. Copie `.env.example` para `.env.local` e altere as credenciais.
4. Execute:

```bash
npm run dev
```

5. Abra `http://localhost:3000`.

O painel correto está na pasta `miniverso-admin-main`. Execute `npm run dev` para o site (porta 3000) e, em outro terminal na raiz, `npm run dev:admin` para o painel (porta 3001). O login fica em `http://localhost:3001/admin/login`; a edição das páginas internas fica em `/admin/paginas`.

O botão **Login** do cabeçalho e do menu móvel, assim como o link **Área administrativa** dos rodapés, abre o login de `miniverso-admin-main`. Em desenvolvimento, o destino padrão é `http://localhost:3001/admin/login`; inicie o painel com `npm run dev:admin`. A rota antiga `http://localhost:3000/admin` também redireciona para esse destino. O link **Ver site** do painel retorna a `http://localhost:3000`. Em produção, configure `NEXT_PUBLIC_ADMIN_LOGIN_URL` no site com a URL publicada do login do painel e `NEXT_PUBLIC_SITE_URL` no painel antes dos builds. A autenticação usa a configuração própria do painel; as credenciais `ADMIN_USER` da raiz pertencem à implementação antiga.

O painel separado mantém seus recursos de autenticação e leads. A tela `/admin/paginas` lê e publica o conteúdo de O estúdio, Soluções, Contato e Portfólio no mesmo `data/content.json` consumido pelas páginas públicas; o layout permanece nos componentes do site.

Os projetos da página inicial, do portfólio e das páginas de detalhes são gerenciados em **Portfólio integrado**. Os dois primeiros projetos visíveis, pela ordem do portfólio, aparecem na home; títulos, capas, links e visibilidade usam a mesma fonte. A lista antiga `projects` permanece no arquivo de dados como histórico, mas não alimenta mais a home. **Serviços da página inicial** altera os serviços da home; **Página Soluções** altera o catálogo de `/servicos`. As demais guias indicam e permitem abrir a página que alteram.

Para validar login e publicação nas páginas, execute `node scripts/admin-integration-qa.cjs` com o servidor local ativo. O teste altera temporariamente títulos e visibilidade, restaurando cada seção ao final; execute sem edições simultâneas no painel. Configure `ADMIN_USER`, `ADMIN_PASSWORD` e, se necessário, `QA_BASE_URL` no ambiente do teste.

## Estrutura

- `app/`: páginas, componentes e rotas de API.
- `data/content.json`: banco local inicial de serviços e projetos.
- `lib/`: acesso aos dados e autenticação.
- `public/`: imagens e identidade visual.

## Observações para produção

O projeto usa JSON para facilitar a execução local. Antes de publicar em ambiente serverless, substitua `lib/db.js` por PostgreSQL, MySQL ou outro banco persistente. Configure `ADMIN_USER`, `ADMIN_PASSWORD` e uma `SESSION_SECRET` forte no servidor.

### Página O estúdio

A rota `/sobre` é editada no painel em **Páginas do site → O estúdio**. O editor permite alterar textos, cores, imagens e vídeos enviados, posição e escurecimento do fundo, cards, ícones, colunas e layout. Seções podem ser adicionadas, removidas, ocultadas e reordenadas. Clique em **Publicar alterações** antes de abrir a página pública.

O conteúdo é persistido em `data/content.json`, na chave `studio`. Os valores iniciais ficam em `lib/studio-content.js`. A rota é dinâmica: não exige novo build após uma edição. O endpoint autenticado `PUT /api/admin/content` valida a estrutura antes de salvar. Os tipos de seção disponíveis são introdução, cards e chamada para contato; novos tipos visuais podem ser acrescentados ao renderizador `app/sobre/StudioPage.js`.

A persistência atual requer disco gravável e persistente no servidor, como o restante do painel existente. Em hospedagem sem disco persistente, substitua `lib/db.js` por um banco de dados antes de publicar. A foto inicial reutiliza `public/hero-vr.jpg`; a foto exata da referência não foi fornecida como arquivo separado.

No editor de O estúdio, **Visualizar alterações** abre uma prévia do rascunho em desktop ou celular, sem salvar nem publicar. Os links ficam desativados nessa prévia. Feche pelo botão ou pela tecla Escape para continuar editando. O navegador avisa ao tentar sair/recarregar com alterações não salvas.

### Página Soluções

A guia **Soluções** abre `/servicos`. Edite no painel em **Páginas do site → Soluções**: títulos, cores, imagens e vídeos, enquadramento, serviços, benefícios, etiquetas, ícones, links, tabela comparativa e etapas. É possível adicionar, remover, ocultar e reordenar blocos, escolher uma ou duas colunas no catálogo e destacar um serviço em toda a linha.

O conteúdo fica em `data/content.json`, na chave `solutions`, com valores iniciais em `lib/solutions-content.js`. O endpoint autenticado valida os dados, e `/servicos` lê as alterações sem recompilar. A lista **Serviços** existente continua usada pela página inicial. As fotos desta implementação reutilizam `public/hero-vr.jpg` e podem ser substituídas por caminho local ou URL HTTPS. As fotos originais das referências não foram fornecidas separadamente.

### Página Contato

A rota `/contato` segue a composição da referência com fundo fotográfico, painéis translúcidos, formulário, canais diretos, próximas etapas e demonstrações dos estados de envio. Edite textos, fundo, enquadramento, cores, serviços e blocos no painel em **Páginas do site → Contato**; a edição não envia mensagens.

O formulário valida os campos no navegador e no servidor, exige autorização de contato, solicita telefone quando o canal escolhido depende dele, preserva os dados após falha e gera protocolo após persistir a mensagem. Os contatos ficam disponíveis em `/admin` → **Mensagens recebidas**. Não há envio automático de e-mail ou WhatsApp: o retorno é feito pela equipe pelo canal solicitado. Os dados usam o armazenamento local existente em `data/content.json`, que exige disco persistente em produção.

O fundo `public/contact-vr.png` foi gerado com a ferramenta ImageGen integrada, inspirado na referência; não é a foto original. O prompt completo está em `scripts/contact-image-prompt.txt`. A configuração inicial da página fica em `lib/contact-content.js`. O teste `scripts/contact-qa.cjs` verifica quatro larguras, validação, estados, protocolo, registro e painel, removendo apenas a mensagem temporária criada por ele.

### Integração do portfólio e navegação

A pasta `Front-MiniVerso-projetos-V1-main` foi incorporada ao aplicativo principal: componentes em `app/projetos/components`, recursos em `public/portfolio`, CSS limitado ao portfólio e conteúdo persistido na chave `portfolio` de `data/content.json`. A pasta original permanece preservada como referência e não precisa de servidor separado.

`/projetos` reúne os seis projetos importados e os três anteriores. `/projetos/[slug]` exibe detalhes, ficha técnica e galeria. Conteúdos sem arquivo de mídia mantêm os estados de indisponibilidade da origem. Edite no painel em **Páginas do site → Portfólio e projetos**; o editor permite alterar seções, projetos, fichas, histórias, capas, vídeos e galerias, com validação no servidor.

Cabeçalho e rodapé usam `lib/navigation.js`. As rotas antigas `/o-estudio` e `/solucoes` redirecionam para `/sobre` e `/servicos`. A home leva ao estúdio, soluções, portfólio e contato; os cards de projeto levam aos seus detalhes. O teste `scripts/navigation-qa.cjs` verifica os links, estado ativo, filtros, detalhes, diálogo de mídia, menus móveis, redirecionamentos, 404 e salvamento administrativo.

O site e o painel devem compartilhar o mesmo diretório de dados gravável. Por padrão, ambos usam `data/`; em instalações separadas, configure `HOME_DATA_DIR` com o mesmo caminho persistente nos dois processos. Em hospedagem sem armazenamento compartilhado e persistente, conecte o conteúdo a um serviço de dados antes de publicar.
