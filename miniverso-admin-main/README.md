
# Administração Miniverso

Painel Next.js/React para editar o site público completo.

## Iniciar

Instale as dependências nesta pasta e na raiz. Na raiz, npm run dev inicia site e painel.
Para iniciar apenas o painel nesta pasta: npm run dev -- --port 3001.

Login: http://localhost:3001/admin/login.
Editor: /admin/paginas. Mensagens: /admin/leads.

O .env.example configura o login local de demonstração:
- e-mail: admin@miniverso.test;
- senha: miniverso123.

O conteúdo publicado é real: usa ../data/site-content.json, compartilhado com o site. O editor antigo redireciona para o editor completo.

## Áreas editáveis

Cinco páginas, heroes, faixas, seções, itens, mídia e legendas; portfólio e detalhes dos projetos; marca, cabeçalho e rodapé; formulário; dispositivos e smartphone social; textos da interface.

Salvar e publicar valida e persiste o documento completo. O site lê as alterações sem recompilar. Erros preservam o rascunho; revisões evitam sobrescrever outra sessão. Recarregar busca a última publicação; Descartar recupera a versão carregada.

## API PHP

Configure API_URL, API_MODE=live, CONTENT_SOURCE=api e MOCK_RESOURCES vazio. Configure o site público da mesma forma. Tokens ficam no cookie HttpOnly; chamadas passam pelo servidor Next.

Veja [Contrato PHP](../docs/ADMIN-E-PHP.md). O PHP ainda precisa implementar as rotas. No modo API, publicação/upload não gravam no JSON local nem simulam sucesso.

## Verificação

npm run build, npm test e npm run lint nesta pasta. Na raiz, npm run test:e2e executa o teste de navegador depois dos builds.
