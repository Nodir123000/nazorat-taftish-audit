-- CreateTable
CREATE TABLE IF NOT EXISTS "ref_regions" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50),
    "name" JSONB NOT NULL,
    "type" VARCHAR(50),
    "status" VARCHAR(20) DEFAULT 'active',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ref_regions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "ref_areas" (
    "id" SERIAL NOT NULL,
    "region_id" INTEGER,
    "code" VARCHAR(50),
    "name" JSONB NOT NULL,
    "type" VARCHAR(50),
    "status" VARCHAR(20) DEFAULT 'active',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ref_areas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "ref_regions_code_key" ON "ref_regions"("code");
CREATE UNIQUE INDEX IF NOT EXISTS "ref_areas_code_key" ON "ref_areas"("code");

-- AddForeignKey
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ref_areas_region_id_fkey') THEN
        ALTER TABLE "ref_areas" ADD CONSTRAINT "ref_areas_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "ref_regions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;
