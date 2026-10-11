// Query params the OAuth provider adds when it sends someone to /anmelden or the consent page.
const SIGNING_PARAMS = ["sig", "exp", "ba_iat", "ba_pl", "ba_param"];

/**
 * Where to go after signing in when an AI assistant started an OAuth authorization: back
 * to the authorize endpoint, which then sees the session and continues to consent.
 * This must happen in the assistant's window (ChatGPT keeps its login state there), not
 * in the tab the magic link opens; /email-pruefen continues once the session exists.
 * Undefined for ordinary sign-ins.
 */
const RESUME_PREFIX = "/api/auth/oauth2/authorize?";

/** Whether a URL from the query string is a resume URL, so it can't redirect elsewhere. */
export function isOAuthResumeUrl(url: string | undefined): url is string {
  return !!url && url.startsWith(RESUME_PREFIX);
}

export function oauthResumeUrl(search: URLSearchParams): string | undefined {
  if (!search.has("sig") || !search.has("client_id")) return undefined;
  const params = new URLSearchParams(search);
  for (const name of SIGNING_PARAMS) params.delete(name);
  // They have just signed in; asking again would loop back here.
  if (params.get("prompt") === "login") params.delete("prompt");
  return `${RESUME_PREFIX}${params}`;
}
