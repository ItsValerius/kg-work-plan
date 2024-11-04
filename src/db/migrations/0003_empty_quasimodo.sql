ALTER TABLE "kg-work-plan_task_participants" RENAME COLUMN "added_by_id" TO "created_by_id";--> statement-breakpoint
ALTER TABLE "kg-work-plan_task" RENAME COLUMN "added_by_id" TO "created_by_id";--> statement-breakpoint
ALTER TABLE "kg-work-plan_task_participants" DROP CONSTRAINT "kg-work-plan_task_participants_added_by_id_kg-work-plan_user_id_fk";
--> statement-breakpoint
ALTER TABLE "kg-work-plan_task" DROP CONSTRAINT "kg-work-plan_task_added_by_id_kg-work-plan_user_id_fk";
--> statement-breakpoint
ALTER TABLE "kg-work-plan_event" ALTER COLUMN "description" SET NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "kg-work-plan_task_participants" ADD CONSTRAINT "kg-work-plan_task_participants_created_by_id_kg-work-plan_user_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."kg-work-plan_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "kg-work-plan_task" ADD CONSTRAINT "kg-work-plan_task_created_by_id_kg-work-plan_user_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."kg-work-plan_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
