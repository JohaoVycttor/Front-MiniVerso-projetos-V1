import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { NextConfig } from "next";

// Versão exibida no rodapé do menu lateral, lida do package.json.
const { version } = JSON.parse(readFileSync(join(process.cwd(), "package.json"), "utf8")) as {
  version: string;
};

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  // O painel é restrito: não deve aparecer em buscadores.
  { key: "X-Robots-Tag", value: "noindex, nofollow" },
];

const nextConfig: NextConfig = {
  // A raiz do projeto é esta pasta, mesmo que exista outro package-lock.json mais acima no computador.
  turbopack: { root: process.cwd() },
  poweredByHeader: false,
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_APP_VERSION: version,
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
