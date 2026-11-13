
# Contrato da API PHP

A versão atual administra o documento completo do site, substituindo o modelo antigo de dez seções da home.

Especificação: [ADMIN-E-PHP.md](../../docs/ADMIN-E-PHP.md).
Exemplo: data/site-content.json na raiz.
JSON Schema: [site-content.schema.json](../../docs/site-content.schema.json).

O editor chama GET/PUT /api/admin/pages. O BFF autenticado encaminha para GET/PUT {API_URL}/site-content. O site chama GET {API_URL}/site-content/public.

Tipos TypeScript: src/features/site-editor/schema.ts.
Validação compartilhada: shared/site-content.mjs na raiz.

Integração real: API_MODE=live, CONTENT_SOURCE=api, MOCK_RESOURCES vazio. Sem API, o modo local persiste no arquivo compartilhado e registra mensagens reais em data/leads.json.
