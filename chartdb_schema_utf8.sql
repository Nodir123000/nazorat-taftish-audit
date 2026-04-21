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
CREATE TABLE "commission_members" (
    "id" SERIAL NOT NULL,
    "audit_id" INTEGER,
    "order_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "role" VARCHAR(50) NOT NULL,
    "is_responsible" BOOLEAN DEFAULT false,
    "assigned_from" DATE,
    "assigned_to" DATE,

    CONSTRAINT "commission_members_pkey" PRIMARY KEY ("id")
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
    "template_id" VARCHAR(50),

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "personnel" (
    "id" SERIAL NOT NULL,
    "physical_person_id" INTEGER NOT NULL,
    "service_number" VARCHAR(50),
    "pnr" VARCHAR(50),
    "rank_id" INTEGER,
    "unit_id" INTEGER,
    "position_id" INTEGER,
    "vus_id" INTEGER,
    "category_id" INTEGER,
    "status" VARCHAR(50) DEFAULT 'active',
    "service_start_date" DATE,
    "service_end_date" DATE,
    "clearance_level" VARCHAR(50),
    "emergency_contact" VARCHAR(255),
    "emergency_phone" VARCHAR(50),
    "full_name" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "personnel_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "ref_areas" (
    "id" SERIAL NOT NULL,
    "region_id" INTEGER NOT NULL,
    "code" VARCHAR(50),
    "name" JSONB NOT NULL,
    "type" VARCHAR(50),
    "status" VARCHAR(20) DEFAULT 'active',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ref_areas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ref_audit_objects" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50),
    "name" JSONB NOT NULL,
    "status" VARCHAR(20) DEFAULT 'active',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ref_audit_objects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ref_award_penalties" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50),
    "name" JSONB NOT NULL,
    "status" VARCHAR(20) DEFAULT 'active',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ref_award_penalties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ref_budget_articles" (
    "article_id" SERIAL NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "name" JSONB NOT NULL,
    "parent_article_id" INTEGER,
    "description" TEXT,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ref_budget_articles_pkey" PRIMARY KEY ("article_id")
);

-- CreateTable
CREATE TABLE "ref_classifiers" (
    "id" SERIAL NOT NULL,
    "type" VARCHAR(100) NOT NULL,
    "code" VARCHAR(50),
    "name" JSONB NOT NULL,
    "parent_id" INTEGER,
    "sort_order" INTEGER DEFAULT 0,
    "metadata" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ref_classifiers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ref_compositions" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50),
    "name" JSONB NOT NULL,
    "status" VARCHAR(20) DEFAULT 'active',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ref_compositions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ref_control_authorities" (
    "authority_id" SERIAL NOT NULL,
    "code" VARCHAR(100) NOT NULL,
    "name" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ref_control_authorities_pkey" PRIMARY KEY ("authority_id")
);

-- CreateTable
CREATE TABLE "ref_control_directions" (
    "direction_id" SERIAL NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "name" JSONB NOT NULL,
    "description" TEXT,
    "status" VARCHAR(50) DEFAULT 'active',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ref_control_directions_pkey" PRIMARY KEY ("direction_id")
);

-- CreateTable
CREATE TABLE "ref_control_types" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50),
    "name" JSONB NOT NULL,
    "status" VARCHAR(20) DEFAULT 'active',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ref_control_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ref_decision_statuses" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50),
    "name" JSONB NOT NULL,
    "status" VARCHAR(20) DEFAULT 'active',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ref_decision_statuses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ref_document_types" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50),
    "name" JSONB NOT NULL,
    "category" VARCHAR(100),
    "status" VARCHAR(20) DEFAULT 'active',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ref_document_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ref_education_levels" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50),
    "name" JSONB NOT NULL,
    "status" VARCHAR(20) DEFAULT 'active',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ref_education_levels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ref_financing_sources" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50),
    "name" JSONB NOT NULL,
    "status" VARCHAR(20) DEFAULT 'active',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ref_financing_sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ref_fitness_categories" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50),
    "name" JSONB NOT NULL,
    "status" VARCHAR(20) DEFAULT 'active',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ref_fitness_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ref_genders" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50),
    "name" JSONB NOT NULL,
    "status" VARCHAR(20) DEFAULT 'active',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ref_genders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ref_inspection_kinds" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50),
    "name" JSONB NOT NULL,
    "status" VARCHAR(20) DEFAULT 'active',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ref_inspection_kinds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ref_inspection_statuses" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50),
    "name" JSONB NOT NULL,
    "status" VARCHAR(20) DEFAULT 'active',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ref_inspection_statuses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ref_inspection_types" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50),
    "name" JSONB NOT NULL,
    "status" VARCHAR(20) DEFAULT 'active',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ref_inspection_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ref_military_districts" (
    "district_id" SERIAL NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "name" JSONB NOT NULL,
    "short_name" JSONB,
    "area_id" INTEGER,
    "status" VARCHAR(50) DEFAULT 'active',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ref_military_districts_pkey" PRIMARY KEY ("district_id")
);

