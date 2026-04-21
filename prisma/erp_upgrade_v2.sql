-- CreateTable
CREATE TABLE "unplanned_audits" (
    "id" SERIAL NOT NULL,
    "request_number" VARCHAR(50) NOT NULL,
    "source_agency" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "unit_id" INTEGER NOT NULL,
    "assigned_to" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "document_s3_key" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "unplanned_audits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "internal_investigations" (
    "id" SERIAL NOT NULL,
    "incident_date" DATE NOT NULL,
    "incident_type" VARCHAR(100) NOT NULL,
    "subject_id" INTEGER NOT NULL,
    "inspector_id" INTEGER,
    "conclusion" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "internal_investigations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kpi_metrics" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "name" JSONB NOT NULL,
    "weight" DECIMAL(5,2) NOT NULL,
    "formula" TEXT,

    CONSTRAINT "kpi_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_kpi_scores" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "metric_id" INTEGER NOT NULL,
    "score" DECIMAL(10,2) NOT NULL,
    "period_start" DATE NOT NULL,
    "period_end" DATE NOT NULL,

    CONSTRAINT "user_kpi_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inspector_profiles" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "specialization" VARCHAR(255),
    "clearance_level" VARCHAR(50),
    "total_audits" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "inspector_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inspector_rotations" (
    "id" SERIAL NOT NULL,
    "profile_id" INTEGER NOT NULL,
    "unit_id" INTEGER NOT NULL,
    "position" VARCHAR(255) NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE,
    "order_number" VARCHAR(100),

    CONSTRAINT "inspector_rotations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "i18n_keys" (
    "id" SERIAL NOT NULL,
    "key" VARCHAR(255) NOT NULL,
    "module" VARCHAR(50),

    CONSTRAINT "i18n_keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "i18n_values" (
    "id" SERIAL NOT NULL,
    "key_id" INTEGER NOT NULL,
    "locale" VARCHAR(10) NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "i18n_values_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "unplanned_audits_request_number_key" ON "unplanned_audits"("request_number");

-- CreateIndex
CREATE UNIQUE INDEX "kpi_metrics_code_key" ON "kpi_metrics"("code");

-- CreateIndex
CREATE UNIQUE INDEX "inspector_profiles_user_id_key" ON "inspector_profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "i18n_keys_key_key" ON "i18n_keys"("key");

-- AddForeignKey
ALTER TABLE "unplanned_audits" ADD CONSTRAINT "unplanned_audits_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "ref_units"("unit_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unplanned_audits" ADD CONSTRAINT "unplanned_audits_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "internal_investigations" ADD CONSTRAINT "internal_investigations_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "personnel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "internal_investigations" ADD CONSTRAINT "internal_investigations_inspector_id_fkey" FOREIGN KEY ("inspector_id") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_kpi_scores" ADD CONSTRAINT "user_kpi_scores_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_kpi_scores" ADD CONSTRAINT "user_kpi_scores_metric_id_fkey" FOREIGN KEY ("metric_id") REFERENCES "kpi_metrics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inspector_profiles" ADD CONSTRAINT "inspector_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inspector_rotations" ADD CONSTRAINT "inspector_rotations_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "inspector_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inspector_rotations" ADD CONSTRAINT "inspector_rotations_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "ref_units"("unit_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "i18n_values" ADD CONSTRAINT "i18n_values_key_id_fkey" FOREIGN KEY ("key_id") REFERENCES "i18n_keys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

