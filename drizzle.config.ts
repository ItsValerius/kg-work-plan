import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config();

// Use connection URL in production, otherwise use individual env vars
const isProd = process.env.NODE_ENV === "production";

const dbCredentials = isProd
  ? (() => {
      const connectionUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
      if (!connectionUrl) {
        throw new Error("POSTGRES_URL or DATABASE_URL is required in production");
      }
      return { url: connectionUrl };
    })()
  : {
      host: process.env.POSTGRES_HOST || "localhost",
      port: Number.parseInt(process.env.POSTGRES_PORT || "54320", 10),
      user: process.env.POSTGRES_USER || "postgres",
      password: process.env.POSTGRES_PASSWORD || "postgres",
      database: process.env.POSTGRES_DB || "kg_work_plan_dev",
      ssl: process.env.POSTGRES_SSL === "true",
    };

const config: Config = {
  schema: "src/db/schema",
  out: "src/db/migrations",
  dialect: "postgresql",
  dbCredentials,
  tablesFilter: ["kg-work-plan_*"],
};

export default config;