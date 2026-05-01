-- Add priority_level to ref_control_authorities
ALTER TABLE "ref_control_authorities" ADD COLUMN "priority_level" INTEGER NOT NULL DEFAULT 3;
CREATE INDEX "ref_control_authorities_priority_level_idx" ON "ref_control_authorities"("priority_level");

-- Add exception fields to rev_plan_year
ALTER TABLE "rev_plan_year" ADD COLUMN "is_exceptional" BOOLEAN DEFAULT false;
ALTER TABLE "rev_plan_year" ADD COLUMN "exceptional_reason" TEXT;
ALTER TABLE "rev_plan_year" ADD COLUMN "minister_order_ref" VARCHAR(100);
ALTER TABLE "rev_plan_year" ADD COLUMN "minister_order_date" DATE;
ALTER TABLE "rev_plan_year" ADD COLUMN "override_authority_id" INTEGER;

-- Create foreign key for override authority
ALTER TABLE "rev_plan_year" ADD CONSTRAINT "rev_plan_year_override_authority_fk" FOREIGN KEY ("override_authority_id") REFERENCES "ref_control_authorities"("authority_id") ON DELETE SET NULL;

-- Add indexes
CREATE INDEX "rev_plan_year_is_exceptional_idx" ON "rev_plan_year"("is_exceptional");
CREATE INDEX "rev_plan_year_override_authority_idx" ON "rev_plan_year"("override_authority_id");

-- Add control_authority_id to users
ALTER TABLE "users" ADD COLUMN "control_authority_id" INTEGER;
ALTER TABLE "users" ADD COLUMN "rls_authority_id" INTEGER;

-- Create foreign key
ALTER TABLE "users" ADD CONSTRAINT "users_control_authority_fk" FOREIGN KEY ("control_authority_id") REFERENCES "ref_control_authorities"("authority_id") ON DELETE SET NULL;

CREATE INDEX "users_control_authority_id_idx" ON "users"("control_authority_id");
CREATE INDEX "users_rls_authority_id_idx" ON "users"("rls_authority_id");

-- Initialize priority levels for existing control authorities (example seed data):
UPDATE "ref_control_authorities" SET "priority_level" = 1 WHERE "code" = 'КРУ МО РУ';
UPDATE "ref_control_authorities" SET "priority_level" = 2 WHERE "code" IN ('ГУБП ГШ ВС РУ', 'К ВПВО И ВВС', 'ГУВИР МО РУ');
