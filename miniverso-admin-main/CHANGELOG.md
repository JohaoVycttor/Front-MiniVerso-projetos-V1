# Changelog

Mudanças do painel administrativo, da mais recente para a mais antiga.
Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/). O detalhamento de cada entrega, com capturas de tela, está em [docs/EVOLUCAO.md](docs/EVOLUCAO.md).

## [0.4.2] - 2026-10-17

### Corrigido

- Único aviso do `npm run lint`: `aria-invalid` saiu do botão "Escolher imagem", que não aceita esse atributo. O erro continua ligado ao botão por `aria-describedby` e é anunciado ao aparecer
- `next build` não avisa mais sobre outro `package-lock.json` fora do projeto: a raiz do Turbopack é a pasta do projeto

## [0.4.1] - 2026-10-15

Revisão completa do painel, do código ao Figma. Detalhes e método em [docs/EVOLUCAO.md](docs/EVOLUCAO.md).

### Corrigido

- Editor: o carregamento do conteúdo não chama mais `setState` direto dentro do efeito; "Tentar de novo" volta ao estado de carregamento antes de pedir o conteúdo. Era o único erro da regra `react-hooks/set-state-in-effect`, que o `npm run lint` aponta com o eslint-config-next 16
- Login: no fim da contagem do bloqueio, o aviso de bloqueio sai e aparece "O bloqueio terminou. Você já pode tentar entrar de novo." Antes, a mensagem de bloqueio continuava na tela, em vermelho
- Login: a contagem regressiva não é mais anunciada pelo leitor de tela a cada segundo; ele lê a mensagem com a duração do bloqueio
- Celular: ao abrir o menu em gaveta, o foco vai para "Fechar menu"; ao fechar (botão, Esc ou toque fora), volta para "Abrir menu". Com o menu aberto, o resto da tela fica inativo para o teclado. Se a tela crescer até o layout com menu fixo, a gaveta fecha sozinha
- Celular: o nome do lead no cartão, que abre o detalhe, tem área de toque de 44 px; antes tinha 24 px (RNF40)
- Celular: a caixa de autorização do logo, junto com o rótulo, chega a 44 px de altura; antes tinha 42 px (RNF40)
- Switch de visibilidade no editor de seção: o nome lido pelo leitor de tela não muda mais com o estado ("Exibir Diferenciais na página", ligado ou desligado). O texto visível continua dizendo "Visível na página" ou "Oculta na página"
- Mensagens de campo obrigatório citam o campo pelo rótulo: `Preencha o campo "Título".`, `Escolha uma imagem para o campo "Capa".` e `Escolha uma opção no campo "Categoria".` (RNF30). Antes: "Preencha título." e "Envie capa."
- A mensagem de erro da caixa de seleção passou a ser ligada ao campo (`aria-describedby`)

### Alterado

- A lateral do login também cita os contatos recebidos pelo site
- Figma: cinco cores do modo Claro da coleção "Painel · Cores" ficaram mais escuras para todo texto passar de 4,5:1 (RNF33), e o botão "Salvando..." deixou de ser transparente, como no código

### Removido

- Classes CSS sem uso (`brandName`) no menu lateral e no login

## [0.4.0] - 2026-10-15

Modo escuro no painel e no Figma. Detalhes em [docs/EVOLUCAO.md](docs/EVOLUCAO.md).

### Adicionado

- Modo escuro em todas as telas, inclusive no login. O botão "Modo escuro" fica no cabeçalho, ao lado de "Ver site"; no tema escuro ele mostra "Modo claro". Abaixo de 1024 px aparece só o ícone, com área de toque de 44 px
- Na primeira visita o painel segue o tema do sistema. Depois do clique, a escolha fica salva no navegador por um ano (cookie `miniverso_admin_theme`), e o servidor já entrega a página no tema certo
- `src/lib/theme.ts` com as regras do tema e `src/components/layout/theme-toggle.tsx` no cabeçalho
- Testes do tema e dos tokens de cor: os dois blocos do modo escuro são iguais, todo papel de cor tem valor no escuro, contraste mínimo nos dois temas (RNF33) e nenhum componente usa cor fixa (73 testes)

### Alterado

- Os componentes passaram a usar papéis de cor (`--color-*` em `globals.css`) no lugar das cores fixas, com os mesmos valores no tema claro. Conferido elemento por elemento: no claro, só o título dos formulários em modal mudou, de `#05060A` para a cor dos outros títulos (`#0B0E16`)
- Modais, avisos, menu lateral e lateral do login ganham um contorno sutil no modo escuro
- No celular, o espaço entre os botões do cabeçalho diminuiu para o título caber inteiro com o novo botão
- Página não encontrada: o botão diz "Ir para o painel", porque a visão geral não existe mais

## [0.3.0] - 2026-10-15

