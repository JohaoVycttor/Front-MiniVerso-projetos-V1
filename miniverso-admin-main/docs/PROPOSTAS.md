# Propostas fora do DRDA

Ideias que surgiram nos comentários do João no Figma (outubro de 2026). Nenhuma delas está nas telas principais. Cada uma só entra no painel depois de o cliente aprovar e de o DRDA ganhar o requisito correspondente.

Os esboços estão no Figma, na página **99 · Propostas**.

| # | Proposta | Origem | Situação |
| --- | --- | --- | --- |
| 1 | Recuperação de senha | comentário #4 | fora do DRDA, precisa de aprovação |
| 2 | Gráfico de leads por período | comentários #1 e #4 | fora do DRDA, precisa de aprovação |
| 3 | Personalização com limites | comentário #3 | fora do DRDA, precisa de aprovação |

## 1. Recuperação de senha

**Por que está fora.** O DRDA prevê login (RF11), acesso restrito (RF12), bloqueio após tentativas falhas (RNF15) e erro genérico (RNF16), mas nenhum requisito de recuperar a senha. O back-end só tem `/login`, `/logout`, `/me` e `/register`, e não há envio de e-mail configurado.

**O que seria preciso.**

1. Novo RF no DRDA, por exemplo: "o administrador pode redefinir a senha por um link enviado ao e-mail de acesso".
2. Duas rotas no back-end: pedir o link e salvar a nova senha, com token de uso único e validade curta.
3. Serviço de e-mail configurado (SMTP).
4. A mesma mensagem para e-mail cadastrado ou não ("Se o e-mail estiver cadastrado, você vai receber um link"), para não revelar quem tem acesso, no mesmo princípio do RNF16.

Enquanto isso, com um único administrador (2.2), a senha pode ser trocada pela equipe direto no back-end.

## 2. Gráfico de leads por período

**Por que está fora.** Nenhum RF pede gráficos ou métricas. No DRDA (2.2), "dashboard" é o próprio painel administrativo, não uma tela de indicadores. O sistema também não coleta visitas nem conversão.

**Como seria, se aprovado.**

1. Uma métrica só: quantidade de leads por semana, contada pela data de envio, o único dado que o sistema já registra.
2. No topo da tela de Leads, sem tela nova nem item novo no menu.
3. Período escolhido numa lista (4 semanas, 12 semanas, 6 meses), com o total escrito.
4. Cada barra com o número em texto, para a informação não depender só de forma ou cor (RNF39).
5. Exige novo RF e uma rota de contagem no back-end, ou o cálculo a partir de `GET /leads`.

## 3. Personalização com limites

**Por que não do jeito pedido.** Editar cor, fonte e posição de qualquer elemento transforma o painel num construtor de páginas. Isso conflita com:

- a identidade visual própria, em azul e branco (3.1.1);
- a estrutura padronizada das informações (RN06);
- a consistência entre telas (RNF28);
- o contraste mínimo de 4,5:1 (RNF33), que qualquer combinação livre de cores pode quebrar;
- o administrador sem conhecimento técnico (RNF41).

**O que já está no painel.** Textos e imagens de todas as seções (RF15), imagem de fundo opcional por seção (v0.3.0), modo claro e escuro escolhido no cabeçalho (v0.4.0), visibilidade das seções opcionais (3.1.1) e ordem das seções do meio (decisão da equipe, a validar com o cliente). O modo escuro não depende desta proposta: troca só os papéis de cor, sem mudar a identidade.

**O que propomos, se o cliente aprovar.**

1. Layout da seção: 2 ou 3 variações prontas por seção (texto à esquerda, centralizado, imagem à esquerda), já desenvolvidas e testadas.
2. Tema de cor: paletas pré-aprovadas que já passam no contraste mínimo.
3. Fontes fixas, porque fazem parte da identidade.

Cada variação precisa ser desenhada, desenvolvida no front-end público e testada nos três tamanhos de tela (RF10, RNF09).
