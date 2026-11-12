# Painel administrativo Miniverso

Front-end do painel administrativo do portfólio institucional da Miniverso, em **Next.js 16** e **React 19**.
Esta parte do projeto é o **editor da página inicial** (frame "Painel · Editor da página inicial" no Figma), onde o administrador muda a estrutura e o conteúdo da home do site, e a consulta de **leads** recebidos pelo formulário de contato (seção "Painel · Leads" no Figma).
Projeto da disciplina Programação Avançada para Web (UNDB, Prof. Me. Kleydson Beckman).

Versão atual: **0.4.2**. O histórico de entregas está em [docs/EVOLUCAO.md](docs/EVOLUCAO.md) e as ideias fora do DRDA, em [docs/PROPOSTAS.md](docs/PROPOSTAS.md).

## O que já funciona

- Login com validação, mensagem de erro genérica e bloqueio temporário após tentativas erradas
- Sessão em cookie httpOnly, proteção das rotas do painel, saída e encerramento após 30 minutos sem uso
- Editor da página inicial (`/admin/pagina-inicial`):
  - ordem das seções, com Hero fixo no topo e Rodapé fixo no fim
  - exibir ou ocultar as seções opcionais, com as regras do DRDA (Experiência interativa bloqueada, Clientes só com logo autorizado)
  - textos, imagens e opções de cada seção, com limites e campos obrigatórios marcados
  - itens de cada seção (serviços, projetos, etapas, logos, redes) com adicionar, editar, reordenar, ocultar e remover
  - imagem de fundo opcional nas seções do meio, decorativa e sem texto alternativo
  - rascunho com aviso de alterações, "Descartar" e "Salvar e publicar"
- Leads (`/admin/leads`):
  - lista com busca por nome, e-mail ou empresa, filtro por serviço de interesse, ordenação por data e paginação
  - detalhe com a mensagem completa, responder por e-mail e copiar o contato
  - exclusão com confirmação que nomeia o lead
- Modo claro e escuro em todas as telas: botão no cabeçalho, ao lado de "Ver site". Na primeira visita segue o tema do sistema; depois a escolha fica salva no navegador

## Como rodar

Requisito: Node.js 20.9 ou mais recente.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Abra <http://localhost:3000>. O painel fica em `/admin`.

Sem back-end configurado, o painel usa dados de exemplo (modo mock), no mesmo formato da API Laravel:

| Campo | Valor de teste |
| --- | --- |
| E-mail | `admin@miniverso.test` |
| Senha | `miniverso123` |

Na 7ª tentativa em 1 minuto o acesso é bloqueado, igual ao `throttle:6,1` do back-end (RNF15).

### Conectar ao back-end (metaverso-back)

Suba o back-end com o Sail (ver o README dele) e crie um usuário administrador. No `.env.local` do painel:

```bash
API_URL=http://localhost:8000
API_MODE=live
```

O login, a sessão e a saída passam a usar a API real. O conteúdo da página inicial (`site-content`) e os leads (`leads`) ainda não existem no back-end, então continuam vindo do mock (`MOCK_RESOURCES=site-content,leads`). Quando uma rota for criada lá, tire o nome dela dessa lista. O contrato está em [docs/CONTRATO-API.md](docs/CONTRATO-API.md).

## Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | servidor de desenvolvimento |
| `npm run build` | build de produção, com checagem de tipos |
| `npm start` | roda o build de produção |
| `npm run lint` | ESLint com as regras do Next.js e do React (inclui as regras do React Compiler) |
| `npm test` | testes da camada de dados, de segurança e do contrato com o back-end |

## Arquitetura

```text
Navegador ──> Next.js (este projeto) ──> API Laravel
              │
              ├─ /admin/*        telas do painel
              ├─ /api/auth/*     login, logout e sessão expirada
              └─ /api/admin/*    ponte autenticada para a API (BFF)
```

O navegador nunca fala direto com o Laravel. O Next.js faz o papel de BFF (*backend for frontend*):

1. No login, o token devolvido pela API fica num cookie **httpOnly**. O JavaScript da página não consegue lê-lo, o que protege a sessão contra XSS (RNF12, RNF20, RNF22).
2. Cada chamada do painel passa por `/api/admin/*`, que lê o cookie e repassa para a API com `Authorization: Bearer <token>` (RNF13).
3. Erros técnicos da API viram mensagens simples antes de chegar à tela (RNF43).
4. `src/proxy.ts` redireciona para o login quem tenta abrir o painel sem sessão (RF12). O layout do painel também confere o token na API antes de mostrar qualquer dado.

Com `API_MODE=mock`, a mesma ponte responde com os dados de `src/mock`, então dá para desenvolver e apresentar o painel antes de a API estar pronta.

