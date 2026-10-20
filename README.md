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

O painel fica em `http://localhost:3000/admin`.

## Estrutura

- `app/`: páginas, componentes e rotas de API.
- `data/content.json`: banco local inicial de serviços e projetos.
- `lib/`: acesso aos dados e autenticação.
- `public/`: imagens e identidade visual.

## Observações para produção

O projeto usa JSON para facilitar a execução local. Antes de publicar em ambiente serverless, substitua `lib/db.js` por PostgreSQL, MySQL ou outro banco persistente. Configure `ADMIN_USER`, `ADMIN_PASSWORD` e uma `SESSION_SECRET` forte no servidor.

### Página O estúdio

A rota `/sobre` é editada em `/admin` → **O estúdio**. O editor permite alterar textos, cores, imagens por URL HTTPS ou caminho em `public`, posição e escurecimento do fundo, cards, ícones, colunas e layout. Seções podem ser adicionadas, removidas, ocultadas e reordenadas. Clique em **Salvar página** antes de abrir a página pública.

O conteúdo é persistido em `data/content.json`, na chave `studio`. Os valores iniciais ficam em `lib/studio-content.js`. A rota é dinâmica: não exige novo build após uma edição. O endpoint autenticado `PUT /api/admin/content` valida a estrutura antes de salvar. Os tipos de seção disponíveis são introdução, cards e chamada para contato; novos tipos visuais podem ser acrescentados ao renderizador `app/sobre/StudioPage.js`.

A persistência atual requer disco gravável e persistente no servidor, como o restante do painel existente. Em hospedagem sem disco persistente, substitua `lib/db.js` por um banco de dados antes de publicar. A foto inicial reutiliza `public/hero-vr.jpg`; a foto exata da referência não foi fornecida como arquivo separado.

No editor de O estúdio, **Visualizar alterações** abre uma prévia do rascunho em desktop ou celular, sem salvar nem publicar. Os links ficam desativados nessa prévia. Feche pelo botão ou pela tecla Escape para continuar editando. O navegador avisa ao tentar sair/recarregar com alterações não salvas.

### Página Soluções

A guia **Soluções** abre `/servicos`. Edite em `/admin` → **Página Soluções**: títulos, cores, imagens e enquadramento, escurecimento, serviços, benefícios, etiquetas, ícones, links, tabela comparativa e etapas. É possível adicionar, remover, ocultar e reordenar blocos, escolher uma ou duas colunas no catálogo e destacar um serviço em toda a linha. A prévia mostra o rascunho em desktop e celular antes do salvamento.

O conteúdo fica em `data/content.json`, na chave `solutions`, com valores iniciais em `lib/solutions-content.js`. O endpoint autenticado valida os dados, e `/servicos` lê as alterações sem recompilar. A lista **Serviços** existente continua usada pela página inicial. As fotos desta implementação reutilizam `public/hero-vr.jpg` e podem ser substituídas por caminho local ou URL HTTPS. As fotos originais das referências não foram fornecidas separadamente.

### Página Contato

A rota `/contato` segue a composição da referência com fundo fotográfico, painéis translúcidos, formulário, canais diretos, próximas etapas e demonstrações dos estados de envio. Edite textos, fundo, enquadramento, cores, serviços e blocos em `/admin` → **Página Contato**; a prévia não envia mensagens.

O formulário valida os campos no navegador e no servidor, exige autorização de contato, solicita telefone quando o canal escolhido depende dele, preserva os dados após falha e gera protocolo após persistir a mensagem. Os contatos ficam disponíveis em `/admin` → **Mensagens recebidas**. Não há envio automático de e-mail ou WhatsApp: o retorno é feito pela equipe pelo canal solicitado. Os dados usam o armazenamento local existente em `data/content.json`, que exige disco persistente em produção.

O fundo `public/contact-vr.png` foi gerado com a ferramenta ImageGen integrada, inspirado na referência; não é a foto original. O prompt completo está em `scripts/contact-image-prompt.txt`. A configuração inicial da página fica em `lib/contact-content.js`. O teste `scripts/contact-qa.cjs` verifica quatro larguras, validação, estados, protocolo, registro e painel, removendo apenas a mensagem temporária criada por ele.

### Integração do portfólio e navegação

A pasta `Front-MiniVerso-projetos-V1-main` foi incorporada ao aplicativo principal: componentes em `app/projetos/components`, recursos em `public/portfolio`, CSS limitado ao portfólio e conteúdo persistido na chave `portfolio` de `data/content.json`. A pasta original permanece preservada como referência e não precisa de servidor separado.

