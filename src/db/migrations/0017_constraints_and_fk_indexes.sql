CREATE INDEX "task_participants_user_id_idx" ON "kg-work-plan_task_participants" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "task_shift_id_idx" ON "kg-work-plan_task" USING btree ("shift_id");--> statement-breakpoint
CREATE INDEX "shift_event_id_idx" ON "kg-work-plan_shift" USING btree ("event_id");--> statement-breakpoint
ALTER TABLE "kg-work-plan_task_participants" ADD CONSTRAINT "task_participants_group_size_positive" CHECK ("kg-work-plan_task_participants"."group_size" >= 1);--> statement-breakpoint
ALTER TABLE "kg-work-plan_task" ADD CONSTRAINT "task_required_participants_positive" CHECK ("kg-work-plan_task"."required_participants" >= 1);--> statement-breakpoint
ALTER TABLE "kg-work-plan_shift" ADD CONSTRAINT "shift_ends_after_start" CHECK ("kg-work-plan_shift"."end_time" > "kg-work-plan_shift"."start_time");