/**
 * Loads a realistic demo season into the local database. Safe to rerun: every
 * demo row has a "demo-" id and is replaced, real accounts are never touched.
 * Dates are relative to today, so the demo never goes stale.
 *
 *   pnpm db:seed
 */
import * as dotenv from "dotenv";
import { Client } from "pg";

dotenv.config({ path: ".env.local", quiet: true });
dotenv.config({ quiet: true });

const T = {
  user: '"kg-work-plan_user"',
  event: '"kg-work-plan_event"',
  shift: '"kg-work-plan_shift"',
  task: '"kg-work-plan_task"',
  participant: '"kg-work-plan_task_participants"',
};

/**
 * A wall-clock time in Berlin, `days` from today, as a UTC ISO string. The app stores
 * UTC in timestamp-without-time-zone columns; pg would serialize a Date in local time.
 */
function berlin(days: number, time: string): string {
  const [hour, minute] = time.split(":").map(Number);
  const day = new Date();
  day.setUTCDate(day.getUTCDate() + days);
  const guess = new Date(
    Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate(), hour, minute),
  );
  const berlinHour = Number(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Berlin",
      hour: "2-digit",
      hourCycle: "h23",
    }).format(guess),
  );
  return new Date(guess.getTime() - (berlinHour - hour) * 3_600_000).toISOString();
}

const helpers = [
  ["anna", "Anna Becker"],
  ["juergen", "Jürgen Hensen"],
  ["marlies", "Marlies Coenen"],
  ["tim", "Tim Schmitz"],
  ["heinz", "Heinz Jansen"],
  ["sabine", "Sabine Wolters"],
  ["peter", "Peter Dahmen"],
  ["lena", "Lena Küppers"],
  ["willi", "Willi Theißen"],
  ["gaby", "Gaby Mertens"],
  ["klaus", "Klaus Op de Hipt"],
  ["nicole", "Nicole Frenken"],
] as const;

type TaskSeed = {
  name: string;
  description?: string;
  at: string;
  need: number;
  helpers?: (string | [string, string, number])[];
};
type ShiftSeed = { name: string; from: string; to: string; tasks: TaskSeed[] };
type EventSeed = {
  key: string;
  name: string;
  description: string;
  days: number;
  from: string;
  to: string;
  shifts: ShiftSeed[];
};

// Helpers are listed by key; a tuple signs up a group: [key, group name, size].
const season: EventSeed[] = [
  {
    key: "hoppeditz",
    name: "Hoppeditzerwachen",
    description: "Sessionsauftakt in der Mehrzweckhalle Golkrath.",
    days: 12,
    from: "10:00",
    to: "19:00",
    shifts: [
      {
        name: "Aufbau",
        from: "08:00",
        to: "11:00",
        tasks: [
          {
            name: "Tische und Bänke stellen",
            description: "Treffpunkt am Hallentor",
            at: "08:00",
            need: 6,
            helpers: ["juergen", ["heinz", "Familie Jansen", 3]],
          },
          {
            name: "Getränke kühlen",
            description: "Kühlwagen befüllen",
            at: "08:30",
            need: 2,
            helpers: ["marlies", "tim"],
          },
          { name: "Deko aufhängen", at: "09:00", need: 3, helpers: ["gaby"] },
        ],
      },
      {
        name: "Ausschank",
        from: "11:00",
        to: "15:00",
        tasks: [
          { name: "Bierstand", at: "11:00", need: 4, helpers: ["anna", "sabine"] },
          {
            name: "Kuchentheke",
            description: "Kaffee und Kuchen verkaufen",
            at: "11:00",
            need: 3,
            helpers: ["peter"],
          },
          { name: "Kasse", at: "11:00", need: 2, helpers: ["nicole", "willi"] },
        ],
      },
      {
        name: "Abbau",
        from: "18:00",
        to: "20:00",
        tasks: [{ name: "Halle aufräumen", at: "18:00", need: 8 }],
      },
    ],
  },
  {
    key: "biwak",
    name: "Prinzenbiwak",
    description: "Biwak mit Kinderprogramm und Proklamation.",
    days: 45,
    from: "11:00",
    to: "20:00",
    shifts: [
      {
        name: "Theke",
        from: "10:00",
        to: "15:00",
        tasks: [
          { name: "Kasse", at: "10:00", need: 2, helpers: ["lena"] },
          {
            name: "Grillstand",
            description: "Würstchen und Pommes",
            at: "11:00",
            need: 3,
            helpers: [["klaus", "Kegelclub Alle Neune", 3]],
          },
        ],
      },
      {
        name: "Kinderprogramm",
        from: "13:00",
        to: "16:00",
        tasks: [{ name: "Kinderschminken", at: "13:00", need: 2 }],
      },
    ],
  },
  {
    key: "rosenmontag",
    name: "Rosenmontagszug",
    description: "",
    days: 88,
    from: "09:00",
    to: "19:00",
    shifts: [
      {
        name: "Zugbegleitung",
        from: "10:00",
        to: "15:00",
        tasks: [
          {
            name: "Wagenengel",
            description: "Begleitung neben dem Prinzenwagen",
            at: "10:00",
            need: 10,
            helpers: ["tim", "anna", "willi"],
          },
          {
            name: "Wurfmaterial verteilen",
            at: "09:30",
            need: 4,
            helpers: [["gaby", "Familie Mertens", 4]],
          },
        ],
      },
    ],
  },
  {
    key: "sommerfest",
    name: "Sommerfest",
    description: "Vereinsfest am Sportplatz.",
    days: -60,
    from: "12:00",
    to: "22:00",
    shifts: [
      {
        name: "Grill",
        from: "12:00",
        to: "16:00",
        tasks: [{ name: "Grillstand", at: "12:00", need: 2, helpers: ["peter", "klaus"] }],
      },
    ],
  },
];

