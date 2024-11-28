ALTER TABLE "users"."event_payment" ADD COLUMN "coupon_code" varchar(20);--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users"."event_payment" ADD CONSTRAINT "event_payment_coupon_code_coupon_code_code_fk" FOREIGN KEY ("coupon_code") REFERENCES "content"."coupon_code"("code") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
