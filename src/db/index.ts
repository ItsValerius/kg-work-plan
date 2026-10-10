import { neonConfig, Pool } from "@neondatabase/serverless";

// This is the only code that will be different in development
if (process.env.VERCEL_ENV === "development") {
  neonConfig.wsProxy = (host: string) => `${host}:54330/v1`;
  neonConfig.useSecureWebSocket = false;
  neonConfig.pipelineTLS = false;
  neonConfig.pipelineConnect = false;
}

import { drizzle } from "drizzle-orm/neon-serverless";
import * as schema from "./schema/index";

// The pool connects lazily on the first query, so builds don't need a database.
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL ?? process.env.DATABASE_URL,
});

const db = drizzle({ client: pool, schema });

export default db;
