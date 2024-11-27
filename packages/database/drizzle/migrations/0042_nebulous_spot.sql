ALTER TABLE "users"."event_payment" ADD COLUMN "method" "course_payment_method";
UPDATE "users"."event_payment" SET method = 'sbp';
ALTER TABLE "users"."event_payment" ALTER COLUMN "method" SET NOT NULL;
ALTER TABLE "users"."event_payment" ADD COLUMN "stripe_invoice_id" varchar(255);--> statement-breakpoint
ALTER TABLE "users"."event_payment" ADD COLUMN "stripe_payment_intent" varchar(255);--> statement-breakpoint
