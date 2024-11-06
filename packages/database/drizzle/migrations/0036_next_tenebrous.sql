CREATE TABLE IF NOT EXISTS "users"."b_certificate_timestamps" (
	"uid" uuid NOT NULL,
	"b_certificate_exam" uuid NOT NULL,
	"pdf_key" varchar(255),
	"img_key" varchar(255),
	"txt_key" varchar(255),
	"txt_ots_key" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"last_sync" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "b_certificate_timestamps_uid_b_certificate_exam_pk" PRIMARY KEY("uid","b_certificate_exam")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users"."b_certificate_timestamps" ADD CONSTRAINT "b_certificate_timestamps_uid_accounts_uid_fk" FOREIGN KEY ("uid") REFERENCES "users"."accounts"("uid") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users"."b_certificate_timestamps" ADD CONSTRAINT "b_certificate_timestamps_b_certificate_exam_b_certificate_exam_id_fk" FOREIGN KEY ("b_certificate_exam") REFERENCES "content"."b_certificate_exam"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
