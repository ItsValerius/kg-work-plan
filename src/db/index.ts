import { neonConfig } from "@neondatabase/serverless";

// This is the only code that will be different in development
if (process.env.VERCEL_ENV === "development") {
  neonConfig.wsProxy = (host: string) => `${host}:54330/v1`;
  neonConfig.useSecureWebSocket = false;
  neonConfig.pipelineTLS = false;
  neonConfig.pipelineConnect = false;
}

import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";
import * as schema from "./schema/index";

const db = drizzle(sql, { schema });

export default db;
