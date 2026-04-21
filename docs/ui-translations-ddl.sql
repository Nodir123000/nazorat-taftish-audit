-- DDL for PostgreSQL

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

CREATE UNIQUE INDEX "ui_keys_key_key" ON "ui_keys"("key");

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

CREATE UNIQUE INDEX "ui_translations_key_id_locale_key" ON "ui_translations"("key_id", "locale");
CREATE INDEX "ui_translations_locale_idx" ON "ui_translations"("locale");

ALTER TABLE "ui_translations" ADD CONSTRAINT "ui_translations_key_id_fkey" FOREIGN KEY ("key_id") REFERENCES "ui_keys"("id") ON DELETE CASCADE ON UPDATE CASCADE;
