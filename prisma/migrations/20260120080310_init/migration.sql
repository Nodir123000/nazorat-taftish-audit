-- CreateTable
CREATE TABLE "users" (
    "user_id" SERIAL NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "fullname" VARCHAR(255) NOT NULL,
    "rank" VARCHAR(100),
    "position" VARCHAR(255),
    "role" VARCHAR(50) NOT NULL DEFAULT 'inspector',
    "email" VARCHAR(255),
    "phone" VARCHAR(50),
    "unit_id" INTEGER,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "specialization" VARCHAR(255),

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "ref_units" (
    "unit_id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "unit_code" VARCHAR(50),
    "subordination" VARCHAR(255),
    "location" VARCHAR(255),
    "commander_name" VARCHAR(255),
    "commander_rank" VARCHAR(100),
    "unit_type" VARCHAR(100),
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "name_uz_latn" VARCHAR(255),
    "name_uz_cyrl" VARCHAR(255),
    "location_uz_latn" VARCHAR(255),
    "location_uz_cyrl" VARCHAR(255),
    "territory_id" INTEGER,

    CONSTRAINT "ref_units_pkey" PRIMARY KEY ("unit_id")
);

-- CreateTable
CREATE TABLE "ref_ranks" (
    "rank_id" SERIAL NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "category" VARCHAR(50),
    "level" INTEGER,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "name_uz_latn" VARCHAR(100),
    "name_uz_cyrl" VARCHAR(100),

    CONSTRAINT "ref_ranks_pkey" PRIMARY KEY ("rank_id")
);

-- CreateTable
CREATE TABLE "ref_violations" (
    "viol_type_id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "code" VARCHAR(50),
    "category" VARCHAR(100),
    "severity" VARCHAR(50),
    "description" TEXT,
    "legal_basis" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "name_uz_latn" VARCHAR(255),
    "name_uz_cyrl" VARCHAR(255),

    CONSTRAINT "ref_violations_pkey" PRIMARY KEY ("viol_type_id")
);

-- CreateTable
CREATE TABLE "ref_budget_articles" (
    "article_id" SERIAL NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "parent_article_id" INTEGER,
    "description" TEXT,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "name_uz_latn" VARCHAR(255),
    "name_uz_cyrl" VARCHAR(255),

    CONSTRAINT "ref_budget_articles_pkey" PRIMARY KEY ("article_id")
);

-- CreateTable
CREATE TABLE "ref_districts" (
    "district_id" SERIAL NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "name_uz_latn" VARCHAR(255),
    "name_uz_cyrl" VARCHAR(255),
    "short_name" VARCHAR(100),
    "headquarters" VARCHAR(255),
    "status" VARCHAR(50) DEFAULT 'active',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ref_districts_pkey" PRIMARY KEY ("district_id")
);

-- CreateTable
CREATE TABLE "ref_control_directions" (
    "direction_id" SERIAL NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "name_uz_latn" VARCHAR(255),
    "name_uz_cyrl" VARCHAR(255),
    "description" TEXT,
    "status" VARCHAR(50) DEFAULT 'active',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ref_control_directions_pkey" PRIMARY KEY ("direction_id")
);

-- CreateTable
CREATE TABLE "ref_control_authorities" (
    "authority_id" SERIAL NOT NULL,
    "code" VARCHAR(100) NOT NULL,
    "name" VARCHAR(500) NOT NULL,
    "name_uz_latn" VARCHAR(500),
    "name_uz_cyrl" VARCHAR(500),
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ref_control_authorities_pkey" PRIMARY KEY ("authority_id")
);

-- CreateTable
CREATE TABLE "ref_territories" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "name_uz_latn" VARCHAR(255),
    "name_uz_cyrl" VARCHAR(255),
    "type" VARCHAR(50) NOT NULL,
    "parent_id" INTEGER,
    "status" VARCHAR(20) DEFAULT 'active',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ref_territories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ref_classifiers" (
    "id" SERIAL NOT NULL,
    "type" VARCHAR(100) NOT NULL,
    "code" VARCHAR(50),
    "name_ru" VARCHAR(500) NOT NULL,
    "name_uz_latn" VARCHAR(500),
    "name_uz_cyrl" VARCHAR(500),
    "parent_id" INTEGER,
    "sort_order" INTEGER DEFAULT 0,
    "metadata" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ref_classifiers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rev_plan_year" (
    "plan_id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "plan_number" VARCHAR(50),
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "unit_id" INTEGER,
    "responsible_id" INTEGER,
    "status" VARCHAR(50) DEFAULT 'draft',
    "description" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "approval_date" DATE,
    "approved_by_id" INTEGER,
    "completed_count" INTEGER DEFAULT 0,
    "period_type" VARCHAR(50) NOT NULL DEFAULT 'annual',
    "planned_count" INTEGER DEFAULT 0,

    CONSTRAINT "rev_plan_year_pkey" PRIMARY KEY ("plan_id")
);

