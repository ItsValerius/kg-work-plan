import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Run as if on a device far from Berlin: date helpers must not depend on the local zone.
process.env.TZ = "America/New_York";

export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  test: { include: ["tests/**/*.test.ts"] },
});
