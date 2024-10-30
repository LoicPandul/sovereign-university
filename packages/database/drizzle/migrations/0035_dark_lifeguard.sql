ALTER TABLE "users"."accounts" ADD COLUMN "last_email_change_request" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "users"."accounts" ADD COLUMN "current_email_checked" boolean DEFAULT false NOT NULL;
UPDATE "users"."accounts" SET "current_email_checked" = true WHERE "email" IS NOT NULL;
