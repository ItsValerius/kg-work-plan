import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config();
if (!process.env.POSTGRES_URL) {
  throw new Error("DATABASE_URL is missing");
}

export default {
  schema: "src/db/schema",
  out: "src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.POSTGRES_URL,
  },
  tablesFilter: ["kg-work-plan_*"],
} satisfies Config;
