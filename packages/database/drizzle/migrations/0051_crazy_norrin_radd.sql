ALTER TABLE "content"."builders" ADD COLUMN "id" uuid;--> statement-breakpoint
ALTER TABLE "content"."builders_localized" ADD COLUMN "id" uuid;--> statement-breakpoint
ALTER TABLE "content"."builders" ADD CONSTRAINT "builders_id_unique" UNIQUE("id");
ALTER TABLE "content"."builders_localized" ADD CONSTRAINT "builders_localized_id_builders_id_fk" FOREIGN KEY ("id") REFERENCES "content"."builders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
