CREATE TABLE IF NOT EXISTS "content"."youtube_channels" (
	"resource_id" integer PRIMARY KEY NOT NULL,
	"id" uuid NOT NULL,
	"language" varchar(10) NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"channel" text NOT NULL,
	"trailer" text NOT NULL,
	CONSTRAINT "youtube_channels_id_unique" UNIQUE("id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "content"."youtube_channels" ADD CONSTRAINT "youtube_channels_resource_id_resources_id_fk" FOREIGN KEY ("resource_id") REFERENCES "content"."resources"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
