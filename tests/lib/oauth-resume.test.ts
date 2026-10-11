import { describe, expect, it } from "vitest";
import { isOAuthResumeUrl, oauthResumeUrl } from "@/lib/auth/oauth-resume";

describe("oauthResumeUrl", () => {
  it("ignores ordinary sign-ins", () => {
    expect(oauthResumeUrl(new URLSearchParams("callbackUrl=/profil"))).toBeUndefined();
  });

  it("returns to the authorize endpoint without the signing params", () => {
    const url = oauthResumeUrl(
      new URLSearchParams(
        "client_id=abc&redirect_uri=https%3A%2F%2Fchatgpt.com%2Fcb&prompt=login&exp=1&ba_iat=2&ba_param=client_id&ba_param=exp&sig=xyz",
      ),
    );
    expect(url).toBe(
      "/api/auth/oauth2/authorize?client_id=abc&redirect_uri=https%3A%2F%2Fchatgpt.com%2Fcb",
    );
  });
});

describe("isOAuthResumeUrl", () => {
  it("accepts only the authorize endpoint", () => {
    expect(isOAuthResumeUrl("/api/auth/oauth2/authorize?client_id=abc")).toBe(true);
    expect(isOAuthResumeUrl("https://evil.example/api/auth/oauth2/authorize?x")).toBe(false);
    expect(isOAuthResumeUrl("//evil.example")).toBe(false);
    expect(isOAuthResumeUrl(undefined)).toBe(false);
  });
});

describe("oauthResumeUrl forced sign-in", () => {
  const resume = (query: string) =>
    new URLSearchParams(
      oauthResumeUrl(new URLSearchParams(`client_id=a&sig=s&${query}`))!.split("?")[1],
    );

  it("drops only the prompts that force another sign-in", () => {
    expect(resume("prompt=login%20consent").get("prompt")).toBe("consent");
    expect(resume("prompt=select_account").has("prompt")).toBe(false);
  });

  it("drops max_age, which would ask for a fresh sign-in again", () => {
    expect(resume("max_age=0").has("max_age")).toBe(false);
  });
});
