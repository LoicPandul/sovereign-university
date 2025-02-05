ALTER TABLE "content"."courses" ADD COLUMN "is_planb_school" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "content"."courses" ADD COLUMN "planb_school_markdown" varchar;