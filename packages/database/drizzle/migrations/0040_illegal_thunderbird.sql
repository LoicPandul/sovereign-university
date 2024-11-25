CREATE TYPE "public"."course_payment_method" AS ENUM('sbp', 'stripe', 'free');--> statement-breakpoint
ALTER TABLE "users"."course_payment" ADD COLUMN "method" "course_payment_method";
UPDATE "users"."course_payment" SET method = 'sbp';
ALTER TABLE "users"."course_payment" ALTER COLUMN "method" SET NOT NULL;
ALTER TABLE "users"."course_payment" ADD COLUMN "stripe_payment_intent" varchar(255);
ALTER TABLE "users"."course_payment" ADD COLUMN "stripe_invoice_id" varchar(255);