-- CreateTable
CREATE TABLE "ref_nationalities" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50),
    "name" JSONB NOT NULL,
    "status" VARCHAR(20) DEFAULT 'active',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ref_nationalities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ref_physical_persons" (
    "id" SERIAL NOT NULL,
    "pinfl" VARCHAR(14) NOT NULL,
    "passport_series" VARCHAR(10),
    "passport_number" VARCHAR(20),
    "last_name" VARCHAR(100) NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "middle_name" VARCHAR(100),
    "birth_date" DATE,
    "gender_id" INTEGER,
    "nationality_id" INTEGER,
    "region_id" INTEGER,
    "district_id" INTEGER,
    "address" VARCHAR(500),
    "photo" VARCHAR(500),
    "contact_phone" VARCHAR(50),
    "email" VARCHAR(255),
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ref_physical_persons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ref_positions" (
    "id" INTEGER NOT NULL,
    "code" VARCHAR(50),
    "status" VARCHAR(20) DEFAULT 'active',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "name" JSONB NOT NULL,

    CONSTRAINT "ref_positions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ref_ranks" (
    "rank_id" SERIAL NOT NULL,
    "name" JSONB NOT NULL,
    "category" VARCHAR(50),
    "level" INTEGER,
    "composition_id" INTEGER,
    "type" VARCHAR(20),
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ref_ranks_pkey" PRIMARY KEY ("rank_id")
);

-- CreateTable
CREATE TABLE "ref_regions" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50),
    "name" JSONB NOT NULL,
    "type" VARCHAR(50),
    "status" VARCHAR(20) DEFAULT 'active',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ref_regions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ref_security_clearances" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50),
    "name" JSONB NOT NULL,
    "status" VARCHAR(20) DEFAULT 'active',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ref_security_clearances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ref_specializations" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50),
    "name" JSONB NOT NULL,
    "status" VARCHAR(20) DEFAULT 'active',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ref_specializations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ref_statuses" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "name" JSONB NOT NULL,
    "category" VARCHAR(50),
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ref_statuses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ref_subdivision_names" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50),
    "name" JSONB NOT NULL,
    "status" VARCHAR(20) DEFAULT 'active',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ref_subdivision_names_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ref_supply_departments" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "name" JSONB NOT NULL,
    "short_name" JSONB,
    "status" VARCHAR(20) DEFAULT 'active',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ref_supply_departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ref_territory_types" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "name" JSONB NOT NULL,
    "description" TEXT,
    "status" VARCHAR(20) NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ref_territory_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ref_tmc_types" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50),
    "name" JSONB NOT NULL,
    "status" VARCHAR(20) DEFAULT 'active',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ref_tmc_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ref_unit_types" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50),
    "name" JSONB NOT NULL,
    "status" VARCHAR(20) DEFAULT 'active',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ref_unit_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ref_units" (
    "unit_id" SERIAL NOT NULL,
    "name" JSONB NOT NULL,
    "unit_code" VARCHAR(50),
    "commander_name" VARCHAR(255),
    "commander_rank" VARCHAR(100),
    "unit_type_id" INTEGER,
    "specialization_id" INTEGER,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "military_district_id" INTEGER,
    "area_id" INTEGER,

    CONSTRAINT "ref_units_pkey" PRIMARY KEY ("unit_id")
);

