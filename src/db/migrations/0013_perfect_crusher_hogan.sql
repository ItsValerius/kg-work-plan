CREATE TABLE "kg-work-plan_rate_limit" (
	"id" text PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"count" integer NOT NULL,
	"lastRequest" bigint NOT NULL,
	CONSTRAINT "kg-work-plan_rate_limit_key_unique" UNIQUE("key")
);
