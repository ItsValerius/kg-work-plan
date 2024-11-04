import { sql } from "drizzle-orm";
import { pgTableCreator } from "drizzle-orm/pg-core";
import db from ".";
import { events, shifts, taskParticipants, tasks } from "./schema";

export const pgTable = pgTableCreator((name) => `kg-work-plan_${name}`);
