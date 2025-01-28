ALTER TABLE "content"."courses" ADD COLUMN "is_archived" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "content"."courses" ADD COLUMN "payment_expiration_date" timestamp;