ALTER TABLE "content"."builders_localized" DROP CONSTRAINT "builders_localized_builder_id_builders_resource_id_fk";
--> statement-breakpoint
ALTER TABLE "content"."builders_localized" DROP CONSTRAINT "builders_localized_builder_id_language_pk";--> statement-breakpoint
ALTER TABLE "content"."builders" DROP CONSTRAINT "builders_pkey";--> statement-breakpoint
ALTER TABLE "content"."builders" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "content"."builders" ALTER COLUMN "id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "content"."builders_localized" ADD CONSTRAINT "builders_localized_id_language_pk" PRIMARY KEY("id","language");--> statement-breakpoint
ALTER TABLE "content"."builders_localized" DROP COLUMN "builder_id";
