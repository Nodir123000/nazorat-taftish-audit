DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ref_regions' AND column_name='type') THEN
        ALTER TABLE "ref_regions" ADD COLUMN "type" VARCHAR(50);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ref_regions' AND column_name='code') THEN
        ALTER TABLE "ref_regions" ADD COLUMN "code" VARCHAR(50);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ref_areas' AND column_name='code') THEN
        ALTER TABLE "ref_areas" ADD COLUMN "code" VARCHAR(50);
    END IF;
END $$;
