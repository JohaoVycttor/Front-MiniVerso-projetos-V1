# Miniverso — avaliação e nova organização do conteúdo

Pesquisa realizada em 12 de novembro de 2026. Escopo: conteúdo abaixo dos heroes das páginas públicas. Os heroes aprovados foram preservados.

## Referências de mercado

A tabela registra uma leitura de design das páginas consultadas, não uma medição de conversão ou uma afirmação de que existe um único padrão no setor.

| Referência | O que foi observado | Aplicação na Miniverso |
| --- | --- | --- |
| [Apple Vision Pro](https://www.apple.com/apple-vision-pro/) | A apresentação passa do dispositivo a capítulos de uso, como entretenimento, produtividade e conexão. Detalhes do equipamento recebem imagens e explicações próprias. | Soluções organizadas por participação, dispositivo e aplicação; cada visual explica um assunto. |
| [Estilos oficiais da Apple Vision Pro](https://www.apple.com/v/apple-vision-pro/l/built/styles/overview.built.css) | O CSS declara SF Pro Display em títulos e SF Pro Text em texto. A classe de título examinada usa peso 600 e tamanhos responsivos de 64, 48 e 40 px. | Uma hierarquia explícita, usando a fonte local da Miniverso: títulos com peso 600 e textos de leitura com peso 400. |
| [Linear](https://linear.app/) e [guia de marca](https://linear.app/brand) | Recursos organizados em etapas do trabalho, interfaces como demonstração e orientações explícitas sobre espaço ao redor da marca. | Conteúdo dividido por finalidade; portfólio apresentado por contexto e entregas; alinhamentos e espaços consistentes. |
| [Varjo: treinamento e simulação](https://varjo.com/use-cases/training-and-simulation) | A página explica a aplicação, o funcionamento e como começar, acompanhada de exemplos de treinamento. | Tabela que relaciona objetivo, formato e entrega; informações práticas antes da chamada para contato. |
| [Teenage Engineering: OP–1](https://teenage.engineering/products/op-1) | Descrição do produto acompanhada de detalhes e uma lista técnica extensa. A informação concreta sustenta a apresentação. | Fichas dos projetos com público, formato e entregas disponíveis no conteúdo existente. |
| [Nothing](https://nothing.tech/) | Categorias de produto e campanhas separadas, cada uma com mensagem e imagem específicas. | Navegação clara entre os quatro formatos e menos imagens repetidas entre seções. |

## Avaliação do site anterior

1. **Hierarquia repetida.** Muitos títulos tinham a mesma escala grande, peso leve e segunda frase azul. Isso dava a conteúdos diferentes a mesma importância.
2. **Texto pequeno.** Rótulos de 8–10 px e descrições curtas enfraqueciam a leitura abaixo das aberturas.
3. **Mockups como decoração.** Celulares, notebooks e telas do próprio site ocupavam espaço sem esclarecer o serviço oferecido.
4. **Fotografias sem relação direta com a entrega.** Imagens de referência reapareciam em projetos sem capturas próprias. Mesmo identificadas como ilustrativas, repetiam uma linguagem de banco de imagens.
5. **Conteúdo útil pouco explorado.** A comparação de soluções mostrava principalmente os nomes dos formatos, embora os dados já tivessem objetivos e descrições das entregas.
6. **Repetição no encerramento.** Chamadas grandes e outra marca em escala monumental competiam com a assinatura já presente no hero.

## O que mudou

- **Home:** apresentação editorial com fotografia da equipe, navegação de soluções por formato, projetos com contexto, critérios de criação e processo em sequência.
- **Soluções:** uma galeria controlada pelo visitante, com abas acessíveis, dispositivo, interação e aplicação. Esquemas próprios explicam AR, MR e 360°; o equipamento VR aparece como referência, com legenda. A comparação exibe objetivo, formato e entrega.
- **Estúdio:** registros da equipe e do público, textos completos, critérios e formatos apresentados em seções distintas.
- **Portfólio:** filtros preservados; fichas apresentam títulos, contexto, público, formato e entregas. Mídias próprias cadastradas continuam aparecendo. Projetos sem capturas próprias são apresentados pelas suas informações.
- **Contato:** formulário e canais com hierarquias distintas; campos, privacidade e estados de envio mantidos.
- **Rodapé:** navegação curta, contato e identificação do estúdio, com uma assinatura mais discreta.
- **Texto:** títulos abaixo dos heroes passam a explicar o conteúdo da seção, reduzindo chamadas vagas.

## Tipografia e composição

- Fonte local: **MiniversoInter**.
- Títulos de seção: aproximadamente **30–46 px**, peso **600**, entrelinha **1,14**.
- Títulos de projetos e formatos: aproximadamente **25–38 px**, peso **600**.
- Textos de leitura: **14–17 px**, entrelinha **1,75–1,85**.
- Metadados e legendas: **10–13 px**, com contraste e função secundária.
- Fotografias documentais em proporções verticais; imagens de projeto somente quando cadastradas como mídia própria.
- Listas, tabelas e linhas divisórias organizam informações; os blocos variam conforme a função.
- No celular, as colunas viram uma sequência de leitura. As abas mantêm seleção por teclado e identificação do painel ativo.

## Integridade e limites

Os arquivos compartilhados dos heroes foram comparados por SHA-256 com a versão anterior. O conteúdo dos heroes também foi preservado na atualização dos textos.

O acervo disponível inclui fotografias documentais da equipe e do público, imagens de referência e projetos sem captura própria. Essa diferença orientou o tratamento editorial. Capturas e vídeos reais adicionais poderão enriquecer os projetos pelo cadastro existente.

As fontes, os estilos, os esquemas e os componentes novos ficam no projeto local. A pesquisa usou os sites oficiais como referências de organização; as imagens e marcas dessas empresas não fazem parte do site da Miniverso.

## Validação

- Compilação Next.js concluída.
- As 14 páginas públicas e de projetos verificadas responderam com HTTP 200 e um título principal por página.
- Âncoras internas, IDs, imagens, folhas de estilo e redirecionamentos verificados.
- Nas três galerias, quatro abas, um painel inicialmente visível e vínculos ARIA válidos.
- Os arquivos e os dados dos heroes foram comparados com a versão anterior.
- A revisão visual e o teste das interações no navegador ficaram indisponíveis porque o host de acesso ao navegador não respondeu. A validação das abas cobriu a estrutura entregue pelo servidor.
