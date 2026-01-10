ALTER TABLE "kg-work-plan_verificationToken" RENAME TO "kg-work-plan_verification";--> statement-breakpoint
ALTER TABLE "kg-work-plan_account" RENAME COLUMN "providerAccountId" TO "accountId";--> statement-breakpoint
ALTER TABLE "kg-work-plan_account" RENAME COLUMN "provider" TO "providerId";--> statement-breakpoint
ALTER TABLE "kg-work-plan_account" RENAME COLUMN "access_token" TO "accessToken";--> statement-breakpoint
ALTER TABLE "kg-work-plan_account" RENAME COLUMN "refresh_token" TO "refreshToken";--> statement-breakpoint
-- Rename expires_at to accessTokenExpiresAt, but keep as integer for now
ALTER TABLE "kg-work-plan_account" RENAME COLUMN "expires_at" TO "accessTokenExpiresAt";--> statement-breakpoint
ALTER TABLE "kg-work-plan_account" RENAME COLUMN "id_token" TO "idToken";--> statement-breakpoint
ALTER TABLE "kg-work-plan_session" RENAME COLUMN "sessionToken" TO "token";--> statement-breakpoint
ALTER TABLE "kg-work-plan_session" RENAME COLUMN "expires" TO "expiresAt";--> statement-breakpoint
ALTER TABLE "kg-work-plan_verification" RENAME COLUMN "token" TO "value";--> statement-breakpoint
ALTER TABLE "kg-work-plan_verification" RENAME COLUMN "expires" TO "expiresAt";--> statement-breakpoint
-- Convert integer (Unix timestamp in seconds) to timestamp
ALTER TABLE "kg-work-plan_account" ALTER COLUMN "accessTokenExpiresAt" TYPE timestamp USING to_timestamp("accessTokenExpiresAt");--> statement-breakpoint
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'kg-work-plan_session'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "kg-work-plan_session" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
ALTER TABLE "kg-work-plan_user" ALTER COLUMN "email" SET NOT NULL;--> statement-breakpoint
-- Convert timestamp to boolean: NULL or past timestamp -> false, any timestamp -> true
ALTER TABLE "kg-work-plan_user" ALTER COLUMN "emailVerified" TYPE boolean USING (CASE WHEN "emailVerified" IS NOT NULL THEN true ELSE false END);--> statement-breakpoint
ALTER TABLE "kg-work-plan_user" ALTER COLUMN "emailVerified" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "kg-work-plan_user" ALTER COLUMN "emailVerified" SET NOT NULL;--> statement-breakpoint
-- Add id column as nullable first, populate with UUIDs, then make it NOT NULL and primary key
ALTER TABLE "kg-work-plan_account" ADD COLUMN "id" text;--> statement-breakpoint
UPDATE "kg-work-plan_account" SET "id" = gen_random_uuid()::text WHERE "id" IS NULL;--> statement-breakpoint
ALTER TABLE "kg-work-plan_account" ALTER COLUMN "id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "kg-work-plan_account" DROP CONSTRAINT "kg-work-plan_account_provider_providerAccountId_pk";--> statement-breakpoint
ALTER TABLE "kg-work-plan_account" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "kg-work-plan_account" ADD COLUMN "refreshTokenExpiresAt" timestamp;--> statement-breakpoint
ALTER TABLE "kg-work-plan_account" ADD COLUMN "password" text;--> statement-breakpoint
ALTER TABLE "kg-work-plan_account" ADD COLUMN "createdAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "kg-work-plan_account" ADD COLUMN "updatedAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
-- Add id column to session table (nullable first, then populate and make primary key)
ALTER TABLE "kg-work-plan_session" ADD COLUMN "id" text;--> statement-breakpoint
UPDATE "kg-work-plan_session" SET "id" = gen_random_uuid()::text WHERE "id" IS NULL;--> statement-breakpoint
ALTER TABLE "kg-work-plan_session" ALTER COLUMN "id" SET NOT NULL;--> statement-breakpoint
-- Need to drop old primary key constraint on session table first
DO $$ 
DECLARE 
    pk_name text;
BEGIN
    SELECT tc.constraint_name INTO pk_name
    FROM information_schema.table_constraints tc
    WHERE tc.table_schema = 'public'
        AND tc.table_name = 'kg-work-plan_session'
        AND tc.constraint_type = 'PRIMARY KEY'
    LIMIT 1;
    IF pk_name IS NOT NULL THEN
        EXECUTE 'ALTER TABLE "kg-work-plan_session" DROP CONSTRAINT ' || quote_ident(pk_name);
    END IF;
END $$;--> statement-breakpoint
ALTER TABLE "kg-work-plan_session" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "kg-work-plan_session" ADD COLUMN "ipAddress" text;--> statement-breakpoint
ALTER TABLE "kg-work-plan_session" ADD COLUMN "userAgent" text;--> statement-breakpoint
ALTER TABLE "kg-work-plan_session" ADD COLUMN "createdAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "kg-work-plan_session" ADD COLUMN "updatedAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "kg-work-plan_user" ADD COLUMN "createdAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "kg-work-plan_user" ADD COLUMN "updatedAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
-- Add id column to verification table (nullable first, then populate and make primary key)
ALTER TABLE "kg-work-plan_verification" ADD COLUMN "id" text;--> statement-breakpoint
UPDATE "kg-work-plan_verification" SET "id" = gen_random_uuid()::text WHERE "id" IS NULL;--> statement-breakpoint
ALTER TABLE "kg-work-plan_verification" ALTER COLUMN "id" SET NOT NULL;--> statement-breakpoint
-- Drop old primary key if it exists (verification table might have composite PK)
DO $$ 
DECLARE 
    pk_name text;
BEGIN
    SELECT tc.constraint_name INTO pk_name
    FROM information_schema.table_constraints tc
    WHERE tc.table_schema = 'public'
        AND tc.table_name = 'kg-work-plan_verification'
        AND tc.constraint_type = 'PRIMARY KEY'
    LIMIT 1;
    IF pk_name IS NOT NULL THEN
        EXECUTE 'ALTER TABLE "kg-work-plan_verification" DROP CONSTRAINT ' || quote_ident(pk_name);
    END IF;
END $$;--> statement-breakpoint
ALTER TABLE "kg-work-plan_verification" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "kg-work-plan_verification" ADD COLUMN "createdAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "kg-work-plan_verification" ADD COLUMN "updatedAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "kg-work-plan_account" DROP COLUMN IF EXISTS "type";--> statement-breakpoint
ALTER TABLE "kg-work-plan_account" DROP COLUMN IF EXISTS "token_type";--> statement-breakpoint
ALTER TABLE "kg-work-plan_account" DROP COLUMN IF EXISTS "session_state";--> statement-breakpoint
ALTER TABLE "kg-work-plan_session" ADD CONSTRAINT "kg-work-plan_session_token_unique" UNIQUE("token");