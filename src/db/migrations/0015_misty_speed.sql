ALTER TABLE "kg-work-plan_event" DROP CONSTRAINT "kg-work-plan_event_created_by_id_kg-work-plan_user_id_fk";
--> statement-breakpoint
ALTER TABLE "kg-work-plan_task_participants" DROP CONSTRAINT "kg-work-plan_task_participants_created_by_id_kg-work-plan_user_id_fk";
--> statement-breakpoint
ALTER TABLE "kg-work-plan_task" DROP CONSTRAINT "kg-work-plan_task_created_by_id_kg-work-plan_user_id_fk";
--> statement-breakpoint
ALTER TABLE "kg-work-plan_shift" DROP CONSTRAINT "kg-work-plan_shift_created_by_id_kg-work-plan_user_id_fk";
--> statement-breakpoint
ALTER TABLE "kg-work-plan_event" ALTER COLUMN "created_by_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "kg-work-plan_task_participants" ALTER COLUMN "created_by_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "kg-work-plan_task" ALTER COLUMN "created_by_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "kg-work-plan_shift" ALTER COLUMN "created_by_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "kg-work-plan_event" ADD CONSTRAINT "kg-work-plan_event_created_by_id_kg-work-plan_user_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."kg-work-plan_user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kg-work-plan_task_participants" ADD CONSTRAINT "kg-work-plan_task_participants_created_by_id_kg-work-plan_user_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."kg-work-plan_user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kg-work-plan_task" ADD CONSTRAINT "kg-work-plan_task_created_by_id_kg-work-plan_user_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."kg-work-plan_user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kg-work-plan_shift" ADD CONSTRAINT "kg-work-plan_shift_created_by_id_kg-work-plan_user_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."kg-work-plan_user"("id") ON DELETE set null ON UPDATE no action;