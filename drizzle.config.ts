import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config();

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
    url: connectionUrl,
  },
  tablesFilter: ["kg-work-plan_*"],
};

export default config;