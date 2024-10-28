CREATE TABLE IF NOT EXISTS "kg-work-plan_event" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kg-work-plan_account" (
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "kg-work-plan_account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kg-work-plan_authenticator" (
	"credentialID" text NOT NULL,
	"userId" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"credentialPublicKey" text NOT NULL,
	"counter" integer NOT NULL,
	"credentialDeviceType" text NOT NULL,
	"credentialBackedUp" boolean NOT NULL,
	"transports" text,
	CONSTRAINT "kg-work-plan_authenticator_userId_credentialID_pk" PRIMARY KEY("userId","credentialID"),
	CONSTRAINT "kg-work-plan_authenticator_credentialID_unique" UNIQUE("credentialID")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kg-work-plan_session" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kg-work-plan_user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text,
	"role" text,
	"emailVerified" timestamp,
	"image" text,
	CONSTRAINT "kg-work-plan_user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kg-work-plan_verificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "kg-work-plan_verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kg-work-plan_task_participants" (
	"id" text PRIMARY KEY NOT NULL,
	"task_id" text NOT NULL,
	"user_id" text,
	"group_name" text,
	"group_size" integer DEFAULT 1 NOT NULL,
	"added_at" timestamp DEFAULT now() NOT NULL,
	"added_by_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kg-work-plan_task" (
	"id" text PRIMARY KEY NOT NULL,
	"event_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"required_participants" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"added_by_id" text NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "kg-work-plan_event" ADD CONSTRAINT "kg-work-plan_event_created_by_id_kg-work-plan_user_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."kg-work-plan_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "kg-work-plan_account" ADD CONSTRAINT "kg-work-plan_account_userId_kg-work-plan_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."kg-work-plan_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "kg-work-plan_authenticator" ADD CONSTRAINT "kg-work-plan_authenticator_userId_kg-work-plan_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."kg-work-plan_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "kg-work-plan_session" ADD CONSTRAINT "kg-work-plan_session_userId_kg-work-plan_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."kg-work-plan_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "kg-work-plan_task_participants" ADD CONSTRAINT "kg-work-plan_task_participants_task_id_kg-work-plan_task_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."kg-work-plan_task"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "kg-work-plan_task_participants" ADD CONSTRAINT "kg-work-plan_task_participants_user_id_kg-work-plan_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."kg-work-plan_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "kg-work-plan_task_participants" ADD CONSTRAINT "kg-work-plan_task_participants_added_by_id_kg-work-plan_user_id_fk" FOREIGN KEY ("added_by_id") REFERENCES "public"."kg-work-plan_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "kg-work-plan_task" ADD CONSTRAINT "kg-work-plan_task_event_id_kg-work-plan_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."kg-work-plan_event"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "kg-work-plan_task" ADD CONSTRAINT "kg-work-plan_task_added_by_id_kg-work-plan_user_id_fk" FOREIGN KEY ("added_by_id") REFERENCES "public"."kg-work-plan_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
