/**
 * Configurações que o navegador pode ver.
 * Variáveis NEXT_PUBLIC_ são embutidas no build, então nunca coloque segredos aqui.
 */
const idleMinutes = Number(process.env.NEXT_PUBLIC_IDLE_TIMEOUT_MINUTES);

export const publicConfig = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  idleTimeoutMinutes: Number.isFinite(idleMinutes) && idleMinutes > 0 ? idleMinutes : 30,
  appVersion: process.env.NEXT_PUBLIC_APP_VERSION || "dev",
};
