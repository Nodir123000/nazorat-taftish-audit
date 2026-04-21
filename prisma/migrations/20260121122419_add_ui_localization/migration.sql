/*
  Warnings:

  - You are about to drop the column `actual_address` on the `personnel` table. All the data in the column will be lost.
  - You are about to drop the column `citizenship` on the `personnel` table. All the data in the column will be lost.
  - You are about to drop the column `contact_phone` on the `personnel` table. All the data in the column will be lost.
  - You are about to drop the column `date_of_birth` on the `personnel` table. All the data in the column will be lost.
  - You are about to drop the column `department` on the `personnel` table. All the data in the column will be lost.
  - You are about to drop the column `deployment_city` on the `personnel` table. All the data in the column will be lost.
  - You are about to drop the column `deployment_location` on the `personnel` table. All the data in the column will be lost.
  - You are about to drop the column `deployment_region` on the `personnel` table. All the data in the column will be lost.
  - You are about to drop the column `directive_date` on the `personnel` table. All the data in the column will be lost.
  - You are about to drop the column `directive_number` on the `personnel` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `personnel` table. All the data in the column will be lost.
  - You are about to drop the column `first_name` on the `personnel` table. All the data in the column will be lost.
  - You are about to drop the column `full_name` on the `personnel` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `personnel` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `personnel` table. All the data in the column will be lost.
  - You are about to drop the column `license_count` on the `personnel` table. All the data in the column will be lost.
  - You are about to drop the column `marital_status` on the `personnel` table. All the data in the column will be lost.
  - You are about to drop the column `military_district` on the `personnel` table. All the data in the column will be lost.
  - You are about to drop the column `military_id` on the `personnel` table. All the data in the column will be lost.
  - You are about to drop the column `military_id_expiry_date` on the `personnel` table. All the data in the column will be lost.
  - You are about to drop the column `military_id_issue_date` on the `personnel` table. All the data in the column will be lost.
  - You are about to drop the column `military_rank` on the `personnel` table. All the data in the column will be lost.
  - You are about to drop the column `military_unit` on the `personnel` table. All the data in the column will be lost.
  - You are about to drop the column `nationality` on the `personnel` table. All the data in the column will be lost.
  - You are about to drop the column `passport_expiry_date` on the `personnel` table. All the data in the column will be lost.
  - You are about to drop the column `passport_issue_date` on the `personnel` table. All the data in the column will be lost.
  - You are about to drop the column `passport_issued_by` on the `personnel` table. All the data in the column will be lost.
  - You are about to drop the column `passport_number` on the `personnel` table. All the data in the column will be lost.
  - You are about to drop the column `passport_series` on the `personnel` table. All the data in the column will be lost.
  - You are about to drop the column `patronymic` on the `personnel` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `personnel` table. All the data in the column will be lost.
  - You are about to drop the column `photo` on the `personnel` table. All the data in the column will be lost.
  - You are about to drop the column `pin` on the `personnel` table. All the data in the column will be lost.
  - You are about to drop the column `place_of_birth` on the `personnel` table. All the data in the column will be lost.
  - You are about to drop the column `position` on the `personnel` table. All the data in the column will be lost.
  - You are about to drop the column `rank` on the `personnel` table. All the data in the column will be lost.
  - You are about to drop the column `registration_address` on the `personnel` table. All the data in the column will be lost.
  - You are about to drop the column `source` on the `personnel` table. All the data in the column will be lost.
  - You are about to drop the column `specialization` on the `personnel` table. All the data in the column will be lost.
  - You are about to alter the column `service_number` on the `personnel` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - The `service_start_date` column on the `personnel` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `clearance_level` on the `personnel` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `emergency_contact` on the `personnel` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `emergency_phone` on the `personnel` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to drop the column `territory_id` on the `ref_units` table. All the data in the column will be lost.
  - You are about to drop the `ref_districts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ref_territories` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[service_number]` on the table `personnel` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[pnr]` on the table `personnel` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `physical_person_id` to the `personnel` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ref_units" DROP CONSTRAINT "ref_units_territory_id_fkey";

-- DropIndex
DROP INDEX "personnel_pin_key";

-- AlterTable
ALTER TABLE "personnel" DROP COLUMN "actual_address",
DROP COLUMN "citizenship",
DROP COLUMN "contact_phone",
DROP COLUMN "date_of_birth",
DROP COLUMN "department",
DROP COLUMN "deployment_city",
DROP COLUMN "deployment_location",
DROP COLUMN "deployment_region",
DROP COLUMN "directive_date",
DROP COLUMN "directive_number",
DROP COLUMN "email",
DROP COLUMN "first_name",
DROP COLUMN "full_name",
DROP COLUMN "gender",
DROP COLUMN "last_name",
DROP COLUMN "license_count",
DROP COLUMN "marital_status",
DROP COLUMN "military_district",
DROP COLUMN "military_id",
DROP COLUMN "military_id_expiry_date",
DROP COLUMN "military_id_issue_date",
DROP COLUMN "military_rank",
DROP COLUMN "military_unit",
DROP COLUMN "nationality",
DROP COLUMN "passport_expiry_date",
DROP COLUMN "passport_issue_date",
DROP COLUMN "passport_issued_by",
DROP COLUMN "passport_number",
DROP COLUMN "passport_series",
DROP COLUMN "patronymic",
DROP COLUMN "phone",
DROP COLUMN "photo",
DROP COLUMN "pin",
DROP COLUMN "place_of_birth",
DROP COLUMN "position",
DROP COLUMN "rank",
DROP COLUMN "registration_address",
DROP COLUMN "source",
DROP COLUMN "specialization",
ADD COLUMN     "category_id" INTEGER,
ADD COLUMN     "physical_person_id" INTEGER NOT NULL,
ADD COLUMN     "pnr" VARCHAR(50),
ADD COLUMN     "position_id" INTEGER,
ADD COLUMN     "rank_id" INTEGER,
ADD COLUMN     "service_end_date" DATE,
ADD COLUMN     "status" VARCHAR(50) DEFAULT 'active',
ADD COLUMN     "unit_id" INTEGER,
ADD COLUMN     "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "vus_id" INTEGER,
ALTER COLUMN "service_number" SET DATA TYPE VARCHAR(50),
DROP COLUMN "service_start_date",
ADD COLUMN     "service_start_date" DATE,
ALTER COLUMN "clearance_level" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "emergency_contact" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "emergency_phone" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "ref_units" DROP COLUMN "territory_id",
ADD COLUMN     "area_id" INTEGER,
ADD COLUMN     "military_district_id" INTEGER;

-- AlterTable
ALTER TABLE "rev_plan_year" ADD COLUMN     "control_authority" VARCHAR(100),
ADD COLUMN     "control_object" VARCHAR(255),
ADD COLUMN     "expense_classification" VARCHAR(50),
ADD COLUMN     "incoming_date" DATE,
ADD COLUMN     "incoming_number" VARCHAR(50),
ADD COLUMN     "inspection_direction" INTEGER,
ADD COLUMN     "inspection_type" INTEGER,
ADD COLUMN     "objects_fs" INTEGER DEFAULT 0,
ADD COLUMN     "objects_os" INTEGER DEFAULT 0,
ADD COLUMN     "objects_total" INTEGER DEFAULT 0,
ADD COLUMN     "supply_department" VARCHAR(50);

-- DropTable
DROP TABLE "ref_districts";

-- DropTable
DROP TABLE "ref_territories";

-- CreateTable
CREATE TABLE "ref_military_districts" (
    "district_id" SERIAL NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "name_uz_latn" VARCHAR(255),
    "name_uz_cyrl" VARCHAR(255),
    "short_name" VARCHAR(100),
    "headquarters" VARCHAR(255),
    "status" VARCHAR(50) DEFAULT 'active',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ref_military_districts_pkey" PRIMARY KEY ("district_id")
);

-- CreateTable
CREATE TABLE "ref_regions" (
    "id" SERIAL NOT NULL,
    "name" JSONB NOT NULL,
    "status" VARCHAR(20) DEFAULT 'active',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ref_regions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ref_areas" (
    "id" SERIAL NOT NULL,
    "region_id" INTEGER NOT NULL,
    "name" JSONB NOT NULL,
    "type" VARCHAR(50),
    "status" VARCHAR(20) DEFAULT 'active',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ref_areas_pkey" PRIMARY KEY ("id")
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
    "gender" VARCHAR(20),
    "nationality" VARCHAR(100),
    "photo" VARCHAR(500),
    "contact_phone" VARCHAR(50),
    "email" VARCHAR(255),
    "registration_address" VARCHAR(500),
    "actual_address" VARCHAR(500),
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ref_physical_persons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ref_unit_types" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50),
    "name" VARCHAR(255) NOT NULL,
    "name_uz_latn" VARCHAR(255),
    "name_uz_cyrl" VARCHAR(255),
    "status" VARCHAR(20) DEFAULT 'active',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ref_unit_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ref_specializations" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50),
    "name" VARCHAR(255) NOT NULL,
    "name_uz_latn" VARCHAR(255),
    "name_uz_cyrl" VARCHAR(255),
    "status" VARCHAR(20) DEFAULT 'active',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ref_specializations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ref_vus_list" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50),
    "name" VARCHAR(255) NOT NULL,
    "name_uz_latn" VARCHAR(255),
    "name_uz_cyrl" VARCHAR(255),
    "status" VARCHAR(20) DEFAULT 'active',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ref_vus_list_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ref_positions" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50),
    "name" VARCHAR(255) NOT NULL,
    "name_uz_latn" VARCHAR(255),
    "name_uz_cyrl" VARCHAR(255),
    "status" VARCHAR(20) DEFAULT 'active',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ref_positions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ref_subdivision_names" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50),
    "name" VARCHAR(255) NOT NULL,
    "name_uz_latn" VARCHAR(255),
    "name_uz_cyrl" VARCHAR(255),
    "status" VARCHAR(20) DEFAULT 'active',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ref_subdivision_names_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ref_document_types" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50),
    "name" VARCHAR(255) NOT NULL,
    "name_uz_latn" VARCHAR(255),
    "name_uz_cyrl" VARCHAR(255),
    "category" VARCHAR(100),
    "status" VARCHAR(20) DEFAULT 'active',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ref_document_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ref_control_types" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50),
    "name" VARCHAR(255) NOT NULL,
    "name_uz_latn" VARCHAR(255),
    "name_uz_cyrl" VARCHAR(255),
    "status" VARCHAR(20) DEFAULT 'active',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ref_control_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ref_financing_sources" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50),
    "name" VARCHAR(255) NOT NULL,
    "name_uz_latn" VARCHAR(255),
    "name_uz_cyrl" VARCHAR(255),
    "status" VARCHAR(20) DEFAULT 'active',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ref_financing_sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ref_tmc_types" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50),
    "name" VARCHAR(255) NOT NULL,
    "name_uz_latn" VARCHAR(255),
    "name_uz_cyrl" VARCHAR(255),
    "status" VARCHAR(20) DEFAULT 'active',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ref_tmc_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ref_violation_reasons" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50),
    "name" VARCHAR(255) NOT NULL,
    "name_uz_latn" VARCHAR(255),
    "name_uz_cyrl" VARCHAR(255),
    "status" VARCHAR(20) DEFAULT 'active',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ref_violation_reasons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ref_inspection_kinds" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50),
    "name" VARCHAR(255) NOT NULL,
    "name_uz_latn" VARCHAR(255),
    "name_uz_cyrl" VARCHAR(255),
    "status" VARCHAR(20) DEFAULT 'active',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ref_inspection_kinds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ref_audit_objects" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50),
    "name" VARCHAR(255) NOT NULL,
    "name_uz_latn" VARCHAR(255),
    "name_uz_cyrl" VARCHAR(255),
    "status" VARCHAR(20) DEFAULT 'active',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ref_audit_objects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ref_inspection_statuses" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50),
    "name" VARCHAR(255) NOT NULL,
    "name_uz_latn" VARCHAR(255),
    "name_uz_cyrl" VARCHAR(255),
    "status" VARCHAR(20) DEFAULT 'active',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ref_inspection_statuses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ref_inspection_types" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50),
    "name" VARCHAR(255) NOT NULL,
    "name_uz_latn" VARCHAR(255),
    "name_uz_cyrl" VARCHAR(255),
    "status" VARCHAR(20) DEFAULT 'active',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ref_inspection_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ref_violation_severities" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50),
    "name" VARCHAR(255) NOT NULL,
    "name_uz_latn" VARCHAR(255),
    "name_uz_cyrl" VARCHAR(255),
    "status" VARCHAR(20) DEFAULT 'active',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ref_violation_severities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ref_violation_statuses" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50),
    "name" VARCHAR(255) NOT NULL,
    "name_uz_latn" VARCHAR(255),
    "name_uz_cyrl" VARCHAR(255),
    "status" VARCHAR(20) DEFAULT 'active',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ref_violation_statuses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ref_decision_statuses" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50),
    "name" VARCHAR(255) NOT NULL,
    "name_uz_latn" VARCHAR(255),
    "name_uz_cyrl" VARCHAR(255),
    "status" VARCHAR(20) DEFAULT 'active',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ref_decision_statuses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ref_compositions" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50),
    "name" VARCHAR(255) NOT NULL,
    "name_uz_latn" VARCHAR(255),
    "name_uz_cyrl" VARCHAR(255),
    "status" VARCHAR(20) DEFAULT 'active',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ref_compositions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ref_education_levels" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50),
    "name" VARCHAR(255) NOT NULL,
    "name_uz_latn" VARCHAR(255),
    "name_uz_cyrl" VARCHAR(255),
    "status" VARCHAR(20) DEFAULT 'active',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ref_education_levels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ref_security_clearances" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50),
    "name" VARCHAR(255) NOT NULL,
    "name_uz_latn" VARCHAR(255),
    "name_uz_cyrl" VARCHAR(255),
    "status" VARCHAR(20) DEFAULT 'active',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ref_security_clearances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ref_fitness_categories" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50),
    "name" VARCHAR(255) NOT NULL,
    "name_uz_latn" VARCHAR(255),
    "name_uz_cyrl" VARCHAR(255),
    "status" VARCHAR(20) DEFAULT 'active',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ref_fitness_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ref_award_penalties" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50),
    "name" VARCHAR(255) NOT NULL,
    "name_uz_latn" VARCHAR(255),
    "name_uz_cyrl" VARCHAR(255),
    "status" VARCHAR(20) DEFAULT 'active',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ref_award_penalties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ref_genders" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50),
    "name" VARCHAR(255) NOT NULL,
    "name_uz_latn" VARCHAR(255),
    "name_uz_cyrl" VARCHAR(255),
    "status" VARCHAR(20) DEFAULT 'active',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ref_genders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ref_nationalities" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50),
    "name" VARCHAR(255) NOT NULL,
    "name_uz_latn" VARCHAR(255),
    "name_uz_cyrl" VARCHAR(255),
    "status" VARCHAR(20) DEFAULT 'active',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ref_nationalities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ui_keys" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "description" TEXT,
    "tags" TEXT[],
    "status" TEXT NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT,

    CONSTRAINT "ui_keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ui_translations" (
    "id" TEXT NOT NULL,
    "key_id" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT,

    CONSTRAINT "ui_translations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ref_military_districts_code_key" ON "ref_military_districts"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ref_physical_persons_pinfl_key" ON "ref_physical_persons"("pinfl");

-- CreateIndex
CREATE UNIQUE INDEX "ref_unit_types_code_key" ON "ref_unit_types"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ref_specializations_code_key" ON "ref_specializations"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ref_vus_list_code_key" ON "ref_vus_list"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ref_positions_code_key" ON "ref_positions"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ref_subdivision_names_code_key" ON "ref_subdivision_names"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ref_document_types_code_key" ON "ref_document_types"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ref_control_types_code_key" ON "ref_control_types"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ref_financing_sources_code_key" ON "ref_financing_sources"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ref_tmc_types_code_key" ON "ref_tmc_types"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ref_violation_reasons_code_key" ON "ref_violation_reasons"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ref_inspection_kinds_code_key" ON "ref_inspection_kinds"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ref_audit_objects_code_key" ON "ref_audit_objects"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ref_inspection_statuses_code_key" ON "ref_inspection_statuses"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ref_inspection_types_code_key" ON "ref_inspection_types"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ref_violation_severities_code_key" ON "ref_violation_severities"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ref_violation_statuses_code_key" ON "ref_violation_statuses"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ref_decision_statuses_code_key" ON "ref_decision_statuses"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ref_compositions_code_key" ON "ref_compositions"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ref_education_levels_code_key" ON "ref_education_levels"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ref_security_clearances_code_key" ON "ref_security_clearances"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ref_fitness_categories_code_key" ON "ref_fitness_categories"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ref_award_penalties_code_key" ON "ref_award_penalties"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ref_genders_code_key" ON "ref_genders"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ref_nationalities_code_key" ON "ref_nationalities"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ui_keys_key_key" ON "ui_keys"("key");

-- CreateIndex
CREATE INDEX "ui_translations_locale_idx" ON "ui_translations"("locale");

-- CreateIndex
CREATE UNIQUE INDEX "ui_translations_key_id_locale_key" ON "ui_translations"("key_id", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "personnel_service_number_key" ON "personnel"("service_number");

-- CreateIndex
CREATE UNIQUE INDEX "personnel_pnr_key" ON "personnel"("pnr");

-- AddForeignKey
ALTER TABLE "ref_units" ADD CONSTRAINT "ref_units_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "ref_areas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ref_units" ADD CONSTRAINT "ref_units_military_district_id_fkey" FOREIGN KEY ("military_district_id") REFERENCES "ref_military_districts"("district_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ref_areas" ADD CONSTRAINT "ref_areas_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "ref_regions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personnel" ADD CONSTRAINT "personnel_physical_person_id_fkey" FOREIGN KEY ("physical_person_id") REFERENCES "ref_physical_persons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personnel" ADD CONSTRAINT "personnel_rank_id_fkey" FOREIGN KEY ("rank_id") REFERENCES "ref_ranks"("rank_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personnel" ADD CONSTRAINT "personnel_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "ref_units"("unit_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personnel" ADD CONSTRAINT "personnel_position_id_fkey" FOREIGN KEY ("position_id") REFERENCES "ref_positions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personnel" ADD CONSTRAINT "personnel_vus_id_fkey" FOREIGN KEY ("vus_id") REFERENCES "ref_vus_list"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ui_translations" ADD CONSTRAINT "ui_translations_key_id_fkey" FOREIGN KEY ("key_id") REFERENCES "ui_keys"("id") ON DELETE CASCADE ON UPDATE CASCADE;
