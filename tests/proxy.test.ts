import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const getSession = vi.fn();
vi.mock("@/lib/auth/auth", () => ({ auth: { api: { getSession } } }));

const { proxy } = await import("@/proxy");

function request() {
  return new NextRequest("http://localhost/meine-aufgaben", {
    headers: { cookie: "better-auth.session_token=tok; better-auth.session_data=old" },
  });
}

function answer(...setCookies: string[]) {
  const headers = new Headers();
  for (const cookie of setCookies) headers.append("set-cookie", cookie);
  getSession.mockResolvedValue({ headers, response: null });
}

describe("proxy", () => {
  beforeEach(() => {
    getSession.mockReset();
  });

  it("passes through when the cache is still valid", async () => {
    answer();
    const response = await proxy(request());
    expect(response.headers.getSetCookie()).toEqual([]);
    expect(response.headers.get("x-middleware-override-headers")).toBeNull();
  });

  it("sends a refreshed cache cookie to the browser and to this render", async () => {
    answer("better-auth.session_data=new%2Bvalue; Max-Age=300; Path=/; HttpOnly");
    const response = await proxy(request());
    expect(response.headers.getSetCookie()).toEqual([
      "better-auth.session_data=new%2Bvalue; Max-Age=300; Path=/; HttpOnly",
    ]);
    expect(response.headers.get("x-middleware-request-cookie")).toBe(
      "better-auth.session_token=tok; better-auth.session_data=new%2Bvalue",
    );
  });

  it("drops cookies Better Auth expires", async () => {
    answer("better-auth.session_data=; Max-Age=0; Path=/");
    const response = await proxy(request());
    expect(response.headers.get("x-middleware-request-cookie")).toBe(
      "better-auth.session_token=tok",
    );
  });

  it("lets the page decide when the session lookup fails", async () => {
    getSession.mockRejectedValue(new Error("db down"));
    const response = await proxy(request());
    expect(response.headers.getSetCookie()).toEqual([]);
  });
});
