import { beforeEach, describe, expect, it, vi } from "vitest";

// The route's own gate, without OAuth or a database: requireMcpAuth hands over fixed claims,
// getMcpAccess answers per test, and the MCP handler just records that it was reached.
const claims = { sub: "user-1", azp: "client-1", scope: "openid" };
const access = vi.fn();
const reached = vi.fn(async () => new Response("tools"));

vi.mock("@better-auth/mcp", () => ({
  requireMcpAuth:
    (_auth: unknown, handler: (req: Request, claims: unknown) => Promise<Response>) =>
    (req: Request) =>
      handler(req, claims),
}));
vi.mock("@modelcontextprotocol/server", () => ({
  createMcpHandler: () => ({ fetch: reached }),
}));
vi.mock("@/lib/auth/auth", () => ({ auth: {}, MCP_RESOURCE: "https://kg.test/api/mcp" }));
vi.mock("@/domains/assistants/queries", () => ({ getMcpAccess: access }));
vi.mock("@/server/mcp/tools", () => ({ buildMcpServer: vi.fn() }));

const { POST } = await import("@/app/api/mcp/route");
const call = () => POST(new Request("https://kg.test/api/mcp", { method: "POST" }));

describe("MCP route access", () => {
  beforeEach(() => {
    access.mockReset();
    reached.mockClear();
  });

  it("checks this user's connection to this assistant", async () => {
    access.mockResolvedValue({ isAdmin: true, connected: true });
    await call();
    expect(access).toHaveBeenCalledWith("user-1", "client-1");
  });

  it("sends a disconnected assistant back to sign-in", async () => {
    access.mockResolvedValue({ isAdmin: true, connected: false });
    const response = await call();
    expect(response.status).toBe(401);
    expect(response.headers.get("WWW-Authenticate")).toContain(
      'resource_metadata="https://kg.test/.well-known/oauth-protected-resource/api/mcp"',
    );
    expect(reached).not.toHaveBeenCalled();
  });

  it("refuses connected users who aren't admins", async () => {
    access.mockResolvedValue({ isAdmin: false, connected: true });
    expect((await call()).status).toBe(403);
    expect(reached).not.toHaveBeenCalled();
  });

  it("lets connected admins through with their user id", async () => {
    access.mockResolvedValue({ isAdmin: true, connected: true });
    expect(await (await call()).text()).toBe("tools");
    expect(reached).toHaveBeenCalledWith(
      expect.any(Request),
      expect.objectContaining({
        authInfo: expect.objectContaining({ clientId: "client-1", extra: { userId: "user-1" } }),
      }),
    );
  });
});