`/projetos` reúne os seis projetos importados e os três anteriores. `/projetos/[slug]` exibe detalhes, ficha técnica e galeria. Conteúdos sem arquivo de mídia mantêm os estados de indisponibilidade da origem. A edição fica em **Admin → Portfólio integrado**; o editor visual cobre os campos principais e a edição de estrutura completa permite alterar seções, galerias e demais dados com validação no servidor.

Cabeçalho e rodapé usam `lib/navigation.js`. As rotas antigas `/o-estudio` e `/solucoes` redirecionam para `/sobre` e `/servicos`. A home leva ao estúdio, soluções, portfólio e contato; os cards de projeto levam aos seus detalhes. O teste `scripts/navigation-qa.cjs` verifica os links, estado ativo, filtros, detalhes, diálogo de mídia, menus móveis, redirecionamentos, 404 e salvamento administrativo.


### Página inicial e configurações gerais

A home usa um esquema de conteúdo em `lib/site-content.js`, salvo em `data/content.json` nas chaves `home` e `site`. Em **Admin → Página inicial**, edite hero, textos, imagens, cores, botões, espaçamentos, colunas e layouts. Adicione, duplique, oculte, reordene ou troque componentes: abertura, faixa de temas, apresentação, serviços, projetos, etapas, texto/imagem, cards, chamada e contato. A prévia de rascunho tem opções para computador e celular; os formulários da prévia não enviam mensagens.

Em **Admin → Header e rodapé**, altere nome e logo, links e ordem dos menus, botão do cabeçalho, posicionamento, cores, redes sociais e rodapé. As configurações são compartilhadas pelas páginas públicas e aparecem no próximo acesso após salvar, sem recompilar o site.

Serviços e projetos podem usar os cadastros existentes ou listas personalizadas da seção. Cada formulário da home tem textos e opções de serviço próprios e aceita campos adicionais de texto, e-mail, telefone, número, seleção ou mensagem longa. É possível definir quais campos adicionais são obrigatórios. As mensagens são validadas no navegador e na API, persistidas com protocolo e origem e exibidas em **Mensagens recebidas**, incluindo as respostas adicionais. Falhas de envio preservam o que o visitante digitou.

O armazenamento usa gravação atômica e uma fila por processo para evitar que salvamentos simultâneos sobrescrevam mensagens. Continua sendo um arquivo JSON local: requer disco persistente e uma instância de servidor. Para múltiplas instâncias ou hospedagem sem disco persistente, migre o módulo `lib/db.js` para banco de dados. Não há disparo automático de e-mail ou WhatsApp.

Validação de integração: `node scripts/home-admin-qa.cjs`, com o servidor local em execução. Instale Playwright separadamente e indique o módulo com `PLAYWRIGHT_MODULE` se ele não estiver na pasta temporária usada pelo teste. O teste modifica temporariamente a home e as configurações, verifica envio e caixa de entrada e restaura os dados no final, removendo apenas a mensagem de teste.

Em Admin → O estúdio, as seções permitem duplicação e troca entre introdução, cards e chamada. É possível configurar cores por seção, alinhamento, espaçamento, colunas, ícones, links dos cards e altura, imagem, enquadramento e descrição do banner final. O banner usa public/studio-cta-background.png, fornecido pelo usuário. O teste node scripts/studio-admin-qa.cjs verifica edição visual, prévia, salvamento público, componentes e responsividade e restaura o conteúdo ao final.


### Fontes Thunder

As 36 variantes fornecidas estão em `public/fonts/thunder`, com WOFF2, WOFF e TTF e a licença original. `app/brand-fonts.css` registra a família `Thunder` (HC) e `Thunder LC`, com pesos de 100 a 900 em normal e itálico. Os títulos públicos usam a variável `--mv-display-font`; a alternativa LC está disponível em `--mv-display-font-lc`. O navegador prioriza WOFF2 e carrega apenas os pesos utilizados.

O pacote Fontes_Miniverso.zip também fornece Random Grotesque: Standard (Book, Medium, Semibold e Bold, em normal e itálico), Slim (Book e Black Italic) e Spacious (Book e Black Italic). Os arquivos e a licença estão em public/fonts/random-grotesque. A família Standard é a fonte de leitura e interface, definida em --mv-font. Thunder permanece nos títulos.

Após comparação visual das famílias do pacote, os títulos usam Random Grotesque Standard Bold (700) e Bold Italic nos destaques, definidos por --mv-display-font. Thunder e Thunder LC continuam disponíveis; --mv-display-font-thunder preserva a alternativa Thunder.
