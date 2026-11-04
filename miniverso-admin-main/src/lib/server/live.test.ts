/**
 * Modo live contra um servidor falso que responde exatamente como o metaverso-back
 * (AuthController, UserResource, InvalidCredentialsException, throttle:6,1).
 */
import assert from "node:assert/strict";
import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";
import { after, before, describe, it } from "node:test";
import { GET as proxyGet } from "@/app/api/admin/[...path]/route";
import { POST as login } from "@/app/api/auth/login/route";
import { fetchCurrentUser } from "./auth";

const VALID_TOKEN = "1|token-real-do-sanctum";
let server: Server;

before(async () => {
  server = createServer((req, res) => {
    let raw = "";
    req.on("data", (chunk) => (raw += chunk));
    req.on("end", () => {
      const send = (status: number, body: unknown) => {
        res.writeHead(status, { "content-type": "application/json" });
        res.end(body === null ? "" : JSON.stringify(body));
      };
      const authorized = req.headers.authorization === `Bearer ${VALID_TOKEN}`;
      if (req.method === "POST" && req.url === "/login") {
        const { email, password } = JSON.parse(raw || "{}");
        if (email === "dev@example.com" && password === "12345") {
          return send(200, { data: { token: VALID_TOKEN, user: { nome: "Dev", email, created_at: "01/10/2026 10:00:00" } } });
        }
        return send(422, { errors: { message: "Credenciais inválidas." } });
      }
      if (req.url === "/me") {
        return authorized ? send(200, { data: { nome: "Dev", email: "dev@example.com" } }) : send(401, { message: "Não autenticado." });
      }
      send(404, { message: "Not Found" });
    });
  });
  await new Promise<void>((resolve) => server.listen(0, resolve));
  process.env.API_MODE = "live";
  process.env.API_URL = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  process.env.MOCK_LATENCY_MS = "0";
});

after(() => {
  process.env.API_MODE = "mock";
  process.env.API_URL = "";
  server.close();
});

const loginRequest = (email: string, password: string) =>
  new Request("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: { "content-type": "application/json", origin: "http://localhost:3000", host: "localhost:3000" },
    body: JSON.stringify({ login: email, password }),
  });

describe("modo live com o contrato do metaverso-back", () => {
  it("faz login, guarda o token no cookie e lê o nome do campo `nome`", async () => {
    const response = await login(loginRequest("dev@example.com", "12345"));
    assert.equal(response.status, 200);
    assert.match(response.headers.get("set-cookie") ?? "", /1%7Ctoken-real-do-sanctum/);
    assert.deepEqual(await response.json(), { user: { id: "dev@example.com", name: "Dev", email: "dev@example.com" } });
  });

  it("transforma o 422 de credenciais inválidas na mensagem genérica", async () => {
    const response = await login(loginRequest("dev@example.com", "errada"));
    assert.equal(response.status, 401);
  });

  it("valida a sessão em /me", async () => {
    assert.equal((await fetchCurrentUser(VALID_TOKEN)).kind, "ok");
    assert.equal((await fetchCurrentUser("token-vencido")).kind, "unauthenticated");
  });

  it("serve o conteúdo da página inicial pelo mock enquanto o back-end não tem a rota", async () => {
    const response = await proxyGet(
      new Request("http://localhost:3000/api/admin/site-content", {
        headers: { cookie: `miniverso_admin_session=${encodeURIComponent(VALID_TOKEN)}` },
      }),
      { params: Promise.resolve({ path: ["site-content"] }) },
    );
    assert.equal(response.status, 200);
    assert.equal(((await response.json()) as { data: { sections: unknown[] } }).data.sections.length, 10);
  });

  it("serve leads pelo mock enquanto o back-end não tem a rota", async () => {
    const response = await proxyGet(
      new Request("http://localhost:3000/api/admin/leads?per_page=3", {
        headers: { cookie: `miniverso_admin_session=${encodeURIComponent(VALID_TOKEN)}` },
      }),
      { params: Promise.resolve({ path: ["leads"] }) },
    );
    assert.equal(response.status, 200);
    assert.equal(((await response.json()) as { data: unknown[] }).data.length, 3);
  });
});