## Estrutura de pastas

```text
src/
├─ app/                  rotas do Next.js (App Router)
│  ├─ admin/login/       tela de login
│  ├─ admin/(painel)/    telas protegidas (pagina-inicial e leads)
│  └─ api/               rotas do BFF (auth e ponte para a API)
├─ components/
│  ├─ layout/            menu lateral, cabeçalho, botão de tema e menu da conta
│  └─ ui/                botão, campos, switch, modais, toasts, estados vazios e de erro
├─ features/
│  ├─ auth/              login e saída por inatividade
│  ├─ home-editor/       editor: schema das seções, regras, API e componentes
│  └─ leads/             lista, detalhe e exclusão de leads
├─ lib/
│  ├─ api/               cliente HTTP, mensagens de erro e conversão dos dados da API
│  ├─ hooks/             carregamento de dados e busca com atraso
│  └─ server/            regras do BFF: sessão, chamada à API, autenticação
├─ mock/                 API de exemplo no formato do Laravel
├─ types/                modelos usados no front
└─ proxy.ts              proteção das rotas /admin
```

## Decisões técnicas

| Decisão | Motivo | Requisitos |
| --- | --- | --- |
| Token em cookie httpOnly via BFF | o token não fica exposto ao JavaScript do navegador | RNF12, RNF20, RNF22 |
| Checagem de sessão no `proxy.ts` e no layout | ninguém vê o painel sem sessão válida | RF12, RNF10, RN01 |
| Mensagens centralizadas em `src/lib/messages.ts` | textos simples e iguais em todo o painel | RNF27, RNF28, RNF43 |
| CSS Modules com tokens em `globals.css` | cores, espaços e raios num só lugar, fáceis de trocar pelos do Figma | RNF28, RNF33 |
| Componentes de estado (carregando, vazio, erro, sucesso) | toda ação tem retorno visual | RNF08, RNF29 |
| Seções descritas em `schema.ts` | o formulário de cada seção sai de uma tabela; mudar um campo não exige mexer na tela | RF15, RNF28 |
| Rascunho local e publicação única | o site nunca mostra meia alteração; falha não apaga o que foi feito | RF18, RNF31, RNF44 |
| Setas para reordenar | funciona no teclado e no toque, ao contrário de arrastar | RNF35, RNF40 |
| Remoção sempre com modal que nomeia o item | evita apagar algo por engano | RNF42 |
| Serviço de interesse ligado à seção Serviços | o filtro de leads e o formulário do site usam a mesma lista | RF06, RF16, RNF28 |
| Imagem de fundo decorativa, sem texto alternativo | o RNF34 vale para imagens relevantes; a página pública aplica uma camada para o texto manter o contraste | RF15, RNF33, RNF34 |
| Modo escuro por papéis de cor e cookie | os componentes usam papéis (`--color-*`) e o modo escuro troca só os papéis; o servidor lê o cookie e já entrega a página no tema certo, sem piscar | RNF28, RNF33, RNF41 |
| `<dialog>` nativo, rótulos visíveis e foco visível | acessibilidade sem biblioteca extra | RNF35, RNF36 |
| Mock no formato do Laravel | o painel evolui em paralelo com o back-end | 2.5 (desenvolvimento incremental) |

## Identidade visual

- Cores e fontes das variáveis do Figma (Miniverso · Tokens): fundo `#05060A`, azul `#2450E6`, hover `#1233A8`, Inter no texto e Sofia Sans Extra Condensed nos títulos, carregadas com `next/font`. Os pares de texto e fundo têm o contraste anotado em `src/app/globals.css` (RNF33).
- Logo oficial em `public/brand/logo-branca-horizontal.svg`, exportado do Figma. É a versão branca, por isso o menu lateral e a lateral do login têm fundo escuro.
- Modo escuro: valores em `src/app/globals.css`, nos blocos `:root[data-theme="dark"]` (escolha salva) e `prefers-color-scheme: dark` (tema do sistema). No Figma, as mesmas cores estão na coleção de variáveis "Painel · Cores", com os modos Claro e Escuro.

## Testes

```bash
npm test
```

Cobrem as regras do editor (obrigatórios, limites, ordem das seções, Clientes, Experiência, projeto em destaque, arquivos, imagem de fundo), os leads (busca, filtro, ordem, exclusão, acesso sem token), o tema (cookie, sistema e alternância), os tokens de cor (contraste mínimo nos dois temas e nenhuma cor fixa nos componentes), o mock da API, os redirecionamentos seguros e as rotas do BFF: cookie httpOnly, mensagem genérica de login, bloqueio por tentativas, recusa de chamadas de outros sites e de caminhos fora da lista permitida.
