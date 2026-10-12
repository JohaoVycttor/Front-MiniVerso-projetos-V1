# Miniverso · Front-end

Página de projetos em **Next.js App Router, React e TypeScript**, construída a partir dos três prints fornecidos. CSS próprio, fonte local, painéis com transparência e blur suave, filtros, menu mobile, páginas de projetos e galeria com imagens e vídeos.

## Executar

```bash
npm install
npm run dev
```

Abra http://localhost:3000. A página de projetos também está em `/projetos`.

```bash
npm run typecheck
npm test
npm run build
npm start
```

## Conteúdo separado da apresentação

- `src/data/content.json`: fonte centralizada dos dados simulados, inclusive textos de interface, navegação, categorias, cards, galerias, metadados e rodapé.
- `src/types/content.ts`: contrato `PageContent` esperado do back-end.
- `src/lib/content.ts`: carregamento e validação da API; seleção de conteúdo publicado e ordenação.
- `src/components/`: componentes visuais reutilizáveis. `SectionRenderer` resolve cada seção por `type`.
- `src/app/`: rotas da página, projetos e páginas institucionais.

Os projetos e os textos institucionais são demonstrativos, baseados nas referências, e devem ser revisados antes da publicação. Os links de redes sociais são exemplos para substituição pelos perfis oficiais. Os espaços de imagem/vídeo permanecem como nas referências até o cadastro das mídias. A foto de fundo foi gerada com ImageGen e o símbolo é uma aproximação em SVG; substitua pelos arquivos oficiais quando disponíveis. Não foi implementado um painel administrativo nem um back-end.

## Conectar a API

Copie `.env.example` para `.env.local` e configure:

```dotenv
CONTENT_API_URL=https://seu-backend.com/api/pages/projetos
```

Sem essa variável, `getContent()` carrega o JSON simulado. Com a variável configurada, carrega o endpoint no servidor, sem cache, com limite de 10 segundos, verifica o status HTTP e valida o contrato antes de renderizar. Não é preciso mudar os componentes. Falhas da API mostram uma página de erro com opção de tentar novamente, sem substituir silenciosamente o conteúdo real por dados simulados. O endereço da API não é exposto como variável pública no navegador.

O endpoint deve retornar o objeto completo de `src/data/content.json`, com `schemaVersion: 1`. Os IDs devem ser únicos; categorias e destaques devem referenciar itens existentes. Mídias aceitam caminhos locais ou URLs HTTP(S). Vídeos são arquivos diretos reproduzíveis pelo navegador, como MP4/WebM; URLs de páginas do YouTube/Vimeo não são URLs de arquivo e exigiriam um componente de embed específico.

## Campos para o futuro painel

- **Seções**: `sections[].type` escolhe `hero`, `featured`, `projects` ou `contact`; `order` controla a posição e `visible` a publicação. Títulos, descrições e ações pertencem à própria seção. O `id` é também a âncora HTML; atualize os links de navegação ao alterar IDs. `projects.columns` aceita 2 ou 3 colunas no desktop.
- **Cards**: `projects[].order`, `visible`, `title`, `description`, `tag` e `categoryIds` controlam a listagem. O destaque referencia `projectId`. Um projeto oculto também deixa de aparecer no destaque e seu detalhe retorna 404.
- **Projetos**: `slug` define `/projetos/[slug]`; `introduction`, `facts` e `story` alimentam os detalhes.
- **Detalhe do projeto (opcionais)**: `heading` (`{ text, accent }`) troca o título simples pelo título em destaque; `year` vira um selo ao lado da tag; `background` troca a foto de fundo só daquela página; `highlights[]` (`{ icon, title, text }`, com `icon` em `shield`, `headset` ou `chart`) monta os cards "O que mudou"; `story[].label` mostra o rótulo acima de cada bloco; `presentation.duration` (em segundos) aparece no botão do vídeo. O próximo projeto é o seguinte na ordem de `projects[].order`.
- **Mídias**: `cover`, `presentation` e `gallery[]` usam `{ id, type, src?, poster?, alt, caption? }`. `type` aceita `image` ou `video`; `poster` é a capa opcional do vídeo. A ordem do array define a ordem da galeria. Sem `src`, o componente mostra um estado vazio, sem imagens quebradas ou reprodução fictícia.
- **Navegação e marca**: nome, símbolo, foto de fundo, contatos e links do rodapé vêm do mesmo contrato.
- **Páginas institucionais**: `pages[]` controla `/o-estudio` e `/solucoes` e pode cadastrar outras páginas no mesmo formato.

O formulário/upload, autenticação, persistência e publicação do futuro painel devem ser implementados no back-end. O front-end atual apenas consome o conteúdo publicado. Os botões de contato abrem o aplicativo de e-mail usando `mailto:`.

## Acessibilidade e responsividade

Idioma `pt-BR`, landmarks, títulos hierárquicos, foco visível, link para pular a navegação, estado dos filtros com `aria-pressed`, contagem anunciada, menu com Escape e diálogo nativo com retenção/restauração de foco. Transições respeitam `prefers-reduced-motion`. Cards não têm altura de texto fixa nem títulos truncados. A grade passa de três para duas e depois uma coluna.

## Asset gerado

Ferramenta: ImageGen integrada. Arquivo usado: `public/images/vr-background.webp`.

Prompt: fotografia editorial horizontal de uma mulher adulta com cabelos escuros, headset de realidade virtual e braços levantados; luz vermelha lateral, fundo azul/malva, textura sutil e espaço negativo para títulos, seguindo a composição e as cores dos prints; sem textos, logos, cards ou marca d'água. A versão PNG original está em `public/images/vr-background.png`.
