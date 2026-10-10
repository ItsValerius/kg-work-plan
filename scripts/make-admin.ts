/**
 * Gives an email address the admin role in the local database, creating the
 * account if it doesn't exist yet (the magic link then signs into it).
 *
 *   pnpm make-admin you@example.com
 */
import * as dotenv from "dotenv";
import { Client } from "pg";

dotenv.config({ path: ".env.local", quiet: true });
dotenv.config({ quiet: true });

async function main() {
  const email = process.argv[2]?.trim().toLowerCase();
  if (!email || !email.includes("@")) {
    console.error("Bitte eine E-Mail-Adresse angeben: pnpm make-admin du@example.com");
    process.exit(1);
  }

  const connectionString = process.env.POSTGRES_URL ?? process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("POSTGRES_URL fehlt (siehe .env.example).");
    process.exit(1);
  }

  const client = new Client({ connectionString });
  await client.connect();
  try {
    const result = await client.query(
      `insert into "kg-work-plan_user" (id, email, role, "emailVerified")
       values ($1, $2, 'admin', true)
       on conflict (email) do update set role = 'admin', "updatedAt" = now()
       returning (xmax = 0) as created`,
      [crypto.randomUUID(), email],
    );
    console.log(
      result.rows[0].created
        ? `${email} angelegt und zum Admin gemacht. Jetzt unter /anmelden mit dieser Adresse anmelden.`
        : `${email} ist jetzt Admin.`,
    );
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error("Fehlgeschlagen:", error instanceof Error ? error.message : error);
  process.exit(1);
});