-- CreateTable
CREATE TABLE "ref_violation_reasons" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50),
    "name" JSONB NOT NULL,
    "status" VARCHAR(20) DEFAULT 'active',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ref_violation_reasons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ref_violation_severities" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50),
    "name" JSONB NOT NULL,
    "status" VARCHAR(20) DEFAULT 'active',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ref_violation_severities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ref_violation_statuses" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50),
    "name" JSONB NOT NULL,
    "status" VARCHAR(20) DEFAULT 'active',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ref_violation_statuses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ref_violations" (
    "viol_type_id" SERIAL NOT NULL,
    "name" JSONB NOT NULL,
    "code" VARCHAR(50),
    "category" VARCHAR(100),
    "severity" VARCHAR(50),
    "description" TEXT,
    "legal_basis" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ref_violations_pkey" PRIMARY KEY ("viol_type_id")
);

-- CreateTable
CREATE TABLE "ref_vus_list" (
    "id" INTEGER NOT NULL,
    "code" VARCHAR(50),
    "status" VARCHAR(20) DEFAULT 'active',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "name" JSONB NOT NULL,

    CONSTRAINT "ref_vus_list_pkey" PRIMARY KEY ("id")
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
    "incoming_number" VARCHAR(50),
    "incoming_date" DATE,
    "objects_total" INTEGER DEFAULT 0,
    "objects_fs" INTEGER DEFAULT 0,
    "objects_os" INTEGER DEFAULT 0,
    "expense_classification" VARCHAR(50),
    "supply_department" VARCHAR(50),
    "subordinate_units_on_allowance" JSONB,
    "period_covered_end" DATE,
    "period_covered_start" DATE,
    "control_authority_id" INTEGER,
    "inspection_direction_id" INTEGER,
    "inspection_type_id" INTEGER,

    CONSTRAINT "rev_plan_year_pkey" PRIMARY KEY ("plan_id")
);

