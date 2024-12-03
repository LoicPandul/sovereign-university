UPDATE content.tutorials SET NAME = 'pbn-certificate-timestamping' where name = 'bcert-verification';
ALTER TABLE "content"."courses" RENAME COLUMN "paid_start_date" TO "start_date";--> statement-breakpoint
ALTER TABLE "content"."courses" RENAME COLUMN "paid_end_date" TO "end_date";
