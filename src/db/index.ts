import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";
import * as schema from "./schema/index";
const db = drizzle(sql, { schema });

export default db;
