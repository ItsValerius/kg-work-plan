/**
 * Runs the dev server behind an ngrok https tunnel, so ChatGPT (which can't reach
 * localhost) can connect to /api/mcp. BETTER_AUTH_URL is set to the tunnel for this run
 * only; .env.local stays as it is.
 *
 *   pnpm dev:tunnel
 *
 * Needs ngrok, logged in once with `ngrok config add-authtoken <token>`. Free accounts
 * keep the same domain, so the URL in ChatGPT survives restarts.
 */
import { spawn } from "node:child_process";

const ngrok = spawn("ngrok", ["http", "3000", "--log=stdout"], { stdio: "ignore" });
ngrok.on("error", () => {
  console.error("ngrok nicht gefunden. Installieren: https://ngrok.com/download");
  process.exit(1);
});

/** ngrok's local API lists the tunnel once it is up. */
async function tunnelUrl() {
  for (let attempt = 0; attempt < 30; attempt++) {
    try {
      const response = await fetch("http://127.0.0.1:4040/api/tunnels");
      const { tunnels } = (await response.json()) as { tunnels: { public_url: string }[] };
      const url = tunnels.find((tunnel) => tunnel.public_url.startsWith("https://"))?.public_url;
      if (url) return url;
    } catch {
      // Not up yet.
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error("ngrok hat keinen Tunnel geöffnet. Ist der Authtoken gesetzt?");
}

async function main() {
  const url = await tunnelUrl();
  console.log(`\n  Tunnel:     ${url}\n  MCP-Server: ${url}/api/mcp\n`);

  const next = spawn("pnpm", ["dev"], {
    stdio: "inherit",
    // Process env wins over .env.local, so this run uses the tunnel as its public URL.
    env: { ...process.env, BETTER_AUTH_URL: url },
  });
  const stop = () => {
    next.kill();
    ngrok.kill();
  };
  process.on("SIGINT", stop);
  process.on("SIGTERM", stop);
  next.on("exit", (code) => {
    ngrok.kill();
    process.exit(code ?? 0);
  });
}

main().catch((error: Error) => {
  console.error(error.message);
  ngrok.kill();
  process.exit(1);
});
