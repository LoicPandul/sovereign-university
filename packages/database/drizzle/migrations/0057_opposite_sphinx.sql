ALTER TABLE "content"."tutorials" ALTER COLUMN "logo_url" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "content"."courses" ADD COLUMN "published_at" timestamp;