-- CreateTable
CREATE TABLE "document_templates" (
    "id" VARCHAR(50) NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,
    "locale" TEXT NOT NULL DEFAULT 'ru',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "document_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "regulatory_documents" (
    "id" SERIAL NOT NULL,
    "num" VARCHAR(50) NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "name" VARCHAR(500) NOT NULL,
    "date" DATE NOT NULL,
    "direction" VARCHAR(100),
    "status" VARCHAR(50) NOT NULL DEFAULT 'active',
    "content" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "tags" TEXT[],
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "regulatory_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "briefings" (
    "id" SERIAL NOT NULL,
    "plan_id" INTEGER NOT NULL,
    "instructor_id" INTEGER NOT NULL,
    "instruction_date" DATE NOT NULL,
    "content" TEXT,
    "safety_measures" TEXT,
    "status" TEXT NOT NULL DEFAULT 'conducted',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "briefings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prescriptions" (
    "id" SERIAL NOT NULL,
    "plan_id" INTEGER NOT NULL,
    "prescription_num" VARCHAR(50) NOT NULL,
    "date" DATE NOT NULL,
    "issuer_id" INTEGER NOT NULL,
    "requirements" TEXT,
    "status" TEXT NOT NULL DEFAULT 'issued',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prescriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ui_translations" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" JSONB NOT NULL,
    "description" TEXT,
    "tags" TEXT[],
    "status" TEXT NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ui_translations_pkey" PRIMARY KEY ("id")
);

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
    "has_completed_welcome_tour" BOOLEAN DEFAULT false,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
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
CREATE TABLE "doc_view_logs" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "doc_id" TEXT NOT NULL,
    "doc_type" TEXT NOT NULL,
    "viewed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "doc_view_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "help_articles" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "keywords" TEXT[],
    "video_url" TEXT,
    "author_id" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'published',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "help_articles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "orders_order_number_key" ON "orders"("order_number");

-- CreateIndex
CREATE UNIQUE INDEX "personnel_service_number_key" ON "personnel"("service_number");

-- CreateIndex
CREATE UNIQUE INDEX "personnel_pnr_key" ON "personnel"("pnr");

-- CreateIndex
CREATE UNIQUE INDEX "ref_areas_code_key" ON "ref_areas"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ref_audit_objects_code_key" ON "ref_audit_objects"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ref_award_penalties_code_key" ON "ref_award_penalties"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ref_budget_articles_code_key" ON "ref_budget_articles"("code");

-- CreateIndex
CREATE UNIQUE INDEX "type_code_idx" ON "ref_classifiers"("type", "code");

-- CreateIndex
CREATE UNIQUE INDEX "ref_compositions_code_key" ON "ref_compositions"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ref_control_authorities_code_key" ON "ref_control_authorities"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ref_control_directions_code_key" ON "ref_control_directions"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ref_control_types_code_key" ON "ref_control_types"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ref_decision_statuses_code_key" ON "ref_decision_statuses"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ref_document_types_code_key" ON "ref_document_types"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ref_education_levels_code_key" ON "ref_education_levels"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ref_financing_sources_code_key" ON "ref_financing_sources"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ref_fitness_categories_code_key" ON "ref_fitness_categories"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ref_genders_code_key" ON "ref_genders"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ref_inspection_kinds_code_key" ON "ref_inspection_kinds"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ref_inspection_statuses_code_key" ON "ref_inspection_statuses"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ref_inspection_types_code_key" ON "ref_inspection_types"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ref_military_districts_code_key" ON "ref_military_districts"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ref_nationalities_code_key" ON "ref_nationalities"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ref_physical_persons_pinfl_key" ON "ref_physical_persons"("pinfl");

-- CreateIndex
CREATE UNIQUE INDEX "ref_positions_code_key" ON "ref_positions"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ref_regions_code_key" ON "ref_regions"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ref_security_clearances_code_key" ON "ref_security_clearances"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ref_specializations_code_key" ON "ref_specializations"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ref_statuses_code_key" ON "ref_statuses"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ref_subdivision_names_code_key" ON "ref_subdivision_names"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ref_supply_departments_code_key" ON "ref_supply_departments"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ref_territory_types_code_key" ON "ref_territory_types"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ref_tmc_types_code_key" ON "ref_tmc_types"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ref_unit_types_code_key" ON "ref_unit_types"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ref_units_unit_code_key" ON "ref_units"("unit_code");

-- CreateIndex
CREATE UNIQUE INDEX "ref_violation_reasons_code_key" ON "ref_violation_reasons"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ref_violation_severities_code_key" ON "ref_violation_severities"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ref_violation_statuses_code_key" ON "ref_violation_statuses"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ref_violations_code_key" ON "ref_violations"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ref_vus_list_code_key" ON "ref_vus_list"("code");

-- CreateIndex
CREATE UNIQUE INDEX "regulatory_documents_num_key" ON "regulatory_documents"("num");

-- CreateIndex
CREATE UNIQUE INDEX "prescriptions_prescription_num_key" ON "prescriptions"("prescription_num");

-- CreateIndex
CREATE UNIQUE INDEX "ui_translations_key_key" ON "ui_translations"("key");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- AddForeignKey
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_reports" ADD CONSTRAINT "audit_reports_audit_id_fkey" FOREIGN KEY ("audit_id") REFERENCES "audits"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audits" ADD CONSTRAINT "audits_lead_auditor_id_fkey" FOREIGN KEY ("lead_auditor_id") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audits" ADD CONSTRAINT "audits_monthly_plan_id_fkey" FOREIGN KEY ("monthly_plan_id") REFERENCES "monthly_plans"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audits" ADD CONSTRAINT "audits_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audits" ADD CONSTRAINT "audits_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "ref_units"("unit_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commission_members" ADD CONSTRAINT "commission_members_audit_id_fkey" FOREIGN KEY ("audit_id") REFERENCES "audits"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commission_members" ADD CONSTRAINT "commission_members_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commission_members" ADD CONSTRAINT "commission_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "decisions" ADD CONSTRAINT "decisions_violation_id_fkey" FOREIGN KEY ("violation_id") REFERENCES "violations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "findings" ADD CONSTRAINT "findings_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "audit_reports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "findings" ADD CONSTRAINT "findings_responsible_unit_id_fkey" FOREIGN KEY ("responsible_unit_id") REFERENCES "ref_units"("unit_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monthly_plans" ADD CONSTRAINT "monthly_plans_quarterly_plan_id_fkey" FOREIGN KEY ("quarterly_plan_id") REFERENCES "quarterly_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_issuer_id_fkey" FOREIGN KEY ("issuer_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "rev_plan_year"("plan_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "document_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "ref_units"("unit_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personnel" ADD CONSTRAINT "personnel_physical_person_id_fkey" FOREIGN KEY ("physical_person_id") REFERENCES "ref_physical_persons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personnel" ADD CONSTRAINT "personnel_position_id_fkey" FOREIGN KEY ("position_id") REFERENCES "ref_positions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personnel" ADD CONSTRAINT "personnel_rank_id_fkey" FOREIGN KEY ("rank_id") REFERENCES "ref_ranks"("rank_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personnel" ADD CONSTRAINT "personnel_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "ref_units"("unit_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personnel" ADD CONSTRAINT "personnel_vus_id_fkey" FOREIGN KEY ("vus_id") REFERENCES "ref_vus_list"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plan_change_log" ADD CONSTRAINT "plan_change_log_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "rev_plan_year"("plan_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quarterly_plans" ADD CONSTRAINT "quarterly_plans_annual_plan_id_fkey" FOREIGN KEY ("annual_plan_id") REFERENCES "rev_plan_year"("plan_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ref_areas" ADD CONSTRAINT "ref_areas_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "ref_regions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ref_military_districts" ADD CONSTRAINT "ref_military_districts_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "ref_areas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ref_physical_persons" ADD CONSTRAINT "ref_physical_persons_district_id_fkey" FOREIGN KEY ("district_id") REFERENCES "ref_areas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ref_physical_persons" ADD CONSTRAINT "ref_physical_persons_gender_id_fkey" FOREIGN KEY ("gender_id") REFERENCES "ref_genders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ref_physical_persons" ADD CONSTRAINT "ref_physical_persons_nationality_id_fkey" FOREIGN KEY ("nationality_id") REFERENCES "ref_nationalities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ref_physical_persons" ADD CONSTRAINT "ref_physical_persons_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "ref_regions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ref_ranks" ADD CONSTRAINT "ref_ranks_composition_id_fkey" FOREIGN KEY ("composition_id") REFERENCES "ref_compositions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ref_units" ADD CONSTRAINT "ref_units_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "ref_areas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ref_units" ADD CONSTRAINT "ref_units_military_district_id_fkey" FOREIGN KEY ("military_district_id") REFERENCES "ref_military_districts"("district_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ref_units" ADD CONSTRAINT "ref_units_specialization_id_fkey" FOREIGN KEY ("specialization_id") REFERENCES "ref_specializations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ref_units" ADD CONSTRAINT "ref_units_unit_type_id_fkey" FOREIGN KEY ("unit_type_id") REFERENCES "ref_unit_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rev_plan_year" ADD CONSTRAINT "rev_plan_year_approved_by_id_fkey" FOREIGN KEY ("approved_by_id") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rev_plan_year" ADD CONSTRAINT "rev_plan_year_control_authority_id_fkey" FOREIGN KEY ("control_authority_id") REFERENCES "ref_control_authorities"("authority_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rev_plan_year" ADD CONSTRAINT "rev_plan_year_inspection_direction_id_fkey" FOREIGN KEY ("inspection_direction_id") REFERENCES "ref_control_directions"("direction_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rev_plan_year" ADD CONSTRAINT "rev_plan_year_inspection_type_id_fkey" FOREIGN KEY ("inspection_type_id") REFERENCES "ref_inspection_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rev_plan_year" ADD CONSTRAINT "rev_plan_year_responsible_id_fkey" FOREIGN KEY ("responsible_id") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rev_plan_year" ADD CONSTRAINT "rev_plan_year_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "ref_units"("unit_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "briefings" ADD CONSTRAINT "briefings_instructor_id_fkey" FOREIGN KEY ("instructor_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "briefings" ADD CONSTRAINT "briefings_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "rev_plan_year"("plan_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_issuer_id_fkey" FOREIGN KEY ("issuer_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "rev_plan_year"("plan_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "violations" ADD CONSTRAINT "violations_audit_id_fkey" FOREIGN KEY ("audit_id") REFERENCES "audits"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "violations" ADD CONSTRAINT "violations_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "ref_units"("unit_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doc_view_logs" ADD CONSTRAINT "doc_view_logs_doc_id_fkey" FOREIGN KEY ("doc_id") REFERENCES "help_articles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doc_view_logs" ADD CONSTRAINT "doc_view_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

