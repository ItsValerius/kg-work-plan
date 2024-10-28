CREATE TABLE IF NOT EXISTS "kg-work-plan_shift" (
	"id" text PRIMARY KEY NOT NULL,
	"event_id" text NOT NULL,
	"name" text NOT NULL,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by_id" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "kg-work-plan_task" RENAME COLUMN "event_id" TO "shift_id";--> statement-breakpoint
ALTER TABLE "kg-work-plan_task" DROP CONSTRAINT "kg-work-plan_task_event_id_kg-work-plan_event_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "kg-work-plan_shift" ADD CONSTRAINT "kg-work-plan_shift_event_id_kg-work-plan_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."kg-work-plan_event"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "kg-work-plan_shift" ADD CONSTRAINT "kg-work-plan_shift_created_by_id_kg-work-plan_user_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."kg-work-plan_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "kg-work-plan_task" ADD CONSTRAINT "kg-work-plan_task_shift_id_kg-work-plan_shift_id_fk" FOREIGN KEY ("shift_id") REFERENCES "public"."kg-work-plan_shift"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "kg-work-plan_event" DROP COLUMN IF EXISTS "slug";--> statement-breakpoint
ALTER TABLE "kg-work-plan_task" DROP COLUMN IF EXISTS "slug";