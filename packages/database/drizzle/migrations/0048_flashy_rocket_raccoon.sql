CREATE TABLE IF NOT EXISTS "content"."movies" (
	"resource_id" integer PRIMARY KEY NOT NULL,
	"id" uuid NOT NULL,
	"language" varchar(10) NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"duration" integer,
	"publication_year" integer,
	"author" text NOT NULL,
	"platform" text NOT NULL,
	"trailer" text NOT NULL,
	CONSTRAINT "movies_id_unique" UNIQUE("id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "content"."movies" ADD CONSTRAINT "movies_resource_id_resources_id_fk" FOREIGN KEY ("resource_id") REFERENCES "content"."resources"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