-- CreateTable
CREATE TABLE "audit_log" (
    "log_id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "action" VARCHAR(255) NOT NULL,
    "table_name" VARCHAR(100),
    "record_id" INTEGER,
    "old_value" TEXT,
    "new_value" TEXT,
    "ip_address" VARCHAR(50),
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_log_pkey" PRIMARY KEY ("log_id")
);

-- CreateTable
CREATE TABLE "quarterly_plans" (
    "id" SERIAL NOT NULL,
    "annual_plan_id" INTEGER NOT NULL,
    "quarter" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "status" VARCHAR(50) NOT NULL DEFAULT 'draft',
    "planned_audits" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quarterly_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "monthly_plans" (
    "id" SERIAL NOT NULL,
    "quarterly_plan_id" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "status" VARCHAR(50) NOT NULL DEFAULT 'draft',
    "planned_audits" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "monthly_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audits" (
    "id" SERIAL NOT NULL,
    "monthly_plan_id" INTEGER,
    "order_id" INTEGER,
    "audit_number" VARCHAR(50) NOT NULL,
    "audit_type" VARCHAR(100) NOT NULL,
    "unit_id" INTEGER NOT NULL,
    "unit_name" VARCHAR(255),
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "status" VARCHAR(50) NOT NULL DEFAULT 'planned',
    "lead_auditor_id" INTEGER,
    "team_size" INTEGER DEFAULT 1,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" SERIAL NOT NULL,
    "order_number" VARCHAR(50) NOT NULL,
    "order_date" DATE NOT NULL,
    "issuer_id" INTEGER NOT NULL,
    "plan_id" INTEGER,
    "unit_id" INTEGER,
    "order_type" VARCHAR(50),
    "status" VARCHAR(50) NOT NULL DEFAULT 'issued',
    "order_text" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commission_members" (
    "id" SERIAL NOT NULL,
    "audit_id" INTEGER NOT NULL,
    "order_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "role" VARCHAR(50) NOT NULL,
    "is_responsible" BOOLEAN DEFAULT false,
    "assigned_from" DATE,
    "assigned_to" DATE,

    CONSTRAINT "commission_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_reports" (
    "id" SERIAL NOT NULL,
    "audit_id" INTEGER NOT NULL,
    "report_number" VARCHAR(50),
    "report_date" DATE NOT NULL,
    "summary" TEXT,
    "status" VARCHAR(50) NOT NULL,
    "findings_count" INTEGER DEFAULT 0,
    "violations_count" INTEGER DEFAULT 0,
    "total_amount" DECIMAL(18,2),
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "findings" (
    "id" SERIAL NOT NULL,
    "report_id" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "severity" VARCHAR(50) NOT NULL,
    "responsible_unit_id" INTEGER,
    "due_date" DATE,
    "status" VARCHAR(50) NOT NULL DEFAULT 'open',
    "closure_date" DATE,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "findings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "violations" (
    "id" SERIAL NOT NULL,
    "audit_id" INTEGER NOT NULL,
    "violation_number" VARCHAR(50) NOT NULL,
    "category" VARCHAR(100) NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DECIMAL(18,2),
    "severity" VARCHAR(50) NOT NULL,
    "status" VARCHAR(50) NOT NULL,
    "responsible_person" VARCHAR(255),
    "unit_id" INTEGER,
    "detected_date" DATE NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "violations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "decisions" (
    "id" SERIAL NOT NULL,
    "violation_id" INTEGER NOT NULL,
    "decision_number" VARCHAR(50) NOT NULL,
    "decision_type" VARCHAR(100) NOT NULL,
    "description" TEXT NOT NULL,
    "responsible_executor" VARCHAR(255),
    "deadline" DATE,
    "status" VARCHAR(50) NOT NULL,
    "issued_date" DATE,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "decisions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" SERIAL NOT NULL,
    "file_name" VARCHAR(255) NOT NULL,
    "file_type" VARCHAR(100) NOT NULL,
    "storage_path" VARCHAR(500) NOT NULL,
    "file_size" INTEGER,
    "description" TEXT,
    "uploaded_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "entity_type" VARCHAR(50),
    "entity_id" INTEGER,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plan_change_log" (
    "id" SERIAL NOT NULL,
    "plan_id" INTEGER NOT NULL,
    "change_type" VARCHAR(50) NOT NULL,
    "description" TEXT NOT NULL,
    "changed_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "plan_change_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "personnel" (
    "id" SERIAL NOT NULL,
    "photo" TEXT,
    "deployment_city" TEXT,
    "deployment_region" TEXT,
    "pin" TEXT,
    "source" TEXT,
    "license_count" TEXT,
    "military_rank" TEXT,
    "military_unit" TEXT,
    "military_district" TEXT,
    "rank" TEXT,
    "passport_number" TEXT,
    "date_of_birth" TEXT,
    "full_name" TEXT,
    "first_name" TEXT,
    "last_name" TEXT,
    "patronymic" TEXT,
    "position" TEXT,
    "department" TEXT,
    "citizenship" TEXT,
    "place_of_birth" TEXT,
    "registration_address" TEXT,
    "actual_address" TEXT,
    "marital_status" TEXT,
    "gender" TEXT,
    "nationality" TEXT,
    "passport_series" TEXT,
    "passport_issue_date" TEXT,
    "passport_expiry_date" TEXT,
    "passport_issued_by" TEXT,
    "military_id" TEXT,
    "military_id_issue_date" TEXT,
    "military_id_expiry_date" TEXT,
    "service_number" TEXT,
    "service_start_date" TEXT,
    "specialization" TEXT,
    "clearance_level" TEXT,
    "contact_phone" TEXT,
    "email" TEXT,
    "emergency_contact" TEXT,
    "emergency_phone" TEXT,
    "directive_number" TEXT,
    "directive_date" TEXT,
    "deployment_location" TEXT,
    "phone" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "personnel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "ref_units_unit_code_key" ON "ref_units"("unit_code");

-- CreateIndex
CREATE UNIQUE INDEX "ref_violations_code_key" ON "ref_violations"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ref_budget_articles_code_key" ON "ref_budget_articles"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ref_districts_code_key" ON "ref_districts"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ref_control_directions_code_key" ON "ref_control_directions"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ref_control_authorities_code_key" ON "ref_control_authorities"("code");

-- CreateIndex
CREATE UNIQUE INDEX "type_code_idx" ON "ref_classifiers"("type", "code");

-- CreateIndex
CREATE UNIQUE INDEX "orders_order_number_key" ON "orders"("order_number");

-- CreateIndex
CREATE UNIQUE INDEX "personnel_pin_key" ON "personnel"("pin");

-- AddForeignKey
ALTER TABLE "ref_units" ADD CONSTRAINT "ref_units_territory_id_fkey" FOREIGN KEY ("territory_id") REFERENCES "ref_territories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rev_plan_year" ADD CONSTRAINT "rev_plan_year_approved_by_id_fkey" FOREIGN KEY ("approved_by_id") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rev_plan_year" ADD CONSTRAINT "rev_plan_year_responsible_id_fkey" FOREIGN KEY ("responsible_id") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rev_plan_year" ADD CONSTRAINT "rev_plan_year_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "ref_units"("unit_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quarterly_plans" ADD CONSTRAINT "quarterly_plans_annual_plan_id_fkey" FOREIGN KEY ("annual_plan_id") REFERENCES "rev_plan_year"("plan_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monthly_plans" ADD CONSTRAINT "monthly_plans_quarterly_plan_id_fkey" FOREIGN KEY ("quarterly_plan_id") REFERENCES "quarterly_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audits" ADD CONSTRAINT "audits_lead_auditor_id_fkey" FOREIGN KEY ("lead_auditor_id") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audits" ADD CONSTRAINT "audits_monthly_plan_id_fkey" FOREIGN KEY ("monthly_plan_id") REFERENCES "monthly_plans"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audits" ADD CONSTRAINT "audits_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audits" ADD CONSTRAINT "audits_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "ref_units"("unit_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_issuer_id_fkey" FOREIGN KEY ("issuer_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "rev_plan_year"("plan_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "ref_units"("unit_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commission_members" ADD CONSTRAINT "commission_members_audit_id_fkey" FOREIGN KEY ("audit_id") REFERENCES "audits"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commission_members" ADD CONSTRAINT "commission_members_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commission_members" ADD CONSTRAINT "commission_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_reports" ADD CONSTRAINT "audit_reports_audit_id_fkey" FOREIGN KEY ("audit_id") REFERENCES "audits"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "findings" ADD CONSTRAINT "findings_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "audit_reports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "findings" ADD CONSTRAINT "findings_responsible_unit_id_fkey" FOREIGN KEY ("responsible_unit_id") REFERENCES "ref_units"("unit_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "violations" ADD CONSTRAINT "violations_audit_id_fkey" FOREIGN KEY ("audit_id") REFERENCES "audits"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "violations" ADD CONSTRAINT "violations_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "ref_units"("unit_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "decisions" ADD CONSTRAINT "decisions_violation_id_fkey" FOREIGN KEY ("violation_id") REFERENCES "violations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plan_change_log" ADD CONSTRAINT "plan_change_log_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "rev_plan_year"("plan_id") ON DELETE RESTRICT ON UPDATE CASCADE;
