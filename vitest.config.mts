import { fileURLToPath } from "node:url";
import { configDefaults, defineConfig } from "vitest/config";

// Run as if on a device far from Berlin: date helpers must not depend on the local zone.
process.env.TZ = "America/New_York";

export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          include: ["tests/**/*.test.ts"],
          exclude: [...configDefaults.exclude, "tests/db/**"],
        },
      },
      // Needs the docker-compose database and wsproxy (or the CI services).
      { extends: true, test: { name: "db", include: ["tests/db/**/*.test.ts"] } },
    ],
  },
});