Revisão a partir dos comentários do João no Figma. A análise de cada comentário está em [docs/EVOLUCAO.md](docs/EVOLUCAO.md#v030--15102026--revisão-dos-comentários-do-joão).

### Adicionado

- Leads de volta ao painel (RF16, RF17): lista com busca, filtro por serviço de interesse, ordenação por data e paginação; detalhe com a mensagem completa, responder por e-mail e copiar contato; exclusão com confirmação (RNF42)
- O filtro "Serviço de interesse" usa os serviços da seção Serviços da página inicial, a mesma lista do formulário de contato
- Campo "Imagem de fundo (opcional)" em Sobre, Serviços, Projetos, Diferenciais, Experiência interativa, Processo, Clientes e Contato (RF15). É decorativa, então não pede texto alternativo. O Hero mantém o fundo próprio e o Rodapé não tem fundo (RIU27)
- Nota no painel de estrutura: o menu do site e os atalhos do rodapé seguem as seções visíveis, na ordem da lista
- Mock de leads com 18 contatos fictícios (RNF18) e rotas `GET /leads`, `GET /leads/{id}` e `DELETE /leads/{id}` no formato do Laravel
- [docs/PROPOSTAS.md](docs/PROPOSTAS.md) com as ideias fora do DRDA: recuperação de senha, gráfico de leads por período e personalização com limites
- Testes de leads no mock, na ponte e no modo híbrido, e da imagem de fundo decorativa (63 testes)

### Alterado

- Menu lateral com "Página inicial" e "Leads"; sem item "Dashboard", porque no DRDA (2.2) o dashboard é o próprio painel
- Ponte `/api/admin/*` e `MOCK_RESOURCES` passam a liberar `site-content` e `leads`
- Contrato da API com as rotas de leads e o campo `background` das seções

## [0.2.0] - 2026-10-12

### Alterado

- Escopo corrigido: o painel passa a ser só o editor da página inicial, como no frame "Painel · Editor da página inicial" do Figma
- `/admin` abre direto em `/admin/pagina-inicial`; o menu lateral tem um único item
- Cores e fontes trocadas pelas variáveis do Figma (fundo `#05060A`, azul `#2450E6`, Inter e Sofia Sans Extra Condensed) e logo oficial no menu e no login
- Mock e ponte `/api/admin/*` liberam só o recurso `site-content`

### Adicionado

- Estrutura da página: ordem das seções com setas, Hero e Rodapé fixos, seções obrigatórias marcadas, opcionais com botão de exibir
- Regras do DRDA no editor: Experiência interativa bloqueada (RIU20), Clientes só com logo autorizado (RIU22, RIU23), projeto em destaque visível (RIU17)
- Formulário de cada seção montado a partir de `schema.ts`, com contador de caracteres e campos obrigatórios marcados
- Itens das seções (serviços, projetos, etapas, logos, redes) com adicionar, editar, reordenar, ocultar e remover com confirmação
- Envio de imagem com prévia, substituir, remover e validação de tipo, extensão e tamanho; texto alternativo obrigatório
- Rascunho com aviso de alterações não publicadas, "Descartar" e "Salvar e publicar"; o rascunho continua na tela se a publicação falhar
- Componentes `Switch`, `FormDialog` (modal ou painel lateral), `TextAreaField` e `CheckboxField`
- Testes das regras do editor e da rota `site-content`

### Removido

- Visão geral, Leads e telas reservadas de Projetos, Serviços e Conteúdo, que não fazem parte desta entrega

## [0.1.1] - 2026-10-11

### Alterado

- Login, sessão e saída integrados ao back-end real (metaverso-back): rotas na raiz (`/login`, `/me`, `/logout`), resposta em `data` e usuário com o campo `nome`
- Login só por e-mail, porque o back-end valida o campo como e-mail
- Mock atualizado para responder igual ao back-end (mensagens, formato e limite de 6 tentativas por minuto)

### Adicionado

- Modo híbrido: com `API_MODE=live`, recursos que o back-end ainda não tem (`MOCK_RESOURCES`) continuam vindo do mock
- Testes do modo live contra um servidor que imita o back-end

## [0.1.0] - 2026-10-11

### Adicionado

- Projeto Next.js 16 com React 19 e TypeScript
- Tokens de design com as cores do manual da Miniverso e contraste conferido
- Tela de login com validação por campo, mostrar e ocultar senha, erro genérico e bloqueio temporário
- Sessão em cookie httpOnly, proteção das rotas `/admin` e saída pelo menu da conta
- Encerramento da sessão por inatividade, sincronizado entre abas
- Ponte autenticada `/api/admin/*` (BFF) entre o navegador e a API Laravel
- API de exemplo (mock) no formato do Laravel para desenvolver sem o back-end
- Layout com menu lateral, cabeçalho com título da página, "Ver site" e menu da conta, responsivo para desktop, tablet e celular
- Visão geral com leads dos últimos 7 dias, totais de projetos e serviços, últimos leads e atalhos
- Lista de leads com busca, filtro por serviço, ordenação e paginação
- Detalhe do lead com mensagem completa, resposta por e-mail e cópia do contato
- Exclusão de lead com modal de confirmação
- Estados de carregamento, vazio, erro e sucesso nas telas com dados
- Telas reservadas para Projetos, Serviços e Conteúdo do site
- Testes da camada de dados e de segurança (`npm test`)
- Documentação: README, contrato da API e registro de evolução
