import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
// Local setup keeps its URL in .env.local (like scripts/make-admin.ts); CI and Vercel set it directly.
dotenv.config({ path: ".env.local", quiet: true });
dotenv.config({ quiet: true });

// Use connection URL in production, otherwise use individual env vars

const connectionUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
if (!connectionUrl) {
  throw new Error("POSTGRES_URL or DATABASE_URL is required");
}

const config: Config = {
  schema: "src/db/schema",
  out: "src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    // pg already treats Neon's sslmode=require as verify-full and warns about it on every
    // migrate; naming the mode it uses keeps the same checks without the warning.
    url: connectionUrl.replace("sslmode=require", "sslmode=verify-full"),
  },
  tablesFilter: ["kg-work-plan_*"],
};

export default config;
