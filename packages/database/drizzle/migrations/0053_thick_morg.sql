ALTER TABLE "content"."builders_localized" ALTER COLUMN "id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "content"."bet" ADD COLUMN "project_id" uuid;--> statement-breakpoint
ALTER TABLE "content"."conferences" ADD COLUMN "project_id" uuid;--> statement-breakpoint
ALTER TABLE "content"."events" ADD COLUMN "project_id" uuid;--> statement-breakpoint
ALTER TABLE "content"."tutorials" ADD COLUMN "project_id" uuid;--> statement-breakpoint
ALTER TABLE "content"."bet" ADD CONSTRAINT "bet_project_id_builders_id_fk" FOREIGN KEY ("project_id") REFERENCES "content"."builders"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content"."conferences" ADD CONSTRAINT "conferences_project_id_builders_id_fk" FOREIGN KEY ("project_id") REFERENCES "content"."builders"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content"."events" ADD CONSTRAINT "events_project_id_builders_id_fk" FOREIGN KEY ("project_id") REFERENCES "content"."builders"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content"."tutorials" ADD CONSTRAINT "tutorials_project_id_builders_id_fk" FOREIGN KEY ("project_id") REFERENCES "content"."builders"("id") ON DELETE set null ON UPDATE no action;