/**
 * Recursos da API que o painel pode acessar pelo proxy /api/admin/*.
 * Qualquer outro caminho é recusado: o proxy não vira uma porta aberta para a API inteira.
 * Ao criar um módulo novo no painel, inclua o recurso aqui e no contrato (docs/CONTRATO-API.md).
 */
export const ADMIN_RESOURCES = new Set(["site-content", "leads"]);