async function main() {
  const connectionString = process.env.POSTGRES_URL ?? process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("POSTGRES_URL fehlt (siehe .env.example).");
    process.exit(1);
  }
  // Demo data must never land in a shared or production database.
  const host = new URL(connectionString).hostname;
  if (!["localhost", "127.0.0.1", "::1"].includes(host)) {
    console.error(`Seed läuft nur gegen eine lokale Datenbank, nicht gegen ${host}.`);
    process.exit(1);
  }

  const client = new Client({ connectionString });
  await client.connect();
  try {
    await client.query("begin");
    // Children first; demo events cascade to their shifts and tasks.
    await client.query(`delete from ${T.participant} where id like 'demo-%'`);
    await client.query(`delete from ${T.event} where id like 'demo-%'`);
    await client.query(`delete from ${T.user} where id like 'demo-%'`);

    await client.query(
      `insert into ${T.user} (id, name, email, "emailVerified") values ('demo-orga', 'Demo Organisation', 'orga@demo.example', true)`,
    );
    for (const [key, name] of helpers) {
      await client.query(
        `insert into ${T.user} (id, name, email, "emailVerified") values ($1, $2, $3, true)`,
        [`demo-${key}`, name, `${key}@demo.example`],
      );
    }

    let signups = 0;
    for (const event of season) {
      const eventId = `demo-${event.key}`;
      await client.query(
        `insert into ${T.event} (id, name, description, start_date, end_date, created_at, created_by_id) values ($1, $2, $3, $4, $5, now(), 'demo-orga')`,
        [
          eventId,
          event.name,
          event.description,
          berlin(event.days, event.from),
          berlin(event.days, event.to),
        ],
      );
      for (const [shiftIndex, shift] of event.shifts.entries()) {
        const shiftId = `${eventId}-s${shiftIndex}`;
        await client.query(
          `insert into ${T.shift} (id, event_id, name, start_time, end_time, created_by_id) values ($1, $2, $3, $4, $5, 'demo-orga')`,
          [
            shiftId,
            eventId,
            shift.name,
            berlin(event.days, shift.from),
            berlin(event.days, shift.to),
          ],
        );
        for (const [taskIndex, task] of shift.tasks.entries()) {
          const taskId = `${shiftId}-t${taskIndex}`;
          await client.query(
            `insert into ${T.task} (id, shift_id, name, description, required_participants, created_by_id, start_time) values ($1, $2, $3, $4, $5, 'demo-orga', $6)`,
            [
              taskId,
              shiftId,
              task.name,
              task.description ?? "",
              task.need,
              berlin(event.days, task.at),
            ],
          );
          for (const [helperIndex, helper] of (task.helpers ?? []).entries()) {
            const [key, groupName, groupSize] =
              typeof helper === "string" ? [helper, null, 1] : helper;
            await client.query(
              `insert into ${T.participant} (id, task_id, user_id, group_name, group_size, created_by_id, created_at)
               values ($1, $2, $3, $4, $5, $3, now() - make_interval(hours => $6))`,
              [
                `demo-${taskId}-p${helperIndex}`,
                taskId,
                `demo-${key}`,
                groupName,
                groupSize,
                48 - helperIndex,
              ],
            );
            signups++;
          }
        }
      }
    }
    await client.query("commit");
    console.log(
      `Demo-Saison geladen: ${season.length} Veranstaltungen, ${helpers.length} Helfer, ${signups} Anmeldungen.`,
    );
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error("Fehlgeschlagen:", error instanceof Error ? error.message : error);
  process.exit(1);
});
